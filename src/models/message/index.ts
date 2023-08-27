import mongoose, { Schema } from "mongoose";

import Conversation, { ConversationDocument } from "../../models/conversation/index.ts";

export interface MessageDocument extends mongoose.Document {
  conversation: Schema.Types.ObjectId,
  sender: Schema.Types.ObjectId,
  seen: {
    type: Array<Schema.Types.ObjectId>,
  },
  message: string,
  created_at: Date,
};

const MessageSchema = new Schema<MessageDocument>({
  conversation: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
  },
  seen: {
    type: Array<Schema.Types.ObjectId>,
    ref: 'Users',
    default: [],
  },
  message: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

/**
 * @description Checks whether sender is allowed to conversate or not
 */
MessageSchema.pre('save', async function (next) {
  const msg = this;
  let query: ConversationDocument;
  try {
    query = await Conversation.findOne({
      _id: msg.conversation,
      members: msg.sender,
    }).exec();
  } catch (e) {
    next(e);
  }
  if(!query) {
    next({
      name: 'Unauthorized',
      message: 'Not part of conversation',
    });
  }
  next();
});

export default mongoose.model<MessageDocument>('Message', MessageSchema);