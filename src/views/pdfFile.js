const pdf = require("pdf-creator-node");
const fs = require("fs");
const path = require("path")
const html = fs.readFileSync(path.join(__dirname, "../pdf.html"), "utf8");
var options = {
    format: "A3",
    orientation: "portrait",
    border: "10mm",
    header: {
        height: "45mm",
        contents: '<div style="text-align: center;">Flipkart: Invoice</div>'
    },
    footer: {
        height: "28mm",
        contents: {
            first: 'Cover page',
            2: 'Second page', // Any page number is working. 1-based index
            default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
            last: 'Last Page'
        }
    }
};
exports.pdfFile = (newResult) => {
    const { product, addressId, userId: user, price: totalAmount, createdBy, createdAt, _id } = newResult
    const { fullName, houseNo, number, street, city, pincode, country, landmark } = addressId
    let total = 0;
    const productDetails = []
    product.map((x) => {
        obj = {
            productName: x.productId.productName,
            productPrice: x.productId.price,
            productCreatedBy: x.productId.createdBy,
            productQuantity: x.quantity,
        }
        productDetails.push(obj)
        total += (x.quantity * x.productId.price)
    })
    var document = {
        html: html,
        data: {
            fullName, totalAmount, productDetails, createdAt, _id
            , houseNo, number, street, city, pincode, country, landmark, createdBy
        },
        path: "./output.pdf",
        type: "",
    };
    pdf.create(document, options)
        .then((res) => {
            console.log(res);
        })
        .catch((error) => {
            console.log(error);
        });
}