export function getURL(path?: string): string {
    let base = "http://0.0.0.0/blog"
    let production = "http://54.152.207.25/blog"
    if (path !== undefined) {
        return `${production}/${path}`
    } else {
        return base
    }
}