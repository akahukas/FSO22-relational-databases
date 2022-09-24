const router = require('express').Router()

const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
    include: {
      model: Blog,
      as: 'markedBooks',
      attributes: { exclude: ['userId', 'blogId', 'createdAt', 'updatedAt'] },
      through: {
        attributes: []
      }
    }
  })

  res.json(user)

})

router.post('/', async (req, res) => {
  const user = await User.create({
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  res.json(user)
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })

  user.name = req.body.name
  user.updatedAt = new Date()
  
  await user.save()
  res.json(user)
})

module.exports = router
