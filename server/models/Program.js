var orm = require('../lib/model'),
    Seq = orm.Seq()

module.exports = {
    model: {
        id: {
            type: Seq.INTEGER,
            primaryKey: true,
            authIncrement: true
        },
        number: {   // required
            type: Seq.STRING
        },
        location: {
            type: Seq.STRING,
            defaultValue: '',
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
        belongsTo: "Drawing",
        belongsTo: "Machine"
    },
    options: {
        classMethods: {},
        instanceMethods: {}
    }
}