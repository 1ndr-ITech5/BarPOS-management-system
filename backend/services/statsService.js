const User = require("../models/userModel.js")
const Order = require("../models/orderModel.js")

const waiterStats = async(waiterData) => {
    // check if this waiter exists in his workspace
    const waiter = await User.findOne({_id: waiterData._id, workspaceId: waiterData.workspaceId})

    // find all the waiter orders
    const allCompletedOrders = await Order.countDocuments({
        waiterId: waiter._id,
        workspaceId: waiter.workspaceId,
        status: "closed"
    });

    // filter these found orders on todays total completed orders
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todayCompletedOrders = await Order.countDocuments({
        waiterId: waiter._id,
        workspaceId: waiter.workspaceId,
        status: "closed",
        createdAt: {$gte: startOfToday}
    });

    return {allCompletedOrders, todayCompletedOrders}
}

const adminReport = async(userData) => {
    // check for admin existence
    const admin = await User.findOne({_id: userData._id, workspaceId: userData.workspaceId})

    // find all waiters on that workspace
    const allWaiters = await User.find({role: "waiter", workspaceId: admin.workspaceId})

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // group waiter's completed orders
    const results = await Order.aggregate([
    {
        $match: {
            workspaceId: admin.workspaceId,
            status: "closed",
            createdAt: {$gte: startOfToday}
        }
    },
    {
        $group: {
            _id: "$waiterId",
            completedOrders: {$sum: 1}
        }
    }])

    const waitersPerformance = allWaiters.map(waiter => {
        const performance = results.find(result => 
            result._id.toString() === waiter._id.toString())

        return {
            _id: waiter._id,
            first_name: waiter.first_name,
            last_name: waiter.last_name,
            completedOrders: performance ? performance.completedOrders : 0
        }
    })

    return waitersPerformance;
}

module.exports = {waiterStats, adminReport}