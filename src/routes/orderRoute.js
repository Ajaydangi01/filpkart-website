const express = require('express');
const orderController = require('./../controller/orderController');
const { tokenVerify, checkRole } = require("./../middleware/index")
const { orderValidation } = require("./../validations/index")

const orderRouter = new express.Router();
orderRouter.post("/order", tokenVerify, orderValidation, orderController.createOrder)
orderRouter.get("/order/:id", tokenVerify, orderController.getOneOrder)
orderRouter.get("/order", tokenVerify, orderController.getAllOrder)
orderRouter.put("/order/:id", tokenVerify, orderController.cancelOrder)
orderRouter.put("/orderstatus/:id", tokenVerify, checkRole("seller"), orderController.changeStatus)
orderRouter.put("/shipped" , tokenVerify , orderController.shipped)

module.exports = orderRouter;