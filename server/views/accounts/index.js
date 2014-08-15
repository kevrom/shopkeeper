var orm = require('../../lib/model'),
    Seq = orm.Seq(),
    User = orm.model('User')

exports.index = function(req, res) {
    res.render('accounts/index', {
        user: req.user,
        title: 'Shopkeeper | Account Management'
    })
}

exports.login = function(req, res) {
    res.render('accounts/login', {
        user: req.user,
        title: 'Shopkeeper | Login'
    })
}

exports.logout = function(req, res) {
    req.logout()
    res.redirect('/')
}

exports.register = function(req, res) {
    if (req.body.password === req.body.password_repeat) {
        console.log(req.body)
        var user = User.build({
            email: req.body.email,
            name: req.body.name,
            provider: 'local',
            isActive: true,
            isAdmin: false
        })
        user.setPassword(req.body.password)
        user.save().success(function(user) {
            console.log('Successfully created user ' + user.email)
            console.log(user)
            req.login(user, function(err) {
                if (err) throw new Error('Login failed.')            
                res.redirect('/s')
            })
        })
    } else {
        res.render('accounts/login', {
            title: 'Shopkeeper | Login',
            errors: 'Passwords do not match.'
        })
    }
}