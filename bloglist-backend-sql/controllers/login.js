const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const { User, ServerSession } = require('../models')

router.post('/', async (req, res) => {
  const body = req.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  const passwordCorrect = body.password === 'thisIsTotallyNotSafe'

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'Invalid username or password.'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id
  }

  const token = jwt.sign(userForToken, SECRET)

  const session = await ServerSession.create({
    token,
  })

  res.status(200).send({
    token,
    session,
    username: user.username,
    name: user.name
  })
})

module.exports = router
