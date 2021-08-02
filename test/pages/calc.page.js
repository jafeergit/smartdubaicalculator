import Page from './page';

class CalcPage extends Page {
   
    get iFrameval () { return $('#fullframe'); }
    get iFramevales () { return $$('#iframe'); }
    get canvas () { return $('#canvas'); }

     navigateToIframe () {
         //console.log("the number of iframes is", this.iFramevales.getSize());
         this.driver.awaitIsDisplayed(this.iFrameval);
         this.driver.moveToIframe(this.iFrameval);
    }

    clickSubtractCalcButton() {
        this.canvas.click({ x: 894, y: 381 })
        this.driver.moveInto(this.canvas,894,381);
        this.driver.moveInto(this.canvas,1024,600);
        this.driver.moveInto(this.canvas,774,594);
        console.log("he location is",this.canvas.getLocation());
        browser.keys('NUMBERPAD8');
        browser.keys('SUBTRACT');
        browser.keys('NUMBERPAD2');
        browser.keys('EQUAL');
        //click action not working
    }

    clickDivideCalcButton() {
        this.driver.moveInto(this.canvas,894,381);
        this.driver.moveInto(this.canvas,1024,600);
        this.driver.moveInto(this.canvas,774,594);
        browser.keys('NUMBERPAD8');
        rowser.keys('DIVIDE');
        rowser.keys('NUMBERPAD2');
        browser.keys('EQUAL');
    }

}

export default new CalcPage();
