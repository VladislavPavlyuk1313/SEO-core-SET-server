const express = require('express')
const bodyParser = require('body-parser');
const {getHistoryController} = require('./controllers/history');
const {getFeedbackController, addFeedbackController} = require('./controllers/feedback');
const {getReportsController, postReportsController} = require('./controllers/reports');
const {downloadOnSchedule} = require('./manegers/queueDB')
const cors = require('cors')

const app = new express();
app.use(cors())
app.use(bodyParser.json());

app.post('/feedback', addFeedbackController)
app.get('/feedback', getFeedbackController)
app.post('/reports', postReportsController)
app.get('/reports', getReportsController)
app.post('/history', getHistoryController)





app.listen(8080, () => {
    downloadOnSchedule();
    console.log(`KOA Server is now running on http://localhost:8080`)})




