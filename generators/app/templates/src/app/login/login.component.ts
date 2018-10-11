import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Auth Service
import { AuthService } from '../services/solid.auth.service';
import { SolidProvider } from '../models/solid-provider.model';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router) { }

  /**
   * A list of Solid Identity Providers
   * @type {SolidProvider[]}
   */
  identityProviders: SolidProvider[];
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
    const idp: string = this.selectedProviderUrl ? this.selectedProviderUrl : this.customProviderUrl;

    if (idp) {
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
