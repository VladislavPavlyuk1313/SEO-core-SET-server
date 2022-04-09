const {createReportsList} = require("../manegers/reportCreator");
const {addToDownloadList} = require('../manegers/queueDB')

const getReportsController = async (req, res) =>{
    const {downloadDaily, urls}  = req.body
    if (downloadDaily){
      addToDownloadList(urls);
    }
    res.send(await createReportsList(urls));
}

module.exports = {getReportsController}