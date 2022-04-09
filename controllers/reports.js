const {createReportsList} = require("../manegers/reportCreator");
const {addToDownloadList} = require('../manegers/queueDB');
const {downloadMeneger} = require('../manegers/ReportsDB')

const getReportsController = async (req, res) =>{
    res.send(await createReportsList(urls));
}
const postReportsController = (req, res) =>{
    const {downloadDaily, urls}  = req.body
    if (downloadDaily){
        addToDownloadList(urls);
    }
    downloadMeneger(urls)
    res.sendStatus(200)
}

module.exports = {getReportsController, postReportsController}