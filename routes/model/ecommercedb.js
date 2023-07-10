exports.MasterProduct = (data) => {
  let dataresult = [];

  data.forEach((key, item) => {
    dataresult.push({
      productid: key.mp_productid,
      name: key.mp_name,
      description: key.mp_description,
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
      categoryid: key.mc_categoryid,
      name: key.mc_name,
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