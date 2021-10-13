const url = "https://mern-crud.herokuapp.com"
const puppeteer = require("puppeteer");

(async () => {
    const start = process.hrtime();
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto(url);

    let readData = async() => {
        return await new Promise(async (resolve, reject) => {
            try {
                resolve(await page.evaluate(() => {
                    let tabla = document.querySelector('table[class="ui single line table"]')
                    let titulos = tabla.querySelector('thead').querySelectorAll('th');
                    let keys = []
                    for (var i = 0; i < 4; i++) {
                        keys.push(titulos[i].innerHTML)
                    }
                    tabla = tabla.querySelector('tbody').querySelectorAll('tr');
                    let datos = []
                    for (var i = 0; i < tabla.length; i++) {
                        var x = {}
                        var data = tabla[i].querySelectorAll('td')
                        for (var j = 0; j < 4; j++) {
                            x[keys[j]] = data[j].innerHTML
                        }
                        datos.push(x)
                    }
                    return datos;
                }))
            }
            catch(error) {
                reject(error);
            }
        })
    }
    
    console.log(await readData())
    await page.click('button[class="ui green button"]')
    await page.waitForSelector('div[class="ui tiny modal transition visible active"]')
    await page.focus('input[name="name"]')
    await page.keyboard.type('Martha Cecilia Sosa Diaz')
    await page.focus('input[name="email"]')
    await page.keyboard.type('mcsd1969@gmail.com')
    await page.focus('input[name="age"]')
    await page.keyboard.type('53')
    await page.click('button[class="ui green right floated button"]')
    await page.waitForNetworkIdle()
    await page.click('i[class="close icon"]')
    console.log("--------------------------------------")
    console.log(await readData());
    await browser.close();
    const end = process.hrtime(start);
    console.log("--------------------------------------")
    console.log(`Tiempo de ejecución ${end[0]} s y ${end[1]/1000000} ms`);
})();

