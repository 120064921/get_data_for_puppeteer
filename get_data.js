const puppeteer = require('puppeteer');
const url = 'https://eosflare.io/token/tkcointkcoin/TKC';//源数据页面地址

(async () => {
	const browser = await (puppeteer.launch({
		// 若是手动下载的chromium需要指定chromium地址
		// executablePath: './node_modules/puppeteer/.local-chromium',
		//设置超时时间
		timeout: 5000,
		//如果是访问https页面 此属性会忽略https错误
		ignoreHTTPSErrors: true,
		// 打开开发者工具, 当此值为true时, headless总为false
		devtools: false,
		// 关闭headless模式, 不会打开浏览器
		headless: false
	}));
	
	const page = await browser.newPage();
	await page.goto(url);
	await page.waitFor(5000);
	
	let insert_num = 0;
	let insert_datas = [];

	for (let page_num = 1; page_num <= 2; page_num++) {
	  await page.waitForSelector('#holders', {timeout: 10000});
	  const get_data = await page.$eval('#holders', function(e){
		let itemList = e.querySelectorAll('.layout.row.wrap')
		const writeDataList = [];

		for (let item of itemList) {
			let writeData = {};

			let rankStr = item.querySelector('.flex.xs12.sm5.md6').innerText;
			let rankArr = rankStr.split(' ');
			writeData.rank = rankArr[0].replace(".", "");
			writeData.account = item.querySelector('.flex.xs12.sm5.md6>a').innerText;
			writeData.balance = item.querySelector('.flex.xs8.sm4.md3.text-sm-right').innerText;
			writeData.rate = item.querySelector('.flex.xs4.sm3.md3.text-xs-right').innerText;

			writeDataList.push(writeData);
		}

		return writeDataList;
	  });
	  
	  //写入数据库
    //todo
	  await page.waitFor(2000);
	  //下一页
    await page.click('[aria-label="Next page"]');
	  await page.waitForSelector('#holders', {timeout: 10000});
	  await page.waitFor(3000);
	
	  insert_num += get_data.length;
	  insert_datas.push(get_data);
	  console.log('当前页数：'+page_num);
	}
	
	console.log(insert_datas);
	console.log('获取数据量：'+insert_num);
	
	browser.close();
})();
