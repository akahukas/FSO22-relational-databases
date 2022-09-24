const router = require('express').Router()
const { Op } = require('sequelize')

const { Blog, User } = require('../models')
const { blogFinder, tokenExtractor } = require('../util/middleware')


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
    where,
    order: [
      ['likes', 'DESC']
    ]
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res, next) => {
  console.log(req.body)

  const user = await User.findByPk(req.decodedToken.id)
  const userJson = user.toJSON()

  if (userJson.disabled) {
    return res.status(403).send({
      errorMessage: 'Session expired.'
    })
  }

  const { author, url, title, year, likes } = req.body
  
  if (year >= 1991 && year <= new Date().getFullYear()) {
    const blog = await Blog.create({
      author,
      url,
      title,
      year,
      likes,
      userId: userJson.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    
    res.json(blog)
  }
  else {
    const currentYear = new Date().getFullYear()

    res.status(400).json({
      errorMessage: `Writing year of the blog must be between years 1991 and ${currentYear}`
    })
  }
  
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
    req.blog.updatedAt = new Date()
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
    
    const user = await User.findByPk(req.decodedToken.id)
    const userJson = user.toJSON()
    
    if (userJson.disabled) {
      return res.status(403).send({
        errorMessage: 'Session expired.'
      })
    }

    await Blog.destroy({ where: { id: req.params.id } })
    res.status(204).end()
  }
  res.status(403).json({
      errorMessage: 'Deletion forbidden, this blog is not yours.'
  })
})

module.exports = router
