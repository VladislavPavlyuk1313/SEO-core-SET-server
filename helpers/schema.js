const mongoose = require("mongoose");
let Schema = mongoose.Schema;
const connection = mongoose.createConnection("localhost", "test_1243", 27017, {
    server: {
        socketOptions: {
            socketTimeoutMS: 0,
            connectTimeoutMS: 0
        }
    }
});

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

let downloadListModel = connection.model('DownloadList', DownloadListSchema);
let reportModel = connection.model('Reports', ReportSchema);

module.exports = {reportModel, downloadListModel}