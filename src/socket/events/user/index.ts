import { Server, Socket } from "socket.io";

import ConversationModal, { ConversationDocument } from "../../../models/conversation/index.ts";
import UserModal from "../../../models/user/index.ts";

const User = (io: Server, socket: Socket) => {
  socket.on('set_user', async (userId) => {
    let user: any;
    try {
      user = await UserModal.findOne({ _id: userId }).exec();
      socket.data.user = user;
      console.log(`${user._id} connected`);
    } catch (e) {
      console.error(e);
    }
    if (!user) return socket.emit('set-user-error', 'No User exist');
    socket.emit('set_user_success', { message: 'Success' });
    const conversationList = await ConversationModal.find({
      members: user._id,
    }).exec();
    console.log('Joining rooms...');
    conversationList.forEach(async (i: ConversationDocument) => {
      await socket.join(i._id.toString());
      console.log(i._id.toString());
      socket.to(i._id.toString()).emit('room_joined', i._id);
    });
    console.log('Rooms joined.');
  });

  socket.on('search_user', async (search: string) => {
    const { user } = socket.data;
    const regex = new RegExp(search, 'i');
    const users = await UserModal.find({
      $and: [
        {
          _id: {
            $nin: user._id,
          },
        },
        {
          $or: [
            {
              email: regex
            },
            {
              firstName: regex,
            },
            {
              lastName: regex,
            }
          ],
        }
      ],
    }).select({ fcmToken: false, password: false }).exec();
    return socket.emit('search_user', users);
  });
}

export default User;