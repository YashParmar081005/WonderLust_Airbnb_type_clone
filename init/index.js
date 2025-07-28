
const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Mongoose connection
main()
  .then(() => {
    console.log("Connected to DB");
    initDB(); // Only initialize DB after successful connection
  })
  .catch((e) => {
    console.log("Error connecting to DB:", e);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  try {
    await listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj , owner:"683b15e755e1ae7fa8be63d6"}));
    await listing.insertMany(initData.data);
    console.log("Data was initialized");
  } catch (e) {
    console.log("Error initializing data:", e);
  }
};
