const defaults = require("../../config/defaults")
const { User, Counter } = require("../../models")
const { notFound } = require("../../utils/httpErrors")

const createUser = async ({ name, email, password, bio, status, role }) => {
    const user = await new User({ name, email, password, bio, status, role }).save()
    return user
}

const findSingleUser = async (id, expand = true) => {
    const user = await User.findById(id);

    if (!user) throw notFound()

    if (expand) {
        const followersDoc = await Counter.findOne({ parent: user.id, type: 'followers' })
        const followeesDoc = await Counter.findOne({ parent: user.id, type: 'followees' })

        user._doc.followers = followersDoc?.count || 0
        user._doc.followees = followeesDoc?.count || 0
    }

    return user
}

const findAllUser = async ({
    page = defaults.page,
    limit = defaults.limit,
    sortType = defaults.sortType,
    sortBy = defaults.sortBy,
    search = defaults.search,
    omitSesitiveProps = true
}) => {
    const sort = (sortType === 'desc' ? '-' : '') + sortBy
    const filter = {
        name: { $regex: search, $options: 'i' }
    }

    const users = await User.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)

    if (omitSesitiveProps) {
        return users.map(user => {
            const { password, status, ...otherProps } = user._doc
            return otherProps
        })
    }

    return users
}

const findUserByEmail = (email) => User.findOne({ email })

const updateOrCreateUser = async (id, { name, email, password, bio, status, role }) => {
    let user = await User.findById(id)

    const payload = { name, email, password, bio, status, role }

    if (!user) {
        user = await createUser({ ...payload })
        return { user, code: 201 }
    }

    await user.overwrite(payload).save()

    return { user, code: 200 }
}

const updateUser = async (id, { name, email, password, bio, status, role }) => {
    let user = await User.findById(id)

    if (!user) throw notFound()

    const payload = {
        name: name ?? user.name,
        email: email ?? user.email,
        password: password ?? user.password,
        bio: bio ?? user.bio,
        status: status ?? user.status,
        role: role ?? user.role
    }

    await user.overwrite(payload).save()

    return user
}

const deleteUser = async (id) => {
    const user = await User.findByIdAndDelete(id)

    if (!user) throw notFound()
}

module.exports = {
    createUser,
    deleteUser,
    findSingleUser,
    findAllUser,
    updateOrCreateUser,
    updateUser,
    findUserByEmail,
}