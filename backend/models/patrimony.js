const mongoose = require("mongoose");

const PatrimonySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  patrimonyCode: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  locations: {
    type: Array,
    required: true
  },
  patrimonyDate: {
    type: Array
  },
  photos: {
    type: Array
  },
  privacy: {
    type: Boolean
  },
  userId: {
    type: mongoose.ObjectId
  }


});



const Patrimony = mongoose.model("Patrimony", PatrimonySchema);

module.exports = Patrimony;