import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

@Component({
  selector: 'app-ai-companion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-companion.component.html'
})
export class AiCompanionComponent {
  newMessageText: string = '';
  isAiTyping: boolean = false;

  // Predefined conversation starter chips to improve UX discovery
  starterPrompts: string[] = [
    "I'm feeling overwhelmed today, can we talk?",
    "Give me a 5-minute mindfulness breathing exercise.",
    "Help me reframe a negative thought I had earlier."
  ];

  // In-memory conversation thread history template registry
  messages: Message[] = [
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am your Ujiyar Wellness Companion. I am here to provide a safe, non-judgmental space for you to reflect, vent, or practice mindfulness. How is your mind space treating you today?',
      timestamp: new Date(Date.now() - 60000)
    }
  ];

  sendMessage(textToSend?: string) {
    const messageContent = textToSend || this.newMessageText.trim();
    if (!messageContent) return;

    // 1. Append User Message to local timeline stack
    const userMsg: Message = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: messageContent,
      timestamp: new Date()
    };
    this.messages.push(userMsg);
    
    // Reset layout input box text container property if not a chip trigger
    if (!textToSend) this.newMessageText = '';

    // 2. Trigger simulated typing lifecycle states
    this.isAiTyping = true;
    console.log('Mock payload dispatching... Input Captured:', messageContent);

    // Simulate standard streaming network handshake latency blocks locally
    setTimeout(() => {
      this.isAiTyping = false;
      const aiResponse: Message = {
        id: crypto.randomUUID(),
        sender: 'ai',
        text: `Thank you for sharing that with me. As your companion, I am listening closely. (This is a placeholder response. In Phase 4, this space will process your context using your PostgreSQL history and stream a real reflection response via Gemini RAG).`,
        timestamp: new Date()
      };
      this.messages.push(aiResponse);
    }, 1500);
  }
}