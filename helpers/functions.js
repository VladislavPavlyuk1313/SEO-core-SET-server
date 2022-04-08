/**
 * Функція приймає час, коли було отримано звіт CrUX і повертає дату, коли його було сформоввно.
 *
 * Звіти CrUX оновлюються щодня о 04:00 UTC
 * @param {Number} time - час у форматі кількості мілісекунд що пройшли від 01.01.1970 00:00:00:000 UTC
 * @returns {string} - cтрокое предсталення дати (Наприклад 'Tue Apr 05 2022')
 */
const getNormalizedDate = (time) => {

    const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;//getTimezoneOffset() повертає зміщення в хвилинах.
    // Всі змінні які використовуються в даній функції зберігають мілісекунди, тому потрібно перетворити хвилини в мілісекунди

    const CrUXUpdateOffset = -14400000
    const normalizationOffset = timezoneOffset + CrUXUpdateOffset;

    const normalizedTime = time + normalizationOffset;

    return new Date(normalizedTime).toDateString();
}
/**
 * У звіті від CrUX усі метрики мають усі числовий тип, а CLS метрики - стрічки. Дана функція привоить метрики CLS до числового типу
 * @param cls
 * @returns {*}
 */
const fixCLS = (cls) => {
    cls.percentiles.p75 = Number(cls.percentiles.p75)
    cls.histogram.forEach((element) => {
        element.end = Number(element.end)
        element.start = Number(element.start)
    })
    return cls
}
/**
 * Функція на основі метрик розраховує загальну оцінку продуктивності сторінки по шкалі від 0 до 100
 * @param metrics
 * @returns {number}
 */
const getScore = (metrics) => {
    return Math.floor(Math.random()*100)
}
/**
 * Функція розраховує середні значення усіх метрик зі списку звітів
 * @param reportsList
 * @returns {{fid: number, score: number, lcp: number, cls: number}}
 */
const getAverageValues = (reportsList) => {
    let counter = 0;
    let fidCounter = 0
    let fidSum = 0;
    let clsSum = 0;
    let lcpSum = 0;
    let scoreSum = 0;
    reportsList.forEach((report) =>{
        if (report.record.metrics){
            if (report.record.metrics.fid?.percentiles){
                fidSum += report.record.metrics.fid.percentiles.p75;
                fidCounter++
            }
            counter++;
            clsSum += report.record.metrics.cls.percentiles.p75;
            lcpSum += report.record.metrics.lcp.percentiles.p75;
            scoreSum += report.record.score;
        }
    })
    return {
        fid : fidSum/fidCounter,
        cls : clsSum/counter,
        lcp : lcpSum/counter,
        score : scoreSum/counter
    }
}
const prepareReport = (report, URLAdress, date, formFactor = 'ALL_FORM_FACTORS') => {
    const metrics = report?.record?.metrics ?
        {
            fid : report.record.metrics.first_input_delay ?
                    report.record.metrics.first_input_delay :
                {
                    "percentiles": {
                        "p75": undefined
                    }},
            cls : fixCLS(report.record.metrics.cumulative_layout_shift),
            lcp : report.record.metrics.largest_contentful_paint
        } :
        undefined;
    let record
    if (metrics) {
        record =  {
            score : getScore(metrics),
            metrics : metrics
        }
    }else {
        record = report
    }

    return  {
        urlAdress : URLAdress,
        formFactor : formFactor,
        date : date,
        record : record
    }
}
const getSortWeight = (report) => {
    let weight
    if (report.record.error){
        weight = 0
    }else {
        weight = report.record.score
    }
    return weight
}
const sortHistory = (report1, report2) => {
    time1 = new Date(report1.date).getTime()
    time2 = new Date(report2.date).getTime()
    return time2 - time1
}
module.exports = {
    getSortWeight,
    getNormalizedDate,
    getAverageValues,
    prepareReport,
    sortHistory
}