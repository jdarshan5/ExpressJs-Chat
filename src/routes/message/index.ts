import { Router } from "express";

import AuthMiddleware from "../../middlewares/authenticate.ts";

import Message from "../../controllers/message/index.ts";

const MessageRouter = Router();

MessageRouter.use(AuthMiddleware.isAuthenticated);

MessageRouter.get('/:convid', Message.getMessages);

MessageRouter.post('/', Message.createMessage);

MessageRouter.patch('/seen', Message.seeMessage);

export default MessageRouter;