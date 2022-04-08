const express = require('express');
const addressController = require('./../controller/addressController');
const { addressValidation } = require('./../validations/index');
const addressRouter = new express.Router();

// /**
//  * @swagger
//  * /api/create_address:
//  *   post:
//  *     summary: Add address
//  *     requestBody:
//  *         required: true
//  *         content:
//  *          application/json:
//  *            schema:
//  *                required:
//  *                   - fullName
//  *                   - number
//  *                   - houseNo
//  *                   - street
//  *                   - lankmark
//  *                   - city
//  *                   - pincode
//  *                   - state
//  *                   - country
//  *                properties:
//  *                   fullName:
//  *                      type:string
//  *                   number:
//  *                      type:number
//  *                   houseNo:
//  *                      type: email
//  *                   street:
//  *                      type: password
//  *                   lankmark:
//  *                      type:string
//  *                   city:
//  *                      type:number
//  *                   pincode:
//  *                      type: email
//  *                   state:
//  *                      type: password
//  *                   country:
//  *                      type:string
//  *                example:
//  *                    fullName : Ajay dangi
//  *                    number : 8866535512
//  *                    houseNo : 258
//  *                    street : 6
//  *                    lankmark : svm school
//  *                    city : indore
//  *                    pincode : 452010
//  *                    state : mp
//  *                    country : india
//  *     security: [{
//  *       jwt: []
//  *              }]
//  *     responses:
//  *      200:
//  *        description: OK
//  *      409:
//  *        description: Bad request
//  */

//  addressRouter.post("/api/create_address",addressValidation, addressController.create_address)
addressRouter.post('/api/create_address', addressValidation, addressController.create_address);

/**
 * @swagger
 * /api/VerifyByAdmin:
 *   post:
 *     summary: Admin can verify seller
 *     requestBody:
 *         content:
 *          application/json:
 *            schema:
 *                example:
 *                   id: 62387d181163e39cf9f2002b
 *     security:
 *	    - jwt: []
 *     responses:
 *      200:
 *        description: OK
 *      409:
 *        description: Bad request
 */
addressRouter.get('/api/show_address', addressController.show_address);

/**
 * @swagger
 * /api/adminLogin:
 *   post:
 *     summary: Admin Login
 *     requestBody:
 *         required: true
 *         content:
 *          application/json:
 *            schema:
 *                required:
 *                   - email
 *                   - password
 *                properties:
 *                   email:
 *                      type: email
 *                   password:
 *                      type: password
 *                example:
 *                   email: ajay@yopmail.com
 *                   password: "123456"
 *     security: [{
 *       jwt: []
 *              }]
 *     responses:
 *      200:
 *        description: OK
 *      409:
 *        description: Bad request
 */
addressRouter.put('/api/update_address/:id', addressController.update_address);

/**
 * @swagger
 * /api/getAllSellers:
 *   get:
 *     summary: Admin get all sellers
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
 *      409:
 *        description: Bad request
 */
addressRouter.delete('/api/delete_address/:id', addressController.delete_address);

addressRouter.get('/api/get_Data', addressController.get_Data);

module.exports = addressRouter;
