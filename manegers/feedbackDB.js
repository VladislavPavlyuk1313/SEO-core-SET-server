const {feedbackModel, downloadListModel} = require('../helpers/schema');
const {getNormalizedDate} = require('../helpers/functions')

const addFeedback = async (message, userEmail='') => {
    (new feedbackModel({
        date: getNormalizedDate(Date.now()),
        message: message,
        userEmail: userEmail
    })).save();
}

const getFeedback = async () => {

    const records = await feedbackModel.find({}, {
        'date': 1, 'message': 1, 'userEmail':1, _id: 0
    })
    let recordsList = [];
    records.forEach(element => recordsList.push(element._doc))
    return recordsList
}

module.exports = {addFeedback, getFeedback}