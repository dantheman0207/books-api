'use strict';
module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: DataTypes.STRING,
        email: DataTypes.STRING
    }, {
        classMethods: {
            associate: function (models) {
                // associations can be defined here
                User.hasMany(models.Book);
            }
        }
    });
    return User;
};