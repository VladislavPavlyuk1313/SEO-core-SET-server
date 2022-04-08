const {downloadListModel} = require('../helpers/schema.js');
const {getNormalizedDate} = require('../helpers/functions');
const {downloadMeneger}=require('./ReportsDB')
/**
 * Функція повертає скільки мілісекунд залишилося до наступного разу, коли на годиннику буде 05:00
 * (в цей час щодня завантажуються заплановані звіти CrUX)
 * @returns {number}
 */
const getDelayForNextUpdate = () => {
    const currentDate = getNormalizedDate(Date.now())
    const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
    const updateOffset = 29 * 3600 * 1000 //currentDate містить сьогоднішню дату
    const offset = updateOffset - timezoneOffset
    const updateTime = new Date(currentDate).getTime() + offset
    return updateTime - Date.now()
}
/**
 * Функція відпоідає за щоденне завантаження запланованих звітів CrUX
 * Вона з ввідпоідної колекції бази даних отримує список URL`ів які потрібно завантажити, передає їх download meneger`у
 * та викликає саму себе з необхідною затримкою
 * @returns {Promise<void>}
 */
const downloadOnSchedule = async () => {
    const downloadList = await getDownloadList();
    downloadMeneger(downloadList);
    setTimeout(downloadOnSchedule, getDelayForNextUpdate())
}
/**
 * Функція додає документи до колекції у якій зберігаються ті URL`и які потрібно завантажувати щодня
 * @param {String} ListOfAdress - URL адреса зіт за якою необхідно заантажити
 * @param {String} [formFactor = 'ALL_FORM_FACTORS'] - формфактор. 'ALL_FORM_FACTORS', 'PHONE', 'DESKTOP' або 'TABLET'
 * @returns {Promise<void>}
 */
const addToDownloadList = async (ListOfAdress, formFactor = 'ALL_FORM_FACTORS') => {
    ListOfAdress.forEach((urlAdress) => {
        (new downloadListModel({
            urlAdress: urlAdress, formFactor: formFactor,
        })).save();
    })
}
/**
 * Функція поертає список URL`ів звіти про які потрібно заввантажуввати щоденно.
 * Структура відповіді:
 * [{'urlAdress': {String}, 'formFactor': {String}}, ...]
 *  * @returns {Promise<*[]>}
 */
const getDownloadList = async () => {

    const records = await downloadListModel.find({}, {
        'urlAdress': 1, 'formFactor': 1, _id: 0
    })
    let downloadList = [];
    records.forEach(element => downloadList.push(element._doc))
    return downloadList
}
module.exports = {
    addToDownloadList,
    downloadOnSchedule,
    getDownloadList
}