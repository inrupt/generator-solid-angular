import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, from } from 'rxjs';
// import * as solid from 'solid-auth-client';
declare let solid: any;
// Service
import { RdfService } from './rdf.service';

interface SolidSession {
  accessToken: string;
  clientId: string;
  idToken: string;
  sessionKey: string;
  webId: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  session: Observable<SolidSession>;
  fechInit = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/sparql-update',
    },
    body: '',
  };

  constructor(private router: Router, private rdf: RdfService) {
    this.isSessionActive();
  }

  /*
   * This will check if current session is active to avoid security problems
  */
  isSessionActive = async () => {
    this.session = from(solid.auth.currentSession());
  }

  solidLoginPopup = async () => {
    try {
      await solid.auth.popupLogin({ popupUri: './login'});
      // Check if session is valid to avoid redirect issues
      await this.isSessionActive();

      // popupLogin success redirect to profile
      this.router.navigate(['/card']);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }

  solidSignOut = async () => {
    try {
      await solid.auth.logout();
      // Remove localStorage
      localStorage.removeItem('solid-auth-client');
      // Redirect to home page
      this.router.navigate(['/']);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }

  parseUpdateSparkQL = (options: { key: string, value: any, nextValue: any }) => {
    return `DELETE {  <${this.rdf.session.webId}> <http://xmlns.com/foaf/0.1/${options.key}> "${options.value}". }
    INSERT { <${this.rdf.session.webId}> <http://xmlns.com/foaf/0.1/${options.key}> "${options.nextValue}". }`;
  }

  parseInsertDeleteSarkQL = (options: { key: string, value: any, action: string }) => {
    return `${options.action} { <${this.rdf.session.webId}> <http://xmlns.com/foaf/0.1/${options.key}> "${options.value}". }`;
  }

  updateProfile = async (key: string, value: any, nextValue: any) => {
    try {
      this.fechInit.body = this.parseUpdateSparkQL({ key, value, nextValue });

      await solid.auth.fetch(this.rdf.session.webId, this.fechInit);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }

  insertDeleteProfile = async (key: string, value: any, action: string = 'INSERT') => {
    try {
      this.fechInit.body = this.parseInsertDeleteSarkQL({ key, value, action });

      await solid.auth.fetch(this.rdf.session.webId, this.fechInit);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }

  solidLogin = async (idp: string) => {
    return solid.auth.login(idp);
  }

  getIdentityProviders(): object[] {
    return [
      {
        providerName: 'Inrupt',
        providerImage: '/assets/images/Inrupt.png',
        providerLoginUrl: '0',
        providerDesc: 'Lorem ipsum dolor sit amet non ipsom dolor'
      },
      {
        providerName: 'Solid Community',
        providerImage: '/assets/images/Solid.png',
        providerLoginUrl: '1',
        providerDesc: 'Lorem ipsum dolor sit non consectetur'
      },
      {
        providerName: 'Janeiro Digital',
        providerImage: '/assets/images/JD.svg',
        providerLoginUrl: 'https://janeirodigital.exchange/auth',
        providerDesc: 'Lorem ipsum dolor sit amet non'
      },
      {
        providerName: 'Other (Enter WebID)',
        providerImage: '/assets/images/Generic.png',
        providerLoginUrl: null
      }
    ];
  }
}
