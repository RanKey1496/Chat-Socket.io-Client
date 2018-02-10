import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  users;
  conversations: Array<any> = new Array;
  socket;
  message;
  userTyping = false;
  timer: any;
  registered = false;
  username;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.socket = io('https://rankey-socketio-server.herokuapp.com/');
  }

  connectSocket() {
    this.socket.on('message', (data) => {
      this.conversations.push(data);
    });
    this.socket.on('typing', (data) => {
      this.userTyping = data.userId;
    });
    this.socket.on('notyping', (data) => {
      this.userTyping = false;
    });
    this.socket.on('user-registered', (data) => {
      this.users = data.users;
    });
    this.socket.on('user-disconnected', (data) => {
      this.users = data.users;
    });
  }

  register() {
    this.socket.emit('register', this.username);
    this.registered = true;
    this.connectSocket();
  }

  sendMessage() {
    this.socket.emit('add-message', this.message);
    this.message = '';
  }

  typing(e) {
    this.message = e;
    if (this.userTyping == false) {
      this.socket.emit('typing');
    }
    this.resetCounter();
    this.timer = setTimeout(() => {
      console.log('finalizo');
      this.resetCounter();
      this.userTyping = false;
      this.socket.emit('notyping');
    }, 500);
  }

  resetCounter() {
    clearTimeout(this.timer);
  }

}
