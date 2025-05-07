import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { menuList as staticMenuList } from '../../data/menus';
import { CartService } from 'src/services/cart.service';

@Component({
  selector: 'll-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  cartCount: number = 0;
  isLoggedIn: boolean = false;

  @Input() topFixed: boolean;
  @Output() toggleSidenav = new EventEmitter();
  isScrolled: boolean;
  menuList = [];
  isLessThenLargeDevice: boolean;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.handleUserRole(); // validate and assign role
    this.checkAuthState(); // set isLoggedIn
  
    this.breakpointObserver.observe(['(max-width: 1199px)']).subscribe(({ matches }) => {
      this.isLessThenLargeDevice = matches;
    });
  
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
  
    // Filter menu based on role
    this.menuList = staticMenuList.filter(menu => {
      if (menu.name === 'Dashboard') {
        return this.userRole === '0'; // show only for admin
      }
      return true;
    });
  }
  

  checkAuthState(): void {
    // Check if token exists in sessionStorage
    this.isLoggedIn = !!sessionStorage.getItem('token'); // or your actual token key
  }

  logout(): void {
    // Clear all session storage
    sessionStorage.clear();
  
    // Clear all local storage
    localStorage.clear();
  
    // Reset login state
    this.isLoggedIn = false;
  
    // Optional: Refresh page to ensure full logout effect
    // window.location.reload();
  }
  
  userRole: string = 'guest'; // fallback default

  handleUserRole(): void {
    const role = sessionStorage.getItem('userRole');
    if (role !== '0' && role !== '1') {
      sessionStorage.removeItem('userRole');
      this.userRole = 'guest';
    } else {
      this.userRole = role;
    }
  }
  
  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isScrolled = window.pageYOffset > 15;
  }
}