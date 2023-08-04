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
    let createdby = req.session.fullname;
    let createddate = helper.GetCurrentDatetime();
    let master_product = [];
    let product_history = [];
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

          let sql_productid = `select mp_productid as productid from master_product where mp_name='${productname}'`;

          mysql.SelectResult(sql_productid, (err, result) => {
            if (err) console.error("Error: ", err);
            var id = result[0].productid;
            var description = `Add: ${id} ${productname} ${stock}`;

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
        });
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
    let createddate = helper.GetCurrentDatetime();
    let data = [status, productcode];
    let product_history = [];
    let description = `Update: ${productcode} status change to ${status}`;

    let sql_Update = `UPDATE master_product 
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

router.post("/getproduct", (req, res) => {
  try {
    let productid = req.body.productid;
    let sql = `select 
    mp_productid as productid,
    mp_categoryid as categoyid,
    mp_name as name,
    mp_description as description,
    mpp_price as price,
    mp_stock as stock,
    mpi_image as image 
    from master_product as mp
    inner join master_product_image as mpi on mp_productid = mpi_productid
    inner join master_product_price as mpp on mpp_productid = mp_productid
    where mp_productid = '${productid}'
    order by mp_productid`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) console.error("Error: ", err);
      var data = [];

      console.log(result);

      result.forEach((key, item) => {
        data.push({
          productid: key.productid,
          categoyid: key.categoyid,
          name: key.name,
          description: key.description,
          price: key.price,
          stock: key.stock,
          image: key.image,
        });
      });

      res.json({
        msg: "success",
        data: data,
      });
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.post("/getbycategory", (req, res) => {
  try {
    let categoryid = req.body.categoryid;
    let sql = `select 
    mp_productid as productid,
    mp_categoryid as categoyid,
    mp_name as name,
    mp_description as description,
    mp_stock as stock,
    mpi_image as image 
    from master_product as mp
    inner join master_product_image as mpi on mp_productid = mpi_productid
    where mp_categoryid='${categoryid}'
    order by mp_productid`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) console.error("Error: ", err);
      var data = [];

      console.log(result);

      result.forEach((key, item) => {
        data.push({
          productid: key.productid,
          categoyid: key.categoyid,
          name: key.name,
          description: key.description,
          stock: key.stock,
          image: key.image,
        });
      });

      res.json({
        msg: "success",
        data: data,
      });
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});
