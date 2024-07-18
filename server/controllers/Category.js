
const Category = require("../models/Category.model");
const Course = require("../models/Course.model");

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

//& create Category Handler
exports.createCategory = async(req, res) => {
    try {
        const {name, description} = req.body;

        if(!name || !description)
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })

        const existingCategory = await Category.findOne({name: name})
        if(existingCategory)
            return res.status(403).json({
                success: false,
                message: "This Category already exists"
            })
        
        const newCategory = await Category.create({
            name: name,
            description: description
        });
        // console.log(newCategory);

        return res.status(200).json({
            success: true,
            message: "Category created successfully"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "something went wrong while controlling Categorys"
        })
    }
}

//& getAllCategory Handler
exports.showAllCategory = async(req, res) => {
    try {
        const allCategory = await Category.find();
                    //^ find( { criteria : none}, { what fields must be their : true } )

        return res.status(200).json({
            success: true,
            message: "All Category displayed",
            allCategory
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while Showing Category"
        })
    }
}

//& get Categorypage Details Handler
exports.categoryPageDetails = async(req, res) => {
    try {
        //^ get Category id
        const {categoryId} = req.body;
        
        //^ show selected category's courses
        const selectedCategory = await Category.findById(categoryId)
                            .populate({
                                path: "courses",
                                match: {status: "Published"},
                                populate: {
                                    path: "ratingAndReviews"
                                }
                            })
                            .exec()

        if(!selectedCategory) 
            return res.status(404).json({
                succcess: false,
                message: "Category Not found!"
            })

        if(selectedCategory.courses.length === 0){
            return res.status(404).json({
                success: false,
                message: "No Courses found for this category"
            })
        }

        //^ Show Recommended Courses (other than selected)
        const categoriesExceptSelected = await Category.find({
                        _id: {$ne: categoryId}
                    })
        // console.log(categoriesExceptSelected)
        
        let differentCategory = await Category.findOne(categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id)
                .populate({
                    path: "courses",
                    match: {status: "Published"}
                })
                .exec();

        
        // console.log("DIFFERENT CATEGORY: ", differentCategory)
        
        //^ show top 10 Selling courses
        const allCategories = await Category.find()
                .populate({
                    path: "courses",
                    match: {status: "Published"},
                    populate: {
                        path: "instructor"
                    }
                })
                .exec()

                
        
        const allCourses = allCategories.flatMap((category) => category.courses)

        const mostSellingCourses = allCourses
                                .sort((a,b) => a.sold - b.sold)
                                .slice(0, 10)
        // console.log("DIFFERENT CATEGORY: ", mostSellingCourses)


        res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses
            }
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while Showing Page Category",
            error: error
        })
    }
}
