const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session=require('express-session');
const bodyParser = require('body-parser');
const wosaiFs = require('./modules/fs');
const  lessMiddleware = require("less-middleware");
const app = express();


app.use(cookieParser());
app.use(session({
  secret:'zhouchi',
  key:'outside-sports',
  cookie:{maxAge: 60*10*60*8*1000}
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 注册路由
const dirTree = wosaiFs.readDirDeepSync(path.resolve(__dirname, 'routes'));

wosaiFs.genRouteByDirTree(dirTree).forEach((route) => {
  //console.log(route);
  app.use(route.route, require(route.path));
});


app.use(require('less-middleware')(path.join(__dirname, 'public')));
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
