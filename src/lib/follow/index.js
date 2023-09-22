const { Follower, User } = require("../../models")
const { notFound } = require("../../utils/httpErrors")
const { incrementCounter } = require("../counter")

const follow = async ({ followee, follower }) => {
    let code = 200
    let followerObj = await Follower.findOne({ followee, follower })

    if (!followerObj) {
        const followeeExist = await User.findById(followee)

        if (!followeeExist) throw notFound('Followee not found')

        followerObj = await Follower.create({ followee, follower })
        code = 201

        await incrementCounter({ parent: followee, type: 'followers', incrementBy: 1 })
        await incrementCounter({ parent: follower, type: 'followees', incrementBy: 1 })
    }

    return { data: followerObj._doc, code }
}

const unfollow = async ({ followee, follower }) => {
    let followerObj = await Follower.findOne({ followee, follower })

    if (!followerObj) return { code: 200 }

    await followerObj.deleteOne()

    await incrementCounter({ parent: followee, type: 'followers', incrementBy: -1 })
    await incrementCounter({ parent: follower, type: 'followees', incrementBy: -1 })

    return { code: 204 }
}

// TODO: Test this function
const findFollowersOf = async (userId, {
    page = defaults.page,
    limit = defaults.limit,
    sortType = defaults.sortType,
    sortBy = defaults.sortBy,
}) => {
    const sort = (sortType === 'desc' ? '-' : '') + sortBy
    const filter = {
        followee: userId
    }

    const followers = await Follower.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)

    return followers
}

// TODO: Test this function
const findFolloweesOf = async (userId, {
    page = defaults.page,
    limit = defaults.limit,
    sortType = defaults.sortType,
    sortBy = defaults.sortBy,
}) => {
    const sort = (sortType === 'desc' ? '-' : '') + sortBy
    const filter = {
        follower: userId
    }

    const followees = await Follower.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)

    return followees
}

module.exports = { follow, unfollow, findFollowersOf, findFolloweesOf }