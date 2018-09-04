import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Auth Service
import { AuthService } from '../services/solid.auth.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router) { }

  // TODO: Provide models and definitions for these objects
  identityProviders: object[];
  selectedProviderUrl: string;
  customProviderUrl: string;

  ngOnInit() {
    // If we're authenticated, go to profile
    if (localStorage.getItem('solid-auth-client')) {
      this.router.navigateByUrl('/card');
    }

    this.identityProviders = this.auth.getIdentityProviders();
  }

  /*
  *  Alternate login function for Solid. See service for more details.
  */
  onLoginPopup = async () => {
    this.auth.solidLoginPopup();
  }

  onLogin = async () => {
    try {
      this.auth.solidLogin(this.selectedProviderUrl);
    } catch (err) {
      console.log('An error has occurred logging in: ' + err);
    }
  }

  goToRegistration() {
    this.router.navigateByUrl('/register');
  }
}
