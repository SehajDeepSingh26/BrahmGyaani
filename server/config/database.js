const mongoose = require('mongoose');
require('dotenv').config();

exports.dbConnect = () => {
    mongoose.connect(process.env.MONGO_URL)
    .then(console.log("db connected successfully"))
    .catch((error) => {
        console.log("Error during db Connection")
        console.log(error);
        process.exit(1);
    })
};