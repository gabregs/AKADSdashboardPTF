const { Sequelize } = require('sequelize');
module.exports = new Sequelize('akadsmysql', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql' 
  });
