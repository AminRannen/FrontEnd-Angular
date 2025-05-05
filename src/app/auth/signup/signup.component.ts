// signup.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { mustMatch } from 'src/app/utils/validators';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showSuccess = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, {
      validator: mustMatch('password', 'password_confirmation')
    });
  }

  onSubmit() {
    if (this.signupForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.showSuccess = false;

    const { name, email, password } = this.signupForm.value;

    this.authService.register(email, name, password, 1).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.showSuccess = true;
        
        // Optional: Auto-login after registration
        this.authService.login(email, password).subscribe({
          next: (loginResponse) => {
            sessionStorage.setItem('token', loginResponse.token);
            this.router.navigate(['/']);
          },
          error: (loginError) => {
            // Registration succeeded but auto-login failed
            this.router.navigate(['/auth/login']);
          }
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 
                            error.error?.error || 
                            'Registration failed. Please try again.';
      }
    });
  }

  get f() {
    return this.signupForm.controls;
  }
}