const Sequelize = require('sequelize');
const db = require('../config/database');

const Request = db.define('request', {

    request_id: {
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

    is_taken: {
        type: Sequelize.TINYINT
    }
}, {
    timestamps: false
    }
);

module.exports = Request;