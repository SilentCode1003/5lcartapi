var express = require("express");
var router = express.Router();

const mysql = require("./repository/ecommerdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("category", {
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
    let sql = `select * from master_category`;
    mysql.Select(sql, "MasterCategory", (err, result) => {
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
    let categoryname = req.body.categoryname;
    let status = dictionary.GetValue(dictionary.ACT());
    let createdby = "DEV42";
    let createddate = helper.GetCurrentDatetime();
    let master_category = [];
    let sql_check = `select * from master_category where mc_name='${categoryname}'`;

    mysql.isDataExist(sql_check, "MasterCategory").then((result) => {
      if (result) {
        return res.json({
          msg: "exist",
        });
      } else {
        master_category.push([categoryname, status, createdby, createddate]);
        mysql.InsertTable("master_category", master_category, (err, result) => {
          if (err) console.error("Error: ", err);

          console.log(result);
          res.json({ msg: "success" });
        });
      }
    });
  } catch (error) {
    res.json({ msg: error });
  }
});

router.post("/edit", (req, res) => {
  try {
    let categorynamemodal = req.body.categorynamemodal;
    let categorycode = req.body.categorycode;

    let data = [categorynamemodal, categorycode];

    let sql_Update = `UPDATE master_category 
                     SET mc_name = ?
                     WHERE mc_categoryid = ?`;

    let sql_check = `SELECT * FROM master_category WHERE mc_categoryid='${categorycode}'`;

    console.log(data);

    mysql.Select(sql_check, "MasterCategory", (err, result) => {
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
});

router.post("/status", (req, res) => {
  try {
    let categorycode = req.body.categorycode;
    let status =
      req.body.status == dictionary.GetValue(dictionary.ACT())
        ? dictionary.GetValue(dictionary.INACT())
        : dictionary.GetValue(dictionary.ACT());
    let data = [status, categorycode];

    let sql_Update = `UPDATE master_category 
                     SET mc_status = ?
                     WHERE mc_categoryid = ?`;

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
