const Blog = require('./blog')
const User = require('./user')
const Readinglist = require('./readinglist')
const ServerSession = require('./serverSession')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: Readinglist, as: 'markedBooks' })
Blog.belongsToMany(User, { through: Readinglist })

module.exports = {
  Blog,
  User,
  Readinglist,
  ServerSession,
}
