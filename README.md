## 概要
クライアントアプリからAPI経由でユーザー情報、メモ情報のCRUDを行うサーバーサイドアプリケーションです。

## 機能
- ユーザー情報
  - 登録
    - 登録時に入力されたメールアドレスの認証
  - 削除
- メモ情報
  - 登録
  - 編集
  - 削除
- 認証管理
  - JWTによるトークンベースの認証管理 

## 使用技術
- 言語・フレームワーク
  - TypeScript
  - Express.js
- データベース
  - MongoDB
- 認証とセキュリティ
  - bcrypt
  - jsonwebtoken
- メール送信
  - nodemailer
- 仕様管理
  - swagger-ui-express
- インフラ
  - AWS（独自ドメインを取得、https有効）
    - 使用サービス
      - EC2
      - Route53
      - Amazon Simple Email Service


