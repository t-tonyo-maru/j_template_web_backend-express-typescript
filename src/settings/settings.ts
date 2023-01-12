import path from 'path'
// type
import { SettingsType } from '@/types/settings'

export const settings: SettingsType = {
  // 実行環境
  env: process.env.NODE_ENV || 'development',
  // ログレベル
  logLevel: process.env.LOG_LEVEL || 'info',
  // ポート
  port: 3000,
  // API path
  apiPath: '/api',
  // 静的ファイルの格納先
  staticDir: path.resolve(__dirname, './public'),
  // 環境変数ファイルのパス
  envPath: path.resolve(__dirname, `../../.env.${process.env.NODE_ENV}`),
  // 送信データの許可容量
  maxBytesCanSent: '10mb',
  // デフォルトタイムアウト時間
  timeout: 1000 * 20 // 20秒数
}
