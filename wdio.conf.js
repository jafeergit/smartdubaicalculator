const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const chaiSubset = require('chai-subset');
const utilities = require('./support/utils/Utilities');
const constants = require('./support/utils/constants');
const allure = require('@wdio/allure-reporter').default;
const pathToDownloadFolder = utilities.getCwd(constants.DOWNLOAD_FOLDER);
const commandlineArgs = require('minimist')(process.argv.slice(2));
const url = commandlineArgs.baseUrl == undefined ? 'https://www.online-calculator.com/full-screen-calculator/' : commandlineArgs.baseUrl;
const responsive = commandlineArgs.responsive == undefined ? false : true;

const BrowserManager = require('./support/utils/Browser.Manager');

const browserArgs = {
    browserName: commandlineArgs.browser == undefined ? 'chrome' : commandlineArgs.browser,
    isSauceLabs: commandlineArgs.sauce,
    isHeadless: commandlineArgs.headless,
};
const browserCaps = new BrowserManager(browserArgs).create();
exports.config = {
    baseUrl: url,
    capabilities: [browserCaps],
    specs: ['./test/specs/*.spec.js'], suites: { calc: ['./test/specs/*.spec.js'], }, exclude: [],
    filesToi: [],
    deprecationWarnings: true,
    bail: 0, waitforTimeout: 100000,
    connectionRetryTimeout: 60000,
    connectionRetryCount: 3,
    framework: 'mocha',
    reporters: [
        'spec',
        ['allure', {
            outputDir: `report/allure-results/`,
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false,
        }],
        ['junit', {
            outputDir: `junit-report/${browserArgs.browserName}-junit-results`,
            outputFileFormat: function () {
                return `junit-${browserArgs.browserName}-test-results.xml`;
            },
        }],
    ],
    mochaOpts: {
        ui: 'bdd',
        compilers: ['js:@babel/register'],
        timeout: 240000,
        retries: commandlineArgs.retries == undefined ? 0 : commandlineArgs.retries,
    },
    services: ['selenium-standalone',['image-comparison', {
        baselineFolder: join(process.cwd(), './support/baseline/'),
        formatImageName: '{tag}-{logName}-{width}x{height}',
        screenshotPath: join(process.cwd(), '.tmp/'),
        savePerInstance: true,
        autoSaveBaseline: true,
        blockOutStatusBar: true,
        blockOutToolBar: true,
        isHybridApp: false,
        tabbableOptions:{
            circle:{
                size: 18,
                fontSize: 18,
            },
            line:{
                color: '#ff221a',
                width: 3,
            },
        }
    }]] ,
    maxInstances: 1,
    onPrepare: function () {
        utilities.createDir(pathToDownloadFolder);
    },

    beforeSession: function () {
        require('@babel/register');
    },
    before: function () {
        chai.use(chaiAsPromised);
        chai.use(chaiSubset);
        global.expect = chai.expect;
        global.assert = chai.assert;
        global.should = chai.should();
        global.baseUrl = this.baseUrl;
        global.env = this.env;
        global.responsive = responsive;
        global.allure = allure;
        global.addEnv = allure.addEnvironment;
        global.addDescription = allure.addDescription;
        global.step = allure.addStep;
        if (!global.responsive) {
            browser.setWindowSize(1920, 1080);
        }
    },
    afterTest: function (test) {
        if (test.error !== undefined) {
            browser.takeScreenshot();
        }
    },
    onComplete: function () {
        utilities.rmDir(pathToDownloadFolder);
    },
};