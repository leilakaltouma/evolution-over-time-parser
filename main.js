const puppeteer = require('puppeteer')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvWriter = createCsvWriter({
    path: 'cities.csv',
    header: [
        {id: 'City', title: 'city'},
        {id: 'temperature', title: 'temperature'},
        {id: 'timeStamp', title: 'Timestamp'}
    ]
});


async function run () {
    const browser = await puppeteer.launch({
        headless:true
    });
    const page = await browser.newPage();
    await page.goto('https://github.com/leilakaltouma/evolution-over-time/commits/main/cities.json');
    const links = await page.evaluate(() => {
        const ref = Array.from(document.querySelectorAll(".TimelineItem-body .BtnGroup a:first-child")).map(x => x.getAttribute('href').replace('/blob/','/'))
        const timeStamp = Array.from(document.querySelectorAll("relative-time")).map(x => x.getAttribute('title'))
    return  {ref,timeStamp}
})

    let cities = []

    for(i=0; i < links.ref.length; i++) {
        await page.goto(`https://raw.githubusercontent.com/${links.ref[i]}`)
        let data = await page.evaluate(()=> {
           return  document.querySelector('pre').innerText
        })

        data = JSON.parse(data)
        data.forEach((x) => x.timeStamp = links.timeStamp[i])
        cities.push(data)
    }
    csvWriter.writeRecords(cities.flat())
    .then(() => {
        console.log('...Done');
    });

    browser.close();
}
run();