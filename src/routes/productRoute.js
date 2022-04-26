const express = require('express');
const productController = require('./../controller/productController');
const { productValidation } = require("./../validations/index")
const productRouter = new express.Router();
const { tokenVerify, tokenVerifyForProduct, uploadImage, uploadfile, checkRole, allowTo } = require("./../middleware/index")

/** 
 * @swagger
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
 *                      type : string
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
 *                  brandId: 
 *                  categoryId:
 *                  productName: 
 *                  productDetail: 
 *                  price : 
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
productRouter.get('/product', tokenVerifyForProduct, tokenVerify, productController.showProduct); //show all product


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


productRouter.put('/verifyProduct', tokenVerify, allowTo("admin"), productController.productVerify)
module.exports = productRouter;