const express = require('express')
const bodyParser = require('body-parser');
const { createReportsList, getHistiryOfReports } = require('./manegers/reportCreator');
//const {addToDownloadList, downloadOnSchedule, getDownloadList} = require('./manegers/queueDB')

const app = new express();
app.use(bodyParser.json());
app.post('/get-reports', async (req, res) =>{
            console.log('прийшов запит', req.body)
            const {downloadDaily, urls}  = req.body
            //if (downloadDaily){
            //  addToDownloadList(urls)
            //}
            res.send(await createReportsList(urls))})
app.post('/history', async (req, res) =>{
    console.log('прийшов запит', req.body)
    const {urlAdress, formFactor = 'ALL_FORM_FACTORS'}  = req.body
    console.log(urlAdress)
    res.send(await getHistiryOfReports(urlAdress, formFactor))})





app.listen(8080, () => {
    console.log(`KOA Server is now running on http://localhost:8080`)})




