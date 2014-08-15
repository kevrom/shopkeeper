var passport = require('passport')

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next() }
    res.redirect('/login')
}

module.exports = function(app) {

    // Main index
    app.get('/', require('./views/index').index)
    app.all('/s*', ensureAuthenticated, require('./views/shop/index').init)
    app.get('/partials/:model/:action', require('./views/shop/index').partials)

    // Local auth
    app.post('/auth/local',
        passport.authenticate('local', { failureRedirect: '/login' }),
        function(req, res) { res.redirect('/s') })

    // Google auth
    // app.get('/auth/google',
    //     passport.authenticate('google', { failureRedirect: '/login' }),
    //     function(req, res) { res.redirect('/') })
    // app.get('/auth/google/return',
    //     passport.authenticate('google', { failureRedirect: '/login' }),
    //     function(req, res) { res.redirect('/') })

    // About
    app.get('/about', require('./views/about/index').index)

    // Contact Us
    app.get('/contactus', require('./views/contactus/index').index)

    // Account
    app.get('/u', ensureAuthenticated, require('./views/accounts/index').index)
    app.get('/login', require('./views/accounts/index').login)
    app.get('/logout', require('./views/accounts/index').logout)
    app.post('/register', require('./views/accounts/index').register)

    // API v1
    var API = require('./api/v1')(app)
    app.all('/api*', ensureAuthenticated)

    app.get('/api/v1/drawings', API.Drawing.list)
    app.get('/api/v1/drawings/:id', API.Drawing.find)
    app.post('/api/v1/drawings', API.Drawing.create)
    app.put('/api/v1/drawings/:id', API.Drawing.update)
    app.delete('/api/v1/drawings/:id', API.Drawing.delete)

    app.get('/api/v1/programs', API.Program.list)
    app.get('/api/v1/programs/:id', API.Program.find)
    app.post('/api/v1/programs', API.Program.create)
    app.put('/api/v1/programs/:id', API.Program.update)
    app.delete('/api/v1/programs/:id', API.Program.delete)

    app.get('/api/v1/machines', API.Machine.list)
    app.get('/api/v1/machines/:id', API.Machine.find)
    app.post('/api/v1/machines', API.Machine.create)
    app.put('/api/v1/machines/:id', API.Machine.update)
    app.delete('/api/v1/machines/:id', API.Machine.delete)

}