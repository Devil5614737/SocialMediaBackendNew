const dotenv = require("dotenv");
const colors = require("colors");
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("../server/config/db");
const {signup,login,post,user}=require('./constants');



dotenv.config({ path: "./.env" });

app.use(express.json());
app.use(cors());

// Connect to Database
connectDB();

app.use("/api", signup);
app.use("/api", login);
app.use("/api", post);
app.use("/api", user);

const port = process.env.PORT || 6000;

app.listen(port, () => {
  console.log("listening on port " + port.bgMagenta);
});
