var express = require('express');
var mongojs = require('mongojs');
var bodyParser = require('body-parser');


var app = express();
var http = require('http').Server(app);
var port = 3000;
var db = mongojs('node',['master','node','pos']);

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

var timestamp= new Date().getTime();

app.all('/*', function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "http://localhost:8100");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
	res.header("Content-Type", "application/x-www-form-urlencoded");
	next();
});

http.listen(port, function () {
	console.log("server is running now at http://localhost:"+port);
	//console.log(timestamp)
	//timeStampTime();
})


app.get('/api/allNode',function(req,res){      //sent data from server to app.js (pass docs) 
	db.node.find({},function(err,node){   //query database
		res.send(node);
	});
});    

app.post('/api/allNode', function(req, res){
	console.log(req.body);
}); 

app.get('/api/allMaster',function(req,res){      //sent data from server to app.js (pass docs) 
	db.master.find({},function(err,master){   //query database
		res.send(master); 
	});  	
});     		


app.get('/api/allPos',function(req,res){      //sent data from server to app.js (pass docs) 
	db.pos.find({},function(err,pos){   //query database
		res.send(pos); 
	});  
});


app.get('/api/nodeByDomain',function(req,res){      //sent data from server to app.js (pass docs) 
	//console.log(req);
	db.node.find({domain : { $exists : true }, location : {$exists : true}},function(err,node){   //query database		
			res.send(node); 
	});  
});


app.get('/api/nodeMark',function(req,res){
	db.node.find({},function(err,node){   //query database		
			res.send(node); 
	});  
});




app.post('/api/shareNode',function(req,res){
	//console.log(req.body);
	db.node.insert((req.body),function(err,data){
		console.log(data);
	});
	res.send(req.body);
});

function findByTimeStamp(Time){
	db.node.find({timestamp:{$gte:Time}},function(err,node){
		console.log(node)
	});
}

function timeStampTime(){
	setInterval(function(){
		findByTimeStamp(timestamp);	
		timestamp= new Date().getTime();		
		console.log(timestamp)
	},60000)
}

