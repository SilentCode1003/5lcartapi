var express = require("express");
var router = express.Router();

const mysql = require("./repository/ecommerdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("productimage", {
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
    let sql = `select * from master_product_image`;
    mysql.Select(sql, "MasterProductImage", (err, result) => {
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
    let productcode = req.body.productcode;
    let productimage = req.body.productimage;
    let status = dictionary.GetValue(dictionary.ACT());
    let createdby = "DEV42";
    let createddate = helper.GetCurrentDatetime();
    let master_product_image = [];
    let product_history = [];

    master_product_image.push([
      productcode,
      productimage,
      status,
      createdby,
      createddate,
    ]);

    console.log(master_product_image);

    mysql.InsertTable(
      "master_product_image",
      master_product_image,
      (err, result) => {
        if (err) console.error("Error: ", err);

        console.log(result);

        let sql_productid = `select mpi_productid as productid from master_product_image where mpi_productid='${productcode}'`;

        mysql.SelectResult(sql_productid, (err, result) => {
          if (err) console.error("Error: ", err);
          var id = result[0].productid;
          var description = `Add: ${id} ${productcode} image`;

          product_history.push([id, "Add", description, createddate]);

          mysql.InsertTable(
            "product_history",
            product_history,
            (err, result) => {
              if (err) console.error("Error: ", err);
              console.log(result);

              res.json({ msg: "success" });
            }
          );
        });
      }
    );
  } catch (error) {
    res.json({ msg: error });
  }
}); // not yet

router.post("/edit", (req, res) => {
  try {
    let productnamemodal = req.body.productnamemodal;
    let productcode = req.body.productcode;

    let data = [productnamemodal, productcode];

    let sql_Update = `UPDATE master_product_image 
                     SET mp_name = ?
                     WHERE mp_productid = ?`;

    let sql_check = `SELECT * FROM master_product_image WHERE mp_productid='${productcode}'`;

    console.log(data);

    mysql.Select(sql_check, "MasterProductImage", (err, result) => {
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
    let createddate = helper.GetCurrentDatetime();
    let data = [status, productcode];
    let product_history = [];
    let description = `Update: ${productcode} status change to ${status}`;

    let sql_Update = `UPDATE master_product_image 
                     SET mp_status = ?
                     WHERE mp_productid = ?`;

    product_history.push([productcode, "Update", description, createddate]);

    console.log(data);

    mysql.UpdateMultiple(sql_Update, data, (err, result) => {
      if (err) console.error("Error: ", err);

      mysql.InsertTable("product_history", product_history, (err, result) => {
        if (err) console.error("Error: ", err);
        console.log(result);

        res.json({
          msg: "success",
        });
      });
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});
