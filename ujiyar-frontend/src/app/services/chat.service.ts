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
  private currentRoomId: string = '';

  constructor() { }

  // Add ": Promise<void>" to the signature
  public startConnection(): Promise<void> {
    // 1. THE FIX: If we are already connected, stop here!
    if (this.hubConnection) {
      return Promise.resolve();
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5000/chatHub') 
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveMessage', (message) => {
      // THE FIX: Only display the message if it belongs to the room we are looking at!
      if (message.roomId === this.currentRoomId) {
        const currentMessages = this.messages$.getValue();
        this.messages$.next([...currentMessages, message]);
      }
    });

    // --- ADD THIS NEW LISTENER FOR ISSUE 2 ---
    this.hubConnection.on('LoadHistory', (history: any[]) => {
      this.messages$.next(history);
    });
    // -----------------------------------------

    this.hubConnection.on('ReceiveSystemMessage', (message) => {
      this.systemMessage$.next(message);
      setTimeout(() => { this.systemMessage$.next(''); }, 5000);
    });

    return this.hubConnection
      .start()
      .then(() => console.log('Live Chat Connection Started!'))
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  public joinRoom(roomId: string) {
    if (!this.hubConnection) return;
    
    // 1. If we were in a room previously, tell C# to unsubscribe us from it
    if (this.currentRoomId) {
      this.hubConnection.invoke('LeaveRoom', this.currentRoomId)
        .catch(err => console.error('Error leaving room:', err));
    }

    // 2. Update our tracker to the new room
    this.currentRoomId = roomId;

    // 3. Clear the UI
    this.messages$.next([]); 
    this.systemMessage$.next('');

    // 4. Join the new room
    this.hubConnection.invoke('JoinRoom', roomId)
      .catch(err => console.error('Error joining room:', err));
  }

  public sendMessage(roomId: string, userId: string, content: string, isAnonymous: boolean) {
    if (!this.hubConnection) return;

    this.hubConnection.invoke('SendMessage', roomId, userId, content, isAnonymous)
      .catch(err => console.error('Error sending message:', err));
  }
}