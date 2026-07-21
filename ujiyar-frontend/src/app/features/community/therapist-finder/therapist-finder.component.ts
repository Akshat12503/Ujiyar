import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Therapist {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  languages: string[];
  availability: 'Available Today' | 'Next Week' | 'Fully Booked';
  styleClass: string;
  imageUrl: string;
  about: string;
  education: string;
  sessionTypes: string[];
  reviewCount: number;
  price: string;
}

@Component({
  selector: 'app-therapist-finder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './therapist-finder.component.html'
})
export class TherapistFinderComponent {
  searchQuery: string = '';
  selectedSpecialty: string = 'All';
  selectedTherapist: Therapist | null = null;

  specialties: string[] = ['All', 'Anxiety & Stress', 'CBT Specialist', 'Work Burnout', 'Mindfulness Coach'];

  therapists: Therapist[] = [
    {
      id: '1',
      name: 'Dr. Ananya Sharma',
      specialty: 'Anxiety & Stress',
      experience: '8+ years experience',
      rating: 4.9,
      languages: ['English', 'Hindi'],
      availability: 'Available Today',
      styleClass: 'border-emerald-200 bg-emerald-50/40 text-emerald-700',
      imageUrl: '👩‍⚕️',
      about: 'Dr. Ananya focuses on helping people navigate anxiety and chronic stress through evidence-based, compassionate care. She believes healing happens at your own pace, with no pressure and no judgment.',
      education: 'M.D. Psychiatry, AIIMS Delhi',
      sessionTypes: ['Video Call', 'In-Person', 'Chat Follow-up'],
      reviewCount: 214,
      price: '₹1,200 / session'
    },
    {
      id: '2',
      name: 'Dr. Rohan Malhotra',
      specialty: 'CBT Specialist',
      experience: '12+ years experience',
      rating: 4.8,
      languages: ['English', 'Punjabi'],
      availability: 'Next Week',
      styleClass: 'border-amber-200 bg-amber-50/40 text-amber-700',
      imageUrl: '👨‍⚕️',
      about: 'Dr. Rohan specializes in Cognitive Behavioral Therapy, helping clients identify and reframe unhelpful thought patterns. His approach is structured, practical, and rooted in long-term outcomes.',
      education: 'Ph.D. Clinical Psychology, NIMHANS Bangalore',
      sessionTypes: ['Video Call', 'In-Person'],
      reviewCount: 356,
      price: '₹1,500 / session'
    },
    {
      id: '3',
      name: 'Sarah Jenkins, LCSW',
      specialty: 'Work Burnout',
      experience: '6+ years experience',
      rating: 5.0,
      languages: ['English'],
      availability: 'Available Today',
      styleClass: 'border-emerald-200 bg-emerald-50/40 text-emerald-700',
      imageUrl: '👩‍⚕️',
      about: 'Sarah works with professionals experiencing burnout, helping them rebuild boundaries, rediscover motivation, and create sustainable routines that protect their mental health long-term.',
      education: 'M.S.W., Columbia University',
      sessionTypes: ['Video Call', 'Chat Follow-up'],
      reviewCount: 189,
      price: '₹1,000 / session'
    }
  ];

  get filteredTherapists(): Therapist[] {
    return this.therapists.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            t.specialty.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesSpecialty = this.selectedSpecialty === 'All' || t.specialty === this.selectedSpecialty;
      return matchesSearch && matchesSpecialty;
    });
  }

  openProfile(therapist: Therapist) {
    this.selectedTherapist = therapist;
  }

  closeProfile() {
    this.selectedTherapist = null;
  }

  triggerBooking(therapist: Therapist) {
    alert(`Mock Integration: Appointment routing handshake initialized for ${therapist.name}. In Phase 2, this will send an email confirmation and establish an active telehealth workspace room payload.`);
  }
}