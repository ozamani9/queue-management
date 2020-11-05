module.exports = {
    preset: "jest-puppeteer",
    globals: {
        URL: "https://sabe.io"
    },
    testMatch: [
        "**/test/**/*.test.js"
    ],
    verbose: true
}