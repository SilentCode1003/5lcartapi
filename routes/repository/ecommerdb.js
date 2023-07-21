const mysql = require("mysql");
const model = require("../model/ecommercemodel");
require("dotenv").config();
const crypt = require("./cryptography");

let password = "";
crypt.Decrypter(process.env._PASSWORD, (err, result) => {
  if (err) throw err;

  password = result;
  // console.log(`${result}`);
});

const connection = mysql.createConnection({
  host: process.env._HOST,
  user: process.env._USER,
  password: password,
  database: process.env._DATABASE,
});

// crypt.Encrypter("#Ebedaf19dd0d", (err, result) => {
//   if (err) console.error("Error: ", err);

//   console.log(result);
// });

// crypt.Decrypter('f6a3287039d0d75cb83cb29d35b3dfcb', (err, result) => {
//     if (err) console.error('Error: ', err);

//     console.log(`${result}`);
// });

exports.CheckConnection = () => {
  connection.connect((err) => {
    if (err) {
      console.error("Error connection to MYSQL databases: ", err);
      return;
    }
    console.log("MySQL database connection established successfully!");
  });
};

exports.InsertMultiple = async (stmt, todos) => {
  try {
    connection.connect((err) => {
      return err;
    });
    // console.log(`statement: ${stmt} data: ${todos}`);

    connection.query(stmt, [todos], (err, results, fields) => {
      if (err) {
        return console.error(err.message);
      }
      console.log(`Row inserted: ${results.affectedRows}`);

      return 1;
    });
  } catch (error) {
    console.log(error);
  }
};

exports.Select = (sql, table, callback) => {
  try {
    connection.connect((err) => {
      return err;
    });
    connection.query(sql, (error, results, fields) => {
      // console.log(results);

      if (error) {
        callback(error, null);
      }

      if (table == "MasterCategory") {
        callback(null, model.MasterCategory(results));
      }

      if (table == "MasterProduct") {
        callback(null, model.MasterProduct(results));
      }

      if (table == "MasterProductImage") {
        callback(null, model.MasterProductImage(results));
      }

      if (table == "ProductHistory") {
        callback(null, model.ProductHistory(results));
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.StoredProcedure = (sql, data, callback) => {
  try {
    connection.query(sql, data, (error, results, fields) => {
      if (error) {
        callback(error.message, null);
      }
      callback(null, results[0]);
    });
  } catch (error) {
    callback(error, null);
  }
};

exports.StoredProcedureResult = (sql, callback) => {
  try {
    connection.query(sql, (error, results, fields) => {
      if (error) {
        callback(error.message, null);
      }
      callback(null, results[0]);
    });
  } catch (error) {
    callback(error, null);
  }
};

exports.Update = async (sql, callback) => {
  try {
    connection.query(sql, (error, results, fields) => {
      if (error) {
        callback(error, null);
      }
      // console.log('Rows affected:', results.affectedRows);

      callback(null, `Rows affected: ${results.affectedRows}`);
    });
  } catch (error) {
    callback(error, null);
  }
};

exports.UpdateMultiple = async (sql, data, callback) => {
  try {
    connection.query(sql, data, (error, results, fields) => {
      if (error) {
        callback(error, null);
      }
      // console.log('Rows affected:', results.affectedRows);

      callback(null, `Rows affected: ${results.affectedRows}`);
    });
  } catch (error) {
    console.log(error);
  }
};

exports.CloseConnect = () => {
  connection.end();
};

exports.Insert = (stmt, todos, callback) => {
  try {
    connection.connect((err) => {
      return err;
    });
    // console.log(`statement: ${stmt} data: ${todos}`);

    connection.query(stmt, [todos], (err, results, fields) => {
      if (err) {
        callback(err, null);
      }
      // callback(null, `Row inserted: ${results}`);
      callback(null, `Row inserted: ${results.affectedRows}`);
      // console.log(`Row inserted: ${results.affectedRows}`);
    });
  } catch (error) {
    callback(error, null);
  }
};

exports.SelectResult = (sql, callback) => {
  try {
    connection.connect((err) => {
      return err;
    });
    connection.query(sql, (error, results, fields) => {
      // console.log(results);

      if (error) {
        callback(error, null);
      }

      callback(null, results);
    });
  } catch (error) {
    console.log(error);
  }
};

exports.InsertTable = (tablename, data, callback) => {
  if (tablename == "master_product") {
    let sql = `INSERT INTO master_product(
      mp_name,
      mp_description,
      mp_stock,
      mp_categoryid,
      mp_status,
      mp_createdby,
      mp_createddate) VALUES ?`;

    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "master_category") {
    let sql = `INSERT INTO master_category(
      mc_name,
      mc_status,
      mc_createdby,
      mc_createddate) VALUES ?`;

    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "master_product_image") {
    let sql = `INSERT INTO master_product_image(
      mpi_productid,
      mpi_image,
      mpi_status,
      mpi_createdby,
      mpi_createddate) VALUES ?`;

    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "product_history") {
    let sql = `INSERT INTO product_history(
      ph_productid,
      ph_type,
      ph_description,
      ph_datetime) VALUES ?`;

    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "orders") {
    let sql = `INSERT INTO orders(
        o_customerid,
        o_orderdate,
        o_status,
        o_totalamount) VALUES ?`;

    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "order_items") {
    let sql = `INSERT INTO order_items(
        oi_orderid,
        oi_productid,
        oi_quantity,
        oi_unitprice,
        oi_subtotal) VALUES ?`;

    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "payment") {
    let sql = `INSERT INTO payment(
        p_orderid,
        p_paymentdate,
        p_paymenttype,
        p_amount) VALUES ?`;

    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "customers") {
    let sql = `INSERT INTO customers(
        c_customername,
        c_email,
        c_address,
        c_phone) VALUES ?`;

    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "products") {
    let sql = `INSERT INTO products(
        p_productname,
        p_description,
        p_unitprice,
        p_stockqunatity) VALUES ?`;

    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }
};

exports.isDataExist = (sql, tablename) => {
  return new Promise((resolve, reject) => {
    this.Select(sql, tablename, (err, result) => {
      if (err) reject(err);

      if (result.length != 0) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

exports.isSingleDataExist = (sql, tablename, callback) => {
  this.Select(sql, tablename, (err, result) => {
    if (err) callback(err, null);

    if (result.length != 0) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  });
};
