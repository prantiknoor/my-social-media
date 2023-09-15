const { faker } = require('@faker-js/faker')
const { createUser } = require('../../lib/user')

const getFakeUserCreationData = () => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    bio: faker.lorem.paragraph()
})

const createRandomUser = async () => {
    const data = getFakeUserCreationData()

    const user = await createUser(data)

    return { data, user }
}

module.exports = { getFakeUserCreationData, createRandomUser }