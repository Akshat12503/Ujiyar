import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../services/chat.service';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-community-hub',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './community-hub.component.html',
  styleUrls: ['./community-hub.component.css']
})
export class CommunityHubComponent implements OnInit, OnDestroy {
  // These must match the exact GUIDs we seeded in the C# ApplicationDbContext!
  public safeRooms = [
    { id: '11111111-1111-1111-1111-111111111111', name: '# venting-space' },
    { id: '22222222-2222-2222-2222-222222222222', name: '# wins-of-the-day' },
    { id: '33333333-3333-3333-3333-333333333333', name: '# anxiety-support' }
  ];

  public activeRoom = this.safeRooms[0]; // Default to venting-space
  public newMessage: string = '';
  public isGhostMode: boolean = false;
  
  public messages: any[] = [];
  public systemWarning: string = '';
  public currentUser: any = null;

  private subs: Subscription = new Subscription();

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // 1. Get the logged-in user
    this.subs.add(this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    }));

    // 2. Start the WebSocket connection
    this.chatService.startConnection();

    // 3. Listen for live messages
    this.subs.add(this.chatService.messages$.subscribe(msgs => {
      this.messages = msgs;
    }));

    // 4. Listen for AI moderation warnings
    this.subs.add(this.chatService.systemMessage$.subscribe(msg => {
      this.systemWarning = msg;
    }));

    // 5. Join the default room
    setTimeout(() => {
      this.switchRoom(this.activeRoom);
    }, 500); // Small delay to ensure connection is established
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  switchRoom(room: any) {
    this.activeRoom = room;
    this.chatService.joinRoom(room.id);
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.currentUser) return;

    this.chatService.sendMessage(
      this.activeRoom.id, 
      this.currentUser.id, 
      this.newMessage, 
      this.isGhostMode
    );

    this.newMessage = ''; // Clear the input box
  }
}