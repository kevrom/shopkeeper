var path = require('path'),
    Sequelize = require('sequelize'),
    modelsPath = path.resolve(__dirname, "../models")

var sequelize = new Sequelize('node-shopkeeper', 'kevrom', 'onetwo12',
    {
        port: 5432,
       	dialect: 'postgres'
    })

var db = {
	User: sequelize.import(modelsPath + '/user'),
    Drawing: sequelize.import(modelsPath + '/drawing'),
    Program: sequelize.import(modelsPath + '/program'),
    Machine: sequelize.import(modelsPath + '/machine'),
    Relationships: function() {
        db.User
            .hasMany(db.Drawing)
            .hasMany(db.Program)
            .hasMany(db.Machine)
        db.Drawing
            .belongsTo(db.User)
            .hasMany(db.Program)
        db.Program
            .belongsTo(db.User)
            .belongsTo(db.Machine)
            .belongsTo(db.Drawing)
        db.Machine
            .belongsTo(db.User)
            .hasMany(db.Program)
        console.log("RelationshipsS")
    }
}


module.exports = db