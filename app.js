//require('./modules/mysqlPool').connectMysql;
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session=require('express-session');
const bodyParser = require('body-parser');
const wosaiFs = require('./modules/fs');
const  lessMiddleware = require("less-middleware");
const ueditor = require('ueditor');
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
app.use(require('./middleware/log'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 注册路由
const dirTree = wosaiFs.readDirDeepSync(path.resolve(__dirname, 'routes'));

wosaiFs.genRouteByDirTree(dirTree).forEach((route) => {
  app.use(route.route, require(route.path));
});

app.use("/ueditor/ueditor", ueditor(path.join(__dirname, 'public'), function(req, res, next) {
  // ueditor 客户发起上传图片请求
  if (req.query.action === 'uploadimage') {
    console.log('上传内容图片');
    var foo = req.ueditor;

    //var imgname = req.ueditor.filename;
    //console.log(req.ueditor);
    //var img_url = '/images/ueditor/';
    //var img_url = 'http://upay-side.dev.shouqianba.com/rpc/image/upload/';
    //你只要输入要保存的地址 。保存操作交给ueditor来做

    //这里操作本地上传图片到远程返回远程图片链接
    //先通过filename定位到图片位置   图片路径:  /images/ueditor/+filename
    res.ue_up();         //重命名并返回src 获取不到随机后的图片名
  }
  //  客户端发起图片列表请求
  else if (req.query.action === 'listimage') {
    var dir_url = '/images/ueditor/';
    //var dir_url = 'http://upay-side.dev.shouqianba.com/api/image/upload/';
    // 客户端会列出 dir_url 目录下的所有图片
    res.ue_list(dir_url);
  }
  // 客户端发起其它请求
  else {
    res.setHeader('Content-Type', 'application/json');
    res.redirect('/ueditor/nodejs/config.json');
  }
}));

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
