const { Builder, By, Key, until } = require("selenium-webdriver");

const delay = ms => new Promise(res => setTimeout(res, ms));

// 1) - Listando CEP existente
async function validateCEP() {
  const CEP = "53429-000";
  const driver = await new Builder().forBrowser("chrome").build();

  await driver.get("https://buscacepinter.correios.com.br/app/endereco/index.php");

  await driver.findElement(By.xpath(`//*[@id="endereco"]`)).sendKeys(CEP, Key.RETURN)
  const cepArea = await driver.wait(until.elementLocated(By.xpath(`//*[@id="resultado-DNEC"]/tbody/tr/td[4]`)), 10000);

  if(await cepArea.getAttribute('textContent') === CEP) {
    console.log("Passou no teste!");
  } else {
    console.log("Reprovou no teste!");
  }
}

// 2) - Listando CEP existente
async function validateWrongCEP() {
  const CEP = "654564416";
  const driver = await new Builder().forBrowser("chrome").build();

  await driver.get("https://buscacepinter.correios.com.br/app/endereco/index.php");

  await driver.findElement(By.xpath(`//*[@id="endereco"]`)).sendKeys(CEP, Key.RETURN)

  await delay(1500);

  const cepArea = await driver.wait(until.elementLocated(By.xpath(`//*[@id="mensagem-resultado"]`)), 10000).getAttribute('textContent');

  if(await cepArea === "Não há dados a serem exibidos") {
    console.log("Passou no teste!");
  } else {
    console.log("Reprovou no teste!");
  }
}

// 3) - Validando exibição de taxas do cálculo de postagem nacional pela data escolhida
async function validateNational() {
  let driver = await new Builder().forBrowser("chrome").build();

  const originalWindow = await driver.getWindowHandle();
  await driver.get("https://www2.correios.com.br/sistemas/precosPrazos/");

  const firstDate =  await driver.findElement(By.xpath("//*[@id='data']")).getAttribute("value");
  const originCep = "53040085";
  const destinyCep = "53140140";

  await driver.findElement(By.xpath("/html/body/div[1]/div[3]/div[2]/div/div/div[2]/div[2]/div[3]/form/div/div/span[3]/label/input")).sendKeys(originCep);
  await driver.findElement(By.xpath("/html/body/div[1]/div[3]/div[2]/div/div/div[2]/div[2]/div[3]/form/div/div/span[5]/label/input")).sendKeys(destinyCep);
  await driver.findElement(By.xpath("/html/body/div[1]/div[3]/div[2]/div/div/div[2]/div[2]/div[3]/form/div/div/span[7]/label/select/option[8]")).click();
  await driver.findElement(By.xpath("//*[@id='spanBotao']/input")).click();

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

  if(date.slice(19) === firstDate) {
    console.log("Passou no teste!")
  } else {
    console.log("Reprovou no teste!")
  };
}

// 4) -  Validando exibição de informações envio de postagem internacional
async function validateInternational() {
  const CEP = "53492-000"
  const driver = await new Builder().forBrowser("chrome").build();

  await driver.get("https://www.correios.com.br/");

  await driver.manage().window().maximize();
  await driver.findElement(By.xpath(`//*[@id="carol-fecha"]`)).click();
  await driver.findElement(By.xpath(`//*[@id="btnCookie"]`)).click();

  const actions = driver.actions({bridge: true});

  await driver.findElement(By.xpath(`//*[@id="content"]/div[3]/div/div[3]/div[2]`)).then((elemento) => {
    actions.move({duration: 3000, origin: elemento ,x: 0, y: 0}).perform();
  });

  await driver.findElement(By.xpath(`//*[@id="content"]/div[3]/div/div[3]/div[2]/ul/li[2]/a`)).click();

  await driver.findElement(By.xpath(`//*[@id="codigoPostalSimulacao"]`)).sendKeys(CEP);
  await delay(3000);
  await driver.wait(until.elementLocated(By.xpath(`//*[@id="siglaPaisDestinatario"]/option[6]`), 10000)).click();
  await delay(3000);
  await driver.wait(until.elementLocated(By.xpath(`//*[@id="nomeCidadeDestinatario"]`), 10000)).sendKeys("BERL", Key.ARROW_DOWN);
  await delay(1500);
  await driver.wait(until.elementLocated(By.xpath(`//*[@id="tipoEmbalagem"]/option[2]`), 10000)).click();
  await driver.findElement(By.xpath(`//*[@id="comprimentoObjeto"]`)).sendKeys(260);
  await driver.findElement(By.xpath(`//*[@id="larguraObjeto"]`)).sendKeys(260);
  await driver.findElement(By.xpath(`//*[@id="pesoObjeto"]`)).sendKeys(260);
  await driver.findElement(By.xpath(`//*[@id="simulaPrecoPrazo"]`)).click();

  await delay(1500);
  const price = await driver.findElement(By.xpath(`//*[@id="tbServicos"]/tbody/tr[1]/td[3]`)).getAttribute("textContent");

  if(price.trim() === "48,10") {
    console.log("Passou no teste!");
  } else {
    console.log("Reprovou no teste!");
  };
}

// validateCEP();
// validateWrongCEP()
// validateNational();
// validateInternational();