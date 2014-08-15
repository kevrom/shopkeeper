exports.index = function(req, res) {
    res.render('index', {
        user: req.user,
        active: 'home',
        title: 'Shopkeeper - Machine Shop Organizer'
    }
)}