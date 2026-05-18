const Category = require('../models/Category');
const Product = require('../models/Product');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
    const categories = await Category.find({});
    res.json(categories);
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/SuperAdmin
const createCategory = async (req, res) => {
    const { name, description, image } = req.body;

    const categoryExists = await Category.findOne({ name });

    if (categoryExists) {
        res.status(400);
        throw new Error('Category already exists');
    }

    const category = new Category({
        name,
        description,
        image
    });

    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/SuperAdmin
const updateCategory = async (req, res) => {
    const { name, description, image } = req.body;

    const category = await Category.findById(req.params.id);

    if (category) {
        if (name && name !== category.name) {
            const categoryExists = await Category.findOne({ name });
            if (categoryExists) {
                res.status(400);
                throw new Error('Category name already exists');
            }
            category.name = name;
        }
        category.description = description !== undefined ? description : category.description;
        category.image = image !== undefined ? image : category.image;

        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } else {
        res.status(404);
        throw new Error('Category not found');
    }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/SuperAdmin
const deleteCategory = async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (category) {
        // Check if category is in use by any products
        const productCount = await Product.countDocuments({ category: req.params.id });
        if (productCount > 0) {
            res.status(400);
            throw new Error('Cannot delete category because it has active products. Please delete or reassign the products first.');
        }

        await category.deleteOne();
        res.json({ message: 'Category removed' });
    } else {
        res.status(404);
        throw new Error('Category not found');
    }
};

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
};
