import { User } from 'src/user/user.model';

export interface OnlineUser {
  device: User;
  isOnline: boolean;
}
