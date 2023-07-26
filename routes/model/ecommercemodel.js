exports.MasterProduct = (data) => {
  let dataresult = [];

  data.forEach((key, item) => {
    dataresult.push({
      productcode: key.mp_productid,
      productname: key.mp_name,
      productdescription: key.mp_description,
      stock: key.mp_stock,
      categoryid: key.mp_categoryid,
      status: key.mp_status,
      createdby: key.mp_createdby,
      createddate: key.mp_createddate,
    });
  });

  return dataresult;
};

exports.MasterCategory = (data) => {
  let dataresult = [];

  data.forEach((key, item) => {
    dataresult.push({
      categorycode: key.mc_categoryid,
      categoryname: key.mc_name,
      status: key.mc_status,
      createdby: key.mc_createdby,
      createddate: key.mc_createddate,
    });
  });

  return dataresult;
};

exports.MasterProductImage = (data) => {
  let dataresult = [];

  data.forEach((key, item) => {
    dataresult.push({
      imageid: key.mpi_imageid,
      productid: key.mpi_productid,
      image: key.mpi_image,
      status: key.mpi_status,
      createdby: key.mpi_createdby,
      createddate: key.mpi_createddate,
    });
  });

  return dataresult;
};

exports.MasterProductPrice = (data) => {
  let dataresult = [];

  data.forEach((key, item) => {
    dataresult.push({
      priceid: key.mpp_priceid,
      productid: key.mpp_productid,
      price: key.mpp_price,
      status: key.mpp_status,
      createdby: key.mpp_createdby,
      createddate: key.mpp_createddate,
    });
  });

  return dataresult;
};

exports.ProductHistory = (data) => {
  let dataresult = [];

  data.forEach((key, item) => {
    dataresult.push({
      id: key.ph_id,
      productid: key.ph_productid,
      type: key.ph_type,
      description: key.ph_description,
      datetime: key.ph_datetime,
    });
  });

  return dataresult;
};

exports.Orders = (data) => {
  let dataresult = [];

  data.forEach((key, item) => {
    dataresult.push({
      orderid: key.o_orderid,
      customerid: key.o_customerid,
      orderdate: key.o_orderdate,
      status: key.o_status,
      totalamount: key.o_totalamount,
    });
  });

  return dataresult;
};

exports.OrderItems = (data) => {
  let dataresult = [];

  data.forEach((key, item) => {
    dataresult.push({
      itemid: key.oi_itemid,
      orderid: key.oi_orderid,
      productid: key.oi_productid,
      quantity: key.oi_quantity,
      unitprice: key.oi_unitprice,
      subtotal: key.oi_subtotal,
    });
  });

  return dataresult;
};

exports.Payment = (data) => {
  let dataresult = [];

  data.forEach((key, item) => {
    dataresult.push({
      paymentid: key.p_paymentid,
      orderid: key.p_orderid,
      paymentdate: key.p_paymentdate,
      paymenttype: key.p_paymenttype,
      amount: key.p_amount,
    });
  });

  return dataresult;
};

exports.Customers = (data) => {
  let dataresult = [];

  data.forEach((key, item) => {
    dataresult.push({
      customerid: key.c_customerid,
      customername: key.c_customername,
      email: key.c_email,
      address: key.c_address,
      phone: key.c_phone,
    });
  });

  return dataresult;
};

exports.Products = (data) => {
  let dataresult = [];

  data.forEach((key, item) => {
    dataresult.push({
      productid: key.p_productid,
      productname: key.p_productname,
      description: key.p_description,
      unitprice: key.p_unitprice,
      stockqunatity: key.p_stockqunatity,
    });
  });

  return dataresult;
};
