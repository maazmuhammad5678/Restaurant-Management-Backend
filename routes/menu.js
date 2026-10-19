const express = require("express");
const router = express.Router();

const {
    createMenu,
    getMenu,
    updateMenu,
    deleteMenu
} = require("../controllers/menu");

const {
    checkAuthentication,
    restrictTo
} = require("../middlewares/auth");

const upload=require("../middlewares/upload");

// Public menu browsing
router.get("/", getMenu);

// Admin-only menu management
router.post(
    "/",
    checkAuthentication,
    restrictTo("Admin"),upload.single("image_url"),
    createMenu
);

router.put(
    "/:id",
    checkAuthentication,
    restrictTo("Admin"),upload.single("image_url"),
    updateMenu
);

router.delete(
    "/:id",
    checkAuthentication,
    restrictTo("Admin"),
    deleteMenu
);

module.exports = router;