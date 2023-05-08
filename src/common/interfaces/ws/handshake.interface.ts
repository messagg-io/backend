import { Handshake } from 'socket.io/dist/socket';
import { IJwtPayload } from '@interfaces/auth';

export interface IHandshake extends Handshake {
  user: IJwtPayload
}