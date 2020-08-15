const Sequelize = require('sequelize');
const db = require('../config/database');

const Session = db.define('session', {

    session_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    tutor_email: {
        type: Sequelize.STRING
    },

    parent_email: {
        type: Sequelize.STRING
    },

    subject: {
        type: Sequelize.ENUM('ENG','SCI','MATH','FIL')
    },

    tutorial_date: {
        type: Sequelize.STRING
    },

    tutorial_time: {
        type: Sequelize.STRING
    },

    session_duration: {
        type: Sequelize.INTEGER,
        allowNull: false 
    },

    student_name: {
        type: Sequelize.STRING
    },

    grade_level: {
        type: Sequelize.INTEGER
    },

    topic: {
        type: Sequelize.STRING
    },

    special_requests: {
        type: Sequelize.TEXT
    },

    zoomlink: {
        type: Sequelize.STRING
    },

    ispaid: {
        type: Sequelize.TINYINT
    },

    isdone: {
        type: Sequelize.TINYINT
    },

    tutor_name: {
        type: Sequelize.STRING
    }
}, {
    timestamps: false
    }
);

module.exports = Session;