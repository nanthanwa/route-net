var express = require('express');
var mongojs = require('mongojs');
var bodyParser = require('body-parser');
var underscore = require('underscore');

var app = express();
var http = require('http').Server(app);
var port = 3000;
var db = mongojs('node',['master','node','pos','tmpnode','profile']);

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

var timestamp= new Date().getTime();
var temp=[];
var ListCheck=[];


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
		//'node.timestamp':{$gt:timestamp}
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

	//save new node in table node
	db.node.remove({UUID:req.body.UUID})
	db.node.insert(req.body)

	db.pos.remove({UUID:req.body.UUID})
	db.pos.insert({
		UUID:req.body.UUID,
		timestamp:req.body.timestamp,
		domains:[
				{
					type:req.body.domains.type,
					name:req.body.domains.name,
					value:80
				}
			]
		},
		function(err,data){  //can use $push to insert indatabase
			console.log(data)
	})

	res.send(req.body);

	});

//Client
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
		findMasterNode();
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
	//decValue();  //decrete all value
	db.node.find({timestamp:{$gte:Time}},function(err,node){	
		db.tmpnode.insert(node,function(){
			for(var i=0;i<node.length;i++){
				nearNode(node[i])
			}
				
		})
	});
	listCheckclear();
	
}

function timeStampTime(){
	setInterval(function(){
		findByTimeStamp(timestamp);	
		
		timestamp= new Date().getTime();		
		console.log(timestamp)
	},10000);
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
		//updateValue(nodes)

		//console.log(nodes)		

	})	
}



function updateValue(nodes){
	var UUID_list=[]					//example data  for  loop push in arraylist UUID
	var check=0


	for(var i=0;i<nodes.length;i++){
		UUID_list.push(nodes[i].UUID)		
	}
	


	if(ListCheck.length==0){
		ListCheck.push(UUID_list)
		for(var i=0;i<UUID_list.length;i++)
		db.pos.find({UUID:UUID_list[i]},function(err,node){
			for(var j=0;j<node[0].domains.length;j++){
				data={type:node[0].domains[j].type
					,name:node[0].domains[j].name};

			db.pos.update({$and:[{UUID:{$in:UUID_list}},{domains:{$elemMatch:data}}]},{$inc:{"domains.$.value":0.05}},{multi:true})
			db.pos.update({$and:[{UUID:{$in:UUID_list}},{domains:{$not:{$elemMatch:data}}}]},{$push:{domains:data}},{multi:true})  //learn
			}
		})			
	}

	for(var i = 0 ; i < ListCheck.length; i += 1) {
		if(ListCheck[i].sort().toString()==UUID_list.sort().toString()){
			check=1;
		}
	}
	if(check==0){
		ListCheck.push(UUID_list)		
		for(var i=0;i<UUID_list.length;i++)
		db.pos.find({UUID:UUID_list[i]},function(err,node){
			for(var j=0;j<node[0].domains.length;j++){
				data={type:node[0].domains[j].type
					,name:node[0].domains[j].name};

			db.pos.update({$and:[{UUID:{$in:UUID_list}},{domains:{$elemMatch:data}}]},{$inc:{"domains.$.value":0.05}},{multi:true})
			db.pos.update({$and:[{UUID:{$in:UUID_list}},{domains:{$not:{$elemMatch:data}}}]},{$push:{domains:data}},{multi:true})  //learn
			}
		})		
	}



//	console.log(ListCheck)
	
	db.tmpnode.remove({});
}

function decValue(){
	db.pos.update({'domains.value':{$gt:0.07}},{$inc:{"domains.$.value":-0.07}},{ multi: true })
}


function listCheckclear(){
	ListCheck=[]
}


function findMasterNode(){
	var MasterNode=[]
	var tmp={}
	var tnode={}
	db.master.remove({})
	db.pos.find({'domains.value':{$gt:70}},function(err,node){
		for(var i=0;i<node.length;i++)
			for(var j=0;j<node[i].domains.length;j++){
				if(node[i].domains[j].value>70){
					console.log(node[i].domains[j].name)
					tmp=node[i].domains[j];
					saveMasterNode(node[i],node[i].domains[j]);
				}
			}		
	})
	
}

function saveMasterNode(node,value){
	//console.log(node)
	db.node.find({UUID:node.UUID},function(err,tnode){
		db.master.insert({node:tnode[0],pos:value})
	})
}


app.post('/api/getProfile',function(req,res){
	//console.log(req.body);
	db.profile.find(req.body,function(err,node){   //query database		
		res.send(node); 
	});  
});


app.post('/api/removeFav',function(req,res){
	console.log(req.body.UUID);
	//var domains = db.profile.findOne({"UUID": req.body.UUID}).domains;
	// domains.splice(req.body.index, 1);  
	// db.profile.update({"UUID": req.body.UUID}, {"$set" : {"domains" : domains}});
});


app.post('/api/lookingfor',function(req,res){

	console.log(req.body);
	db.master.find({$and:[{'pos.name':req.body.lookingfor},{'node.loc':{$near:{
		type:"Point",
		coordinates:[req.body.loc.coordinates[0],req.body.loc.coordinates[1]]
	},
	$maxDistance:1000

	}}]},function(err,node){
	console.log(node)
	res.send(node);	
	});	
});