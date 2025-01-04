// Backend/models/user.js
const mongoose = require('mongoose');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const userSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 50
  },
  lastName: { 
    type: String, 
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 50
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: true,
    minLength: 8
  }
}, { 
  timestamps: true 
});

const User = mongoose.model('User', userSchema);

const validateUser = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: passwordComplexity().required()
  });
  return schema.validate(data);
};

module.exports = { User, validateUser };