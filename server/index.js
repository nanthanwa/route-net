var express = require('express');
var mongojs = require('mongojs');
var bodyParser = require('body-parser');


var app = express();
var http = require('http').Server(app);
var port = 3000;
var db = mongojs('node',['master','node','pos','tmpnode']);

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

var timestamp= new Date().getTime();
var temp=[];
var ListCheck=[]


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
	timeStampTime();
	//updateValue();	
	//nearNode();
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
			res.send("Update Success");
});


//for Server Update 
function updateNode(){
	setInterval(function(){
	db.node.find({},function(err, node){
		for(var i = 0 ; i < node.length ; i++){

			// console.log("=====================");
			// console.log(node[i].loc.coordinates[1]);

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
		console.log("TimeSTampppp!!")
	db.node.find({timestamp:{$gte:Time}},function(err,node){	
		//console.log(node)
		db.tmpnode.insert(node,function(){
			for(var i=0;i<node.length;i++){
				nearNode(node[i])
			}
		})
		
		
	});
	ListCheck=[]
}

function timeStampTime(){
	setInterval(function(){
		findByTimeStamp(timestamp);	
		timestamp= new Date().getTime();		
		console.log(timestamp)
	},30000);
}



function Posibility(node){
	db.pos.find({UUID:node.UUID},function(err,posnode){
		console.log(posnode)
	})
}



function nearNode(nearnd){
	var node_list=[]
	//console.log(nearnd)
	db.tmpnode.find({loc:{$near:{
		type:"Point",
		coordinates:[nearnd.loc.coordinates[0],nearnd.loc.coordinates[1]]
	},
	$maxDistance:500
	}},function(err,nodes){
		console.log("NEARNODE  SUCCESS")
		//console.log(nodes)
		updateValue(nodes)		
	})	
}



function updateValue(nodes){
	var UUID_list=[]					//example data  for  loop push in arraylist UUID
	for(var i=0;i<nodes.length;i++){
		UUID_list.push(nodes[i].UUID)
	}
	

	if(ListCheck.length==0){
		ListCheck.push(UUID_list)
	}
	var hash = {};
	for(var i = 0 ; i < ListCheck.length; i += 1) {
    	hash[ListCheck[i]] = i;
	}
	if(hash.hasOwnProperty(UUID_list)) {
    	
	}
	console.log(ListCheck)



	data={type:"bus",
		name:"A43"}

	db.pos.find({domain:{$elemMatch:data}},function(err,Posnode){		
		if(Posnode!=[]){
			for(var i=0;i<Posnode.length;i++){
				//db.pos.update({domain:{$elemMatch:data}},{$inc:{"domain.$.value":0.02}},{multi:true})
				db.pos.update({$and:[{UUID:{$in:UUID_list}},{domain:{$elemMatch:data}}]},{$inc:{"domain.$.value":0.01}},{multi:true})
			}
		}			
	})

	db.tmpnode.remove({});
}

