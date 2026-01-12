const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const noticeRoutes = require("./routes/notice.routes");


app.use("/api/notices", noticeRoutes);


app.use("/uploads", express.static("uploads"));

module.exports = app;