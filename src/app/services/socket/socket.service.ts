import { inject, Injectable } from '@angular/core';
import {io, Socket} from 'socket.io-client';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private authService: AuthService = inject(AuthService);


  constructor() { 
    this.socket = io('http://localhost:4000');
    this.socket.emit('register', this.authService?.user()?._id );   
  }



  sendMessage(message: any, callback?: (response: any) => void) {
    this.socket.emit('sendMessage', message, callback);
  }

  onMessage(callback: (msg: any) => void) {
    this.socket.on('getMessage', callback);
  }

  disconnect() {
    this.socket.disconnect();
  }
}
