const http = require("http")
const express = require("express")
const route = require("./routes/routes")
const app = express()
require("./config/db")
require('dotenv').config()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT

app.use("/",route)

app.listen(port, () => {
  console.log(`localhost:${port}`)
})

