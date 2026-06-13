import { Component, NgZone } from '@angular/core';
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
  
  // Voice tracking states
  isRecording: boolean = false;
  private recognition: any;

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

  constructor(private zone: NgZone) {
    this.initSpeechRecognition();
  }

  // Initializes the native browser Web Speech API
  initSpeechRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true; // Allows text to appear while speaking
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        let transcript = '';
        // Loop through the active speech results and compile the sentence
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        
        // Push the transcription back into the Angular lifecycle to update the UI
        this.zone.run(() => {
          this.newMessageText = transcript;
        });
      };

      this.recognition.onerror = (event: any) => {
        console.error("Microphone error:", event.error);
        this.zone.run(() => this.isRecording = false);
      };

      this.recognition.onend = () => {
        this.zone.run(() => this.isRecording = false);
      };
    } else {
      console.warn("Speech Recognition API is not supported in this browser.");
    }
  }

  // Toggles the microphone listener on and off
  toggleVoiceRecognition() {
    if (!this.recognition) {
      alert("Your browser does not support voice recognition. Please try Chrome or Edge.");
      return;
    }

    if (this.isRecording) {
      this.recognition.stop();
      this.isRecording = false;
    } else {
      this.newMessageText = ''; // Clear input before dictating
      this.recognition.start();
      this.isRecording = true;
    }
  }

  sendMessage(textToSend?: string) {
    // If the user clicks send while the mic is hot, turn it off automatically
    if (this.isRecording) {
      this.toggleVoiceRecognition();
    }

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