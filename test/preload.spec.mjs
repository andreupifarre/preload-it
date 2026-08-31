import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
	await page.goto('/')
	await page.waitForFunction(() => typeof window.Preload === 'function')
})

test('loads successful and redirected assets', async ({ page }) => {
	const result = await page.evaluate(async () => {
		const preload = window.Preload()
		const events = []
		preload.onfetched = item => events.push(`fetched:${item.status}`)
		preload.oncomplete = () => events.push('complete')
		const items = await preload.fetch(['/fixture/success', '/fixture/redirect'])
		return { items, events, stateMatches: items === preload.state }
	})

	expect(result.stateMatches).toBe(true)
	expect(result.events).toEqual(['fetched:200', 'fetched:200', 'complete'])
	for (const item of result.items) {
		expect(item.error).toBe(false)
		expect(item.completion).toBe(100)
		expect(item.size).toBeGreaterThan(0)
		expect(item.blobUrl).toMatch(/^blob:/)
	}
})

test('resolves HTTP and network failures after reporting them', async ({ page }) => {
	await page.route('**/fixture/network-error', route => route.abort('failed'))
	const result = await page.evaluate(async () => {
		const preload = window.Preload()
		const events = []
		preload.onerror = item => events.push(`error:${item.failureReason}`)
		preload.onfetched = item => events.push(`fetched:${item.failureReason}`)
		preload.oncomplete = () => events.push('complete')
		const items = await preload.fetch(['/fixture/status/500', '/fixture/network-error', 'http://['])
		return { items, events }
	})

	expect(result.items.map(item => item.failureReason).sort()).toEqual(['http', 'network', 'network'])
	expect(result.items.every(item => item.error)).toBe(true)
	expect(result.events.filter(event => event.startsWith('error:'))).toHaveLength(3)
	expect(result.events.at(-1)).toBe('complete')
})

test('handles timeouts and empty batches', async ({ page }) => {
	const result = await page.evaluate(async () => {
		let invalidTimeout
		try {
			window.Preload({ timeout: -1 })
		} catch (error) {
			invalidTimeout = error.message
		}
		const timed = window.Preload({ timeout: 20 })
		const [item] = await timed.fetch(['/fixture/timeout'])
		const empty = window.Preload()
		let completed = 0
		empty.oncomplete = () => completed++
		const items = await empty.fetch([])
		await Promise.resolve()
		return { item, items, completed, invalidTimeout }
	})

	expect(result.item.failureReason).toBe('timeout')
	expect(result.item.error).toBe(true)
	expect(result.items).toEqual([])
	expect(result.completed).toBe(1)
	expect(result.invalidTimeout).toContain('non-negative')
})

test('supports duplicate URLs and replaces state for sequential batches', async ({ page }) => {
	const result = await page.evaluate(async () => {
		const preload = window.Preload()
		const first = await preload.fetch(['/fixture/duplicate', '/fixture/duplicate'])
		const distinctItems = first[0] !== first[1] && first.every(item => item.status === 200)
		const second = await preload.fetch(['/fixture/success'])
		return { distinctItems, firstLength: first.length, secondLength: second.length, stateLength: preload.state.length }
	})

	expect(result).toEqual({ distinctItems: true, firstLength: 2, secondLength: 1, stateLength: 1 })
})

test('rejects overlapping batches without disrupting the active batch', async ({ page }) => {
	const result = await page.evaluate(async () => {
		const preload = window.Preload()
		const active = preload.fetch(['/fixture/slow'])
		let message
		try {
			await preload.fetch(['/fixture/success'])
		} catch (error) {
			message = error.message
		}
		preload.cancel()
		const items = await active
		return { message, canceled: items[0].canceled }
	})

	expect(result.message).toContain('already in progress')
	expect(result.canceled).toBe(true)
})

test('cancels before progress and settles once without completing', async ({ page }) => {
	const result = await page.evaluate(async () => {
		const preload = window.Preload()
		let canceled = 0
		let completed = 0
		let errors = 0
		preload.oncancel = () => canceled++
		preload.oncomplete = () => completed++
		preload.onerror = () => errors++
		const promise = preload.fetch(['/fixture/slow', '/fixture/slow'])
		preload.cancel()
		const items = await promise
		preload.cancel()
		return { items, canceled, completed, errors }
	})

	expect(result.items.every(item => item.canceled && item.status === 0)).toBe(true)
	expect(result).toMatchObject({ canceled: 1, completed: 0, errors: 0 })
})

test('cancels during progress and is a no-op after completion', async ({ page }) => {
	const result = await page.evaluate(async () => {
		const active = window.Preload()
		let activeCancellations = 0
		active.oncancel = () => activeCancellations++
		active.onprogress = event => {
			if (event.progress > 0) active.cancel()
		}
		const [cancelledItem] = await active.fetch(['/fixture/slow'])

		const complete = window.Preload()
		let lateCancellations = 0
		complete.oncancel = () => lateCancellations++
		await complete.fetch(['/fixture/success'])
		complete.cancel()

		return { cancelledItem, activeCancellations, lateCancellations }
	})

	expect(result.cancelledItem.canceled).toBe(true)
	expect(result.activeCancellations).toBe(1)
	expect(result.lateCancellations).toBe(0)
})

test('reports monotonic progress in both modes and handles unknown lengths', async ({ page }) => {
	const result = await page.evaluate(async () => {
		async function run(options, urls) {
			const preload = window.Preload(options)
			const progress = []
			preload.onprogress = event => progress.push(event.progress)
			await preload.fetch(urls)
			return progress
		}
		return {
			stepped: await run({}, ['/fixture/slow', '/fixture/success']),
			weighted: await run({ stepped: false }, ['/fixture/slow', '/fixture/success']),
			unknown: await run({ stepped: false }, ['/fixture/no-length'])
		}
	})

	for (const values of Object.values(result)) {
		expect(values.length).toBeGreaterThan(0)
		expect(values.at(-1)).toBe(100)
		expect(values).toEqual([...values].sort((a, b) => a - b))
	}
})

test('dispose revokes generated URLs and is repeatable', async ({ page }) => {
	const result = await page.evaluate(async () => {
		const revoked = []
		const original = URL.revokeObjectURL
		URL.revokeObjectURL = url => {
			revoked.push(url)
			original.call(URL, url)
		}
		const preload = window.Preload()
		const items = await preload.fetch(['/fixture/success', '/fixture/success'])
		preload.dispose()
		preload.dispose()
		return { created: items.map(item => item.blobUrl), revoked }
	})

	expect(result.revoked.sort()).toEqual(result.created.sort())
})

test('keeps the UMD browser entry point working', async ({ page }) => {
	const result = await page.evaluate(async () => {
		delete window.Preload
		await new Promise((resolve, reject) => {
			const script = document.createElement('script')
			script.src = '/dist/preload-it.js'
			script.onload = resolve
			script.onerror = reject
			document.head.append(script)
		})
		const preload = window.Preload()
		const [item] = await preload.fetch(['/fixture/success'])
		return { factory: typeof window.Preload, status: item.status }
	})

	expect(result).toEqual({ factory: 'function', status: 200 })
})

test('callback exceptions do not prevent Promise settlement', async ({ page }) => {
	const result = await page.evaluate(async () => {
		window.onerror = () => true
		const preload = window.Preload()
		preload.onfetched = () => { throw new Error('consumer callback failed') }
		const items = await preload.fetch(['/fixture/success'])
		return items.length
	})

	expect(result).toBe(1)
})
