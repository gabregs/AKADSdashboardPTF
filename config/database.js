const { Sequelize } = require('sequelize');
module.exports = new Sequelize('akadsmysql', 'root', 'Pluck388', {
    host: 'localhost',
    dialect: 'mysql' 
  });
