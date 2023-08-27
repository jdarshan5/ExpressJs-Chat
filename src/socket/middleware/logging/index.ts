import { Socket } from 'socket.io';

export const logging = (socket: Socket, next: any) => {
  // socket.data.user = 'userId';
  // console.log(socket.data);
  // let token: string;
  // try {
  //   token = socket.request.headers.authorization.split(' ')[1];
  // } catch (e) {

  // }
  // console.log(socket.request);
  next();
}