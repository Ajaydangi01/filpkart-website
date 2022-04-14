const nodemailer = require('nodemailer');
const cloudinary = require('cloudinary').v2
const multer = require("multer")
const { User } = require('../models/schema');
const { logger } = require('./../shared/logger');
const OTP = require('../models/schema');
const jwt = require('jsonwebtoken');
const { htmlcode } = require("./../views/index")
const { mail, pass, accountSid, authToken, sendFrom, sendTo, secretKey, } = require('./../config/index');
const { CloudName, APIKey, APISecret } = require("./../config/index");
const path = require('path');

exports.emailSend = (token, email) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: mail,
      pass: pass,
    },
  });
  const options = {
    from: 'ajaydangi.thoughtwin@gmail.com',
    to: email,
    subject: 'mail sent with the help of node js',
    html: htmlcode(token),
    attachments: [{
      filename: 'handshake.png',
      path: "https://img.icons8.com/clouds/100/000000/handshake.png",
      cid: 'logo'
    }]
  };
  transporter.sendMail(options, (err, info) => {
    if (err) {
      logger.info(err);
      return;
    } else {
      logger.info('sent' + info.response);
      console.log(fullName)
    }
  });
};



exports.otpFunction = (otp) => {
  let Otp = Math.floor(Math.random() * 1000000 + 1);
  const client = require('twilio')(accountSid, authToken);
  client.messages
    .create({
      body: `Your verification otp is : ${Otp} , Expirein : 10min`,
      from: sendFrom,
      to: sendTo,
    })
    .then((message) => logger.info(message.sid))
    .catch((err) => {
      logger.info(err);
    });
  return Otp;
};

exports.generateToken = (id) => {
  try {
    const token = jwt.sign({ id }, secretKey, { expiresIn: '24h' });
    return token;
  } catch (error) {
    logger.info(error);
  }
};

exports.tokenVerify = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
   return res.status(400).json({ status: 400, message: 'Token is required for authentication', success: false, });
  } else {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];
    const admin = jwt.verify(token, secretKey, async (error, info) => {
      if (error) {
       return res.status(400).json({ status: 400, message: 'invalid token', success: false });
      } else {
        const id = info.id;
        const result = await User.findOne({ _id: id });
        if(!result){
         return res.status(401).json({status : 401 , message : "unauthorized access" , success : false})
        }
        req.user = result
        req.role = result.role
        req.id = result.id
        next()
      }
    });

  }
};


exports.allowTo = (...roles) =>
  (req, res, next) => {
    const { role } = req;
    // console.log(role)
    if (!roles.includes(role)) {
      return res.status(404).json({ message: "you are not admin", succes: false })
    }
    return next();
  };

exports.checkRole = (...roles) =>
  (req, res, next) => {
    const { role } = req;
    // console.log(role)
    if (!roles.includes(role)) {
      return res.status(404).json({ message: "you are not seller", succes: false })
    }
    return next();
  };

exports.showToFields = (req) => {
  if (req.query.fields) {
    const arr = req.query.fields.split(',').filter((Element) => Element);
    let allfields = {};
    arr.map((i) => {
      allfields[i] = 1;
    });
    return allfields;
  } else {
    return (allfields = { role: 1, fullName: 1, email: 1, number: 1, isApprove: 1, });
  }
};

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.fieldname + path.extname(file.originalname))
  },
})


const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
}).array("image", 5)

exports.uploadImage = (req, res, next) => {
  upload(req, res, (error) => {
    if (!error) {
      req.files = req.files || req.file
      req.body = req.body
      if (!req.files) {
        return next()
      } else {
        const array = []
        for (file of req.files) {
          if (array.includes(file.originalname) === false) {
            array.push(file.originalname)
          } else {
            return res.status(400).json({ status: 400, message: "Same file not allowed", success: false })
          }
        }
        req.data = req.body
        next()
      }
    }
    else {
      return res.status(400).json({ status: 400, message: error.message, success: false })
    }
  })
}



exports.uploadfile = async (req, res, next) => {
  if (req.files) {
    const imageArray = req.files
    cloudinary.config({
      cloud_name: CloudName,
      api_key: APIKey,
      api_secret: APISecret,
      secure: true
    });

    const imagesarray = []
    for (x of imageArray) {
      const fileName = x.destination + "/" + x.filename
      await cloudinary.uploader.upload(fileName, function (error, result) {
        imagesarray.push({
          photoUrl: result.url,
          public_id: result.public_id
        })
      });
    }
    req.imgarray = imagesarray
    next()
  } else {
    next()
  }
}


// exports.formData = (req, res, next) => {
//   upload(req, res, (err) => {
//     if (err) {
//       return next(new ApiError(400, err.message))
//     } else {
//       req.files = req.files || req.file
//       req.data = req.data
//       if (!req.files) {
//         return next()
//       } else {
//         const array = []
//         for (file of req.files) {
//           if (array.includes(file.originalname) === false) {
//             array.push(file.originalname)
//           } else {
//             return next(new ApiError(409, "same files are not allowed"))
//           }
//         }
//         next()
//       }
//     }
//   })
// }


const data = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.fieldname + path.extname(file.originalname))
  },
})

const uploads = multer({
  storage: data,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
}).single("image")

exports.uploadSingleImage = (req, res, next) => {
  uploads(req, res, (error) => {
    // console.log(">>>>>>>" , req.file)
    if (!error) {
      next()
    }
    else {
      return res.status(400).json({ status: 400, message: error.message, success: false })
    }
  })
}


exports.uploadSingleImage = (req, res, next) => {
  uploads(req, res, (error) => {
    // console.log(">>>>>>>" , req.file)
    if (!error) {
      next()
    }
    else {
      return res.status(400).json({ status: 400, message: error.message, success: false })
    }
  })
}



exports.emailMsgSend = async (email) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: mail,
      pass: pass,
    },
  });
  const options = {
    from: 'ajaydangi.thoughtwin@gmail.com',
    to: email,
    subject: 'flipkart.com',
    text: "your account is active now."
  };
  await transporter.sendMail(options, (err, info) => {
    if (err) {
      logger.info(err);
      return;
    } else {
      logger.info('sent' + info.response);
    }
  });
};