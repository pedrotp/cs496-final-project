var mongoose = require('mongoose');

// var callSchema = mongoose.Schema({
//   incomingNumber: { type: String, required: true },
//   duration: { type: Number }
// });

var clientSchema = mongoose.Schema({
  name: {
    first: { type: String, required: true },
    last: { type: String, required: true }
  },
  email: { type: String, required: true },
  // dialIn: { type: String, required: true },
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return /^(1\D?|\+1\D?)?\(?(\d{3})\)?\D?(\d{3})\D?(\d{4})$/.test(v);
      },
      message: ' Invalid phone number {VALUE}'
    },
    required: true
  },
  discount: { type: Number, required: true, default: 0, min: 0, max: 1 },
  balance: { type: Number, required: true, default: 0 }
  // calls: [callSchema]
});

clientSchema.virtual('fullname').get(function() {
  return this.name.first + ' ' + this.name.last;
});

var userSchema = mongoose.Schema({
  email: { type: String, required: true },
  // password: ,
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return /^(1\D?|\+1\D?)?\(?(\d{3})\)?\D?(\d{3})\D?(\d{4})$/.test(v);
      },
      message: ' Invalid phone number {VALUE}'
    },
    required: true
  },
  rate: { type: Number, default: 0 }, // hourly rate
  clients: [clientSchema]
});

module.exports = mongoose.model('User', userSchema);
