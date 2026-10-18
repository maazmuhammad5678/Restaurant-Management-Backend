const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        items: [
            {
                food_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Menu",
                    required: true
                },
                name: {
                    type: String,
                    required: true
                },
                price: {
                    type: Number,
                    required: true,
                    min: 0
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                }
            }
        ],
        total_price: {
            type: Number,
            required: true,
            min: 0
        },
        status: {
            type: String,
            enum: [
                "Pending",
                "Preparing",
                "Out for delivery",
                "Delivered"
            ],
            default: "Pending"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);