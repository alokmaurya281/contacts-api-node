const express = require("express");
const errorHandler = require("../middleware/errorHandler");
const connectDB = require("../config/dbConnection");
const dotenv = require("dotenv").config();

const app = express();

const port = process.env.PORT || 5001;
const cors = require('cors');
app.use(cors());

connectDB();

app.use(express.json());

app.use("/api/v1/contacts", require("../routes/contactRoutes"));
app.use("/api/v1/user", require("../routes/userRoutes"));

app.use(errorHandler);
// app.use(function(req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });


app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
