import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MoodLogService } from '../../../services/mood-log.service';

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
  isRecording: boolean = false;
  private recognition: any;

  starterPrompts: string[] = [
    "I'm feeling overwhelmed today, can we talk?",
    "Give me a 5-minute mindfulness breathing exercise.",
    "Help me reframe a negative thought I had earlier."
  ];

  messages: Message[] = [
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am your Ujiyar Wellness Companion. I am here to provide a safe, non-judgmental space for you to reflect, vent, or practice mindfulness. How is your mind space treating you today?',
      timestamp: new Date(Date.now() - 60000)
    }
  ];

  constructor(private zone: NgZone, private moodLogService: MoodLogService) {
    this.initSpeechRecognition();
  }

  initSpeechRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        
        this.zone.run(() => {
          this.newMessageText = transcript;
        });
      };

      this.recognition.onerror = (event: any) => {
        console.error(event.error);
        this.zone.run(() => this.isRecording = false);
      };

      this.recognition.onend = () => {
        this.zone.run(() => this.isRecording = false);
      };
    }
  }

  toggleVoiceRecognition() {
    if (!this.recognition) return;

    if (this.isRecording) {
      this.recognition.stop();
      this.isRecording = false;
    } else {
      this.newMessageText = '';
      this.recognition.start();
      this.isRecording = true;
    }
  }

  sendMessage(textToSend?: string) {
    if (this.isRecording) {
      this.toggleVoiceRecognition();
    }

    const messageContent = textToSend || this.newMessageText.trim();
    if (!messageContent) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: messageContent,
      timestamp: new Date()
    };
    this.messages.push(userMsg);
    
    if (!textToSend) this.newMessageText = '';

    this.isAiTyping = true;

    this.moodLogService.saveReflection('user-123', 3, messageContent).subscribe({
      next: (response) => {
        this.isAiTyping = false;
        const aiResponse: Message = {
          id: crypto.randomUUID(),
          sender: 'ai',
          text: `I've safely saved your reflection to your private journal. Thank you for sharing.`,
          timestamp: new Date()
        };
        this.messages.push(aiResponse);
      },
      error: (err) => {
        console.error(err);
        this.isAiTyping = false;
      }
    });
  }
}