const puppeteer = require('puppeteer');

(async () => {

  const browser = await puppeteer.launch({headless: false});

  const page = await browser.newPage();
  await page.setViewport({width: 1200, height: 720})
  await page.goto('https://staging-odin.instaleap.io/');

  const selector = '#username';
  await page.waitForSelector(selector);
  await page.focus(selector);
  await page.type(selector, 'admin.touchtask@touchtask.com');
  await page.click('button._button-login-id');
  
  const selectorPass = '#password';
  await page.waitForSelector(selectorPass);
  await page.focus(selectorPass);
  await page.type(selectorPass, 'admin.touchtask');
  await page.click('button._button-login-password');

  await page.waitForNavigation('#show-job');
  console.log('New Page URL:', page.url());

  await page.waitFor(5000)
  await page.screenshot({ path: './resources/jobs.png' });

  const data = await page.evaluate(() => {
    const tds = Array.from(document.querySelectorAll('.ant-table-body table tbody tr td'))
    return tds.map(td => td.innerHTML)
  });
  console.log(data);

  await browser.close();
})();

// module.exports = scraperObject;

  // await Promise.all([
  //   await page.click('button._button-login-id');
  //   page.waitForNavigation({ waitUntil: 'networkidle0' }),
  // ]);
