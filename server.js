// dependencies
const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const axios = require("axios")
const cheerio = require("cheerio")

// bring in models for mongo
const db = require("./models")

// set port, initialize Express
const PORT = 3000
const app = express()

// configure middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

// configure mongoose connection for heroku deployment
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/cheerioJobScrape"
mongoose.connect(MONGODB_URI)

// routes

app.get("/scrape", (req, res) => {
    axios.get("https://www.ziprecruiter.com/candidate/search?radius=25&search=frontend+developer&location=cleveland+ohio").then((response) => {

        // log for quick-testing successful GET
        // console.log(response)

        // utilize cheerio to parse scraped html into object
        const $ = cheerio.load(response.data)

        $("article div.job_content").each((i, element) => {
            let result = {}
            result.title = $(this)
                .children("a")
                .children("h2")
                .children("span")
                .text()
            result.link = $(this)
                .children("a")
                .attr("href")
            result.summary = $(this)
                .children("p.job_snippet")
                .children("a")
                .text()

            // log to quick test population of result object
            console.log(result)

        })
    })
})