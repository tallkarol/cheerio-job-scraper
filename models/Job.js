const mongoose = require("mongoose")

const Schema = mongoose.Schema

const JobSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: false
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
})

const Job = mongoose.model("Job", JobSchema)

module.exports = Job