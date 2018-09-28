import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Auth Service
import { AuthService } from '../services/solid.auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

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
  *  Alternate login-popup function for Solid. See service for more details.
  */
  onLoginPopup = async () => {
    this.auth.solidLoginPopup();
  }

  onLogin = async () => {
    let idp: string = this.selectedProviderUrl ? this.selectedProviderUrl : this.customProviderUrl;

    if(idp) {
      try {
        this.auth.solidLogin(idp);
      } catch (err) {
        console.log('An error has occurred logging in: ' + err);
      }
    }
  }

  goToRegistration() {
    this.router.navigateByUrl('/register');
  }
}
