const Sequelize = require('sequelize');
const db = require('../config/database');

const Tutor = db.define('tutor', {

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
    },

    subject: {
        type: Sequelize.ENUM('ENG','SCI','MATH','FIL')
    },

    tutor_experience: {
        type: Sequelize.TEXT
    },
    gov_id: {
        type: Sequelize.BLOB
    },

    transcript: {
        type: Sequelize.BLOB 
    },

    isaccepted: {
        type: Sequelize.TINYINT
    }
}, {
    timestamps: false
    }
);

module.exports = Tutor;