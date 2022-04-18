const express = require('express');
const orderController = require('./../controller/orderController');
const { tokenVerify, allowTo } = require("./../middleware/index")
const {orderValidation} = require("./../validations/index")

const orderRouter = new express.Router();
orderRouter.post("/order", tokenVerify,orderValidation, orderController.createOrder)
orderRouter.put("/order/:id", tokenVerify, orderController.cancelOrder)
orderRouter.get("/order/:id", tokenVerify, orderController.getOneOrder)
orderRouter.get("/order", tokenVerify, orderController.getAllOrder)
orderRouter.put("/orderstatus/:id", tokenVerify, allowTo("admin"), orderController.changeStatus)

module.exports = orderRouter;