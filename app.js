var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");

const mysql = require("./routes/repository/ecommerdb");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var productRounter = require("./routes/product");
var productimageRouter = require("./routes/productimage");
var categoryRouter = require("./routes/category");
var productpriceRouter = require("./routes/productprice");

//Mysql Connection
mysql.CheckConnection();

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.json());
app.use(
  express.urlencoded({
    limit: "100mb",
    extended: true,
    parameterLimit: 100000000,
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "25mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/product", productRounter);
app.use("/productimage", productimageRouter);
app.use("/category", categoryRouter);
app.use("/productprice", productpriceRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
