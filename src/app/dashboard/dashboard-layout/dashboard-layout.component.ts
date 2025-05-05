import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'll-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent implements OnInit {
  isLessThenLargeDevice;
  userName: string = 'Loading...'; // Initialize with loading state

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('DashboardLayoutComponent initialized');
    
    this.breakpointObserver.observe(['(max-width: 1199px)']).subscribe(({ matches }) => {
      this.isLessThenLargeDevice = matches;
    });

    const userId = sessionStorage.getItem('userId');
    console.log('Retrieved userId from sessionStorage:', userId);

    if (userId) {
      console.log('Attempting to fetch user data for ID:', userId);
      
      this.authService.getUserById(+userId).subscribe({
        next: (user) => {
          console.log('User data received:', user);
          if (user && user.name) {
            this.userName = user.name;
            console.log('Username set to:', this.userName);
          } else {
            console.warn('User data received but name property is missing');
            this.userName = 'User';
          }
        },
        error: (err) => {
          console.error('Error fetching user data:', err);
          this.userName = 'User';
          console.log('Falling back to default username due to error');
        }
      });
    } else {
      console.warn('No userId found in sessionStorage');
      this.userName = 'Guest'; // Fallback when no user ID
    }
  }

  onLogout(): void {
    console.log('Logout initiated');
    this.authService.logout();
    this.router.navigate(['auth/login']);
  }
}