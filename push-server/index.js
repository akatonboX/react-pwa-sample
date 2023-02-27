const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')();
const webpush = require('web-push')
router.get('/', async (ctx, next) => {
  ctx.body = `
  <html lang="ja">

  <head>
    <meta charset="utf-8">
    <title>Push送信画面</title>
    <script>
    async function sendPushMessage(){
      const message = document.getElementById('message').value;
    
      // FetchAPIのオプション準備
      const param = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
    
        // リクエストボディ
        body: JSON.stringify({ message }),
      };
    console.log("★")
      await (await fetch('/api/sendMessage', param)).text();
    }
    </script>
  </head>
  
  <body>
    <h1>Push送信画面</h1>
    <form>
      <input type="text" name="message" id="message" value="{'test': 'gige' }" />
      <button type="button" onClick="sendPushMessage()">Push送信</button>
    </form>
  </body>
  </html>
  `;
})

const vapidKeys = webpush.generateVAPIDKeys();
webpush.setVapidDetails(
  'mailto:hoge@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey,
);

// endPoint保存用(Push通知送信先)
let endPoint = '';


/**
 * ブラウザにキーを公開するためのメソッド
 * (必ずしもapiで公開する必要はない。手順簡略化のため)
 */
router.get('/api/vapidPublicKey', async (ctx, next) => {
  ctx.body = {
    status: 'success',
    json: vapidKeys.publicKey
  }
});



/**
 * endPointをサーバに保存するApi
 * (保存後、送信画面へリダイレクト)
 */
router.post('/api/registEndpoint', async (ctx, next) => {
  console.log(ctx.request.body);
  endPoint = ctx.request.body.endpoint;
  ctx.body = {
    status: 'success',
  }

});

/**
 * 登録されたendpointへメッセージを送信するApi
 * sendPush.jsから呼び出される
 */
router.post('/api/sendMessage', async (req, res, next) => {
  console.log(endPoint);
  try {
    const response = await webpush.sendNotification(
      JSON.parse(endPoint),
      req.body['message'],
    );

    return res.json({
      statusCode: response.statusCode || -1,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

app.use(router.routes())
app.use(router.allowedMethods())
app.listen(80)


