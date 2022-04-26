
const pdf = require("pdf-creator-node");
const html = `<!DOCTYPE html>
<html>

<head>
    <style>
        body {
            background-color: #EFF8FF;
        }

        h1,
        p {
            margin: 0px;
        }

        .main-section {
            background-color: #FFF;
            border: 1px solid #8D43AC;
        }

        .header {
            background-color: #9b9b9b;
            padding: 30px 15px 20px 15px;
            color: #fff;
        }

        .content {
            padding: 20px 15px 20px 15px;
        }

        th {
            background-color: #9b9b9b;
            color: #fff;
            text-align: right;
        }

        .table td:nth-child(1),
        .table th:nth-child(1) {
            text-align: left;
        }

        .lastSection {
            padding: 20px 15px 30px 15px;
        }
    </style>
    <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="custom.css">
    <link rel="stylesheet" type="text/css"
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
</head>

<body>
    <div class="container">
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                <div class="row main-section">
                    <div class="col-md-12 col-sm-12 header">
                        <div class="row">
                            <div class="col-md-6 col-sm-6 col-xs-6">
                                <img src="https://1000logos.net/wp-content/uploads/2021/02/Flipkart-Logo-2007.png"
                                    alt="" width="200" height="90">
                            </div>
                            <div class="col-md-6 col-sm-6 col-xs-6 text-right">
                                <p>Order ID : </p>
                                <span>May 6 ,2017</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-12 col-sm-12 content">
                        <div class="row">
                            <div class="col-md-6 col-sm-6 col-xs-6">
                                <p> From </p>
                                <p> SellerName </p>
                                <p>Shop Address</p>
                                <p>New York USA</p>
                            </div>
                            <div class="col-md-6 col-sm-6 col-xs-6 text-right">
                                <p>To.</p>
                                <p>Mr. Piyush Kamani</p>
                                <p> Address</p>
                                <p>Los Angel USA</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-12 col-sm-12">
                        <table class="table">
                            <thead>
                                <tr class="text-danger">
                                    <th>Product</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Total Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Product Name</td>
                                    <td>10</td>
                                    <td>$10</td>
                                    <td>$100</td>
                                </tr>
                                <tr>
                                    <td>Name Of The Product</td>
                                    <td>1</td>
                                    <td>$10</td>
                                    <td>$100</td>
                                </tr>
                                <tr>
                                    <td>Product Name</td>
                                    <td>1</td>
                                    <td>$10</td>
                                    <td>$100</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td><b>Total</b></td>
                                    <td>$300</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="col-md-12 col-sm-12 lastSection">
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>

</html>`





const options = {
    format: "A2",
    orientation: "portrait",
    border: "10mm",
    header: {
        height: "45mm",
    },
    footer: {
        height: "28mm",
        contents: {
            2: 'Second page', // Any page number is working. 1-based index
            default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value

        }
    }
};

const users = [
    {
        name: "Shyam",
        age: "26",
    }
];
const document = {
    html:  html,
    data: {
        users: users,
    },
    path: "./output.pdf",
    type: "",
};
pdf
    .create(document, options)
    .then((res) => {
        console.log(res);
    })
    .catch((error) => {
        console.error(error);
    });








