/**
 * @type {SettingsType} アプリの設定値の型
 */
export type SettingsType = Readonly<{
  env: string
  logLevel: string
  port: number
  apiPath: string
  staticDir: string
  envPath: string
  maxBytesCanSent: string
  timeout: number
}>
