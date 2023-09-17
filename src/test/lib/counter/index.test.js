const { createCounter, findCounter, incrementCounter } = require('../../../lib/counter');
const { notFound } = require('../../../utils/httpErrors');
const mongoose = require('mongoose')
const { connectDB } = require('../../../db');
const { Counter } = require('../../../models');

beforeAll(async () => {
    await connectDB(true)
    await Counter.deleteMany()
})

afterAll(async () => {
    await mongoose.connection.close(true)
})

describe('Counter', () => {
    const parentId = 'baf30d3e564c9ce90103244c';
    const fakeParentId = '65030d3e564c9ce90103244c'

    describe('Creating a counter', () => {
        it('should create a counter successfully', async () => {
            const counter = await createCounter({ parent: parentId, type: 'followers' });

            expect(counter.count).toBe(0);
        });

        it('should throw error because counter already exist', () => {
            return expect(createCounter({ parent: parentId, type: 'followers' }))
                .rejects.toThrow('Counter already exist')
        });
    });

    describe('Geting a counter', () => {
        it('should throw notFound error if it doesn\'t find any counter', () => {
            return expect(findCounter({ parent: fakeParentId, type: 'followers' }))
                .rejects.toThrow(notFound());
        });

        it('should return a counter by parentId and type', async () => {
            const counter = await findCounter({ parent: parentId, type: 'followers' });

            expect(counter.count).toBe(0);
        });
    });

    describe('Increment a counter', () => {
        it('should increment count of a counter by 1', async () => {
            const incrementBy = 1;

            const counterPrev = await findCounter({ parent: parentId, type: 'followers' })

            await incrementCounter({ parent: parentId, type: 'followers', incrementBy })

            const counterNow = await findCounter({ parent: parentId, type: 'followers' })

            expect(counterNow.count).toBe(counterPrev.count + incrementBy)
        });

        it('should create a new counter then increment by 1', async () => {
            const incrementBy = 1;

            expect(findCounter({ parent: parentId, type: 'followees' }))
                .rejects.toThrow(notFound())

            await incrementCounter({ parent: parentId, type: 'followees', incrementBy })

            const counter = await findCounter({ parent: parentId, type: 'followees' })

            expect(counter.count).toBe(incrementBy)
        });
    });
});
