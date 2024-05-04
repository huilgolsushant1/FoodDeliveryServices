import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:8080'); // Replace with your Spring Boot server URL
  }

  sendNotification(message: string) {
    this.socket.emit('notification', message);
  }

  getNotifications(): Observable<string> {
    return new Observable(observer => {
      this.socket.on('notification', (message: string) => {
        observer.next(message);
      });
    });
  }
}
