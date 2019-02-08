module.exports = {
    newLink: {
        subscribe: (parent, args, context, info) => {
            return context.prisma.$subscribe.link({ mutation_in: ['CREATED'] }).node()
        },
        resolve: payload => payload,
    },
    newVote: {
        subscribe: (parent, args, context, info) => {
            return context.prisma.$subscribe.vote({ mutation_in: ['CREATED'] }).noe()
        },
        resolve: payload => payload,
    }
}