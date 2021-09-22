const request = require('supertest');

const {app} = require('../src/app');

describe('GET /my-api/v1', () => {
  it('responds with a json message', (done) => {
    request(app)
      .get('/my-api/v1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        message: 'API - 👋🌎🌍🌏'
      }, done);
  });
});

describe('GET /my-api/v1/i-dont-exist', () => {
    it('responds with a not found message', (done) => {
        request(app)
            .get('/my-api/v1/i-dont-exist')
            .set('Accept', 'application/html')
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect(404, done);
    });
});