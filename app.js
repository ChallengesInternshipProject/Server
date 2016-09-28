var express = require('express')
var path = require('path')
  // var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

// Allow remote servers to get
var cors = require('cors')

// Database
var mongoose = require('mongoose')

var mongodbServer = 'mongodb://serverConnection:dare!not@ds021016.mlab.com:21016/dareornot2'

mongoose.connect(mongodbServer)
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log('Connected to DB')
})

var passport = require('passport')
  // Load the passport settings
require('./passport-init')

var routes = require('./routes/index')
var users = require('./routes/users')
var chat = require('./routes/chat')
var files = require('./routes/files')
var notifications = require('./routes/notifications')

// Calendar
var calendar = require('./routes/calendar')

var dares = require('./routes/dares')

// Login and Registration
var auth = require('./routes/auth')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}))
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())

app.use(bodyParser.json({
  limit: '50mb'
}))
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}))

app.use('/', routes)
app.use('/users', users)
app.use('/auth', auth)
app.use('/chat', chat)
app.use('/calendar', calendar)
app.use('/dares', dares)
app.use('/files', files)
app.use('/notifications', notifications)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

module.exports = app
