require('dotenv').config({ path: `${__dirname}/../.test.env` });
const expect = require('expect');
const superagent = require('superagent');

describe('testing POST /api/profile', () => {
  console.log('data', data);

  it('should respond with a profile', () => {
    return superagent.post(`${API_URL}/api/profile`)
    .send(data)
    .then(res => {
      console.log('data', data);
      expect(res.status).toEqual(200);
      expect(res.body.username).toEqual(data.username);
      expect(res.body._id).toExist();
    });
  });

  it('should respond with 400 invalid request body', () => {
    return superagent.post(`${API_URL}/api/profile`).send().catch(err => {
      expect(err.status).toEqual(400);
    });
  });
});
