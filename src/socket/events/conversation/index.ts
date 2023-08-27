import { Server, Socket } from "socket.io";

import ConversationModal, { ConversationDocument } from '../../../models/conversation/index.ts';

import mongoose from "mongoose";

const Conversation = (io: Server, socket: Socket) => {
  socket.on('new_conversation', async (userId, callback: Function) => {
    const { user } = socket.data;
    const user2 = new mongoose.Types.ObjectId(userId);
    let conversation: ConversationDocument;
    try {
      conversation = await ConversationModal.findOne({ members: { $all: [user._id, user2] } }).exec();
    } catch (e) {
      return socket.emit('new_conversation_error', e);
    }
    if (conversation) {
      return socket.emit('conversation_exists_error', {
        message: "Conversation already exists",
        conversation: conversation,
      });
    }
    let conv: ConversationDocument;
    try {
      conv = new ConversationModal({ members: [user._id, user2] });
      conv = await conv.save();
    } catch (e) {
      return socket.emit('new_conversation_error', e);
    }
    callback(await conv.populate(['members']));
    socket.emit('new_conversation', await conv.populate(['members']));
  });
}

export default Conversation;
