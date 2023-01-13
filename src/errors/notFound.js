function notFound (req, res, next) {
  next({ status: 404, message: `Path not found: ${req.orignalUrl}` });
}

module.exports = notFound;