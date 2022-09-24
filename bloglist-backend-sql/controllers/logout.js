const router = require('express').Router()

const { User } = require('../models')
const { serverSessionExtractor, tokenExtractor } = require('../util/middleware')

router.delete('/', tokenExtractor, serverSessionExtractor, async (req, res) => {
  if (!req.session) {
    res.status(401).send({
      message: 'Invalid token or session expired.'
    })
  }
  else {
    const userToDisable = await User.findByPk(req.decodedToken.id)

    userToDisable.disabled = true
    await userToDisable.save()

    req.session.validity = false
    await req.session.save()

    res.status(200).send({
      message: 'You have successfully logged out.'
    })
  }
})

module.exports = router
