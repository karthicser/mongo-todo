var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var index = require('./routes/index');
var users = require('./routes/users');
var cons = require('consolidate');
var socket = require('socket.io');
var app = express();
const {MongoClient,ObjectID} = require('mongodb');
var obj = new ObjectID();
console.log(obj+"----");
// view engine setup
app.engine('html', cons.swig);
app.set('port',process.env.PORT || 2000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

var server  = http.createServer(app).listen(app.get('port'),() => {
  console.log("connected successfully "+app.get('port'));
});
var io = socket(server);

MongoClient.connect('mongodb://localhost:27017/chatapp',(err,db) =>{
  if(err){
    return console.log('unable to connect to mongodbserver' + err);
  }
  console.log('mongodb connected successfully');


  /*db.collection('Todos').insertOne({
      text:'something to do',
      completed:false
  },(err,result)=>{
    if(err)
      return console.log('unable to insert',err);
    console.log(JSON.stringify(result.ops,undefined,2));
  });*/
  /*var user = {name:'karthikeyan',age:'27'};
  var {name} = user;
  console.log(name);

  db.collection('user').insertOne({
    name:'karthik',
    age:'27',
    location:'sholinghur'
  },(err,result)=>{
      if(err)
        return console.log('unable to insert',err);
      console.log(JSON.stringify(result.ops[0]._id.getTimestamp(),undefined,2));
  });*/

  db.collection('Todos').find({_id:new ObjectID('59f196f79140b02632a727cf')}).count().then((counts)=>{
    console.log(`counts:${counts}`);
  },(err)=>{
    console.log('unable to fetch the data',err);
  });


  db.close();

});
