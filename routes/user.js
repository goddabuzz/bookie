exports.user = {};
// Getter
exports.user.get = function(req, res) {
  res.render('index', { title: 'Get user' });
};

// Setter
exports.user.set = function(req, res) {
    res.render('index', { title: 'Set user'});
};