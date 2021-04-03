const puppeteer = require('puppeteer');
const Gpio = require('pigpio').Gpio,
  yAxis = new Gpio(12, {mode: Gpio.OUTPUT});
  xAxis = new Gpio(13, {mode: Gpio.OUTPUT});

(async () => {

const browser = await puppeteer.launch({
   args: ['--no-sandbox', '--disable-setuid-sandbox'],
   executablePath: '/usr/bin/chromium-browser'
 });

const page = await browser.newPage();
await page.goto('https://vex-over-internet.glitch.me');

while (true) {
  await page.waitForTimeout(2);
  const data = await page.evaluate(() => {
    let headingFromWeb = document.querySelectorAll("span[class=messageBody]");
    const headingList = [...headingFromWeb];
    return headingList.map(h => h.innerHTML);
  });
  if (data[1] != undefined) {
    var command = {
      x: data[1].split('|')[0],
      y: data[1].split('|')[1]
    }
    xAxis.pwmWrite(parseInt(command.x)+127);
    yAxis.pwmWrite(parseInt(command.y)+127);
    console.log(command);
  }
}

})();


/*
const puppeteer = require('puppeteer');

var MONTH = [];

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: '/usr/bin/chromium-browser'
  });
  const page = await browser.newPage();
  await page.goto('https://vex-over-internet.glitch.me');

  for (var i = 0; i < 999999999999999999999999; i++) {
    MONTH = await page.evaluate(() => {
      let headingFromWeb = document.querySelectorAll("span[class=messageBody]");
      const headingList = [...headingFromWeb];
      return headingList.map(h => h.innerHTML);
    });
    console.log(MONTH);
  }


})();
*/
