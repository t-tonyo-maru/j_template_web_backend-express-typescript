// settings
import { settings } from '@/settings/settings'
// app
import { app } from '@/app'

// サーバー起動
const run = app.listen(settings.port, () => {
  console.log(`[${new Date().toISOString()}] start server ${settings.port}.`)
})
// タイムアウトを設定
run.timeout = settings.timeout
