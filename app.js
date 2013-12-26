//====================================================
//	Initial Setup code...
//====================================================

var express = require('express');
var routes = require('./routes/routes.js');
var app = express();

app.use(express.bodyParser());
// app.use(express.logger("default"));
// set up cookies
app.use(express.cookieParser());
app.use(express.session({secret: 'thisIsMySecret'}));
app.use('/', express.static(__dirname + "/public",{maxAge:1}));

app.configure(function(){
	app.use(function(req,res,next){
		res.setHeader("Cache-Control", "no-cache, must-revalidate");
		return next();
	});
});

app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.set('port', process.env.PORT || 8080);

//====================================================
//	Routes Setup
//====================================================

app.get('/', routes.getPennPolls);
app.post('/createaccount', routes.postCreateAccount);
app.get('/home/:id', routes.getHomePage);
app.post('/newPoll', routes.postNewPoll);
app.get('/checklogin', routes.getCheckLogin);

// Examples from old code...
// app.get('/', routes.get_login);
// app.post('/checklogin', routes.post_checklogin);
// app.get('/signup', routes.get_signup);
// app.get('/home/:user', routes.get_profile);
// // app.post('/deletestatus', routes.post_deletestatus);
// app.get('/edit/:profile', routes.get_editprofile);
// app.post('/edit/:profile', routes.post_editprofile);
// // app.post('/comment', routes.post_comment);

//====================================================
//	Run the Server
//====================================================

app.listen(app.get('port'));
console.log('Server on 8080 ===========================');