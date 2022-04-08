const express = require('express');
const postController = require('./../controller/controller');
const brandCategoryController = require("./../controller/brandCategoryController")
const { tokenVerify, allowTo } = require('./../middleware/index');
const { signupValidation, loginValidation } = require('./../validations');
const router = new express.Router();

/**
 * @swagger
 * /api/adminSignup:
 *   post:
 *     summary: Admin signup
 *     tags : [Admin]
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
router.post('/api/adminSignup', signupValidation, postController.adminSignup); // admin signup

/**
 * @swagger
 * /api/adminLogin:
 *   post:
 *     summary: Admin Login
 *     tags : [Admin]
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
router.post('/api/adminLogin', loginValidation, postController.adminLogin); // -- Admin login

/**
 * @swagger
 * /api/getAllSellers:
 *   get:
 *     summary: Admin get all sellers
 *     tags : [Admin]
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
router.get('/api/getAllSellers', tokenVerify, allowTo("admin"), postController.getAllSellers); // -- Admin get all users

/**
 * @swagger
 * /api/VerifyByAdmin:
 *   post:
 *     summary: Admin can verify seller
 *     tags : [Admin]
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
router.put('/api/VerifyByAdmin', tokenVerify, allowTo("admin"), postController.verifiedByAdmin); // Admin

router.post('/api/createBrand', tokenVerify, allowTo("admin"), brandCategoryController.createBrand); // create brand by admin

router.get('/api/showBrand', tokenVerify, allowTo("admin"), brandCategoryController.showBrand) // show all brand

router.get('/api/showOneBrand/:id', tokenVerify, allowTo("admin"), brandCategoryController.showOneBrand) // show brand by id

router.delete('/api/deleteBrand/:id', tokenVerify, allowTo("admin"), brandCategoryController.deleteBrand) // delete brand by id

router.put('/api/updateBrand/:id', tokenVerify, allowTo("admin"), brandCategoryController.updateBrand) // update brand by id

router.post('/api/create_category', tokenVerify, allowTo("admin"), brandCategoryController.create_category); // create category brand by admin

router.get('/api/show_category', tokenVerify, allowTo("admin"), brandCategoryController.show_category); //  show all category 

router.get('/api/show_one_category/:id', tokenVerify, allowTo("admin"), brandCategoryController.show_one_category); //  show category by id

router.delete('/api/delete_category/:id', tokenVerify, allowTo("admin"), brandCategoryController.delete_category); // delete category by id

router.put('/api/update_category/:id', tokenVerify, allowTo("admin"), brandCategoryController.update_category); // update category by id

/**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: create a new seller
 *     tags : [Seller]
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
 *                   email: ajay@yopmail.com
 *                   number: "7894561230"
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
router.post('/api/sellersignup', signupValidation, postController.signup); // -- seller Signup

/**
 * @swagger
 * /api/sellerLogin:
 *   post:
 *     summary: Seller login
 *     tags : [Seller]
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
 *                   email: ajay@yopmail.com
 *                   number: "7894561230"
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
router.post('/api/sellerLogin', postController.SellerLogin);  // -- seller login

/**
 * @swagger
 * /api/VerifyOtp:
 *   post:
 *     summary: Verify by otp
 *     tags : [Seller]
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
 *                   opt: 123456
 *     security: [{
 *       jwt: []
 *              }]
 *     responses:
 *      200:
 *        description: OK
 *      409:
 *        description: Bad request
 */
router.post('/api/VerifyOtp', postController.verifyOtp);

/**
 * @swagger
 * /api/confirmEmail/:token:
 *   get:
 *     summary: Verify by email
 *     tags : [Seller]
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
router.post('/api/confirmEmail/:token', postController.confirmEmail); // -- Email confiramtion

module.exports = router;

router.get("/api/adminLogin", (req, res) => {
    res.render("adminlogin")
})

router.get("/api/adminSignup", (req, res) => {
    res.render("adminsignup")
})

router.get("/api/adminpanel", (req, res) => {
    res.render("adminpanel")
})
