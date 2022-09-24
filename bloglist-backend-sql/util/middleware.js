const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const { Blog, User, ServerSession } = require('../models')

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
      return res.status(401).json({
        errorMessage: 'Missing or Invalid Token.'
      })
  }

  next()
}

const userExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  const decodedToken = jwt.verify(authorization.substring(7), SECRET)

  if (!req.token || !decodedToken.id) {
      req.user = null
  }
  else {
      req.user = await User.findByPk(decodedToken.id)
  }

  next()
}

const serverSessionExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  const token = authorization.substring(7)
  
  const session = await ServerSession.findOne({
    where: {
      token: token
    }
  })

  if (!token) {
    req.session = null
  }
  else {
    req.session = session
    next()
  }
}

const errorHandler = (error, req, res, next) => {

  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      errorName: error.name,
      errorMessage: 'Invalid token.'
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
  userExtractor,
  serverSessionExtractor,
  errorHandler
}
