const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

const errorHandler = (error, req, res, next) => {

  res.status(500).json({error: error.message})

  next(error)
}

module.exports = {
  blogFinder,
  errorHandler
}
