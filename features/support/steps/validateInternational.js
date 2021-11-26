const { Given, When, Then } = require('cucumber');
const { Builder, By, Key, until } = require("selenium-webdriver");
const assert = require('assert');

let driver;
const CEP = "53492-000"
let expectedPrice = "48,10";
let price;

  const delay = ms => new Promise(res => setTimeout(res, ms));

  Given(`the user accesses the home page of correios and choose the international prices and deadlines link`, {timeout: 2 * 5000}, async () => {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.get("https://www.correios.com.br/");

    await driver.findElement(By.xpath(`//*[@id="carol-fecha"]`)).click();
    await driver.findElement(By.xpath(`//*[@id="btnCookie"]`)).click();

    const actions = driver.actions({bridge: true});

    await driver.findElement(By.xpath(`//*[@id="content"]/div[3]/div/div[3]/div[2]`)).then((elemento) => {
      actions.move({duration: 1000, origin: elemento ,x: 0, y: 0}).perform();
    });

    await driver.findElement(By.xpath(`//*[@id="content"]/div[3]/div/div[3]/div[2]/ul/li[2]/a`)).click();
  })

  When(`the user fill the fields with package info and click on simulate button`,{ timeout: 4 * 5000 }, async () => {
    await delay(3000);
    await driver.findElement(By.xpath(`//*[@id="codigoPostalSimulacao"]`)).sendKeys(CEP);

    await delay(3000);

    await driver.wait(until.elementLocated(By.xpath(`//*[@id="siglaPaisDestinatario"]/option[6]`), 10000)).click();

    await delay(3000);

    await driver.findElement(By.xpath(`//*[@id="nomeCidadeDestinatario"]`)).sendKeys("BERL", Key.ARROW_DOWN);

    await delay(3000);

    await driver.findElement(By.xpath(`//*[@id="tipoEmbalagem"]/option[2]`)).click();
    await driver.findElement(By.xpath(`//*[@id="comprimentoObjeto"]`)).sendKeys(260);
    await driver.findElement(By.xpath(`//*[@id="larguraObjeto"]`)).sendKeys(260);
    await driver.findElement(By.xpath(`//*[@id="pesoObjeto"]`)).sendKeys(260);

    await driver.findElement(By.xpath(`//*[@id="simulaPrecoPrazo"]`)).click();
    await delay(6000);
  })

  Then('it should be return their respective price', async () => {
    price = await driver.findElement(By.xpath(`//*[@id="tbServicos"]/tbody/tr[1]/td[3]`)).getAttribute("textContent");

    assert.equal(expectedPrice, price.trim())

    await driver.close();
  })