
const {createReportsList} = require("../manegers/reportCreator");
const {addToDownloadList} = require('../manegers/queueDB');
const {downloadMeneger, emitter} = require('../manegers/ReportsDB');
const {reportModel} = require('../helpers/schema');


const getReportsController = async (req, res) =>{
    const id  = req.headers.xid
    const downloadList = await reportModel.findOne({id:id}, {urlAdresses:1, fornFator:1, status:1})
    const {urlAdresses, formFactor, status} = downloadList._doc
    console.log(status)
    if (status === 'done'){
        res.send(await createReportsList(urlAdresses, formFactor));
    }else {
        console.log('жду подію', id)
        emitter.on(id, async () => {
            console.log('зайшов в подію')
            const downloadList = await reportModel.findOne({id:id}, {urlAdresses:1, fornFator:1})
            const {urlAdresses, formFactor} = downloadList._doc
            res.send(await createReportsList(urlAdresses, formFactor));
        })
    }


}
const postReportsController = (req, res) =>{
    const id = Date.now();
    const {downloadDaily, urls}  = req.body
    if (downloadDaily){
        addToDownloadList(urls);
    }
    downloadMeneger(urls, 'ALL_FORM_FACTORS', id)
    console.log(new Date(), 'відправлений статус')
    res.send({id:id})
}

module.exports = {getReportsController, postReportsController}

