var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const dayjs = require('dayjs');
const request = require('request');
  const 
  botKey = "my bot token",
  clientId = "my client id",
  day = dayjs().format('YYYY년 MM월 DD일 HH시 mm분 ss초'),
  res_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress,
  error_text = "[teleMe] [ERROR] "+ res_ip + "에서 "+ day + "에 해당 오류가 발생하였습니다. \n\n" + res.locals.message;
    request(`https://api.telegram.org/bot${botKey}/sendmessage?chat_id=${clientId}&text=${encodeURI(error_text)}`, 
      function (error, response, body) { 
        if(!error){
          if(response.statusCode === 200){ console.log("에러 전송 성공") }
            } else { console.error("요청 전송을 실패하였습니다.") }
        });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
