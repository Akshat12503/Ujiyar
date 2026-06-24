import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private hubConnection: signalR.HubConnection | undefined;
  
  // These act as live streams that our UI will listen to
  public messages$ = new BehaviorSubject<any[]>([]);
  public systemMessage$ = new BehaviorSubject<string>('');

  constructor() { }

  public startConnection() {
    // Note: Ensure 5165 matches your backend port!
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5165/chatHub') 
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Live Chat Connection Started!'))
      .catch(err => console.log('Error while starting connection: ' + err));
      
    // 1. Listen for new messages from other users
    this.hubConnection.on('ReceiveMessage', (message) => {
      const currentMessages = this.messages$.getValue();
      this.messages$.next([...currentMessages, message]);
    });

    // 2. Listen for private AI Moderation warnings
    this.hubConnection.on('ReceiveSystemMessage', (message) => {
      this.systemMessage$.next(message);
      
      // Auto-clear the warning after 5 seconds
      setTimeout(() => {
        this.systemMessage$.next('');
      }, 5000);
    });
  }

  public joinRoom(roomId: string) {
    if (!this.hubConnection) return;
    
    // Clear previous messages when switching rooms
    this.messages$.next([]); 
    this.systemMessage$.next('');

    this.hubConnection.invoke('JoinRoom', roomId)
      .catch(err => console.error('Error joining room:', err));
  }

  public sendMessage(roomId: string, userId: string, content: string, isAnonymous: boolean) {
    if (!this.hubConnection) return;

    this.hubConnection.invoke('SendMessage', roomId, userId, content, isAnonymous)
      .catch(err => console.error('Error sending message:', err));
  }
}