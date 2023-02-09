# j_template_web_backend-express-typescript

## 目次

- [概要](#概要)
- [推奨環境](#推奨環境)
- [コマンド一覧](#コマンド一覧)
- [フォルダ構成](#フォルダ構成)
- [クイックスタート](#クイックスタート)
- [本テンプレートの使い方](#本テンプレートの使い方)
  - [テンプレートの構成](#テンプレートの構成)
  - [アプリの設定ファイル](#アプリの設定ファイル)
  - [nodemon](#nodemon)
  - [データ永続化](#データ永続化)
  - [タイムアウト](#タイムアウト)
  - [環境設定ファイル](#環境設定ファイル)
  - [tsファイルのエイリアス](#tsファイルのエイリアス)
  - [セキュリティ](#セキュリティ)
  - [エラーハンドリング](#エラーハンドリング)
  - [バリデーション](#バリデーション)
  - [body-parser](#body-parser)
  - [ロガー](#ロガー)
  - [テスト](#テスト)
    - [jest](#jest)
    - [supertest](#supertest)
  - [コードフォーマット](#コードフォーマット)
  - [ramda](#ramda)
  - [typedoc](#typedoc)
- [参考リンク集](#参考リンク集)

## 概要

本テンプレートは、[express](https://expressjs.com/ja/)と[TypeScript](https://www.typescriptlang.org/)をベースにしたサーバーサイド用テンプレートです。  
主に開発用モックサーバーを想定したテンプレートになっていますが、カスタマイズ次第で様々なパターンに対応できます。

## 推奨環境

|         | バージョン |
| ------- | ---------- |
| Node.js | 18.14.0    |
| npm     | 9.3.1      |
| yarn    | 1.22.19    |

**※package.json に`engines`を設定して、Node.js を v18 系に縛っています。**  
これにより、npm パッケージのバージョン不整合を回避しています。

利用したい環境に合わせて、適宜変更してください。

## コマンド一覧

| コマンド        | 内容                                                                   |
| --------------- | ---------------------------------------------------------------------- |
| yarn start      | 開発環境でエントリーポイントの ts を実行します（nodemon で起動します） |
| yarn start:dev  | 同上                                                                   |
| yarn start:prod | **本番環境**でエントリーポイントの ts を実行します                     |
| yarn test:i     | jest/supertest による結合テストを実行します                            |
| yarn test:u     | jest による単体テストを実行します                                      |
| yarn format     | prettier を利用して、ソースコードを整形します                          |
| yarn typedoc    | typedoc を利用して、TypeScript のドキュメンを生成します                |

## フォルダ構成

```
./
├── .prettierrc … prettier の設定ファイル
├── README.md
├── package.json
├── src … ソースコード一式を格納
│   ├── index.ts … エントリーポイントのts。app.tsのappを読み込み、サーバーを起動する
│   ├── app.ts … express.appをカスタマイズするファイル
│   ├── __test__ … URL/API単位のテスト（結合テスト）用ファイルの格納先
│   ├── controller … コントローラーの格納先
│   │   ├── handler … URLに対するハンドラーの格納先
│   │   └── modules … 汎用的なTypeScript関数の格納先
│   ├── model … アプリのモデルの格納先
│   ├── settings … アプリの設定ファイルの格納先
│   ├── middleware … expressのミドルウェアの格納先
│   ├── public … 静的ファイルの格納先
│   ├── routes … ルーティング用ファイルの格納先
│   ├── types … 型定義の格納先
│   └── assets … 上記に該当しないファイル群の格納先
├── tsdoc … TypeScriptのドキュメントファイルの出力先
├── tsconfig.json
└── yarn.lock
```

## クイックスタート

1. ローカル環境を[推奨環境](#推奨環境)に合わせます。
2. `yarn install` もしくは `npm run install`を実行します
3. 必要に応じて環境設定ファイル（.env）を用意します
   - **※セキュリティ上の観点から、本番環境では.env ファイルを読み込まないようにしています**
   - **※また、.env 系のファイルはリポジトリに含めないようにしています。**
4. `yarn start` もしくは `npm run start`を実行します

## 本テンプレートの使い方

### テンプレートの構成

本テンプレートは、Model x Controller x Router の 3 つを軸にしています。

- Model … アプリケーションで扱うデータ
  - Type … データの型
- Controller … Model に対する処理
  - Handler … express の Router にセットするハンドラー関数
  - Modules … ハンドラー関数を組み立てるための汎用的な関数群
- Router … アプリケーションのルーティング

本テンプレートは、以下のような実装方法を想定した作りになっています。  
適宜カスタマイズしていただいて構いません。

1. アプリケーションで扱いたいデータを src/model に格納します。
   1. model の格納と同時に src/types に、型定義を格納します。
2. model に対する処理（controller）を実装します。
   1. controller は src/controller 配下に格納します。
   2. router の handler として実装する関数は src/controller/handler に格納します。
   3. 汎用的な関数は src/controller/modules に格納します。適宜、handler に呼び出して利用してください。
3. src/routes に router を格納します。
   1. 格納した router と controller を紐付けます。
4. 完成した router を app.ts の`express.app`に適用します。

その他で…、

- middleware は src/middleware に格納して、app.ts の`express.app`に適用します。
  - middleware の handler 関数が肥大化する場合は、適宜、Model（Type）と Controller（Handler / Modules）に切り分けてください。
- いわゆる MVC の構成にも対応可能です。
  - src/配下に view ディレクトリを作成し、view ファイルを格納すると良いでしょう。

### アプリの設定ファイル

アプリ全体の設定ファイルは `src/settings/settings.ts` にまとめています。  
本ファイルにポート番号や、静的ファイルの公開ディレクトリ、タイムアウト時間をまとめています。

### 型定義

アプリで共通の型は `src/types` に集約して、各 ts ファイルに読み込んでください。  
共通化しない型（例えば、テストでのみ利用するモックの型など）などは、実装者判断で利用するファイルに閉じ込めても問題ありません。

### nodemon

本テンプレートには[nodemon](https://www.npmjs.com/package/nodemon)を導入しています。  
nodemon を組み込むことで、TypeScript ファイルをはじめとして任意のファイルの変更を監視して、コマンドを再実行できます。

開発環境のコマンドは nodemon で動作するようにしています。  
本番環境では nodemon は動作しません。

また、テンプレートのルートに、nodemon の設定ファイル（nodemon.json）を格納しています。  
本ファイルでは、テストファイルや node_modules を対象外に設定しています。  
プロジェクトに応じて、適宜、変更してください。

### nodemon参考リンク集

- [> nodemon](https://www.npmjs.com/package/nodemon)
- [> Nodemon を使用して Node.js アプリケーションを自動的に再起動する方法](https://www.digitalocean.com/community/tutorials/workflow-nodemon-ja)

### データ永続化

様々な要件が考えられるため、本テンプレートでは特定のデータ永続化手段は実装していません。  
データ保持機能や DB への接続は、実装者自身にて対応をお願いします。

ただサンプルとして、リクエストに応じてファイルに書き込みを行う Handler 関数を用意しています。  
関連するファイルは以下の通りです。

- `/src/controller/handler/userHandler/userHandler.ts`
  - `setUserSampleHandler`がファイル書き込みを担う handler 関数です。
- `/src/assets/store/store.json`
  - 上記の関数で更新される json ファイルです。

モック API 等の簡易的な開発サーバーを構築する際などに利用してみると良いでしょう。

### タイムアウト

サーバーのタイムアウトは`src/index.ts`にて設定しています。  
（express では `app.listen().timeout` に設定を入れると、タイムアウトを設定できます。）

設定値は、設定ファイル（`src/settings/settings.ts`）に保持しています。

### 環境設定ファイル

本テンプレートには、環境設定ファイル（.env）を読み込めるように[dotenv](https://www.npmjs.com/package/dotenv)を導入しています。  
テンプレートのルートに、環境設定ファイルのサンプル（`.env.sample`）を用意していますので、適宜、コピーして利用してください。

環境変数の読み込みの設定は `/src/index.ts` に記載しています。  
TypeScript では `process.env.変数名` と記述することで、環境変数を呼び出せるようにしています。  
**セキュリティ上の観点から、本番環境（`process.env.NODE_ENV === 'production'`）では、環境設定ファイルを読み込まないようにしています。**  
**また、環境設定ファイルには非常に重要な情報を定義する事が考えられるため、リポジトリに含めないよう .gitignore で指定しています。**

環境設定ファイルの扱いには注意してください。

### tsファイルのエイリアス

[tsconfig-paths](https://www.npmjs.com/package/tsconfig-paths)を導入した上で、tsconfig.json の`baseUrl` / `paths`を設定しているため、本テンプレートの ts ファイルでは、`import`文でエイリアスが使用できます。  
`import XX from @/model/` と記載すれば、src/model/配下の ts ファイルを読み込めます。

また、jest.config.js にも `moduleNameMapper` を記載しているため、テストファイルでも同様のエイリアスが利用できます。

### セキュリティ

本テンプレートでは、セキュリティ対策のため[helmet](https://helmetjs.github.io/)を導入しています。  
helmet はセキュリティ関連の HTTP ヘッダーをよしなに設定してくれるライブラリです。  
helmet 以外のセキュリティ対策は講じていません。ユーザー認証や DB 関連のセキュリティ対策は実装者自身でご対応をお願いします。

#### セキュリティ参考リンク集

- [> 実稼働環境におけるベスト・プラクティス: セキュリティー | Express](https://expressjs.com/ja/advanced/best-practice-security.html)

### エラーハンドリング

本テンプレートのエラーハンドリングとしては、all catch error hanlder のみを実装しています。  
`/src/middleware/errorHandler/errorHandler.ts`に、関数を定義しており、`/src/app.ts`に読み込み、最終行で設定しています。  
（※all catch error hanlder は、他の middleware の前に設定すると正しく動作しません。必ず最後に設定してください。）

エラーハンドリングのカスタマイズは、実装者自身で対応をお願いします。

#### エラーハンドリング参考リンク集

- [エラー処理 | Express](https://expressjs.com/ja/guide/error-handling.html)
- [Express の error handling を理解し、middleware で実装してみた](https://note.com/shift_tech/n/n42b96d36f0cf)
- [Express な API でエラーハンドリングするよ](https://chaika.hatenablog.com/entry/2020/11/16/083000)
- [Express の冗長なエラー処理を簡潔にする](https://qiita.com/azujuuuuuun/items/f0be4a71aca2d92036aa)

### バリデーション

本テンプレートにはバリデーション用に [zod](https://zod.dev/) を導入しています。

zod は、TypeScript Frist のバリデーションライブラリです。他ライブラリへの依存性もありません。  
非常に多機能なライブラリであり、単純なバリデーション以外の用途にも使えます。（例えば、Web アプリのスキーマを zod で定義するなど。）

`src/controller/modules/zodValidation/zodValidation.ts`に、zod のサンプルを実装しています。

### body-parser

本テンプレートには [body-parser](https://www.npmjs.com/package/body-parser) を導入しています（型定義もインストール済みです）  
その名前の通り、http 通信の body のパーサーです。express で post 通信のパラメータを取得するのに便利です。

使い方は以下の通りです。

1. body-parser を import して、express アプリのミドルウェアとしてセットします  
   具体的なコードは `app.use(bodyParser.urlencoded({ extended: true }))` です
2. 1.さえ設定すれば、post 通信の `req: express.Request` オブジェクトの `body` から簡単にパラメータを取得できます  
   `req.body.hoge` のように、任意のパラメータを取得できます

### ロガー

本テンプレートにはロガーとして [Pino](https://getpino.io/#/) を導入しています（型定義もインストール済みです）  
ロガー設定サンプルを `src/middleware/logger/logger.ts` に記載しており、`src/app.ts` に読み込んで、適用しています。  
また、[pino-pretty](https://github.com/pinojs/pino-pretty)も導入していますので、console 上では整形された上でログが表示されます。

**※本番環境ではログが出力されないように設定しています。**  
**ログの扱いを決めてから、改めて設定してください。**

### テスト

#### jest

本テンプレートでは、[jest](https://jestjs.io/ja/)を導入しています。  
単体テストファイルは、テスト対象の関数と同じディレクトリに`XXX.test.ts`を格納して、テストコードを記載してください。  
`yarn test:i` もしくは `npm run test:i` を実行すると、src/配下の`XXX.test.ts`を対象にテストを実行します。  
**※`test:i`コマンドは、src/\_\_test\_\_/配下のテストファイルを無視します。**  
後述するように、**src/\_\_test\_\_/配下には結合テストファイルを格納してください**

#### supertest

本テンプレートでは、[supertest](https://github.com/visionmedia/supertest)を導入しています。jest と併用して結合テストを行います。  
supertest は Express の開発チームによって作られたテストライブラリです。  
express の web アプリの http リクエストレベルでテスト（＝サーバーのテスト）をすることができます。  
URL/API 単位のテスト（結合テスト）は、`src/__test__/`配下に格納してください。  
そして、`yarn test:u` もしくは `npm run test:u` を実行してください。結合テストが実行されます。

単体テストとのブッキングを避けるために、**※`test:u`コマンドは、src/\_\_test\_\_/配下のテストファイルのみを実行します。**

### コードフォーマット

本テンプレートでは、[prettier](https://prettier.io/) を導入しています。  
`yarn format` もしくは `npm run format` を実行すると、src ディレクトリ配下の js, ts, json ファイルすべてが整形されます。

### ramda

本テンプレートでは [ramda](https://ramdajs.com/) を採用しています。  
[ramda](https://ramdajs.com/) は JavaScript / TypeScript のユーティリティライブラリです。  
[R.clone](https://ramdajs.com/docs/#clone) ：ディープコピー、[R.equals](https://ramdajs.com/docs/#equals) ：ディープイコール…などの便利なメソッドが用意されています。  
また、特に JavaScript / TypeScript で関数型プログラミングを実現するのに役立ちます。

`import * as R from 'ramda'` もしくは `import { …必要な機能のみ…, } from 'ramda'` で .ts ファイルに読み込んで使用できます。  
[@types/ramda](https://www.npmjs.com/package/@types/ramda) もインストールしていますので、型安全になっています。

以下に ramda のサンプルファイルを格納しています。

- /src/controller/modules/ramdaSample/ramdaSample.ts

ramda が不要な場合はサンプルファイルを削除した上で、下記のコマンドを実行すれば、テンプレートから削除できます。  
`yarn remove ramda @types/ramda` もしくは `npm uninstall ramda @types/ramda`

### typedoc

本テンプレートでは、[typedoc](https://typedoc.org/guides/overview/)を導入しています。  
`yarn typedoc` もしくは `npn run typedoc` を実行すると、tsdoc/ 配下に TypeScript のドキュメントファイルを生成します。  
ドキュメントの生成対象は `src/` 配下の ts ファイルです。（※d.ts は除外しています。）

生成されるドキュメントは各 .ts ファイルの JSDoc/TSDoc を元に生成されます。  
また、ドキュメント生成と同時に tsc コマンドによる型精査も行われた上でドキュメントに反映されます。  
したがって、JSDoc/TSDoc のコメントに誤りがあっても、ある程度の補完が効きます。

大規模プロジェクトを構築する場合は、.ts ファイルに、JSDoc/TSDoc コメントを記載し、適宜ドキュメントを生成することをオススメします。

#### typedocの設定

typedoc の設定は、すべてコマンド実行時のオプションで指定しています。  
現状では設定しているオプションは下記の通りです。

- `--readme none`: tsdoc/配下に readme.md を出力しない
- `--cleanOutputDir true`: ドキュメント生成時に、前回出力のドキュメント一式を削除する
- `--excludeExternals false`: 外部ファイルの ts のドキュメントを生成しない。対象ファイルのみ生成する
- `--exclude '**/*+(.test|.spec|.e2e)*+(.ts|.js)'`: ドキュメント生成対象の除外を指定。テストファイルはドキュメントを生成しない
- `--entryPointStrategy expand`: .ts ファイルごとにページを生成する
- `--out ./tsdoc/ ./src/ts/`: ドキュメント生成先と、対象の.ts ファイルの格納先を指定

#### typedoc参考リンク集

- [> TypeDoc](https://typedoc.org/guides/overview/)

## 参考リンク集

- [> Express](https://expressjs.com/)
- [> TypeScript](https://www.typescriptlang.org/)
- [> Node.js | logger](https://www.twilio.com/blog/a-guide-to-node-js-logging-jp)
  - [> Pino](https://getpino.io/#/)
- [> jest](https://jestjs.io/ja/)
- [> supertest](https://github.com/visionmedia/supertest)
- [> 実稼働環境におけるベスト・プラクティス: セキュリティー | Express](https://expressjs.com/ja/advanced/best-practice-security.html)
