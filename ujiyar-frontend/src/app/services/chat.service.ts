import { Injectable, NgZone } from '@angular/core'; // <-- 1. Import NgZone
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private hubConnection: signalR.HubConnection | undefined;
  
  public messages$ = new BehaviorSubject<any[]>([]);
  public systemMessage$ = new BehaviorSubject<string>('');
  
  private currentRoomId: string = '';

  // 2. Inject NgZone into the constructor
  constructor(private zone: NgZone) { }

  public startConnection(): Promise<void> {
    if (this.hubConnection) {
      return Promise.resolve();
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5000/chatHub') 
      .withAutomaticReconnect()
      .build();

    // 3. Wrap all incoming listeners in this.zone.run() so Angular knows to redraw!
    this.hubConnection.on('ReceiveMessage', (message) => {
      // Use toLowerCase() just in case C# sent the GUID in uppercase
      if (message.roomId.toLowerCase() === this.currentRoomId.toLowerCase()) {
        this.zone.run(() => {
          const currentMessages = this.messages$.getValue();
          this.messages$.next([...currentMessages, message]);
        });
      }
    });

    this.hubConnection.on('LoadHistory', (history: any[]) => {
      this.zone.run(() => {
        this.messages$.next(history);
      });
    });

    this.hubConnection.on('ReceiveSystemMessage', (message) => {
      this.zone.run(() => {
        this.systemMessage$.next(message);
        setTimeout(() => { this.systemMessage$.next(''); }, 5000);
      });
    });

    return this.hubConnection
      .start()
      .then(() => console.log('Live Chat Connection Started!'))
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  public joinRoom(roomId: string) {
    if (!this.hubConnection) return;
    
    if (this.currentRoomId) {
      this.hubConnection.invoke('LeaveRoom', this.currentRoomId)
        .catch(err => console.error('Error leaving room:', err));
    }

    this.currentRoomId = roomId;
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