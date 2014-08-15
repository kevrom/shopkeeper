exports.index = function(req, res) {
    res.render('contactus/index', {
        user: req.user,
        active: 'contactus',
        title: 'Shopkeeper - Machine Shop Organizer'
    }
)}