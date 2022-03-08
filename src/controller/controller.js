const User = require("./schema")
const Joi = require("joi")

module.exports = {
    signup: async (req, res) => {
        function validateUser(user) {
            const JoiSchema = Joi.object({
                firstName: Joi.string().min(3).max(30).required(),
                lastName: Joi.string().min(3).max(30).required(),
                number: Joi.number().integer().required(),
                email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
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
            const result = new User(req.body)
            result.save().then((dataResult) => {
                res.status(200).send({ status : 200 ,  message : 'Signup Successfully'});
                
            }).catch((error) => {
                res.send(error)
            })
        }
    }
   
}






