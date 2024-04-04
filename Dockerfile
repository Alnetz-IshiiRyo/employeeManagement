# Nodeのバージョン
FROM node:20

# アプリケーションディレクトリを作成
WORKDIR /sample-app

# アプリケーションの依存関係をインストール
# package.json と package-lock.json をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションのソースをコピー
COPY . .

# アプリケーションをビルド
RUN npm run build

# アプリを起動
CMD ["npm", "start"]
