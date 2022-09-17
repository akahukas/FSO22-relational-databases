const router = require('express').Router()

const { Blog } = require('../models')
const { blogFinder } = require('../util/middleware')


router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

router.post('/', async (req, res) => {
  try {
    console.log(req.body)
    const blog = await Blog.create(req.body)
    return res.json(blog)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

router.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    return res.json(blog)
  }
  else {
    return res.status(404).end()
  }
})

router.put('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body.likes
    await req.blog.save()
    return res.json(req.blog)
  }
  else {
    res.status(404).end()
  }
})

router.delete('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    await Blog.destroy({ where: { id: req.params.id } })
    return res.status(204).end()
  }
  else {
    return res.status(404).end()
  }
})

module.exports = router
