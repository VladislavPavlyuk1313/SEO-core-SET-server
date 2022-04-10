const {historyModel} = require("../helpers/schema");
const {getAverageValues, getSortWeight, sortHistory} = require('../helpers/functions');
const {getTodaysReport} = require('../manegers/ReportsDB');
/**
 * Функція повертає усі записи про даний URL, які є в БД
 * @param {String} URLAdress - URL адреса зіт за якою необхідно заантажити
 * @param {String} [formFactor = 'ALL_FORM_FACTORS'] - формфактор. 'ALL_FORM_FACTORS', 'PHONE', 'DESKTOP' або 'TABLET'* @returns {Promise<void>}
 */
const getHistiryOfReports = async (URLAdress, formFactor = 'ALL_FORM_FACTORS') => {
    let listOfReports = []
    const reports = await historyModel.find({
        'urlAdress': URLAdress, 'formFactor': formFactor
    }, {
        'urlAdress': 1, 'date': 1, 'formFactor': 1, 'record': 1, _id: 0
    })
    reports.forEach(report => listOfReports.push(report._doc))
    console.log(reports)
    listOfReports.sort(sortHistory)
    return listOfReports
}
const createReportsList = async (URLsList, formFactor) => {
    let reportsList = [];
    for (URLAdress of URLsList){
        reportsList.push(await getTodaysReport(URLAdress, formFactor))
    }
    reportsList.sort((a,b)=>{
        return  getSortWeight(b)-getSortWeight(a)
    })
    return {
        average : getAverageValues(reportsList),
        reports : reportsList
    }
}
module.exports = {
    createReportsList,
    getHistiryOfReports
}