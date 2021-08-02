import Driver from "../../support/utils/Driver.Extension";

/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/
export default class Page {
    constructor() {
        this.driver =Driver;
    }
    
    open () {
        return browser.url(baseUrl);
    }
}
