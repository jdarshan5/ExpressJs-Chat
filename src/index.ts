import './config/index.ts';
import './db/conn.ts';

import express from 'express';

import { createServer } from "http";

import { Server } from 'socket.io';

import router from "./routes/index.ts";

import Middleware from './socket/middleware/index.ts';
import Events from "./socket/events/index.ts";

import UserModal, { UserDocument } from "./models/user/index.ts";
import ConversationModal, { ConversationDocument } from './models/conversation/index.ts';

const PORT = process.env.PORT;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.json());

app.use('/auth', router.AuthRouter);
app.use('/user', router.UserRouter);
app.use('/conversation', router.ConversationRouter);
app.use('/message', router.MessageRouter);

io.use(Middleware.logging);

io.on('connection', async (socket) => {
    console.log(`ID: ${socket.id} connected!`);
    console.log(`Total sockets alive: ${(await io.fetchSockets()).length}`);

    // Fetch user id from query and store that user in socket.data so we can access this user while this socket is alive
    if (socket.handshake.query._id) {
        console.log('Initializing User...');
        const { _id } = socket.handshake.query;
        let user: UserDocument;
        try {
            user = await UserModal.findOne({ _id: _id }).exec();
            socket.data.user = user;
            if (!user) throw { message: "No such user exists!" };
        } catch (e) {
            console.error(e);
            socket.emit('user_error', e);
            socket.disconnect(true);
            return;
        }
        const conversationList = await ConversationModal.find({
            members: user._id,
        }).exec();
        conversationList.forEach(async (i: ConversationDocument) => {
            await socket.join(i._id.toString());
            socket.to(i._id.toString()).emit('room_joined', i._id);
        });
        console.log(`User Initialized...\nSocket ${socket.id} has been associated with user ${socket.handshake.query._id}`);
    } else {
        console.log(`Bypassing user initialization (Reason: user id is not provided)...`);
    }

    Events.ConversationEvents(io, socket);
    Events.MessageEvents(io, socket);
    Events.UserEvents(io, socket);
    socket.on('disconnecting', (reason: String) => {
        console.error(reason);
    });
    socket.on('exit', () => {
        socket.disconnect(true);
    });
    socket.on('disconnect', () => {
        console.log(`Data: ${JSON.stringify(socket.data)}`);
        console.log(`ID: ${socket.id} disconnected!`);
        socket.disconnect(true);
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server is Successfully Running, and App is listening on port ${PORT}`);
});
