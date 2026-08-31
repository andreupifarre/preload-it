export interface PreloadOptions {
  stepped?: boolean
  timeout?: number
}

export type FailureReason = 'http' | 'network' | 'timeout' | 'abort'

export interface PreloadItem {
  url: string
  completion: number
  downloaded: number
  total: number
  error: boolean
  canceled: boolean
  xhr?: XMLHttpRequest
  fileName?: string
  type?: string
  status?: number
  blobUrl?: string | null
  size?: number | null
  failureReason?: FailureReason
}

export interface ProgressEvent {
  progress: number
  item: PreloadItem
}

export interface Preloader {
  state: PreloadItem[]
  loaded: number | false
  stepped: boolean
  timeout: number
  onprogress: (event: ProgressEvent) => void
  oncomplete: (items: PreloadItem[]) => void
  onfetched: (item: PreloadItem) => void
  onerror: (item: PreloadItem) => void
  oncancel: (items: PreloadItem[]) => void
  fetch(urls: string[]): Promise<PreloadItem[]>
  getItemByUrl(url: string): PreloadItem | undefined
  cancel(): PreloadItem[]
  dispose(): PreloadItem[]
}

export default function Preload(options?: PreloadOptions): Preloader
