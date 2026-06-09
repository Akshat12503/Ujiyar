import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  registerData = {
    name: '',
    email: '',
    password: ''
  };

  onRegisterSubmit() {
    console.log('Mock registration triggered. Payload:', this.registerData);
    alert('Account created successfully (Mock Mode)! Proceeding to layout setup.');
  }
}