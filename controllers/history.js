const {getHistiryOfReports} = require("../manegers/reportCreator");

const getHistoryController = async (req, res) =>{
    const {urlAdress, formFactor = 'ALL_FORM_FACTORS'}  = req.body
    console.log(urlAdress)
    res.send(await getHistiryOfReports(urlAdress, formFactor))}

module.exports = {getHistoryController}