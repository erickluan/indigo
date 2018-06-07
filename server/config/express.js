let express = require('express');
let bodyParser = require('body-parser');
let path = require('path');

let userRoutes = require('../app/routes/users');
let postRoutes = require('../app/routes/posts');

module.exports = function () {
    let app = express();
    app.set('port', 3000);
    app.use(express.static('./public'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    userRoutes(app);
    postRoutes(app);

    return app;
}