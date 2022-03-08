const express = require("express");
const {signup} = require("../controller");
const router = new express.Router()
router.post("/signup", signup)         


module.exports = router;