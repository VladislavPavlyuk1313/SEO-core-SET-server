const {downloadListModel} = require('../helpers/schema.js');
const {getNormalizedDate} = require('../helpers/functions');
const {downloadMeneger}=require('./ReportsDB');

const getDelayForNextUpdate = () => {
    const currentDate = getNormalizedDate(Date.now())
    const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
    const updateOffset = 29 * 3600 * 1000 //currentDate містить сьогоднішню дату
    const offset = updateOffset - timezoneOffset
    const updateTime = new Date(currentDate).getTime() + offset
    return updateTime - Date.now()
}

const downloadOnSchedule = async () => {
    const downloadList = await getDownloadList();
    downloadMeneger(downloadList);
    setTimeout(downloadOnSchedule, getDelayForNextUpdate())
}

const addToDownloadList = async (ListOfAdress, formFactor = 'ALL_FORM_FACTORS') => {
    ListOfAdress.forEach((urlAdress) => {
        (new downloadListModel({
            urlAdress: urlAdress, formFactor: formFactor,
        })).save();
    })
}

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