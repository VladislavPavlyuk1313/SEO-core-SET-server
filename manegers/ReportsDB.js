const fetch = require("node-fetch");
const {reportModel, historyModel} = require('../helpers/schema.js');
const {getNormalizedDate, prepareReport} = require('../helpers/functions');
const Emitter = require('events')
let emitter = new Emitter()

const downloadMeneger = async (downloadList, formFactor, id) => {
    await (new reportModel({
        requestId: id,
        urlAdresses: downloadList,
        formFactor: formFactor,
        status: 'in processing'
    })).save();
    console.log('додав запис', id);
    promiseList = []
    for (let element of downloadList) {
          promiseList.push(downloadCrUXReport(element, formFactor))
    }
    await Promise.allSettled(promiseList)
    await reportModel.deleteOne({requestId:id})
    await (new reportModel({
        requestId: id,
        urlAdresses: downloadList,
        formFactor: formFactor,
        status: 'done'
    })).save();
    emitter.emit(id)
    console.log(new Date(), 'Опрацював запит id', id)
}
const isTodaysReportInDB = async (URLAdress, formFactor = 'ALL_FORM_FACTORS') => {
    const currentDate = getNormalizedDate(Date.now())
    const report = await historyModel.findOne({"urlAdress": URLAdress, "date": currentDate, 'formFactor': formFactor})
    return Boolean(report)
}
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




