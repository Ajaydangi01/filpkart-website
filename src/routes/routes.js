const express = require('express');
const postController = require('./../controller/controller');
const brandCategoryController = require("./../controller/brandCategoryController")
const { tokenVerify, allowTo, uploadSingleImage } = require('./../middleware/index');
const { signupValidation, loginValidation, brandValidation } = require('./../validations');
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

/** @swagger
 *  components:
 *      schemas:
 *          brand:
 *              type: object
 *              required :
 *                  - brandName
 *                  - description
 *                  - image
 *              properties:
 *                  brandName:
 *                      type : string
 *                  description:
 *                      type : string
 *                  image:
 *                      type: string
 *                      format: binary
 */

/**
 * @swagger
 * /createBrand:
 *   post:
 *     summary: create brand
 *     tags : [Brand]
 *     requestBody:
 *         required: true
 *         content:
 *          multipart/form-data:
 *            schema:
 *              $ref : '#components/schemas/brand'  
 *     responses:
 *          200:
 *            description: OK
 *          400:
 *            description: Bad request
 */
router.post('/createBrand', tokenVerify, uploadSingleImage, brandValidation, allowTo("admin"), brandCategoryController.createBrand); // create brand by admin


/**
 * @swagger
 * /showBrand:
 *   get:
 *     summary: get all Brand
 *     tags : [Brand]
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
router.get('/showBrand', tokenVerify, allowTo("admin"), brandCategoryController.showBrand) // show all brand


/**
 * @swagger
 * /showOneBrand/{id}:
 *   get:
 *     summary: show brand by id
 *     tags: [Brand]
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
router.get('/showOneBrand/:id', tokenVerify, allowTo("admin"), brandCategoryController.showOneBrand) // show brand by id

/**
 * @swagger
 * /deleteBrand/{id}:
 *   delete:
 *     summary: delete brand
 *     tags: [Brand]
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
router.delete('/deleteBrand/:id', tokenVerify, allowTo("admin"), brandCategoryController.deleteBrand) // delete brand by id


/**
 * @swagger
 * /updateBrand/{id}:
 *   put:
 *     summary: update brand
 *     tags: [Brand]
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
 *              $ref : '#components/schemas/brand'
 *     responses:
 *       200:
 *         description: ok
 *       400:
 *        description: Bad request
 */
router.put('/updateBrand/:id', tokenVerify, allowTo("admin"), brandCategoryController.updateBrand) // update brand by id


/** @swagger
 *  components:
 *      schemas:
 *          category:
 *              type: object
 *              required :
 *                  - categoryName
 *                  - description
 *                  - image
 *              properties:
 *                  categoryName:
 *                      type : string
 *                  description:
 *                      type : string
 *                  image:
 *                      type: string
 *                      format: binary
 *              example :
 *                  categoryName: "Samsung"
 *                  description: "Samsung Electronics Co. Ltd."
 */


/**
 * @swagger
 * /createCategory:
 *   post:
 *     summary: create category
 *     tags : [Category]
 *     requestBody:
 *         required: true
 *         content:
 *          multipart/form-data:
 *            schema:
 *              $ref : '#components/schemas/category'  
 *     responses:
 *          200:
 *            description: OK
 *          400:
 *            description: Bad request
 */
router.post('/createCategory', tokenVerify, uploadSingleImage, allowTo("admin"), brandCategoryController.createCategory); // create category brand by admin


/**
 * @swagger
 * /showCategory:
 *   get:
 *     summary: get all category
 *     tags : [Category]
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
router.get('/showCategory', tokenVerify, allowTo("admin"), brandCategoryController.show_category); //  show all category 


/**
 * @swagger
 * /showOneCategory/{id}:
 *   get:
 *     summary: show category by id
 *     tags: [Category]
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
router.get('/showOneCategory/:id', tokenVerify, allowTo("admin"), brandCategoryController.show_one_category); //  show category by id


/**
 * @swagger
 * /deleteCategory/{id}:
 *   delete:
 *     summary: delete category by id
 *     tags: [Category]
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
router.delete('/deleteCategory/:id', tokenVerify, allowTo("admin"), brandCategoryController.delete_category); // delete category by id

/**
 * @swagger
 * /updateCategory/{id}:
 *   put:
 *     summary: update category
 *     tags: [Category]
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
router.put('/updateCategory/:id', tokenVerify, allowTo("admin"), brandCategoryController.update_category); // update category by id

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
