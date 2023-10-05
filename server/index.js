const express = require("express");
const errorHandler = require("../middleware/errorHandler");
const connectDB = require("../config/dbConnection");
const dotenv = require("dotenv").config();

const app = express();

const port = process.env.PORT || 5001;

connectDB();

app.use(express.json());

app.use("/api/v1/contacts", require("../routes/contactRoutes"));
app.use("/api/v1/user", require("../routes/userRoutes"));

app.use(errorHandler);


app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
