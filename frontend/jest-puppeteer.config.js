module.exports = {
    launch: {
        executablePath: 'chrome.exe',
        userDataDir: 'c:\\temp\\jest',
        headless: false,
        slowMo: 30,
        devtools: false,
        ignoreDefaultArgs: ['--disable-extensions'],	  
    }
}
