require("dotenv").config();

const express = require("express");
const { connectMongoDb } = require("./connection");

const authRoutes = require("./routes/user");
const menuRoutes = require("./routes/menu");
const orderRoutes = require("./routes/order");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use('/uploads',express.static("uploads"));


// connection
connectMongoDb(process.env.MONGO_URI)
.then(()=>{
    console.log("MongoDb Connected");
})
.catch((error)=>{
    console.log(error);
});

// Home route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Restaurant Management Backend API is running"
    });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/order", orderRoutes);

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

// Start server after database connection
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
});
  
