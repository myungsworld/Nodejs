const Sequelize = require(`sequelize`);
const path = require('path');
const env = "development";
const config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
const db = {};

var sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize,Sequelize);

module.exports = db;



