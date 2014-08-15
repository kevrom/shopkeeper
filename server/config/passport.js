var LocalStrategy = require('passport-local').Strategy,
    GoogleStrategy = require('passport-google').Strategy

var orm = require('../lib/model'),
    User = orm.model('User')


exports.init = function(app, passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id)
    })
    passport.deserializeUser(function(id, done) {
        User.find({ 
            where: { id: id }
        }).success(function(user) {
            done(null, user)
        }).error(function(err) {
            done(err, null)
        })
    })

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(fld, password, done) {
        console.error('LocalStrategy login');

        User.find({
            where: { email: fld }
        }).error(function (err) {
            console.log("ERROR: " + err);
            return done(err);
        }).success(function(user) {
            //console.log(user)
            if (!user) {
                console.log('Invalid user')
                return done(null, false, { message: 'Invalid user' })
            }
            if (!user.authenticate(password)) {
                console.log('User did not authenticate')
                return done(null, false, { message: 'Invalid password' })
            }
            console.log('Local login successful')
            return done(null, user)
        })
    }))

    // passport.use(
    //     new GoogleStrategy({
    //         returnURL: 'http://localhost:8080/auth/google/return',
    //         realm: 'http://localhost:8080'
    //     },
    //     function(identifier, profile, done) {
    //         process.nextTick(function() {
    //             profile.identifier = identifier
    //             return done(null, profile)
    //         })
    //     })
    // )
}