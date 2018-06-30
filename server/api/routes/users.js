const user = require('../controllers/users');
const auth = require('../controllers/auth');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

module.exports = app => {
  app.post('/api/v1/users/signup', upload.single('avatar'), user.signup);
  app.get('/api/v1/users/:id', user.getUserById);
  app.post('/api/v1/users/signin', auth.signin);
  app.use('/api/v1/users/', auth.verifyAccessToken);
  app.get('/api/v1/users/', user.getUsers);
  app.get('/api/v1/users/:id/posts', user.getPostsFromUser);
  app.put('/api/v1/users/', user.editUser);
  app.delete('/api/v1/users/', user.deleteUser);
};
