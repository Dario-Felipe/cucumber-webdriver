const { Given, When, Then } = require('cucumber');
const { Builder, By, Key, until } = require("selenium-webdriver");
const assert = require('assert');

let driver;
const CEP = "654564416";
const errorMessage = "Não há dados a serem exibidos";

const delay = ms => new Promise(res => setTimeout(res, ms));

  Given(`the user accesses the inital page of the post office`, async () => {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.get("https://buscacepinter.correios.com.br/app/endereco/index.php");
  })

  When(`the user enter with wrong zip code and press the ENTER key on the keyboard`, async () => {
    await driver.findElement(By.xpath(`//*[@id="endereco"]`)).sendKeys(CEP, Key.RETURN)

    await delay(1500);

    actualMessage = await driver.wait(until.elementLocated(By.xpath(`//*[@id="mensagem-resultado"]`)), 10000).getAttribute('textContent');
  })

  Then('it should be rendered a error message', async () => {
    assert.equal(errorMessage, actualMessage);
  })