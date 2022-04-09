const {addFeedback, getFeedback} = require('../manegers/feedbackDB')

const addFeedbackController = async (req, res) => {
    const {message, userEmail=''} = req.body;
    await addFeedback(message, userEmail);
    res.sendStatus(200)
}
const getFeedbackController = async (req, res) => {
    const feedbackList = await getFeedback();
    res.send(feedbackList)
}

module.exports = {
    addFeedbackController,
    getFeedbackController
}