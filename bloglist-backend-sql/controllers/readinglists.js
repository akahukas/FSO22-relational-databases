const router = require('express').Router()

const { Blog, Readinglist, User } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.post('/', async (req, res) => {
  const blog = await Blog.findByPk(req.body.blog_id)
  const user = await User.findByPk(req.body.user_id)

  if (!blog || !user) {
    res.status(404).json({
      errorMessage: 'Blog or user not found.'
    })
  }
  else {
    const newReadinglist = await Readinglist.create({
      userId: req.body.user_id,
      blogId: req.body.blog_id,
      read: req.body.read
    })
    res.json(newReadinglist)
  }
})

router.put('/:id', tokenExtractor, async (req, res) => {
  if (!req.decodedToken) {
    res.status(401).json({
      errorMessage: 'Missing or Invalid Token.'
    })
  }
  else {
    
    const user = await User.findByPk(req.decodedToken.id)
    const userJson = user.toJSON()
    
    if (userJson.disabled) {
      return res.status(403).send({
        errorMessage: 'Session expired.'
      })
    }

    const readinglist = await Readinglist.findByPk(req.params.id)

    if (req.decodedToken.id !== readinglist.userId) {
      res.status(403).json({
        errorMessage: 'Modification forbidden, this readinglist is not yours.'
      }).end()
    }

    readinglist.read = req.body.read
    await readinglist.save()
    res.json(readinglist)
  
  }
})

module.exports = router
