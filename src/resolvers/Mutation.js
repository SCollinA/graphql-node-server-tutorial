const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

module.exports = {
    post: (parent, args, context, info) => {
        const userId = getUserId(context)
        return context.prisma.createLink({
          url: args.url,
          description: args.description,
          postedBy: { connect: { id: userId } },
        })
      },
    signup: async (parent, args, context, info) => {
        const password = await bcrypt.hash(args.password, 10)

        const user = await context.prisma.createUser({ ...args, password })

        const token = jwt.sign({ userId: user.id }, APP_SECRET)

        return {
            token,
            user,
        }
    },
    login: async (parent, args, context, info) => {
        const user = await context.prisma.user({ email: args.email })
        if (!user) {
          throw new Error('No such user found')
        }

        const valid = await bcrypt.compare(args.password, user.password)
        if (!valid) {
          throw new Error('Invalid password')
        }
      
        const token = jwt.sign({ userId: user.id }, APP_SECRET)

        return {
          token,
          user,
        }
    },
    vote: async (parent, args, context, info) => {
        // 1
        const userId = getUserId(context)
      
        // 2
        const linkExists = await context.prisma.$exists.vote({
          user: { id: userId },
          link: { id: args.linkId },
        })
        if (linkExists) {
          throw new Error(`Already voted for link: ${args.linkId}`)
        }
      
        // 3
        return context.prisma.createVote({
          user: { connect: { id: userId } },
          link: { connect: { id: args.linkId } },
        })
      },
}