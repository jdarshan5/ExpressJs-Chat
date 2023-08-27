import { Router } from "express";

import AuthMiddleware from "../../middlewares/authenticate.ts";

import Conversation from "../../controllers/conversation/index.ts";

const ConversationRouter = Router();

ConversationRouter.use(AuthMiddleware.isAuthenticated);

ConversationRouter.get('/', Conversation.listOfConversation);

ConversationRouter.post('/', Conversation.createConversation);

export default ConversationRouter;