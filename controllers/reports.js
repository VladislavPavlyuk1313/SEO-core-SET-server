
const {createReportsList} = require("../manegers/reportCreator");
const {addToDownloadList} = require('../manegers/queueDB');
const {downloadMeneger, emitter} = require('../manegers/ReportsDB');
const {reportModel} = require('../helpers/schema');


const getReportsController = async (req, res) =>{
    const requestId  = req.headers.xid
    const downloadList = await reportModel.findOne({requestId:requestId}, {urlAdresses:1, fornFator:1, status:1})
    if (downloadList?._doc?.status === 'done'){
        const {urlAdresses, formFactor} = downloadList._doc
        res.send(await createReportsList(urlAdresses, formFactor));
    }else {
        console.log('жду подію', requestId)
        emitter.on(requestId, async () => {
            console.log('зайшов в подію', requestId)
            console.log((await reportModel.find({}))._docs)
            const downloadList = await reportModel.findOne({requestId:requestId}, {urlAdresses:1, fornFator:1})
            const {urlAdresses, formFactor} = downloadList._doc
            console.log('надіслав відповідь', requestId)
            res.send(await createReportsList(urlAdresses, formFactor));
        })
    }


}
const postReportsController = (req, res) =>{
    const id = Date.now();
    const {downloadDaily, urls, formFactor}  = req.body
    if (downloadDaily){
        addToDownloadList(urls);
    }
    console.log(urls)
    downloadMeneger(urls, formFactor, id)
    console.log(new Date(), 'отримав запит id: ', id)
    res.send({id:id})
}

module.exports = {getReportsController, postReportsController}

