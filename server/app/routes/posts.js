const auth = require('../controllers/auth');
const post = require('../controllers/posts');

module.exports = function (app) {
    app.get('/api/posts/:id', post.getPostById);
    app.get('/api/posts/', post.getPosts);
    app.use('/api/posts/', auth.verifyAccessToken);
    app.post('/api/posts/', post.newPost);
    app.get('/api/posts/:id/users', post.getUserFromPost);
    app.put('/api/posts/:id', post.editPost);
    app.delete('/api/posts/:id', post.deletePost);
}