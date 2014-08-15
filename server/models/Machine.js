var orm = require('../lib/model'),
    Seq = orm.Seq()

module.exports = {
    model: {
        id: {
            type: Seq.INTEGER,
            primaryKey: true,
            authIncrement: true
        },
        name: {   // required
            type: Seq.STRING
        },
        number: {
            type: Seq.STRING,
            defaultValue: ''
        },
        description: {
            type: Seq.STRING,
            defaultValue: ''
        },
        notes: {
            type: Seq.TEXT,
            defaultValue: ''
        }
    },
    relations: {
        belongsTo: "User",
        hasMany: "Program"
    },
    options: {
        classMethods: {},
        instanceMethods: {}
    }
}