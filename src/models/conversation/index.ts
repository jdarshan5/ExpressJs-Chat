import mongoose, { ObjectId, Schema } from "mongoose";

const onlyTwoMembersValidation = (val: Array<any>) => {
  return val.length === 2;
}

export interface ConversationDocument extends mongoose.Document {
  members: {
    type: Array<Schema.Types.ObjectId>
  },
  messages: {
    type: Array<Schema.Types.ObjectId>,
  },
  last_message: Schema.Types.ObjectId | null,
  created_at: Date,
  updated_at: Date,
};

const ConversationSchema = new Schema<ConversationDocument>({
  members: {
    type: Array<Schema.Types.ObjectId>,
    validate: [
      onlyTwoMembersValidation,
      'Only two members allowed in chat'
    ],
    ref: 'Users',
  },
  messages: {
    type: Array<Schema.Types.ObjectId>,
    ref: 'Message',
  },
  last_message: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
  },
});

export default mongoose.model<ConversationDocument>('Conversation', ConversationSchema);
