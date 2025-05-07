import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'll-dashboard-profile',
  templateUrl: './dashboard-profile.component.html',
  styleUrls: ['./dashboard-profile.component.scss']
})
export class DashboardProfileComponent implements OnInit {
  user: any = {};
  editMode = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const userId = sessionStorage.getItem('userId');

    if (userId) {
      this.authService.getUserById(+userId).subscribe({
        next: (data) => {
          this.user = data;
          console.log('User profile loaded:', data);
        },
        error: (err) => {
          console.error('Error loading user profile:', err);
        }
      });
    }
  }
}
