var Oriento = require('oriento');


module.exports = function() {
	var orientoServer = Oriento({
		host: 'localhost',
		port: 2424,
		username: 'root',
		password: 'pass'
	});

	orientoServer.list()
	.then(function (dbs) {
		console.log('There are ' + dbs.length + ' databases on the server.');
	});

	/*orientoServer.create({
		name: 'mydb',
		type: 'graph',
		storage: 'plocal'
	})
	.then(function (db) {
		console.log('Created a database called ' + db.name);
	});*/
}