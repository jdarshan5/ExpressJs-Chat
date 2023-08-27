import { Request, Response } from "express";

import Message, { MessageDocument } from "../../models/message/index.ts";
import Conversation, { ConversationDocument } from "../../models/conversation/index.ts";

const getMessages = async (req: Request, res: Response) => {
  const { user } = res.locals;
  const { convid } = req.params;
  if (!convid) {
    return res.status(400).json({
      message: "Please provide valid data!",
    });
  }
  let conv: ConversationDocument;
  try {
    conv = await Conversation.findOne({ _id: convid, members: user._id }).exec();
    if (!conv) {
      return res.status(400).json({
        message: "User not part of this conversation",
      });
    }
  } catch (e) {
    return res.status(500).json(e);
  }
  let messages: MessageDocument[];
  try {
    messages = await Message.find({ conversation: conv._id }).exec();
  } catch (e) {
    return res.status(500).json(e);
  }
  return res.status(200).json(messages);
}

const createMessage = async (req: Request, res: Response) => {
  const { user } = res.locals;
  const { conversation, message } = req.body;
  try {
    const msg = await (await Message.create({
      conversation: conversation,
      sender: user._id,
      message: message,
    })).save();
    if (msg) {
      try {
        await Conversation.findByIdAndUpdate(conversation, {
          $push: {
            messages: msg._id,
          },
          $set: {
            last_message: msg._id,
            updated_at: msg.created_at,
          },
        }).exec();
      } catch (e) {
        return res.status(500).json(e);
      }
      return res.status(200).json(msg);
    }
  } catch (e) {
    return res.status(500).json(e);
  }
}

const seeMessage = async (req: Request, res: Response) => {
  const { user } = res.locals;
  const { conversationId, messageId } = req.body;
  let conversation: ConversationDocument;
  try {
    conversation = await Conversation.findOne({
      _id: conversationId,
      members: user._id,
    }).exec();
    if (!conversation) {
      return res.status(400).json({
        message: "User not part of this conversation",
      });
    }
  } catch (e) {
    return res.status(500).json(e);
  }
  let message: MessageDocument;
  let updatedMessage: MessageDocument;
  try {
    message = await Message.findOne({
      _id: messageId,
      conversation: conversation._id,
      sender: {
        $ne: user._id,
      },
      seen: {
        $nin: user._id,
      },
    }).exec();
    if (!message) {
      return res.status(400).json({
        message: "No message found in this conversation / Message already seen",
      });
    }
    updatedMessage = await Message.findByIdAndUpdate(
      message._id,
      {
        $push: {
          seen: user._id,
        },
      },
      {
        new: true,
      }
    ).exec();
  } catch (e) {
    return res.status(500).json(e);
  }
  return res.status(200).json(updatedMessage);
}

export default {
  getMessages,
  createMessage,
  seeMessage,
};