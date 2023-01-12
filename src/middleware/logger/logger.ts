import { Request, Response, NextFunction } from 'express'
import expressPino from 'express-pino-logger'
import pino from 'pino'
// model
import { settings } from '@/settings/settings'

export const logger = pino({ level: settings.logLevel })
export const expressLogger = expressPino({ logger, autoLogging: true })
/**
 * expressのmiddlewareとして、ロガーをセットするためのhandler関数です
 *
 * @param {Request} _req express.Request。利用しません。
 * @param {Response} _res express.Response。利用しません。
 * @param {NextFunction} next middleware完了後に、次の処理を発火させるための関数です。必ず発火させる必要があります。
 * @param {(_req: Request, _res: Response, next: NextFunction) => void}
 */
export const loggerHandler = (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  logger.debug('')
  next()
}
