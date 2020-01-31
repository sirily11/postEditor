export function getURL(path?: string): string {
    let base = "http://0.0.0.0/blog";
    let production = "https://qbiv28lfa0.execute-api.us-east-1.amazonaws.com/dev";
    if (path !== undefined) {
        return `${production}/${path}`
    } else {
        return base
    }
}