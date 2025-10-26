function contentTypeFor(ext) {
  switch (ext) {
    case '.mp4': return 'video/mp4';
    case '.mkv': return 'video/x-matroska';
    case '.avi': return 'video/x-msvideo';
    case '.mov': return 'video/quicktime';
    default: return 'application/octet-stream';
  }
}
module.exports = { contentTypeFor };
