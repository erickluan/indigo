const auth = require('../controllers/auth');
const post = require('../controllers/posts');

module.exports = function (app) {
    app.get('/api/v1/posts/:id', post.getPostById);
    app.get('/api/v1/posts/', post.getPosts);
    app.use('/api/v1/posts/', auth.verifyAccessToken);
    app.post('/api/v1/posts/', post.newPost);
    app.get('/api/v1/posts/:id/users', post.getUserFromPost);
    app.put('/api/v1/posts/:id', post.editPost);
    app.delete('/api/v1/posts/:id', post.deletePost);
}