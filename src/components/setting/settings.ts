export function getURL(path?: string): string {
    let base = "http://0.0.0.0/blog"
    let production = "https://sirileepage.com/api_blog"
    if (path !== undefined) {
        return `${base}/${path}`
    } else {
        return base
    }
}