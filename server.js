require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./server/config/db");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

connectDB();

// Routes
app.use("/user", require("./server/routes/userRouter"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
