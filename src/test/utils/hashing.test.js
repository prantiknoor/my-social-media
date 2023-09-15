const { generateHash, hashMatched } = require("../../utils/hashing");

describe('Generate hash', () => {
    it('should generate a hash', async () => {
        const payload = 'I love JavaScript'

        const hash = await generateHash(payload);

        expect(hash).toHaveLength(60)
    })

    it('should match the hash', async () => {
        const raw = 'I love JavaScript'
        const hash = '$2a$10$02/QFQ6vyxtulyTjVWRGoOTgEuMp6zbsie.WHbO7uy.klEhINSMue'

        const res = await hashMatched(raw, hash)

        expect(res).toBe(true)
    })
})