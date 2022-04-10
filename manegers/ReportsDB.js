const fetch = require("node-fetch");
const {reportModel, historyModel} = require('../helpers/schema.js');
const {getNormalizedDate, prepareReport} = require('../helpers/functions');
const Emitter = require('events')
let emitter = new Emitter()
/**
 @param {[Object]} downloadList  - Cписок об'єктів у кожного з яких є поля 'urlAress' та 'formFactor'
 @param {String} downloadList[].urlAress - URL адреса зіт за якою необхідно заантажити
 @param {String} downloadList[].formFactor - формфактор. 'ALL_FORM_FACTORS', 'PHONE', 'DESKTOP' або 'TABLET'* @returns {Promise<void>}
 */
const downloadMeneger = async (downloadList, formFactor, id) => {
    await (new reportModel({
        id: id,
        urlAdresses: downloadList,
        formFactor: formFactor,
        status: 'in processing'
    })).save();
    promiseList = []
    for (let element of downloadList) {
          promiseList.push(downloadCrUXReport(element, formFactor))
    }
    await Promise.allSettled(promiseList)
    reportModel.replaceOne({id:id}, {status: 'done'})
    emitter.emit(id)
    console.log(new Date(), 'Опрацював запит id', id)
}



/**
 * Функція перевіряє наявність в БД сьогоднішнього звіту про заданий URL
 * @param {String} URLAdress - URL адреса зіт за якою необхідно заантажити
 * @param {String} [formFactor = 'ALL_FORM_FACTORS'] - формфактор. 'ALL_FORM_FACTORS', 'PHONE', 'DESKTOP' або 'TABLET'
 * @returns {Promise<boolean>}
 */
const isTodaysReportInDB = async (URLAdress, formFactor = 'ALL_FORM_FACTORS') => {
    const currentDate = getNormalizedDate(Date.now())
    const report = await historyModel.findOne({"urlAdress": URLAdress, "date": currentDate, 'formFactor': formFactor})
    return Boolean(report)
}
/**
 * Функція перевіряє, чи є в БД сьогоднішній звіт про заданий URL, та якщо його немає заввантажує його.
 * @param {String} URLAdress - URL адреса зіт за якою необхідно заантажити
 * @param {String} [formFactor = 'ALL_FORM_FACTORS'] - формфактор. 'ALL_FORM_FACTORS', 'PHONE', 'DESKTOP' або 'TABLET'
 * @returns {Promise<void>}
 */
const downloadCrUXReport = async (URLAdress, formFactor = 'ALL_FORM_FACTORS') => {
    if (!(await isTodaysReportInDB(URLAdress, formFactor))) {
        const apiKey = 'AIzaSyAXpZ_9gcHduOpiE8XlMpVuRU_Pvs_RNQo';
        const endpointUrl = 'https://chromeuxreport.googleapis.com/v1/records:queryRecord';
        const responseFromCrUX = await fetch(`${endpointUrl}?key=${apiKey}`, {
            method: 'POST', body: JSON.stringify({'origin': URLAdress, 'formFactor': formFactor}),
        });
        const report = await responseFromCrUX.json();
        const currentDate = getNormalizedDate(Date.now())
        const preparedReport = prepareReport(report, URLAdress, currentDate, formFactor)
        await (new historyModel(preparedReport)).save();
    }
}
/**
 * Функція поввертає сьогоднішній звіт про заданий URL
 * @param {String} URLAdress - URL адреса зіт за якою необхідно заантажити
 * @param {String} [formFactor = 'ALL_FORM_FACTORS'] - формфактор. 'ALL_FORM_FACTORS', 'PHONE', 'DESKTOP' або 'TABLET'
 * @returns {Promise<*>}
 */
const getTodaysReport = async (URLAdress, formFactor = 'ALL_FORM_FACTORS') => {
    const currentDate = getNormalizedDate(Date.now())
    const report = await historyModel.findOne({
        'urlAdress': URLAdress, 'date': currentDate, 'formFactor': formFactor
    },{
        'urlAdress': 1, 'date': 1, 'formFactor': 1, 'record': 1 , _id : 0
    })

    let reportObj
    if (!report) {
        await downloadCrUXReport(URLAdress, formFactor)
        reportObj = await getTodaysReport(URLAdress, formFactor);
    } else {
        reportObj = report._doc
    }
   return reportObj
}
module.exports = {
    getTodaysReport,
    downloadMeneger,
    emitter
}




