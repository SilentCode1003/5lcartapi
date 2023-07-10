var express = require("express");
var router = express.Router();

const mysql = require("./repository/ecommerdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("product", {
    title: "5L Cart",
    fullname: "DEV 42",
    roletype: "Admin",
    position: "Developer",
    department: "Research & Development",
  });
});

module.exports = router;

router.get("/load", (req, res) => {
  try {
    let sql = `select * from master_product`;
    mysql.Select(sql, "MasterProduct", (err, result) => {
      if (err) console.error("Error: ", err);

      console.log(result);
      res.json({ msg: "success", data: result });
    });
  } catch (error) {
    res.json({ msg: error });
  }
});

router.post("/save", (req, res) => {
  try {
    let productname = req.body.productname;
    let stock = req.body.stock;
    let category = req.body.category;
    let productdescription = req.body.productdescription;
    let status = dictionary.GetValue(dictionary.ACT());
    let createdby = "DEV42";
    let createddate = helper.GetCurrentDatetime();
    let master_product = [];
    let sql_check = `select * from master_product where mp_name='${productname}'`;

    mysql.isDataExist(sql_check, "MasterProduct").then((result) => {
      if (result) {
        return res.json({
          msg: "exist",
        });
      } else {
        master_product.push([
          productname,
          productdescription,
          stock,
          category,
          status,
          createdby,
          createddate,
        ]);
        mysql.InsertTable("master_product", master_product, (err, result) => {
          if (err) console.error("Error: ", err);

          console.log(result);
          res.json({ msg: "success" });
        });
      }
    });
  } catch (error) {
    res.json({ msg: error });
  }
}); // not yet

router.post("/edit", (req, res) => {
  try {
    let productnamemodal = req.body.productnamemodal;
    let productcode = req.body.productcode;

    let data = [productnamemodal, productcode];

    let sql_Update = `UPDATE master_product 
                     SET mp_name = ?
                     WHERE mp_productid = ?`;

    let sql_check = `SELECT * FROM master_product WHERE mp_productid='${productcode}'`;

    console.log(data);

    mysql.Select(sql_check, "MasterProduct", (err, result) => {
      if (err) console.error("Error: ", err);

      if (result.length != 1) {
        return res.json({
          msg: "notexist",
        });
      } else {
        mysql.UpdateMultiple(sql_Update, data, (err, result) => {
          if (err) console.error("Error: ", err);

          console.log(result);

          res.json({
            msg: "success",
          });
        });
      }
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
}); // not yet

router.post("/status", (req, res) => {
  try {
    let productcode = req.body.productcode;
    let status =
      req.body.status == dictionary.GetValue(dictionary.ACT())
        ? dictionary.GetValue(dictionary.INACT())
        : dictionary.GetValue(dictionary.ACT());
    let data = [status, productcode];

    let sql_Update = `UPDATE master_product 
                     SET mp_status = ?
                     WHERE mp_productid = ?`;

    console.log(data);

    mysql.UpdateMultiple(sql_Update, data, (err, result) => {
      if (err) console.error("Error: ", err);

      res.json({
        msg: "success",
      });
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});
