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
var temp=[];
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
	updateNode();
	//timeStampTime();
	updateValue();	
});


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
	db.node.find({domain : { $exists : true }, loc : {$exists : true}},function(err,node){   //query database	
			res.send(node);			
	});  
});


app.get('/api/nodeMark',function(req,res){
	db.node.find({},function(err,node){   //query database		
			res.send(node); 
	});  
});




app.post('/api/shareNode',function(req,res){
	console.log(req.body);
	/*db.node.insert((req.body),function(err,data){		
		//res.send(data);
	});*/
	db.pos.insert({UUID:req.body.UUID,
				timestamp:req.body.timestamp,
				domain:[{type:req.body.domain.type,name:req.body.domain.name,value:60}]},function(err,data){  //can use $push to insert indatabase
					console.log(data)
	})

	res.send(req.body);
});


app.post('/api/updateNode',function(req,res){
	
			db.node.update(
				{
					UUID : req.body.UUID
				},
				{
					$set:
				      {
				        timestamp: parseInt(new Date().getTime()),
				        loc:{type:"Point",coordinates:[req.body.loc.coordinates[0],req.body.loc.coordinates[1]]}
				      }
				},
				{
					multi: true
				}
			);
			res.send("Updat Success");
});


//for Server Update 
function updateNode(){
	setInterval(function(){
	db.node.find({},function(err, node){
		for(var i = 0 ; i < node.length ; i++){
			db.node.update(
				{
					UUID : node[i].UUID
				},
				{
					$set:
				      {
				        timestamp: parseInt(new Date().getTime()),
				        loc:{type:"Point",coordinates:[(node[i].loc.coordinates[0]),node[i].loc.coordinates[1]]}
				      }
				},
				{
					multi: true
				}
			);
		}
	});	
	},15000)
}



function findByTimeStamp(Time){
	db.node.find({timestamp:{$gte:Time}},function(err,node){
		allNode = node;
		//console.log("Node At Time >"+Time);
		//console.log(node);

	});
}

function timeStampTime(){
	setInterval(function(){
		findByTimeStamp(timestamp);	
		timestamp= new Date().getTime();		
		console.log(timestamp)
	},60000);
}



function Posibility(node){
	db.pos.find({UUID:node.UUID},function(err,posnode){
		console.log(posnode)
	})
}


function updateValue(){
	data={type:"bus",
		name:"A43"}
	db.pos.find({domain:{$elemMatch:{type:data.type,name:data.name}}},function(err,Posnode){
		
		if(Posnode!=[]){
			for(var i=0;i<Posnode.length;i++){
				db.pos.update({UUID:Posnode[i].UUID},{$set:{timestamp:1}},{multi:true})
		}
			console.log(Posnode)
		}
	})
}