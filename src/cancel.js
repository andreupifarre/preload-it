export default function cancel() {
    for (var item of this.state) {
        if (item.completion < 100) {
            item.xhr.abort()
            item.status = 0
        }
    }

    this.oncancel(this.state)

    return this.state
}