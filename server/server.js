var express = require('express'),
    passport = require('passport'),
    expressValidator = require('express-validator'),
    http = require('http'),
    path = require('path'),
    RedisStore = require('connect-redis')(express)

var app = express()

require('./lib/model').setup(__dirname + '/models', 'node-shopkeeper', 'bobdole', 'oneoneoneone',
    {
        port: 5432,
        dialect: 'postgres'
    })

require('./initDB')

require('./config/passport').init(app, passport)

app.configure(function() {
    app.set('port', process.env.PORT || 8010)
    app.set('views', __dirname + '/views')
    app.set('view engine', 'jade')
    app.locals.pretty = true
    app.use(express.favicon())
    app.use(express.logger('dev'))
    app.use(express.bodyParser())
    app.use(expressValidator)
    app.use(express.cookieParser())
    app.use(express.session({
        secret: 'nottherealsecret',
        store: new RedisStore,
        cookie: { secure: false, maxAge:86400000 }
    }))
    app.use(express.methodOverride())
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(app.router)
    app.use(require('stylus').middleware({
        src: path.resolve(__dirname, '../client'),
        compile: require('./lib/utilities').compile
    }))
})

app.configure('development', function() {
    app.use(express.errorHandler())
    app.use(express.static(path.resolve(__dirname, '../client')))
})

// URLs
require('./routes')(app)

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'))
})
