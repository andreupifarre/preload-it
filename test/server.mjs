import { createReadStream } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const port = Number(process.env.PORT || 3000)
const fixture = Buffer.from('preload-it fixture')
const concurrencyStats = new Map()

const contentTypes = {
	'.html': 'text/html; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.mjs': 'text/javascript; charset=utf-8'
}

function sendFile(response, relativePath) {
	const path = join(root, relativePath)
	response.setHeader('Content-Type', contentTypes[extname(path)] || 'application/octet-stream')
	createReadStream(path)
		.on('error', () => {
			response.statusCode = 404
			response.end('Not found')
		})
		.pipe(response)
}

const server = createServer((request, response) => {
	const url = new URL(request.url, `http://${request.headers.host}`)

	if (url.pathname === '/') return sendFile(response, 'test/harness.html')
	if (url.pathname.startsWith('/dist/')) return sendFile(response, url.pathname.slice(1))

	if (url.pathname === '/fixture/success' || url.pathname === '/fixture/duplicate') {
		response.setHeader('Content-Type', 'text/plain')
		response.setHeader('Content-Length', fixture.length)
		return response.end(fixture)
	}

	if (url.pathname === '/fixture/redirect') {
		response.statusCode = 302
		response.setHeader('Location', '/fixture/success')
		return response.end()
	}

	if (url.pathname === '/fixture/status/500') {
		response.statusCode = 500
		return response.end('Server error')
	}

	if (url.pathname.startsWith('/fixture/concurrency-result/')) {
		const id = url.pathname.split('/').at(-1)
		response.setHeader('Content-Type', 'application/json')
		return response.end(JSON.stringify(concurrencyStats.get(id) || { active: 0, maximum: 0 }))
	}

	if (url.pathname.startsWith('/fixture/concurrency/')) {
		const id = url.pathname.split('/').at(-1)
		const stats = concurrencyStats.get(id) || { active: 0, maximum: 0 }
		stats.active++
		stats.maximum = Math.max(stats.maximum, stats.active)
		concurrencyStats.set(id, stats)
		response.once('finish', () => stats.active--)
		response.setHeader('Content-Type', 'text/plain')
		response.setHeader('Content-Length', fixture.length)
		return setTimeout(() => response.end(fixture), 100)
	}

	if (url.pathname === '/fixture/no-length') {
		response.setHeader('Content-Type', 'text/plain')
		response.write('first ')
		return setTimeout(() => response.end('second'), 20)
	}

	if (url.pathname === '/fixture/timeout') {
		return setTimeout(() => response.end(fixture), 250)
	}

	if (url.pathname === '/fixture/slow') {
		const chunk = Buffer.alloc(1024, 'a')
		const chunks = 20
		let sent = 0
		response.setHeader('Content-Type', 'application/octet-stream')
		response.setHeader('Content-Length', chunk.length * chunks)
		const interval = setInterval(() => {
			if (response.destroyed) {
				clearInterval(interval)
				return
			}
			response.write(chunk)
			sent++
			if (sent === chunks) {
				clearInterval(interval)
				response.end()
			}
		}, 20)
		return
	}

	response.statusCode = 404
	response.end('Not found')
})

server.listen(port, '127.0.0.1', () => {
	console.log(`Test server listening on http://127.0.0.1:${port}`)
})
