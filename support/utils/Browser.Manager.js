const utilities = require('../utils/Utilities');
const constants = require('../utils/constants');
const pathToDownloadFolder = utilities.getCwd(constants.DOWNLOAD_FOLDER);
const commandlineArgs = require('minimist')(process.argv.slice(2));

class Browser {
    constructor(browserArgs) {
        this.browser = browserArgs.browserName;
        this.isSauceLabs = browserArgs.isSauceLabs;
        this.isHeadless = browserArgs.isHeadless;
    }

    create() {
        switch (this.browser) {
            case 'chrome':
                return this.chrome(this.isHeadless);
            case 'firefox':
                return this.firefox(this.isHeadless);
            case 'internetexplorer':
                return this.internetexplorer(this.isHeadless);
            case 'safari':
                return this.safari(this.isHeadless);
            default:
                if (this.isSauceLabs) {
                    return this.sauce(this.browser);
                } else {
                    return this.emulatedDevice(this.browser, this.isHeadless);
                }
        }
    }

    chrome() {
        const chromeArgs = [
            '--disable-gpu',
            '--disable-extensions',
            '--disable-infobars',
            '--disable-dev-shm-usage',
            '--disable-web-security',
            '--incognito',
        ];

        if (this.isHeadless) {
            chromeArgs.push('--headless', 'no-sandbox');
        }

        return {
            "browserName": 'chrome',
            'goog:chromeOptions': {
                args: chromeArgs,
                useAutomationExtension: false,
                prefs: {
                    'download.default_directory': pathToDownloadFolder,
                    'download.prompt_for_download': false,
                    'download.directory_upgrade': true,
                    "safebrowsing.enabled": false,
                    "safebrowsing.disable_download_protection": true,
                },
            },
            "maxInstances": process.env.CI_MAX_INSTANCES == undefined ? '10' : process.env.CI_MAX_INSTANCES,
        };
    }

    firefox() {
        const ffArgs = [];

        if (this.isHeadless) {
            ffArgs.push('--headless');
        }

        return {
            "browserName": 'firefox',
            "moz:firefoxOptions": {
                args: ffArgs,
                binary: "C:\\Program Files\\Mozilla Firefox\\firefox.exe", // replace with firefox path
            },
            "maxInstances": process.env.CI_MAX_INSTANCES == undefined ? '10' : process.env.CI_MAX_INSTANCES,
        };
    }

    internetexplorer() { //ie driver has to be changed to 32 bit in node modules if required to run
        const ieArgs = [];

        if (this.isHeadless) {
            ieArgs.push('--headless');
        }

        return {
            "browserName": 'internet explorer',
            "se:ieOptions": {
                args: ieArgs,
                prefs: {
                     "nativeEvents":false,
                    "acceptUntrustedCertificates": true,
                    "ignoreZoomSetting": true,
                    "initialBrowserUrl": commandlineArgs.initialUrl == undefined ? commandlineArgs.baseUrl : commandlineArgs.initialUrl,
                    "requireWindowFocus": true,
                    "EnableNativeEvents": false,
                    "UnexpectedAlertBehaviour": "accept",
                    "disable-popup-blocking": true,
                    "enablePersistentHover": true,
                    "ElementScrollBehavior": true,
                    "ignoreProtectedModeSettings":true,
                },
            },
            "maxInstances": process.env.CI_MAX_INSTANCES == undefined ? '10' : process.env.CI_MAX_INSTANCES,
        };
    }

    safari() {
        const safariArgs = [];

        if (this.isHeadless) {
            safariArgs.push('--headless');
        }

        return {
            "browserName": 'safari',
            "ios:safari.options": {
                args: safariArgs,
                prefs: {
                    "setUseTechnologyPreview": true,
                },
            },
            "maxInstances": process.env.CI_MAX_INSTANCES == undefined ? '10' : process.env.CI_MAX_INSTANCES,
        };
    }

    emulatedDevice(device) {
        const chromeArgs = [
            '--disable-gpu',
            '--disable-extensions',
            '--disable-infobars',
            '--disable-dev-shm-usage',
            '--disable-web-security',
            '--incognito',
        ];

        if (this.isHeadless) {
            chromeArgs.push('--headless', 'no-sandbox');
        }

        return {
            "browserName": 'chrome',
            "acceptInsecureCerts": true,
            'goog:chromeOptions': {
                mobileEmulation: { deviceName: device },
                args: chromeArgs,
                useAutomationExtension: false,
                prefs: {
                    'download.default_directory': pathToDownloadFolder,
                    'download.prompt_for_download': false,
                    'download.directory_upgrade': true,
                    "safebrowsing.enabled": false,
                    "safebrowsing.disable_download_protection": true,
                },
            },
            "maxInstances": process.env.CI_MAX_INSTANCES == undefined ? '10' : process.env.CI_MAX_INSTANCES,
        };
    }

    sauce(browser) {
        const remoteBrowsers = require('../utils/remote-browsers.json');
        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        const jobName = `${process.env.SAUCE_TEST_NAME}: ${date + ' ' + time}`;
        const buildInfo = {
            build: `${process.env.JOB_NAME}: ${process.env.BUILD_NUMBER}`,
            name: jobName,
            maxInstances: process.env.SAUCE_MAX_INSTANCES == undefined ? '30' : process.env.SAUCE_MAX_INSTANCES,
            tunnelIdentifier: process.env.TUNNEL_IDENTIFIER,
        };
        const saucelabsBrowserCaps = remoteBrowsers[browser];
        return { ...buildInfo, ...saucelabsBrowserCaps };
    }
}

module.exports = Browser;