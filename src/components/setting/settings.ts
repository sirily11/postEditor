export function getURL(path?: string): string {
    let base = "http://0.0.0.0/api_blog"
    let production = "https://sirileepage.com/api_blog"
    if (path !== undefined) {
        return `${production}/${path}`
    } else {
        return base
    }
}