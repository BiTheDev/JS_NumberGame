var express = require("express");
var session = require('express-session');
console.log("Let's find out what express is", express);
// invoke express and store the result in the variable app
var app = express();
console.log("Let's find out what app is", app);
var path = require('path');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname, "./static")));
app.use(session({
    secret: 'keyboardkitteh',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
  }))
var score = Math.floor(Math.random() * 100);
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.get('/', function(request, response) {
    if(!request.session.guess){
        request.session.hide = "hidden";
        request.session.hidetxt = "text";
        request.session.btn = "submit";
    }
    request.session.score = score;
    request.session.save()
    console.log(request.session.score);
    var context = {
        guess : request.session.guess,
        box  :request.session.box,
        txt : request.session.txt,
        hide : request.session.hide,
        hidetxt : request.session.hidetxt,
        btn : request.session.btn
    }
    response.render('index', context);
})
app.post('/play', function(request,response){
    var guess = request.body.guess;
    if(guess > request.session.score){
        request.session.box = "high";
        request.session.txt = "Too High";
        console.log("too high");
    }else if(guess < request.session.score){
        request.session.box = "low";
        request.session.txt = "Too Low";
        console.log("Too Low");
    }else{
        request.session.box = "correct";
        request.session.txt = "You Got it";
        request.session.hide = "submit";
        request.session.hidetxt = "hidden";
        request.session.btn = "hidden";
        console.log("You Got it");
    }
    request.session.guess = guess;
    request.session.save();
    response.redirect('/');
})

app.post('/reset', function(request,response){
    score = Math.floor(Math.random() * 100)
    request.session.destroy();
    response.redirect('/');
})

app.listen(8000, function() {
    console.log("listening on port 8000");
  })