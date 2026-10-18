
const Menu = require("../models/menu");

async function createMenu(req, res) {
    try {
        const {
            name,
            category,
            price,
            description,
            is_available
        } = req.body;

        if (
            !name ||
            !category ||
            price === undefined ||
            price === null ||
            price === "" ||
            !description
        ) {
            return res.status(400).json({
                message: "Name, category, price and description are required"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "Product image is required"
            });
        }

        const numericPrice = Number(price);

        if (!Number.isFinite(numericPrice) || numericPrice < 0) {
            return res.status(400).json({
                message: "Price must be a valid non-negative number"
            });
        }

        const image_url =
            `${process.env.BASE_URL || "http://localhost:8000"}/uploads/${req.file.filename}`;

        const menu = await Menu.create({
            name,
            category,
            price: numericPrice,
            description,
            image_url,
            is_available
        });

        return res.status(201).json({
            message: "Food item added successfully",
            menu
        });
    } catch (error) {
        return res.status(400).json({
            message: "Unable to add food item",
            error: error.message
        });
    }
}

async function getMenu(req, res) {
    try {
        const { search, category } = req.query;

        const filter = {};

        // Customers see available items only.
        // Admins can see all items if req.user is populated.
        if (!req.user || req.user.role !== "Admin") {
            filter.is_available = true;
        }

        if (search) {
            filter.name = {
                $regex: search,
                $options: "i"
            };
        }

        if (category) {
            filter.category = category;
        }

        const menu = await Menu.find(filter)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            count: menu.length,
            menu
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to fetch menu",
            error: error.message
        });
    }
}

async function updateMenu(req, res) {
    try {
        const updates = { ...req.body };

        // Update image if a new image is uploaded.
        if (req.file) {
            updates.image_url =
                `${process.env.BASE_URL || "http://localhost:8000"}/uploads/${req.file.filename}`;
        }

        const allowedFields = [
            "name",
            "category",
            "price",
            "description",
            "image_url",
            "is_available"
        ];

        for (const field of Object.keys(updates)) {
            if (!allowedFields.includes(field)) {
                return res.status(400).json({
                    message: `Invalid field: ${field}`
                });
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: "Provide at least one field to update"
            });
        }

        if (updates.price !== undefined) {
            const price = Number(updates.price);

            if (!Number.isFinite(price) || price < 0) {
                return res.status(400).json({
                    message: "Price must be a valid non-negative number"
                });
            }

            updates.price = price;
        }

        const menu = await Menu.findByIdAndUpdate(
            req.params.id,
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!menu) {
            return res.status(404).json({
                message: "Food item not found"
            });
        }

        return res.status(200).json({
            message: "Food item updated successfully",
            menu
        });
    } catch (error) {
        return res.status(400).json({
            message: "Unable to update food item",
            error: error.message
        });
    }
}

async function deleteMenu(req, res) {
    try {
        const menu = await Menu.findByIdAndDelete(req.params.id);

        if (!menu) {
            return res.status(404).json({
                message: "Food item not found"
            });
        }

        return res.status(200).json({
            message: "Food item deleted successfully"
        });
    } catch (error) {
        return res.status(400).json({
            message: "Unable to delete food item",
            error: error.message
        });
    }
}

module.exports = {
    createMenu,
    getMenu,
    updateMenu,
    deleteMenu
};
