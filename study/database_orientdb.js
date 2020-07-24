const OrientDBClient = require("orientjs").OrientDBClient;

OrientDBClient.connect({
  host: "localhost",
  port: 2424
}).then(client => {
  return client.close();
}).then(()=> {
   console.log("Client closed");
});

client.session({ name: "demodb", username: "admin", password: "admin" })
.then(session => {
	// use the session
	console.log('orientdb')
	// close the session
	return session.close();
});