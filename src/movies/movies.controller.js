const service = require('./movies.service')
const asyncErrorBoundary = require('../errors/asyncErrorBoundary')

async function movieIsValid (req, res, next) {
  const movie = await service.read(req.params.movieId)
  if (movie) {
    res.locals.movie = movie
    console.log(movie)
    return next()
  }
  next ({ status: 404, message: 'Movie cannot be found' })
}

async function read (req, res, next) {
  res.json ({ data: res.locals.movie })
}

async function list (req, res) {
  
  const data = await service.list(req.query.is_showing)
  res.json({ data })
}






module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieIsValid), asyncErrorBoundary(read)],
  
}