const getNormalizedDate = (time) => {

    const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;//getTimezoneOffset() повертає зміщення в хвилинах.
    // Всі змінні які використовуються в даній функції зберігають мілісекунди, тому потрібно перетворити хвилини в мілісекунди

    const CrUXUpdateOffset = -14400000
    const normalizationOffset = timezoneOffset + CrUXUpdateOffset;

    const normalizedTime = time + normalizationOffset;

    return new Date(normalizedTime).toDateString();
}
const fixCLS = (cls) => {
    cls.percentiles.p75 = Number(cls.percentiles.p75)
    cls.histogram.forEach((element) => {
        element.end = Number(element.end)
        element.start = Number(element.start)
    })
    return cls
}
const getScore = (metrics) => {
    if (metrics.fid.percentiles.p75) {
        const lcp = getLCPScore(metrics.lcp.percentiles.p75);
        const fid = getFIDScore(metrics.fid.percentiles.p75);
        const cls = getCLSScore(metrics.lcp.percentiles.p75);
        return 0.4 * lcp + 0.35 * fid + 0.25 * cls;
    } else {
        const lcp = getLCPScore(metrics.lcp.percentiles.p75);
        const cls = getCLSScore(metrics.lcp.percentiles.p75);
        return 0.6 * lcp + 0.4 * cls;
    }
}
const getCLSScore = (cls) => {
    const func = {
        first_part: (x) => {
            return Math.floor(100 - 200000 * x * x / 81)
        },
        second_part: (x) => {
            return Math.floor(-40 / 110 * (1000 * x - 310))
        },
        third_part: (x) => {
            return Math.floor(4000 / (1000 * x - 128) - 10)
        }
    }
    if (cls < 0.09) {
        return func.first_part(cls);
    }
    if (cls < 0.23) {
        return func.second_part(cls);
    }
    if (cls < 0.5) {
        return func.third_part(cls);
    }
    if (cls >= 0.5) {
        return 0;
    }
}
const getLCPScore = (lcp) => {
    const func = {
        first_part: (x) => {
            return Math.floor(100 - 20 * x * x / 6250000)
        },
        second_part: (x) => {
            return Math.floor(440 / 3 - 4 * x / 150)
        },
        third_part: (x) => {
            return Math.floor(1100000 / (11 * x - 240000) - 15)
        }
    }
    if (lcp < 2500) {
        return func.first_part(lcp);
    }
    if (lcp < 4000) {
        return func.second_part(lcp);
    }
    if (lcp < 8500) {
        return func.third_part(lcp);
    }
    if (lcp >= 8500) {
        return 0;
    }
}
const getFIDScore = (fid) => {
    const func = {
        first_part: (x) => {
            return Math.floor(100 - 20 * x * x / 8100)
        },
        second_part: (x) => {
            return Math.floor(-4 / 11 * (x - 310))
        },
        third_part: (x) => {
            return Math.floor(4000 / (x - 128) - 10)
        }
    }
    if (fid < 90) {
        return func.first_part(fid);
    }
    if (fid < 230) {
        return func.second_part(fid);
    }
    if (fid < 500) {
        return func.third_part(fid);
    }
    if (fid >= 500) {
        return 0;
    }
}
const getAverageValues = (reportsList) => {
    let counter = 0;
    let fidCounter = 0
    let fidSum = 0;
    let clsSum = 0;
    let lcpSum = 0;
    let scoreSum = 0;
    reportsList.forEach((report) => {
        if (report.record.metrics) {
            if (report.record.metrics.fid?.percentiles.p75) {
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
        fid: fidSum / fidCounter,
        cls: clsSum / counter,
        lcp: lcpSum / counter,
        score: scoreSum / counter
    }
}
const prepareReport = (report, URLAdress, date, formFactor = 'ALL_FORM_FACTORS') => {
    const metrics = report?.record?.metrics ?
        {
            fid: report.record.metrics.first_input_delay ?
                report.record.metrics.first_input_delay :
                {
                    "percentiles": {
                        "p75": NaN
                    }
                },
            cls: fixCLS(report.record.metrics.cumulative_layout_shift),
            lcp: report.record.metrics.largest_contentful_paint
        } :
        undefined;
    let record
    if (metrics) {
        record = {
            score: getScore(metrics),
            metrics: metrics
        }
    } else {
        record = report
    }

    return {
        urlAdress: URLAdress,
        formFactor: formFactor,
        date: date,
        record: record
    }
}
const getSortWeight = (report) => {
    let weight
    if (report.record.error) {
        weight = 0
    } else {
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
