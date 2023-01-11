const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')();
const webpush = require('web-push')
router.get('/', async (ctx, next) => {
  ctx.body = 'Hello World2'
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
router.post('/sendMessage', async (req, res, next) => {
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


