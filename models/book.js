'use strict';
module.exports = function (sequelize, DataTypes) {
    var Book = sequelize.define('Book', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        isbn: DataTypes.CHAR(13),
        lastPg: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function (models) {
                // associations can be defined here
                Book.belongsTo(models.User, {onDelete: 'cascade'});
                Book.hasMany(models.Notes);
            }
        }
    });
    return Book;
};