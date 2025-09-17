import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user: any;
  greeting: string = '';
  greetingMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.setGreeting();
  }

  setGreeting(): void {
    const hour = new Date().getHours();
    if (hour < 12) {
      this.greeting = 'Good Morning';
    } else if (hour < 18) {
      this.greeting = 'Good Afternoon';
    } else {
      this.greeting = 'Good Evening';
    }
    this.greetingMessage = `${this.greeting}, ${this.user?.name || 'Admin'}!`;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  goProfile(): void {
    // Navigate to profile page (you can implement route later)
    console.log('Go to profile page');
  }
}
