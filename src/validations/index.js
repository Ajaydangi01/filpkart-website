const Joi = require('joi');

exports.signupValidation = (req, res, next) => {
  const validateUser = (user) => {
    const JoiSchema = Joi.object({
      fullName: Joi.string().min(3).max(30).required(),
      number: Joi.string().min(10).max(10),
      email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required()
    });
    return JoiSchema.validate(user);
  };
  const response = validateUser(req.body);
  if (response.error) {
    const msg = response.error.details[0].message;
    return res.status(422).json({ status: 422, message: msg });
  } else {
    next();
  }
};

exports.loginValidation = (req, res, next) => {
  const validateUser = (user) => {
    const JoiSchema = Joi.object({
      number: Joi.string().min(10).max(12).optional(),
      email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).optional(),
      otp: Joi.number(),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')),
    }).or('email', 'number');
    return JoiSchema.validate(user);
  };
  const response = validateUser(req.body);
  if (response.error) {
    const msg = response.error.details[0].message;
    return res.status(422).json({ status: 422, message: msg });
  } else {
    next();
  }
};

exports.addressValidation = (req, res, next) => {
  const validateAddress = (address) => {
    const JoiSchema = Joi.object({
      fullName: Joi.string().min(3).max(30).required(),
      number: Joi.string().min(3).max(30).required(),
      houseNo: Joi.string().min(1).max(15).required(),
      street: Joi.string().min(1).max(15).required(),
      landmark: Joi.string().min(5).max(40).required(),
      addressType: Joi.string().min(4).max(30).required(),
      city: Joi.string().min(3).max(30).required(),
      pincode: Joi.string().min(6).max(6).required(),
      state: Joi.string().min(3).max(30).required(),
      country: Joi.string().min(5).max(30).required(),
    });
    return JoiSchema.validate(address);
  };
  const response = validateAddress(req.body);
  if (response.error) {
    const msg = response.error.details[0].message;
    return res.status(422).json({ status: 422, message: msg });
  } else {
    next();
  }
};

exports.sellerProfileValidation = (req, res, next) => {
  const validateProfile = (user) => {
    const JoiSchema = Joi.object({
      GSTIN: Joi.string().pattern(new RegExp('^([0][1-9]|[1-2][0-9]|[3][0-7])([A-Z]{5})([0-9]{4})([A-Z]{1}[1-9A-Z]{1})([Z]{1})([0-9A-Z]{1})+$')).required(),
      aadhaarNo: Joi.string().min(12).max(12).required(),
      pancardNo: Joi.string().pattern(new RegExp("[A-Z]{5}[0-9]{4}[A-Z]{1}")).required()
    });
    return JoiSchema.validate(user);
  };
  const response = validateProfile(req.body);
  if (response.error) {
    const msg = response.error.details[0].message;
    return res.status(422).json({ status: 422, message: msg });
  } else {
    next();
  }
};

exports.productValidation = (req, res, next) => {
  // console.log(req.body.productDetail)
  const validateProduct = (product) => {
    const JoiSchema = Joi.object({
      image: Joi.string().optional(),
      brandId: Joi.string().min(3).max(30).required(),
      categoryId: Joi.string().min(2).max(30).required(),
      productName: Joi.string().min(4).max(99).required(),
      productDetail: Joi.string().min(5).max(200).required(),
      price: Joi.number().min(1).required()
    });
    return JoiSchema.validate(product);
  };
  const response = validateProduct(req.body);
  if (response.error) {
    const msg = response.error.details[0].message;
    return res.status(422).json({ status: 422, message: msg });
  } else {
    next();
  }
};

