const cron = require("node-cron")
const {checkDemoReset} = require("../services/demoResetService.js")

cron.schedule("0 0 * * *", async () => {
    try {
        await checkDemoReset()
    } catch (error) {
        console.error("Demo workspace reset failed:", error)
    }
})