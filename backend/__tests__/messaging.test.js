process.env.NODE_ENV = 'test';
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

jest.mock('../services/pushService', () => ({
  sendMessageNotification: jest.fn().mockResolvedValue(),
}));

jest.mock('../config/firebase', () => ({
  auth: {
    verifyIdToken: jest.fn((token) => ({ uid: token, email: `${token}@test.com` })),
  },
  firebaseInitialized: true,
}));

const pushService = require('../services/pushService');
let app, server, mongo;
const User = require('../models/User');

describe('messaging', () => {
  beforeAll(async () => {
    mongo = await MongoMemoryServer.create({ binary: { version: '5.0.15' } });
    process.env.MONGO_URI = mongo.getUri();
    ({ app, server } = require('../server'));
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
    server.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    pushService.sendMessageNotification.mockClear();
  });

  test('sending message increases unread counts and unread_total', async () => {
    const sender = await User.create({ firebaseUid: 'u1', email: 'u1@test.com' });
    const receiver = await User.create({ firebaseUid: 'u2', email: 'u2@test.com', pushTokens: [{ token: 't2', platform: 'android', updatedAt: new Date() }] });

    const conv = await request(app)
      .post('/api/conversations/open')
      .set('Authorization', 'Bearer u1')
      .send({ participantId: receiver._id.toString() })
      .expect(200);
    const convId = conv.body._id;

    await request(app)
      .post(`/api/conversations/${convId}/messages`)
      .set('Authorization', 'Bearer u1')
      .send({ text: 'hi' })
      .expect(200);

    const list = await request(app)
      .get('/api/conversations')
      .set('Authorization', 'Bearer u2')
      .expect(200);
    expect(list.body[0].unreadCount).toBe(1);

    const total = await request(app)
      .get('/api/me/unread_total')
      .set('Authorization', 'Bearer u2')
      .expect(200);
    expect(total.body.unread_total).toBe(1);

    expect(pushService.sendMessageNotification).toHaveBeenCalled();
    const call = pushService.sendMessageNotification.mock.calls[0];
    expect(call[0].toString()).toBe(receiver._id.toString());
    expect(call[3]).toBe(1);
  });

  test('mark as read resets counts to 0', async () => {
    const sender = await User.create({ firebaseUid: 'u1', email: 'u1@test.com' });
    const receiver = await User.create({ firebaseUid: 'u2', email: 'u2@test.com' });

    const conv = await request(app)
      .post('/api/conversations/open')
      .set('Authorization', 'Bearer u1')
      .send({ participantId: receiver._id.toString() })
      .expect(200);
    const convId = conv.body._id;

    await request(app)
      .post(`/api/conversations/${convId}/messages`)
      .set('Authorization', 'Bearer u1')
      .send({ text: 'hi' })
      .expect(200);

    await request(app)
      .post(`/api/conversations/${convId}/read`)
      .set('Authorization', 'Bearer u2')
      .expect(200);

    const list = await request(app)
      .get('/api/conversations')
      .set('Authorization', 'Bearer u2')
      .expect(200);
    expect(list.body[0].unreadCount).toBe(0);

    const total = await request(app)
      .get('/api/me/unread_total')
      .set('Authorization', 'Bearer u2')
      .expect(200);
    expect(total.body.unread_total).toBe(0);
  });

  test('multiple conversations aggregate correctly', async () => {
    const u1 = await User.create({ firebaseUid: 'u1', email: 'u1@test.com' });
    const u2 = await User.create({ firebaseUid: 'u2', email: 'u2@test.com' });
    const u3 = await User.create({ firebaseUid: 'u3', email: 'u3@test.com' });

    const conv1 = await request(app)
      .post('/api/conversations/open')
      .set('Authorization', 'Bearer u1')
      .send({ participantId: u2._id.toString() })
      .then(r => r.body._id);

    const conv2 = await request(app)
      .post('/api/conversations/open')
      .set('Authorization', 'Bearer u3')
      .send({ participantId: u2._id.toString() })
      .then(r => r.body._id);

    await request(app)
      .post(`/api/conversations/${conv1}/messages`)
      .set('Authorization', 'Bearer u1')
      .send({ text: 'from u1' });

    await request(app)
      .post(`/api/conversations/${conv2}/messages`)
      .set('Authorization', 'Bearer u3')
      .send({ text: 'from u3' });

    const total = await request(app)
      .get('/api/me/unread_total')
      .set('Authorization', 'Bearer u2')
      .expect(200);
    expect(total.body.unread_total).toBe(2);
  });
});
