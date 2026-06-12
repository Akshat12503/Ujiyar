import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  // Simple mock credentials model bound to our inputs
  loginData = {
    email: '',
    password: ''
  };

  onLoginSubmit() {
    console.log('Mock login triggered. Payload:', this.loginData);
    alert(`Welcome back to Ujiyar! Form payload captured locally.`);
    // We will hook up the global Router navigation service logic here later
  }
}