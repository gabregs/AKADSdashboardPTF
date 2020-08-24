const Sequelize = require('sequelize');
const db = require('../config/database');

const User = db.define('user', {

        email: {
            type: Sequelize.STRING,
            primaryKey: true
        },

        fname: {
            type: Sequelize.STRING
        },

        lname: {
            type: Sequelize.STRING
        },

        password: {
            type: Sequelize.STRING
        }
        
    }, {
        timestamps: false
    }
);

module.exports = User;