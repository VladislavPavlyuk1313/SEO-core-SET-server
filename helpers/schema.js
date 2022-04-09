const mongoose = require("mongoose");
let Schema = mongoose.Schema;
const connection = mongoose.connect("mongodb://localhost:27017/test")
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

let ReportSchema = new Schema(
    {
        urlAdress: {type: String},
        date: {type: String},
        formFactor: {type: String},
        record: {type: Object}
    },{
        collection: 'Reports'
    });

let downloadListModel = mongoose.model('DownloadList', DownloadListSchema);
let reportModel = mongoose.model('Reports', ReportSchema);
let feedbackModel = mongoose.model('Feedback', FeedbackSchema);

module.exports = {reportModel, downloadListModel, feedbackModel}