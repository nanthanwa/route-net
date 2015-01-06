var Oriento = require('oriento');


module.exports = function() {
	var orientoServer = Oriento({
		host: 'localhost',
		port: 2424,
		username: 'root',
		password: 'BB98D4287F23079A848205C13C5421A4DF7C20B37DD028AD888C567AF88365FF'
	});

	orientoServer.list()
	.then(function (dbs) {
		console.log('There are ' + dbs.length + ' databases on the server.');
	});

	orientoServer.create({
		name: 'mydb',
		type: 'graph',
		storage: 'plocal'
	})
	.then(function (db) {
		console.log('Created a database called ' + db.name);
	});
}