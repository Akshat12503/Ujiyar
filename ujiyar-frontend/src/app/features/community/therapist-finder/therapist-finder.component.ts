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

  // Static specialized disciplines filter catalog
  specialties: string[] = ['All', 'Anxiety & Stress', 'CBT Specialist', 'Work Burnout', 'Mindfulness Coach'];

  // Local Mock Professional Health Providers Registry Database
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
      imageUrl: '👩‍⚕️'
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
      imageUrl: '👨‍⚕️'
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
      imageUrl: '👩‍⚕️'
    }
  ];

  // Dynamic pipe emulator filtering our array list inside local components runtime
  get filteredTherapists(): Therapist[] {
    return this.therapists.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                            t.specialty.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesSpecialty = this.selectedSpecialty === 'All' || t.specialty === this.selectedSpecialty;
      return matchesSearch && matchesSpecialty;
    });
  }

  triggerBooking(therapist: Therapist) {
    alert(`Mock Integration: Appointment routing handshake initialized for ${therapist.name}. In Phase 2, this will send an email confirmation and establish an active telehealth workspace room payload.`);
  }
}