exports.init = function(req, res) {
    res.render('shop/index', {
        user: req.user,
        active: 'shop',
        title: 'Shopkeeper | Web App'
    })
}

exports.partials = function(req, res) {
    res.render('shop/' + req.params.model + '/' + req.params.action, {
        title: '',
    })
}