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
    this.menuList = staticMenuList;
    this.checkAuthState(); // Check auth state on init

    this.breakpointObserver.observe(['(max-width: 1199px)']).subscribe(({ matches }) => {
      this.isLessThenLargeDevice = matches;
    });

    // Subscribe to cart changes
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
  }

  checkAuthState(): void {
    // Check if token exists in sessionStorage
    this.isLoggedIn = !!sessionStorage.getItem('token'); // or your actual token key
  }

  logout(): void {
    // Remove token from sessionStorage
    sessionStorage.removeItem('token'); // or your actual token key
    this.isLoggedIn = false;
    // Optional: You might want to navigate to login page after logout
    // window.location.reload(); // Uncomment if you want to refresh the page
  }

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isScrolled = window.pageYOffset > 15;
  }
}