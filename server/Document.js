const mongoose = require('mongoose')


mongoose.connect('mongodb://127.0.0.1:27017/docs_ctrlC');

const DocumentSchema = new mongoose.Schema({
  _id: String,
  data: Object
});


module.exports = mongoose.model('Document', DocumentSchema)