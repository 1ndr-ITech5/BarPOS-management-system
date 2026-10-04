const asyncHandler = require("express-async-handler")
const {waiterStats, adminReport} = require("../services/statsService.js")

const statsWaiter = asyncHandler(async(req, res) => {
    const stats = await waiterStats(req.user);
    res.status(200).json(stats)
})

const report = asyncHandler(async(req,res) => {
    const dataToReport = await adminReport(req.user);
    res.status(200).json(dataToReport);
})

module.exports = {statsWaiter, report}