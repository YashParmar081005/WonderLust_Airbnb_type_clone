if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// Routers
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("Mongo Error:", err));

// View engine setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

//session 
const sessionOptions = {
    secret : "mysupersecretcode",
    resave : false,
    saveUninitialized : true,
    Cookie:{
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly :true
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//flash
app.use((req , res , next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser" , async (req, res)=>{
//     let fakeuser = new User({
//         email: "student@gmail.com",
//         username : "delta-student"
//     });
//     let registeredUser = await User.register(fakeuser, "helloworld");
//     res.send(registeredUser);
// });

// Route Mounting
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/",userRouter);


// 404 Handler
app.all("*", (req, res) => {
    res.status(404).render("error", { message: "Page not Found" });
});

// Error Handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error", { message });
});

// Start Server
app.listen(8080, () => {
    console.log("Server running on port 8080");
});
