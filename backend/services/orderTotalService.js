const OrderItem = require("../models/orderItemModel.js");
const Order = require("../models/orderModel.js");

const updateOrderTotal = async(order_id, session) => {
    // get all the items in this order
    const items = await OrderItem.find({orderId: order_id}).session(session)

    // calculate the total of these items
    const totalPrice = items.reduce(
            (sum, item) => sum + Number(item.linePrice),
            0
    );

    // update the order with the new total
        const updatedOrder = await Order.findByIdAndUpdate(
        order_id,
        {total: totalPrice},
            {session, new: true, runValidators: true}
    )

        if (!updatedOrder) {
            const error = new Error("Order total could not be updated because the order does not exist!")
            error.statusCode = 404
            throw error
        }

        return updatedOrder
}

module.exports = {updateOrderTotal}