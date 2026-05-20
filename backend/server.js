require("dotenv").config();
const express= require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");




const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://expense-tracker-eight-beta-72.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

app.use(express.json());

connectDB();
app.get("/", (req, res) => {
  res.send("Backend is running ");
});

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/income",incomeRoutes);
app.use("/api/v1/expense",expenseRoutes);
app.use("/api/v1/dashboard",dashboardRoutes);

//server uploads folder
app.use("/uploads",express.static(path.join(__dirname,"uploads")));


const PORT = process.env.PORT || 8000;
app.listen(PORT,() => console.log(`Server running on port ${PORT}`));

