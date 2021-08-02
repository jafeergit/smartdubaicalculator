import { DEFAULT_TIMEOUT } from '../utils/constants';

export default class Driver {

    static click(selector, timeout = DEFAULT_TIMEOUT) {
        this.awaitIsDisplayed(selector, timeout);
        selector.click();
    }

    static moveInto(selector, x, y, timeout = DEFAULT_TIMEOUT) {
        this.awaitIsDisplayed(selector, timeout);
        selector.moveTo(x, y);
    }

    static moveToIframe(selector, timeout = DEFAULT_TIMEOUT) {
        this.awaitIsDisplayed(selector, timeout);
        browser.switchToFrame(selector);
    }

    static scrollAndClick(selector, timeout = DEFAULT_TIMEOUT) {
        this.scrollIntoView(selector);
        this.click(selector, timeout);
    }

    static textOf(selector, timeout = DEFAULT_TIMEOUT) {
        this.awaitIsDisplayed(selector, timeout);
        return selector.getText();
    }

    static getElementText(selector, timeout = DEFAULT_TIMEOUT) {
        this.awaitIsDisplayed(selector, timeout);
        return selector.getElementText();
    }

    static typeAndTabOff(input, selector, timeout = DEFAULT_TIMEOUT) {
        this.awaitIsDisplayed(selector, timeout);
        selector.setValue(input);
        browser.keys('Tab');
    }

    static isDisplayed(selector) {
        return selector.isDisplayed();
    }
    
    static awaitIsDisplayed(selector, timeout = DEFAULT_TIMEOUT) {
        try {
            selector.waitForDisplayed(timeout);
            return true;
        } catch (e) {
            return false;
        }
    }

    static scrollAndCheckDisplayed(selector) {
        if (this.awaitIsDisplayed(selector)) {
            this.scrollIntoView(selector);
            return true;
        }
        return false;
    }

    static attributeValueOf(selector, attribute) {
        this.awaitIsDisplayed(selector);
        return selector.getAttribute(attribute);
    }

    static scrollIntoView(selector, scrollIntoViewOptions) {
        this.awaitIsDisplayed(selector);
        selector.scrollIntoView(scrollIntoViewOptions);
    }

    
    static getBaseUrl() {
        return browser.options.baseUrl;
    }

    static waitUntilValueDisplayed(selector, timeout = DEFAULT_TIMEOUT) {
        return browser.waitUntil(() => {
            return (this.valueOf(selector) !== '');
        }, timeout);
    }

    static waitUntilTextDisplayed(selector, text, timeout = DEFAULT_TIMEOUT) {
        return browser.waitUntil(() => {
            return (this.textOf(selector) === text);
        }, timeout);
    }
}
