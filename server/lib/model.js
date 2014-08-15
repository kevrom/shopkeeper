var filesystem = require('fs'),
    _ = require('underscore')

var models = {},
    relationships = {}

var singleton = function singleton() {
    var Sequelize = require("sequelize"),
        sequelize = null,
        modelsPath = ""

    this.setup = function(path, database, username, password, obj) {
        modelsPath = path
        switch (arguments.length) {
            case 3:
                sequelize = new Sequelize(database, username)
            case 4:
                sequelize = new Sequelize(database, username, password)
            case 5:
                sequelize = new Sequelize(database, username, password, obj)
            break
        }       
        init()
    }

    this.model = function(name) {
        return models[name]
    }

    this.Seq = function() {
        return Sequelize
    }

    function init() {
        filesystem.readdirSync(modelsPath).forEach(function(name) {
            var object = require(modelsPath + "/" + name)
            var options = object.options || {}
            var modelName = name.replace(/\.js$/i, "")
            models[modelName] = sequelize.define(modelName, object.model, options)
            if ("relations" in object) {
                relationships[modelName] = object.relations
            }
        })
        //console.log(models)
        for (var name in relationships) {
            var relation = relationships[name]
            for (var relName in relation) {
                var related = relation[relName]
                //console.log(related)
                models[name][relName](models[related])
            }
        }
    }

    if (singleton.caller != singleton.getInstance) {
        throw new Error("This object cannot be instanciated")
    }
}

singleton.instance = null

singleton.getInstance = function() {
    if (this.instance === null) {
        this.instance = new singleton()
    }
    return this.instance
}

module.exports = singleton.getInstance()