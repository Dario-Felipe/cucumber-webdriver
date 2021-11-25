const { Given, When, Then } = require('cucumber');
const { Builder, By, Key, until } = require("selenium-webdriver");
const assert = require('assert');

let driver;
let firstDate;
let originCep;
let destinyCep;
let originalWindow;

  const delay = ms => new Promise(res => setTimeout(res, ms));

  Given(`the user accesses the home page of validate national`, async () => {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.get("https://www2.correios.com.br/sistemas/precosPrazos/");
  })

  When(`the user fill the filds and press the ENTER key on the keyboard`, async () => {
    firstDate =  await driver.findElement(By.xpath("//*[@id='data']")).getAttribute("value");
    originCep = "53040085";
    destinyCep = "53140140";
  
    await driver.findElement(By.xpath("/html/body/div[1]/div[3]/div[2]/div/div/div[2]/div[2]/div[3]/form/div/div/span[3]/label/input")).sendKeys(originCep);
    await driver.findElement(By.xpath("/html/body/div[1]/div[3]/div[2]/div/div/div[2]/div[2]/div[3]/form/div/div/span[5]/label/input")).sendKeys(destinyCep);
    await driver.findElement(By.xpath("/html/body/div[1]/div[3]/div[2]/div/div/div[2]/div[2]/div[3]/form/div/div/span[7]/label/select/option[8]")).click();
    await driver.findElement(By.xpath("//*[@id='spanBotao']/input")).click();
  })

  Then('it should be return the same date', async () => {
    originalWindow = await driver.getWindowHandle();
    await driver.wait(
      async () => (await driver.getAllWindowHandles()).length === 2,
      10000
    );
    const windows = await driver.getAllWindowHandles();
    windows.forEach(async handle => {
      if (handle !== originalWindow) {
        await driver.switchTo().window(handle);
      }
    });
    
    const date = await driver.wait(until.elementLocated(By.xpath("/html/body/div[1]/div[3]/div[2]/div/div/div[2]/div[2]/div[2]/table/tbody/tr[2]/th/small")), 100000).getAttribute("textContent");
    assert.equal(date.slice(19), firstDate);
  })