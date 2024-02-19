var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// #################
require('dotenv').config();
const pg = require('pg');
const client = new pg.Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  max: 3,
})

client.connect(err => {
  if (err) {
    console.log('Failed to connect db ' + err)
  } else {
    console.log('Connect to db done!')
  }
})

// #################

var app = express();

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

  const dayjs = require('dayjs');
  const request = require('request');
    const 
    day = dayjs().format('YYYY년 MM월 DD일 HH시 mm분 ss초'),
    res_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    error_text = "[teleMe] [ERROR] "+ res_ip + "에서 "+ day + "에 해당 오류가 발생하였습니다. \n\n" + res.locals.message;
      request(`https://api.telegram.org/bot${process.env.TELE_API_KET}/sendmessage?chat_id=${process.env.TELE_SEND_ID}&text=${encodeURI(error_text)}`, 
        function (error, response, body) { 
          if(!error){
            if(response.statusCode === 200){ console.log("에러 전송 성공") }
              } else { console.error("요청 전송을 실패하였습니다.") }
          });

  res.render('error');
});


app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/test-timeout', async (req, res) => {
  const start = new Date();
  try {
    await client.query('SELECT pg_sleep(3);');
    const lag = new Date() - start;
    console.log(`Lag: \t${lag} ms`);
  } catch (e) {
    const lag = new Date() - start;
    console.log(`Lag: \t${lag} ms`);
    console.error('pg error', e);
  }

  res.send('test-timeout!');
});


module.exports = app;
