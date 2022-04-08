const express = require('express');
const productController = require('./../controller/productController');
const { productValidation } = require("./../validations/index")
const productRouter = new express.Router();
const { tokenVerify, uploadImage, uploadfile, formData, checkRole } = require("./../middleware/index")

/** @swagger
 *  components:
 *      schemas:
 *          product:
 *              type: object
 *              required :
 *                  - brandId
 *                  - categoryId
 *                  - productName
 *                  - productDetail
 *                  - price
 *                  - image
 *              properties:
 *                  brandId:
 *                      type : string
 *                  categoryId:
 *                      type : number
 *                  productName :
 *                      type : string
 *                  productDetail :
 *                      type : string
 *                  price :
 *                      type : string
 *                  image:
 *                      type: string
 *                      format: binary
 *              example :
 *                  brandId: "624e956336d8ce8e2f415006"
 *                  categoryId: "624e956a36d8ce8e2f41500a"
 *                  productName: "SAMSUNG Galaxy Z Fold3 5G (Phantom Black, 512 GB)"
 *                  productDetail: "Qualcomm Snapdragon 888 Octa-Core Processor"
 *                  price : 179999
 *      responses:
 *          200:
 *            description: OK
 *          400:
 *            description: Bad request
 */

/**
 * @swagger
 * /product:
 *   post:
 *     summary: create product
 *     tags : [Product]
 *     requestBody:
 *         required: true
 *         content:
 *          multipart/form-data:
 *            schema:
 *              $ref : '#components/schemas/product'
 *     responses:
 *      200:
 *        description: OK
 *      400:
 *        description: Bad request
 */
productRouter.post('/product', tokenVerify, uploadImage, productValidation, productController.createProduct); //create product


/**
 * @swagger
 * /product:
 *   get:
 *     summary: get all Product
 *     tags : [Product]
 *     body:
 *         required: true
 *         content:
 *          application/json:
 *     security: [{
 *       jwt: []
 *              }]
 *     responses:
 *      200:
 *        description: OK
 *      400:
 *        description: Bad request
 */
productRouter.get('/product', tokenVerify, checkRole("seller"), productController.showProduct); //show all product


/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: show product by id
 *     tags: [Product]
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: ok
 *       400:
 *        description: Bad request
 *
 */
productRouter.get('/product/:id', tokenVerify, checkRole("seller"), productController.showOneProduct); // product find by id


/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     summary: delete product by id
 *     tags: [Product]
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: ok
 *       400:
 *        description: Bad request
 */
productRouter.delete("/product/:id", tokenVerify, productController.deleteProduct) // delete product


/**
 * @swagger
 * /product/{id}:
 *   put:
 *     summary: update product by id
 *     tags: [Product]
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *     requestBody:
 *         required: true
 *         content:
 *          multipart/form-data:
 *            schema:
 *                $ref : '#components/schemas/product'
 *     responses:
 *      200:
 *        description: OK
 *      400:
 *        description: Bad request
 */
productRouter.put('/product/:id', tokenVerify, uploadImage, uploadfile, productController.updateProduct); //update product

module.exports = productRouter;