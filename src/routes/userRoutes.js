const express = require('express');
const userController = require('./../controller/userController');
const { signupValidation, loginValidation } = require('./../validations/index');
const userRouter = new express.Router();

/**
 * @swagger
 * /api/user_signup:
 *   post:
 *     summary: User signup
 *     tags : [User]
 *     requestBody:
 *         required: true
 *         content:
 *          application/json:
 *            schema:
 *                required:
 *                   - fullName
 *                   - number
 *                   - email
 *                   - password
 *                properties:
 *                   fullName:
 *                      type:string
 *                   number:
 *                      type:number
 *                   email:
 *                      type: email
 *                   password:
 *                      type: password
 *                example:
 *                   fullName: Ajay dangi
 *                   number: "7894561230"
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
userRouter.post('/userSignup', signupValidation, userController.user_signup);

/**
 * @swagger
 * /api/user_login:
 *   post:
 *     summary: User login
 *     tags : [User]
 *     requestBody:
 *         required: true
 *         content:
 *          application/json:
 *            schema:
 *                required:
 *                   - number
 *                   - email
 *                   - password
 *                properties:
 *                   number:
 *                      type:number
 *                   email:
 *                      type: email
 *                   password:
 *                      type: password
 *                example:
 *                   number: "7894561230"
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
userRouter.post('/userLogin', loginValidation, userController.user_login);

/**
 * @swagger
 * /api/confirm_Email/:token:
 *   get:
 *     summary: Verify by email
 *     tags : [User]
 *     parameters:
 *         - in: path
 *           name: token
 *           schema:
 *              type: string
 *     security: [{
 *       jwt: []
 *              }]
 *     responses:
 *      200:
 *        description: OK
 *      409:
 *        description: Bad request
 */
userRouter.get('/api/confirm_email/:token', userController.confirm_email);

/**
 * @swagger
 * /api/verify_otp:
 *   post:
 *     summary: Verify by otp
 *     tags : [User]
 *     requestBody:
 *         required: true
 *         content:
 *          application/json:
 *            schema:
 *                required:
 *                   - number
 *                   - otp
 *                properties:
 *                   number:
 *                      type:number
 *                   otp:
 *                      type: number
 *                example:
 *                   number: "7894561230"
 *                   otp: 123456
 *     security: [{
 *       jwt: []
 *              }]
 *     responses:
 *      200:
 *        description: OK
 *      409:
 *        description: Bad request
 */
userRouter.post('/api/verify_otp', loginValidation, userController.verify_otp);

userRouter.put('/api/user_update/:id',  userController.user_update);


module.exports = userRouter;
