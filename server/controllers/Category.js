const Category = require("../models/Category.model");
const Course = require("../models/Course.model");

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
        console.log(newCategory);

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
        const allCategory = await Category.find({}, {name: true, description:true});
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
                            .populate("courses")
                            .exec()

        if(!selectedCategory) 
            return res.status(404).json({
                succcess: false,
                message: "Category Not found!"
            })
        console.log(selectedCategory)

        //^ Show Recommended Courses (other than selected)
        const recommendedCategory = await Category.find({
                        _id: {$ne: categoryId}
                    })
                    .populate("courses")
                    .exec()


        //^ show top 10 Selling courses
        // const top10Courses = await Course.find({}).sort({"$studentsEnrolled.length" : -1}).limit(10).exec()
        // const top10Courses = await Course.aggregate([
        //     { 
        //       $addFields: { 
        //         studentsEnrolledCount: { $size: "$studentsEnrolled" } 
        //       } 
        //     },
        //     { $sort: { studentsEnrolledCount: -1 }},
        //     { $limit: 10 }
        //   ]);
          

        //^ send response
        return res.status(200).json({
            success: true,
            message: "All Category displayed",
            data: {
                selectedCategory, 
                recommendedCategory,
                // topSellingCourses
            }
            
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while Showing Page Category"
        })
    }
}
