const router = require('express').Router()
const { Op } = require('sequelize')

const { Blog, User } = require('../models')
const { blogFinder, tokenExtractor, userExtractor } = require('../util/middleware')


router.get('/', async (req, res) => {
   let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${req.query.search}%`
          }
        },
        {
          author: {
            [Op.iLike]: `%${req.query.search}%`
          }
        }
      ]
    }
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res, next) => {
  console.log(req.body)

  const user = await User.findByPk(req.decodedToken.id)
  const userJson = user.toJSON()

  const { author, url, title, likes } = req.body
  
  const blog = await Blog.create({
    author,
    url,
    title,
    likes,
    userId: userJson.id
  })
  
  res.json(blog)
})

router.get('/:id', blogFinder, async (req, res, next) => {
  if (req.blog) {
    res.json(req.blog)
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

router.delete('/:id', [blogFinder, tokenExtractor], async (req, res, next) => {

  if (!req.decodedToken) {
      return res.status(401).json({
        errorMessage: 'Missing or Invalid Token.'
      })
  }

  if (!req.blog) {
      return res.status(404).json({
        errorMessage: 'Blog not found.'
      })
  }
  else if (!req.blog.userId || req.blog.userId === req.decodedToken.id) {
    await Blog.destroy({ where: { id: req.params.id } })
    res.status(204).end()
  }
  res.status(403).json({
      errorMessage: 'Deletion forbidden, this blog is not yours.'
  })
})

module.exports = router
