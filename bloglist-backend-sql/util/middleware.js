const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
      console.log(req.decodedToken)
  }
  else {
      req.decodedToken = null
      return res.status(401).json({ error: 'Missing token.' })
  }

  next()
}

const errorHandler = (error, req, res, next) => {

  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token.'
    })
  }
  
  res.status(500).json({
    errorName: error.name,
    errorMessage: error.message,
  })

  next(error)
}

module.exports = {
  blogFinder,
  tokenExtractor,
  errorHandler
}
