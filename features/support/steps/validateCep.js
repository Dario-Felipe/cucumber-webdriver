const { Given, When, Then } = require('cucumber');
const { Builder, By, Key, until } = require("selenium-webdriver");
const assert = require('assert');

let driver;
let cepArea;
let CEP = "53429-000";

  const delay = ms => new Promise(res => setTimeout(res, ms));

  Given(`the user accesses the home page of the post office`, async () => {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.get("https://buscacepinter.correios.com.br/app/endereco/index.php");
  })

  When(`the user enter their zip code and press the ENTER key on the keyboard`, async () => {
    await driver.findElement(By.xpath(`//*[@id="endereco"]`)).sendKeys(CEP, Key.RETURN)

    await delay(1500);

    cepArea = await driver.wait(until.elementLocated(By.xpath(`//*[@id="resultado-DNEC"]/tbody/tr/td[4]`)), 10000).getAttribute('textContent');
  })

  Then('it should be the first zip code rendered in the generated table', async () => {
    assert.equal(CEP, cepArea);

    await driver.close();
  })