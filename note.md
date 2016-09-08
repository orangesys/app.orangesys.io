

## auth state

- authenticated: firebaseにログイン済でかつユーザデータも存在する
- signingUpByOAuth: firebaseにログインしたがユーザデータがまだの場合
- needEmailVerification: firebaseにEmailでユーザ登録済みだがメール認証がまだ
- needPaymentInformation: ユーザ登録済みだが支払い情報の登録がまだ

### Email / Password

#### ユーザ登録

usersデータを作る必要がある。

```js
authenticated: true
emailVerified: false
```


### Google / Github でユーザ登録

#### 登録ボタン

まだユーザデータは作られない。
firebaseにログインはした状態。

```js
authenticated: false
signingUpByOAuth: true
```
