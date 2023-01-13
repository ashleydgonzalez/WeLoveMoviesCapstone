const service = require('./reviews.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const methodNotAllowed = require('../errors/methodNotAllowed');

async function reviewIsValid(req, res, next) {
  const review = await service.read(req.params.reviewId);
  // const { reviewId } = req.params;
  // const matchingReview = await service.read(reviewId)
  if (review) {
    res.locals.review = review;
    return next();
  }
  next({ status: 404, message: 'Review cannot be found' });
};

async function destroy(req, res) {
  await service.destroy(res.locals.review.review_id);
  res.sendStatus(204);
};

async function list(req, res) {
  const data = await service.list(req.params.movieId);
  res.json({ data });
};

function hasMovieIDInPath(req, res, next) {
  if(req.params.movieId) {
    return next();
  }
  methodNotAllowed(req, res, next);
};

function noMovieIDInPath(req, res, next) {
  if(req.params.movieId) {
    return methodNotAllowed(req, res, next);
  }
  next();
};

async function update(req, res) {
  const updatedReview = { 
    ...res.locals.review,
    ...req.body.data,
    review_id: res.locals.review.review_id
  };
  const data = await service.update(updatedReview);
  res.json({ data })
};

module.exports = {
  delete: [
    noMovieIDInPath,
    asyncErrorBoundary(reviewIsValid), 
    asyncErrorBoundary(destroy)
  ],
  list: [hasMovieIDInPath, asyncErrorBoundary(list)],
  update: [
    noMovieIDInPath,
    asyncErrorBoundary(reviewIsValid), 
    asyncErrorBoundary(update)
  ],
};