var express = require("express");
var router = express.Router();

const mysql = require("./repository/ecommerdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("productprice", {
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
    let sql = `select * from master_product_price`;
    mysql.Select(sql, "MasterProductPrice", (err, result) => {
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
    let productid = req.body.productname;
    let price = req.body.price;
    let status = dictionary.GetValue(dictionary.ACT());
    let createdby = req.session.fullname;
    let createddate = helper.GetCurrentDatetime();
    let master_product_price = [];
    let product_history = [];
    let sql_check = `select * from master_product_price where mpp_productid='${productid}'`;

    console.log(sql_check);

    mysql.isDataExist(sql_check, "MasterProductPrice").then((result) => {
      console.log(result);
      if (result) {
        return res.json({
          msg: "exist",
        });
      } else {
        master_product_price.push([
          productid,
          price,
          status,
          createdby,
          createddate,
        ]);

        mysql.InsertTable(
          "master_product_price",
          master_product_price,
          (err, result) => {
            if (err) console.error("Error: ", err);

            console.log(result);

            var description = `Add: ${productid} set Price to ${price}`;

            product_history.push([productid, "Add", description, createddate]);

            mysql.InsertTable(
              "product_history",
              product_history,
              (err, result) => {
                if (err) console.error("Error: ", err);
                console.log(result);

                res.json({ msg: "success" });
              }
            );
          }
        );
      }
    });
  } catch (error) {
    res.json({ msg: error });
  }
});

router.post("/edit", (req, res) => {
  try {
    let productnamemodal = req.body.productnamemodal;
    let productcode = req.body.productcode;

    let data = [productnamemodal, productcode];

    let sql_Update = `UPDATE product 
                     SET mp_name = ?
                     WHERE mp_productid = ?`;

    let sql_check = `SELECT * FROM product WHERE mp_productid='${productcode}'`;

    console.log(data);

    mysql.Select(sql_check, "Product", (err, result) => {
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

    let sql_Update = `UPDATE master_product_price 
                     SET mpp_status = ?
                     WHERE mpp_productid = ?`;

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
