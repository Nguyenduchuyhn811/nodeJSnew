var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


// tự viết  
require('dotenv').config();
console.log(process.env);
const fetch = require('node-fetch');
var expressLayouts = require('express-ejs-layouts');
const Database_store = require('nedb');

// tự viết
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// viết thêm vào đây để cấu hình định dạng html 
app.use(expressLayouts);
app.set('layout', 'backend');  //backend.ejs
//end 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// viết vào đây để đọc và biên dịch dữ liệu truyền vào hoặc xuất ra
// app.use(express.json('1mb'));
// end

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/items', require('./routes/items'));


// những hàm xử lý và truyền dữ liệu sang sẽ được điều hướng đến những chỗ này xử lý 
// app.use('/api', require('./routes/handling'));
const database = new Database_store('database.db');
database.loadDatabase();
app.get('/api', (req, res) =>{
	database.find({}, (err, data)=>{
		if (err) {
			res.end();
			return;
		}
		res.json(data);
	})
})

app.post('/api', (req, res) => {
  console.log('I have a request');
  console.log(req.body);
  const data = req.body;
  const timestamp_req_get = Date.now();
  data.timestamp = timestamp_req_get;
  database.insert(data);
  res.json({                      // response - trả ra giá trị gì 
	  status   : 'success',
	  timestamp: timestamp_req_get,
	  mood: data.mood,
	  latitude : data.lat,
	  longitude: data.lon
  })
});


app.post('/api_resource', async (req, res) => {
  var rs ;
  const data = req.body;
  console.log(data);
  const url = `https://dms.inet.vn/api/public/whois/v1/whois/directly`;
  const fetch_resourse = await fetch(url, {
    method: 'post',
    body:    JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  }).then(ressepose_inet => ressepose_inet.json()).then(response => rs = response);;
  

  // res.text();
  res.json(rs)
})
// end

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
