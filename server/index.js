var express = require('express');
var mongojs = require('mongojs');
var bodyParser = require('body-parser');


var app = express();
var http = require('http').Server(app);
var port = 3000;
var db = mongojs('node',['master','node','pos']);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());


http.listen(port, function () {
	console.log("server is running now at http://localhost:"+port);
})


app.get('/api/allNode',function(req,res){      //sent data from server to app.js (pass docs) 
	db.node.find({},function(err,node){   //query database
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
		res.send(node); 
	});  

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



function findByDID(DID){
	db.master.find({DID:DID},function(err,master){
		res.send(master)
	});
}

