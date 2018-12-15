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
mongoose.connect(MONGODB_URI, { useNewUrlParser: true})

// routes

// route to use axios and cheerio to scrape job site(s)
app.get("/scrape", (req, res) => {
    axios.get("https://www.ziprecruiter.com/candidate/search?radius=25&search=frontend+developer&location=cleveland+ohio").then((response) => {

        // log for quick-testing successful GET
        // console.log(response.data)

        // utilize cheerio to parse scraped html into object
        const $ = cheerio.load(response.data)

        $("article div.job_content").each(function(i, element) {
            var result = {}
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
                .text().trim()

            // log to quick test population of result object
            console.log(result)

            db.Job.create(result)
                .then(
                    // function dbJob {console.log(dbJob) }
                )
                .catch(function(err) { return res.json(err) })
        })

        res.send("Scrape Complete")
    })
})

// route to see JSON of all jobs
app.get("/jobs", (req, res) => {
    db.Job.find({})
        .then(dbJob => { res.json(dbJob) })
        .catch(err => { return res.json(err) })
})

// route for populating notes when jobs grabbed via id
app.get("/jobs/:id", (req, res) => {
    db.Job.findOne({ _id: req.params.id })
        // use cheerio to populate based on key value
        .populate("note")
        .then(dbJob => { res.json(dbJob) })
        .catch(err => { res.json(err) })
})

// route for save/update a job's notes
app.post("/jobs/:id", (req, res) => {
    db.Note.create(req.body)
        .then(dbNote => {
            return db.Job.findOneAndUpdate(
                { _id: req.params.id },
                { note: dbNote._id },
                { new: true }
            )
        })
        .then(dbNote => { res.json(dbNote )})
        .catch(err => { res.json(err) })
})

// start express server
app.listen(PORT, () => {
    console.log(`app running on localhost:${PORT}`)
})