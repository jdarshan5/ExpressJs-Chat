import { Server, Socket } from "socket.io";

import ConversationModal, { ConversationDocument } from "../../../models/conversation/index.ts";

import MessageModal, { MessageDocument } from "../../../models/message/index.ts";

const Message = (io: Server, socket: Socket) => {
  // New Message
  socket.on('new_message', async (payload) => {
    const { user } = socket.data;
    let conversation: ConversationDocument;
    try {
      conversation = await ConversationModal.findOne({ $and: [{ members: { $all: user._id } }, { _id: payload.convId }] }).exec();
    } catch (e) {
      console.error(e);
      return socket.emit('new_message_error', { message: "No such conversation exists!", error: e });
    }
    if (!conversation) return socket.emit('new_message_error', { message: "No such conversation exists!" });
    let message: MessageDocument;
    try {
      message = new MessageModal({
        conversation: conversation._id,
        sender: user._id,
        message: payload.message,
      });
      message = await message.save();
    } catch (e) {
      console.error(e);
      return socket.emit('new_message_error', { message: "No such conversation exists!", error: e });
    }
    try {
      conversation = await ConversationModal.findByIdAndUpdate(conversation._id, {
        $set: {
          last_message: message._id,
          updated_at: message.created_at,
        },
        $push: {
          messages: message._id,
        },
      }).populate("last_message").exec();
    } catch (e) {
      console.error(e);
      return socket.emit('new_message_error', { message: "No such conversation exists!", error: e });
    }
    socket.to(conversation._id.toString()).emit('new_message', message);
    socket.emit('new_message', message);
    socket.emit('update_conversation', conversation);
    return socket.to(conversation._id.toString()).emit('update_conversation', conversation);
  });

  // Mark a message as seen
  socket.on('see_message', async (payload) => {
    const { user } = socket.data;
    const { conversationId, messageId } = payload;
    let conversation: ConversationDocument;
    try {
      conversation = await ConversationModal.findOne({
        _id: conversationId,
        members: user._id,
      }).exec();
      if (!conversation) {
        return socket.emit('see_message_error', {
          message: "User not part of this conversation",
        });
      }
    } catch (e) {
      return socket.emit('see_message_error', e);
    }
    let message: MessageDocument;
    let updatedMessage: MessageDocument;
    try {
      message = await MessageModal.findOne({
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
        return socket.emit('see_message_error', {
          message: "No message found in this conversation / Message already seen",
        });
      }
      updatedMessage = await MessageModal.findByIdAndUpdate(
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
      return socket.emit('see_message_error', e);
    }
    socket.to(conversation._id).emit('see_message_success', updatedMessage);
    return socket.emit('see_message_success', updatedMessage);
  });
}

export default Message;