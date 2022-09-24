const router = require('express').Router()

const { Blog, Readinglist, User } = require('../models')

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

module.exports = router
