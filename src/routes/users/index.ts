import express from 'express'
// handler
import {
  getUserHandler,
  setUserSampleHandler
} from '@/controller/handler/userHandler/userHandler'

const userRouter = express.Router()

userRouter.get('/users', getUserHandler)
userRouter.post('/users/set', setUserSampleHandler)

export { userRouter }
