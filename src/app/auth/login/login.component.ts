import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'll-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password, rememberMe } = this.loginForm.value;
    
    this.authService.login(email, password).subscribe({
      next: (response) => {
        if (rememberMe) {
          localStorage.setItem('token', response.token);
          sessionStorage.setItem('userRole', response.user.role);
          sessionStorage.setItem('userID', response.user.id);

        } else {
          sessionStorage.setItem('token', response.token);
          sessionStorage.setItem('userRole', response.user.role);
          sessionStorage.setItem('userId', response.user.id);

        }

         // ✅ Role-based redirect
      if (response.user.role === 0) {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/']);
      }
    },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
      }
    });
  }
  
}