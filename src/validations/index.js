const Joi = require("joi")

exports.signupValidation = (req, res, next) => {
    console.log(req.body)
    const validateUser = (user) => {
        const JoiSchema = Joi.object({
            role: Joi.string().min(3).max(20).required(),
            firstName: Joi.string().min(3).max(30).required(),
            lastName: Joi.string().min(3).max(30).required(),
            number: Joi.string().min(10).max(13),
            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        })
        return JoiSchema.validate(user)
    }
    const response = validateUser(req.body)
    if (response.error) {
        const msg = response.error.details[0].message
        return res.status(422).json({ status: 422, message: msg })
    }
    else {
        next()
    }
}

exports.loginValidation = (req, res, next) => {
    const validateUser = (user) => {
        const JoiSchema = Joi.object({
            number: Joi.string().min(10).max(12).optional(),
            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).optional(),
            otp: Joi.string().min(6).max(6),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        }).or("email" , "number")
        return JoiSchema.validate(user)
    }
    const response = validateUser(req.body)
    if (response.error) {
        const msg = response.error.details[0].message
        return res.status(422).json({ status: 422, message: msg })
    }
    else {
        next()
    }

}
