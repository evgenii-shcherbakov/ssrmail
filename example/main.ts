import { AppHandler } from './app/app.handler';
import { EventEnum } from './constants/enums';
import { SingleController } from './controllers/single.controller';
import { SsrController } from './controllers/ssr.controller';

(async () => {
  const handler = new AppHandler().setControllers(SingleController, SsrController);

  await handler.handle(
    `{ "event": "${EventEnum.SINGLE}", "id": "1", "message": "single-handler message", "todos": [{ "id": "1", "isCompleted": true, "text": "test todo" }, { "id": "2", "isCompleted": false, "text": "test todo 2" }] }`,
  );

  await handler.handle(
    `{ "event": "${EventEnum.SSR}", "id": "2", "message": "ssr-handler message", "ids": ["1", "2", "3"] }`,
  );
})();
