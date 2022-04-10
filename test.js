const Koa = require('koa');
const Router = require('koa-router');
const router = new Router();
const axios = require("axios");
const fetch = require("node-fetch");
const urls = [
    "http://www.home-poster.net/ua/house/Ivano-Frankivska/",
    "https://silrada.org/pro-proekt/",
    "http://etno-selo.com.ua/bronjuvannja-ta-ciny/",
    "http://zymnavoda.lviv.ua/buh/",
    "https://www.mvk.if.ua/pruyom",
    "https://ehrh-ch.org.ua/index.php/uk/osvitnij-tsentr/provesti-trening-u-domi",
    "http://yu.mk.ua/show/92",
    "https://kontramarka.ua/ru/theatre/teatr-operetty-3.html",
    "https://odessa.kontramarka.ua/ru/events/gorsad-litniy-teatr",
    "https://odessa.kontramarka.ua/ru/theatre/opernyj-teatr-141.html",
    "https://shyroke.org.ua/henderna-rivnist/",
    "https://zoobonus.ua/shop/rodents/203/",
    "https://www.vet.zp.ua/zarubezh",
    "https://vpu36balin.km.ua/entrants/profession/",
    "https://www.vet.zp.ua/chipirovanie-zhivotnykh",
    "https://minjust.gov.ua/anti-corruption-initiative",
    "https://tedis.ua/regional_network/",
    "https://home.kpmg/ua/uk/home/services/tax/global-legal-services.html",
    "http://wm-ua.com.ua/news/novinka-hellermanntyton/",
    "https://c4u.org.ua/livyj-vs-pravyj/",
    "https://www.decathlon.ua/uk/27243-chereviki",
    "https://www.decathlon.ua/uk/604-polo",
    "https://bold.com.ua/big-easy-ecommerce",
    "https://www.snt.ua/about/proekty/2018_1",
    "https://www.nrada.gov.ua/zapyty-na-publichnu-informatsiyu/",
    "https://kom-zoryanska-gromada.gov.ua/rozporyadzhennya-za-2018-rik-13-45-20-14-01-2019/",
    "https://kom-zoryanska-gromada.gov.ua/more_news/",
    "https://kom-zoryanska-gromada.gov.ua/gendernij-profil-16-20-24-21-02-2022/",
    "http://kovalivka.school.org.ua/konsultaciya-dlya-batkiv-16-23-45-14-03-2021/",
    "https://knvk35.dnepredu.com/uk/site/robota-z-obdarovanimi-uch.html",
    "https://mf.khadi.kharkov.ua/departments/budivelnikh-i-dorozhnikh-mashin/abiturijentu/",
    "http://www.turystam.in.ua/ukraina-v-tsyfrakh",
    "https://uzhgorod-osvita.gov.ua/zakladi-doshkilnoi-osviti-11-50-39-04-04-2019/",
    "https://cdut-energodar.wixsite.com/cdut-energodar/prava-ditini",
    "https://bcvpubs.kyiv.ua/%d0%b4%d0%ba%d0%b0/",
    "https://www.ua-region.com.ua/kved/43.33",
    "https://kyivobl-man.in.ua/nashi-proekty/proekt-virtualna-naukova-shkola/",
    "https://imzo.gov.ua/diyalnist/zasobi-navchannya-i-obladnannya/",
    "https://mon.gov.ua/ua/tag/protidiya-bulingu",
    "http://rcdut-skvyra.osv.org.ua/dzhura-10-23-58-22-04-2019/",
    "https://osau.edu.ua/koledzh-upravlinnya-bioresursamy/",
    "https://osun.vn.ua/viddili/viddil-biolohiyi-ta-silskoho-hospodarstva",
    "https://lardi-trans.ua/user/13706951275/news/10072/",
    "http://pogrebyshe.cpmsd.org.ua/pro-medichnij-centr-11-06-06-21-07-2021/",
    "http://www.home-poster.net/ua/house/",
    "https://kmvpuzt.vn.ua/entrants/admission-rules/",
    "https://chernigiv-rada.gov.ua/gumsfera-zaklady-osvity/",
    "https://kharkivoda.gov.ua/dostup-do-publichnoyi-informatsiyi/2871/3263?sv"
]
const downloadFlag = true
const app = new Koa();

const download = async (id) => {
    let response;
    try {
        response = await axios.get('http://localhost:8080/reports',{headers:{'Xid':id}})
    }catch (e) {
        console.log(e)
        response = download(id)
    }
    return response
}

app.use(
    router
        .get('/', (ctx) => {
            ctx.body = 'Привіт'
        })
        .get('/history', async (ctx) => {
            const response = await axios.post('http://localhost:8080/history',
                {urlAdress:"https://chernigiv-rada.gov.ua/gumsfera-zaklady-osvity/"});
            ctx.body = response.data
        })
        .get('/reports', async (ctx) =>{
            //передаєш URL'и на сервер і як відповідь отримуєш id свого запиту
            const {data} = await axios.post('http://localhost:8080/reports',{downloadDaily:true, urls:urls});
            const id = data.id;
            //По id отримуєш відповідь на свій запит
            const response = await download(id);
            ctx.body = response.data
        }).middleware())



app.listen(8008, () => {
    console.log(`KOA Server is now running on http://localhost:8008`)})




