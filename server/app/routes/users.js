const user = require('../controllers/users');
const auth = require('../controllers/auth');

module.exports = function (app) {
    app.post('/api/users/signin', auth.signin);
    app.post('/api/users/', user.newUser);
    app.use('/api/users/', auth.verifyAccessToken);
    app.get('/api/users/', user.getUsers);
    app.get('/api/users/:id', user.getUserById);
    app.get('/api/users/:id/posts', user.getPostsFromUser);
    app.put('/api/users/', user.editUser);
    app.delete('/api/users/', user.deleteUser);
}