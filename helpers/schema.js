const mongoose = require("mongoose");
let Schema = mongoose.Schema;
mongoose.connect("mongodb://localhost:27017/test212")
let ReportSchema = new Schema(
    {
        id: {type: Number},
        urlAdresses: {type: Array},
        formFactor: {type: String},
        status: {type: String}
    }
)
let FeedbackSchema = new Schema(
    {
        date: {type: String},
        message: {type: String},
        userEmail: {type: String}
    }
)
let DownloadListSchema = new Schema(
    {
        urlAdress: {type: String},
        formFactor: {type: String},
    },{
        collection: 'DownloadList'
    })


let HistorySchema = new Schema(
    {
        urlAdress: {type: String},
        date: {type: String},
        formFactor: {type: String},
        record: {type: Object}
    },{
        collection: 'Reports'
    });

let downloadListModel = mongoose.model('DownloadList', DownloadListSchema);
let historyModel = mongoose.model('Reports', HistorySchema);
let feedbackModel = mongoose.model('Feedback', FeedbackSchema);
let reportModel = mongoose.model('report', ReportSchema);

module.exports = {historyModel, downloadListModel, feedbackModel, reportModel}