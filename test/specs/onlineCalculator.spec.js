import CalcPage from  '../pages/calc.page';

describe('Calculator Application test', () => {
    it('Perform a subtraction operation',  () => {
         CalcPage.open();
        browser.pause(40000);

         CalcPage.navigateToIframe();
         CalcPage.clickSubtractCalcButton();
         browser.saveScreen('subtractoperation');
         browser.checkScreen('./support/imageBaseline/subtract.png');
    });

    it('Perform a Divide operation',  () => {
        CalcPage.open();

        CalcPage.navigateToIframe();
        CalcPage.clickDivideCalcButton();
        browser.saveScreen('divideoperation');
        browser.checkScreen('./support/imageBaseline/divide.png');
   });
});


