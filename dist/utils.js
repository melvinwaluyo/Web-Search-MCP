/**
 * Utility functions for the web search MCP server
 */
export function cleanText(text, maxLength = 10000) {
    return text
        .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
        .replace(/\n\s*\n/g, '\n') // Replace multiple newlines with single newline
        .trim()
        .substring(0, maxLength);
}
export function getWordCount(text) {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}
export function getContentPreview(text, maxLength = 500) {
    const cleaned = cleanText(text, maxLength);
    return cleaned.length === maxLength ? cleaned + '...' : cleaned;
}
export function generateTimestamp() {
    return new Date().toISOString();
}
export function validateUrl(url) {
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    }
    catch {
        return false;
    }
}
export function sanitizeQuery(query) {
    return query.trim().substring(0, 1000); // Limit query length
}
export function getRandomUserAgent() {
    const userAgents = [
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
    ];
    return userAgents[Math.floor(Math.random() * userAgents.length)];
}
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export function isPdfUrl(url) {
    try {
        const parsed = new URL(url);
        return parsed.pathname.toLowerCase().endsWith('.pdf');
    }
    catch {
        // If URL parsing fails, check the raw string as fallback
        return url.toLowerCase().endsWith('.pdf');
    }
}
//# sourceMappingURL=utils.js.map