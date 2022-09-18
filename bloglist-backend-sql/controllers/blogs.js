const router = require('express').Router()

const { Blog } = require('../models')
const { blogFinder } = require('../util/middleware')


router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

router.post('/', async (req, res, next) => {
  console.log(req.body)
  
  const blog = await Blog.create(req.body)
  
  res.json(blog)
})

router.get('/:id', blogFinder, async (req, res, next) => {
  if (req.blog) {
    res.json(blog)
  }
  else {
    res.status(404).json({error: 'Blog not found.'})
  }
})

router.put('/:id', blogFinder, async (req, res, next) => {
  if (req.blog) {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  }
  else {
    res.status(404).json({error: 'Blog not found.'})
  }
})

router.delete('/:id', blogFinder, async (req, res, next) => {
  if (req.blog) {
    await Blog.destroy({ where: { id: req.params.id } })
    res.status(204).end()
  }
  else {
    res.status(404).json({error: 'Blog not found.'})
  }
})

module.exports = router
