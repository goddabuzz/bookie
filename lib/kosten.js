/*!
 * Kosten.JS
 * Copyright(c) 2012 Daniel Kloosterman <buz.i286@gmail.com>
 */

/**
 * Library version.
 */
exports.version = '0.0.1';

/**
 * Module dependencies.
 */
const express = require('express'),
      mongoose = require('mongoose');

// models

require('./models');

/**
 * Exports.
 */

module.exports = function (config) {

  /**
   * Create app. Allows for easy spawning of multiple apps for testing.
   */

  const app = express();
  const db = mongoose.createConnection(config.mongodb);

  /**
   * Models.
   */
  const User = db.model('User');
  const Transaction = db.model('Transaction');

  /**
   * Middleware.
   */
  app.configure(function () {
    // general
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))
    app.use(express.session({ secret: 'youneedtopaythis' }));

    // static
    app.use(express.static(__dirname + '/../public'));
  });

  /**
   * Settings
   */
  app.configure(function () {
    app.engine('html', require('hjs').__express);
    app.set('views', __dirname + '/../views');
    app.set('view engine', 'html');
  });
  
  /**
   * Save reference to mongoose connection.
   */
  app.configure(function () {
    app.set('db', db);
  });

  /**
   * Main route.
   */
  
  app.get('/', function (req, res, next) {
    res.render('index', {
      title: 'Kosten'
    });
  });
  
  /* 
   * Earnings
   */
  app.get('/earnings', function(req, res, next){
      Transaction.getEarnings(function(err, docs){
          res.send(docs);
      });
  })
  app.get('/earnings/year/:year', function(req, res, next){
    var year = req.param('year')||2013;
    Transaction.getGroupedByMonth(year, true, function(err, docs){
      res.send(err||docs);
    });
  })

  /**
   * Expenses
   */
  app.get('/expenses', function(req, res, next){
    Transaction.getExpenses(function(err, docs){
      res.send(docs);
    });
  });
  app.get('/expenses/year/:year', function(req, res, next){
    var year = req.param('year')||2013;
    Transaction.getGroupedByMonth(year, false, function(err, docs){
      res.send(err||docs);
    });
  })

  /**
   * Search page.
   */
  app.get('/search', function (req, res, next) {
    res.render('search');
  });

  /**
   * Search blog posts.
   */
  
  app.get('/search/do', function (req, res, next) {
    // 1: add an index
    // 2: perform regexp search
  });

  /**
   * Create blog post
   */

  app.post('/user/create', function (req, res, next) {
    var user = new User({
        name: {
            first: 'Daniel',
            last: 'Kloosterman'
        },
        account: {
            email: 'buz.i286@gmail.com',
            password: '-'
        }, 
        created: new Date()
    });
    user.save(function (err) {
        console.log('User created! ' + err);
    });
  });

  /**
   * Delete blog post.
   */
  
  app.get('/delete/:id', function (req, res, next) {
    /*BlogPost.findById(req.param('id'), function (err, doc) {
      if (err) return next(err);
      doc.remove(function (err) {
        req.flash('info', 'Removed');
        res.redirect('/');
      });
    });*/
  });
  
  /**
   * Create comment.
   */
  
  app.post('/comment/:id', function (req, res, next) {
    // 1: define schema
    // 2: retrieve blog post
    // 3: insert embedded doc
    // 4: fun, fun, fun, fun!
  });

  /**
   * Return app. 
   */
  
  return app;

};