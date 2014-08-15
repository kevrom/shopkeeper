var orm = require('../lib/model'),
    Seq = orm.Seq(),
    crypto = require('crypto')

module.exports = {
    model: {
        id: {
            type: Seq.INTEGER,
            primaryKey: true,
            authIncrement: true
        },
        name: {
            type: Seq.STRING,
            validate: {
                notEmpty: true
            }
        },
        email: {
            type: Seq.STRING,
            unique: true,
            validate: {
                isEmail: true,
                notEmpty: true
            }
        },
        provider: {
            type: Seq.STRING
        },
        hashed_password: {
            type: Seq.STRING,
            validate: {
                notEmpty: true
            }
        },
        salt: {
            type: Seq.STRING
        },
        isAdmin: {
            type: Seq.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        isActive: {
            type: Seq.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    relations: {
        hasMany: "Drawing",
        hasMany: "Machine",
        hasMany: "Program"
    },
    options: {
        _password: '',
        classMethods: {},
        instanceMethods: {
            authenticate: function(plainText) {
                return this.encryptPassword(plainText) === this.hashed_password;
            },
            encryptPassword: function(password) {
                return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
            },
            getPassword: function() {
                return this._password;
            },
            makeSalt: function() {
                var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
                var salt = '';
                for (var i = 0; i < 10; i++) {
                    var p = Math.floor(Math.random() * set.length);
                    salt += set[p];
                }
                return salt;
            },
            setPassword: function(password) {
                this._password = password;
                this.salt = this.makeSalt();
                this.hashed_password = this.encryptPassword(password);
            }
        }
    }
}