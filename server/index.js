/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require("express");
const app = express();

// const routes = require("./routes/Course")

const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect} = require("./config/cloudinary") //doubt
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv")

const PORT = process.env.PORT || 4000
dotenv.config()
//middlewares
app.use(express.json());
// const router = require("./Router/routers")


const userRoutes = require("./routes/User.route");
const profileRoutes = require("./routes/Profile.route");
const paymentRoutes = require("./routes/Payment.route");
const courseRoutes = require("./routes/Course.route")


const {dbConnect} = require("./config/database");
dbConnect();



//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
       origin:"http://localhost:5173",      //^ frontend link
       credentials:true,
}))

app.use(fileUpload({
       useTempFiles:true,
       tempFileDir:"/tmp" 
    })
)

     //cloudinary connect
     cloudinaryConnect();  

     //routes
app.use("/api/v1/auth" , userRoutes);
app.use("/api/v1/profile" , profileRoutes);
app.use("/api/v1/course" , courseRoutes);
app.use("/api/v1/payment" , paymentRoutes);
//defaultroute
app.get("/" , (req , res)=>{
       return res.json({
            success:true,
            message:"Your server is up and running"
       })
});


app.listen( PORT,(req , res)=>{
       console.log(`Server is listening at Port , https://localhost:${PORT}`);
})

