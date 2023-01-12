import fs from 'fs'
import path from 'path'
import * as R from 'ramda'
import { Request, Response } from 'express'
// model
import { users } from '@/model/users'
// type
import { UserType } from '@/types/user'

/**
 * ユーザー取得のためのhandler関数です。
 *
 * @param {Request} _req express.Request。利用しません。
 * @param {Response} res express.Response。
 * @param {(_req: Request, res: Response) => void}
 */
export const getUserHandler = (_req: Request, res: Response) => {
  res.send(JSON.stringify(users))
}

/**
 * ユーザーデータをファイルに書き込むためのhandler関数です。
 * fsモジュールを利用して、jsonファイルを更新します。
 *
 * @param {Request} _req express.Request。利用しません。
 * @param {Response} res express.Response。
 * @param {(_req: Request, res: Response) => void}
 */
export const setUserSampleHandler = async (_req: Request, res: Response) => {
  const toUpperCaseuserName = (users: UserType[]) => {
    return users.map((user) => {
      return {
        ...user,
        name: user.name.toUpperCase()
      }
    })
  }
  const x2UserId = (users: UserType[]) => {
    return users.map((user) => {
      return {
        ...user,
        id: user.id * 2
      }
    })
  }
  const pipeForUser = R.pipe(toUpperCaseuserName, x2UserId)

  try {
    const storePath = path.resolve(
      __dirname,
      '../../../assets/store/store.json'
    )
    fs.writeFileSync(storePath, JSON.stringify(pipeForUser(users)))
    res.send(JSON.stringify({ status: 'Success' }))
  } catch (err) {
    res.status(500)
    res.send(JSON.stringify({ status: 'Failed', error: err }))
  }
}
