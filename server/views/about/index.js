exports.index = function(req, res) {
    res.render('about/index', {
        user: req.user,
        active: 'about',
        title: 'Shopkeeper - Machine Shop Organizer'
    }
)}