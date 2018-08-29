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
  identityProviders: any;
  selectedProviderUrl: string;
  customProviderUrl: string;

  ngOnInit() {
    //If we're authenticated, go to profile
    this.auth.session.subscribe()

    // This replicates a provider registry we will get eventually. For now, static array.
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
        providerLoginUrl: 'https://janeirodigital.exchange/auth'
      },
      {
        providerName: 'Other (Enter WebID)',
        providerImage: '',
        providerLoginUrl: null
      }
    ];
  }

  onLoginPopup = async () => {
    this.auth.solidLoginPopup();
  }

  onLogin = async () => {
    try {
      await this.auth.solidLogin(this.selectedProviderUrl);
    } catch(err) {
      console.log('An error has occurred logging in: ' + err);
    }
  }

}
