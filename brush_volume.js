const puppeteer = require('puppeteer');
//主页面地址
const url = 'https://domain.cn/login';
	
//账号密码
const accounts = [
	{username : '12345678910', password : '123456' },
	{username : '12345678910', password : '123456' },
	{username : '12345678910', password : '123456' },
	{username : '12345678910', password : '123456' },
];

//访问页面
const page_urls = [
	'https://domain.cn/contact/detail',
];

(async () => {
	const browser = await (puppeteer.launch({
		// 若是手动下载的chromium需要指定chromium地址, 默认引用地址为 /项目目录/node_modules/puppeteer/.local-chromium/
		// executablePath: './node_modules/puppeteer/.local-chromium',
		//设置超时时间
		timeout: 3000,
		//如果是访问https页面 此属性会忽略https错误
		ignoreHTTPSErrors: true,
		// 打开开发者工具, 当此值为true时, headless总为false
		devtools: false,
		// 关闭headless模式, 不会打开浏览器
		headless: false
	}));
	
	const page = await browser.newPage();
	await page.setViewport({width: 800, height: 600});
	
	for (let i = 0; i < accounts.length; i++) {
		await page.goto(url);
		await page.waitFor(2000);
		await page.waitForSelector('#form', {timeout: 10000});
		// await page.type('input[name=m]', accounts[i].username);
		await page.type('input[name=m]', accounts[i].username, {delay: 100});
		// await page.type('input[name=p]', accounts[i].password);
		await page.type('input[name=p]', accounts[i].password, {delay: 100});
		// await page.waitFor(1000);
		await page.click('input[type="submit"]');
		// await page.waitFor(1000);
		console.log('登录成功（' + accounts[i].username + '）');
		await page.waitFor(3000);
		
		// await page.$eval('#holders', function(e){
		// 	for (let page_url of page_urls) {
		// 		await page.goto(page_url);
		// 		await page.waitFor(2000);
		// 	}
		// });
		
		//循环访问页面
		for (let page_url of page_urls) {
			await page.goto(page_url);
			await page.waitFor(3000);
			console.log('------访问（' + page_url + '）成功（' + accounts[i].username + '）');
		}
		
		await page.waitFor(2000);
		//结束循环访问，退出当前账号
		await page.$eval('.moreInfo:nth-child(1) > span:nth-child(2)', e => {
			e.click();
		});
		
		console.log('退出成功');
		await page.waitFor(1000);
	}
	
	await page.waitFor(3000);
	console.log('脚本执行完毕');
	
	browser.close();
	
})();
