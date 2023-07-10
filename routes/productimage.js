var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("productimage", {
    title: '5L Cart',
    fullname: 'DEV 42',
    roletype: 'Admin',
    position: 'Developer',
    department: 'Research & Development',
  });
});

module.exports = router;
