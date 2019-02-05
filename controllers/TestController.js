'use string';

module.exports = function(app) {
    app.get('/Test/test_page', function (req, res) {
        res.render('./Test/test_page');
    })
}