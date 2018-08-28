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

  //TODO: Provide models and definitions for these objects
  identityProviders: any;
  selectedProvider: any;

  ngOnInit() {
    this.identityProviders = [
      {
        providerName: 'Inrupt',
        providerImage: '/assets/images/Inrupt.png',
        providerLoginUrl: '0'
      },
      {
        providerName: 'Solid Community',
        providerImage: '/assets/images/Solid.png',
        providerLoginUrl: '1'
      },
      {
        providerName: 'Janeiro Digital',
        providerImage: '/assets/images/Janeiro.png',
        providerLoginUrl: 'https://janeirodigital.exchange'
      },
      {
        providerName: 'Other (Enter WebID)',
        providerImage: '',
        providerLoginUrl: '3'
      }
    ]
  }

  onLoginPopup = async () => {
    try {
      await this.auth.solidLoginPopup();
      // popupLogin success redirect to dashboard
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }

  onLogin = async () => {
    try {
      await this.auth.solidLogin(this.selectedProvider);
    } catch {
      console.log('An error has occurred logging in');
    }
  }

}
