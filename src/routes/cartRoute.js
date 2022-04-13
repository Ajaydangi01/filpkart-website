const express = require('express');
const cartController = require('./../controller/cartController');
const { tokenVerify } = require("./../middleware/index")

const cartRouter = new express.Router();


/**
 * @swagger
 * /createCart:
 *   post:
 *     summary: Add to cart
 *     tags : [Cart]
 *     requestBody:
 *         required: true
 *         content:
 *          application/json:
 *            schema:
 *                required:
 *                   - productId
 *                   - userId
 *                properties:
 *                   productId:
 *                      type:string
 *                   userId:
 *                      type:string
 *                example:
 *                    productId : 62542a0e3631bd823042ddd1
 *                    userId : 625511b8c950d288def44ddb
 *     responses:
 *      200:
 *        description: OK
 *      409:
 *        description: Bad request
 */
cartRouter.post('/createCart', tokenVerify, cartController.createCart);


/**
 * @swagger
 *  /showCart:
 *    get:
 *     summary: get cart
 *     tags : [Cart]
 *     body:
 *         required: true
 *         content:
 *          application/json:
 *     responses:
 *      200:
 *        description: OK
 *      400:
 *        description: Bad request
 */
cartRouter.get('/showCart', tokenVerify, cartController.showCart);


/**
 * @swagger
 * /deleteCart/{id}:
 *   delete:
 *     summary: delete cart
 *     tags: [Cart]
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
cartRouter.delete('/deleteCart/:id', tokenVerify, cartController.deleteCart);


// /**
//  * @swagger
//  * /updateCart/{id}:
//  *   post:
//  *     summary: Add to cart
//  *     tags : [Cart]
//  *     parameters:
//  *      - in: path
//  *        name: id
//  *        schema:
//  *          type: string
//  *                required:
//  *                   - productId
//  *                   - userId
//  *                properties:
//  *                   productId:
//  *                      type:string
//  *                   userId:
//  *                      type:string
//  *                example:
//  *                    productId : 62542a0e3631bd823042ddd1
//  *                    userId : 625511b8c950d288def44ddb
//  *     responses:
//  *      200:
//  *        description: OK
//  *      409:
//  *        description: Bad request
//  */

/**
 * @swagger
 * /updateCart/{id}:
 *   put:
 *     summary: update brand
 *     tags: [Cart]
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *      - in: query
 *        name: value
 *     responses:
 *       200:
 *         description: ok
 *       400:
 *        description: Bad request
 */
cartRouter.put('/updateCart/:id', tokenVerify, cartController.updateCart);


cartRouter.delete("/deleteAllCart/:id" , tokenVerify , cartController.deleteAllCart)

module.exports = cartRouter;
