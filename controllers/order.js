const mongoose = require("mongoose");
const Order = require("../models/order");
const Menu = require("../models/menu");

async function createOrder(req, res) {
    try {
        const { items } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "Order must contain at least one item"
            });
        }

        // Validate IDs and quantities before processing.
        for (const item of items) {
            if (
                !item.food_id ||
                !mongoose.isValidObjectId(item.food_id) ||
                !Number.isSafeInteger(item.quantity) ||
                item.quantity < 1
            ) {
                return res.status(400).json({
                    message: "Each item needs a valid food_id and positive integer quantity"
                });
            }
        }

        // Combine duplicate food IDs into one line item.
        const quantities = new Map();

        for (const item of items) {
            const id = item.food_id.toString();
            const quantity = (quantities.get(id) || 0) + item.quantity;

            if (!Number.isSafeInteger(quantity)) {
                return res.status(400).json({
                    message: "Invalid total quantity"
                });
            }

            quantities.set(id, quantity);
        }

        const foodIds = [...quantities.keys()];
        const foods = await Menu.find({
            _id: { $in: foodIds },
            is_available: true
        });

        if (foods.length !== foodIds.length) {
            return res.status(400).json({
                message: "One or more food items do not exist or are unavailable"
            });
        }

        const orderItems = foods.map(food => ({
            food_id: food._id,
            name: food.name,
            price: food.price,
            quantity: quantities.get(food._id.toString())
        }));

        const totalPrice = orderItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        if (!Number.isFinite(totalPrice)) {
            return res.status(400).json({
                message: "Invalid order total"
            });
        }

        const order = await Order.create({
            user_id: req.user.id,
            items: orderItems,
            total_price: totalPrice
        });

        return res.status(201).json({
            message: "Order placed successfully",
            order
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to place order",
            error: error.message
        });
    }
}

async function getMyOrders(req, res) {
    try {
        const orders = await Order.find({
            user_id: req.user.id
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            count: orders.length,
            orders
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to fetch your orders",
            error: error.message
        });
    }
}

async function getAllOrders(req, res) {
    try {
        const orders = await Order.find()
            .populate("user_id", "name email")
            .sort({ createdAt: 1 });

        return res.status(200).json({
            count: orders.length,
            orders
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to fetch orders",
            error: error.message
        });
    }
}

async function updateOrderStatus(req, res) {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "Pending",
            "Preparing",
            "Out for delivery",
            "Delivered"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status",
                allowedStatuses
            });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            {
                new: true,
                runValidators: true
            }
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        return res.status(200).json({
            message: "Order status updated successfully",
            order
        });
    } catch (error) {
        return res.status(400).json({
            message: "Unable to update order status",
            error: error.message
        });
    }
}

module.exports = {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
};