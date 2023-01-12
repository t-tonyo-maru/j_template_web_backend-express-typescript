import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import helmet from 'helmet'
// settings
import { settings } from '@/settings/settings'
// middleware
import { expressLogger } from '@/middleware/logger/logger'
import { errorHandler } from '@/middleware/errorHandler/errorHandler'
// routes
import { userRouter } from '@/routes/users/index'

// 本番環境以外で環境変数ファイルを有効化
if (settings.env !== 'production') {
  dotenv.config({
    path: settings.envPath
  })
  console.log(settings.env, process.env.NODE_DATA)
}

// app
export const app: express.Express = express()
// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: settings.maxBytesCanSent }))
// body-parser 有効化
app.use(bodyParser.urlencoded({ extended: true }))
// 静的ファイルの提供
app.use(express.static(settings.staticDir))
// ロガー設定
if (settings.env === 'production') {
  // 本番環境
  // app.use(expressLogger)
} else if (settings.env === 'development') {
  // 開発環境
  app.use(expressLogger)
}
// helmet適用
app.use(helmet())

// router割り当て
app.use('/', userRouter)

// all catch error handlerを設定。
// すべてのエラーをキャッチするために、必ず最後に設定しなければなりません。
app.use('/', errorHandler)
