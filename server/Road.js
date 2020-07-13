const mongoose = require('mongoose');

const RoadSchema = new mongoose.Schema({
    roadNumber: String,
    roadName: String,
    fromChainage: Number,
    toChainage: Number,
    roadLength: Number,
    from: String,
    to: String,
    pci: Number,
    location: Array,
    numImage: Number,
    imageUrls: Array,
    damageImageUrls: Array,
    timeCreated: Date,
    timeModified: Date,
})

mongoose.model("road", RoadSchema);