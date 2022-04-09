const express = require('express')
const bodyParser = require('body-parser');
const {getHistoryController} = require('./controllers/history');
const {getFeedbackController, addFeedbackController} = require('./controllers/feedback');
const {getReportsController} = require('./controllers/reports');
const {downloadOnSchedule} = require('./manegers/queueDB')

const app = new express();
app.use(bodyParser.json());
app.post('/feedback', getFeedbackController)
app.get('/feedback', addFeedbackController)
app.post('/reports', getReportsController)
app.post('/history', getHistoryController)





app.listen(8080, () => {
    downloadOnSchedule();
    console.log(`KOA Server is now running on http://localhost:8080`)})




