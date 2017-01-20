'use strict';
module.exports = function (sequelize, DataTypes) {
    var Notes = sequelize.define('Notes', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: DataTypes.STRING,
        pg: DataTypes.STRING,
        endPg: DataTypes.STRING,
        content: DataTypes.TEXT
    }, {
        classMethods: {
            associate: function (models) {
                // associations can be defined here
                Notes.belongsTo(models.Book, {onDelete: 'cascade'});
                Notes.hasMany(models.Resource);
            }
        }
    });
    return Notes;
};