const path = require('path');
module.exports = {
  MEDIA_ROOT: path.join(__dirname, '../media'),
  PORT: 3000,
  ALLOWED_EXTENSIONS: ['.mp4', '.mkv', '.avi', '.mov']
};
