import request from 'supertest'
// app
import { app } from '@/app'
// model
import { users } from '@/model/users'

test('get /users', () => {
  return request(app)
    .get('/users')
    .then((response) => {
      expect(response.status).toEqual(200)
      expect(response.text).toEqual(JSON.stringify(users))
    })
})
