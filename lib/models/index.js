/**
 * Module dependencies.
 */

const mongoose = require('mongoose');

/**
 * Require models
 */
mongoose.model('User', require('./User'));
mongoose.model('Transaction', require('./Transaction'));