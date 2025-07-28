
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const app = express();

// Import routers
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

// EJS setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
mongoose.connect(MONGO_URL)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("Mongo Error:", err));

// Mount routers
app.use("/listings", listings); // All listing routes
app.use("/listings/:id/reviews", reviews); // All review routes for a listing

// 404 handler (should be after all routes)
app.all("*", (req, res) => {
    res.status(404).render("error", { message: "Page not Found" });
});

// Error handler (should be last)
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error", { message });
});

// Start the server
app.listen(8080, () => {
    console.log("Server running on port 8080");
});
