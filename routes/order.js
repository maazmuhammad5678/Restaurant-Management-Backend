const express = require("express");
const router = express.Router();

const {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
} = require("../controllers/order");

const {
    checkAuthentication,
    restrictTo
} = require("../middlewares/auth");

// Customer routes
router.post(
    "/",
    checkAuthentication,
    restrictTo("Customer"),
    createOrder
);

router.get(
    "/my-orders",
    checkAuthentication,
    restrictTo("Customer"),
    getMyOrders
);

// Admin routes
router.get(
    "/",
    checkAuthentication,
    restrictTo("Admin"),
    getAllOrders
);

router.put(
    "/:id/status",
    checkAuthentication,
    restrictTo("Admin"),
    updateOrderStatus
);

module.exports = router;