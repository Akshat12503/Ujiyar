import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Post {
  id: string;
  authorInitials: string;
  content: string;
  timeAgo: string;
  supportCount: number;
  hasSupported: boolean;
}

interface SupportRoom {
  id: string;
  title: string;
  emoji: string;
  activeCount: number;
  category: string;
}

@Component({
  selector: 'app-community-hub',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './community-hub.component.html'
})
export class CommunityHubComponent {
  newPostText: string = '';

  // Local Mock Support Room Catalog
  rooms: SupportRoom[] = [
    { id: '1', title: 'Navigating Work Burnout', emoji: '💼', activeCount: 14, category: 'Career Balance' },
    { id: '2', title: 'Mindfulness & Meditation Chat', emoji: '🧘', activeCount: 8, category: 'Daily Calming' },
    { id: '3', title: 'Overcoming Social Anxiety Together', emoji: '🌱', activeCount: 22, category: 'Anxiety Support' }
  ];

  // Local Mock Community Post Timeline
  posts: Post[] = [
    {
      id: '1',
      authorInitials: 'AM',
      content: 'Reminding everyone today that progress isn’t linear. If all you did today was breathe and make it through, I’m incredibly proud of you.',
      timeAgo: '20m ago',
      supportCount: 12,
      hasSupported: false
    },
    {
      id: '2',
      authorInitials: 'SK',
      content: 'Finally took a 10-minute screen break and stepped outside to look at the trees. Highly recommend trying it if your mind feels clouded right now.',
      timeAgo: '1h ago',
      supportCount: 8,
      hasSupported: true
    }
  ];

  createPost() {
    if (!this.newPostText.trim()) return;

    const freshPost: Post = {
      id: crypto.randomUUID(),
      authorInitials: 'ME', // Simulating current User logged initials
      content: this.newPostText,
      timeAgo: 'Just now',
      supportCount: 0,
      hasSupported: false
    };

    // Prepend to our view array to simulate real-time layout ingestion updates
    this.posts.unshift(freshPost);
    this.newPostText = '';
    console.log('Community post cached locally:', freshPost);
  }

  toggleSupport(post: Post) {
    if (post.hasSupported) {
      post.supportCount--;
      post.hasSupported = false;
    } else {
      post.supportCount++;
      post.hasSupported = true;
    }
  }
}