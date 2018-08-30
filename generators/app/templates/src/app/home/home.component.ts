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
    // TODO: Get this to work
    /*this.auth.session.subscribe((session: any) => {
      console.log('Session: '+session);
    });*/
    if (localStorage.getItem('solid-auth-client')) {
      this.router.navigateByUrl('/card');
    }

    // This replicates a provider registry we will get eventually. For now, static array.
    this.identityProviders = this.auth.getIdentityProviders();
  }

  onLoginPopup = async () => {
    this.auth.solidLoginPopup();
  }

  onLogin = async () => {
    try {
      await this.auth.solidLogin(this.selectedProviderUrl);
    } catch (err) {
      console.log('An error has occurred logging in: ' + err);
    }
  }

  goToRegistration() {
    this.router.navigateByUrl('/register');
  }
}
