import { Request, Response } from "express";

import mongoose from "mongoose";

import Conversation, { ConversationDocument } from "../../models/conversation/index.ts";

const listOfConversation = async (req: Request, res: Response) => {
  const { user } = res.locals;
  let conversations: ConversationDocument[];
  try {
    conversations = await Conversation.find(
      {
        members: user._id
      }
    ).populate(
      [
        'members',
        'messages',
        'last_message'
      ]
    ).exec();
    return res.status(200).json(conversations);
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
}

/**
 * @description 
 */
const createConversation = async (req: Request, res: Response) => {
  const { user } = res.locals;
  // user with whom he/she wants conversation
  const user_ = req.body.user;
  try {
    const conv = await (
      await Conversation.create(
        {
          members: [
            user._id,
            new mongoose.Types.ObjectId(user_),
          ],
        }
      )
    ).save();
    if (conv) return res.status(200).json(conv.populate(['members', 'messages']));
  } catch (e) {
    return res.status(500).json(e);
  }
}

export default {
  listOfConversation,
  createConversation,
};