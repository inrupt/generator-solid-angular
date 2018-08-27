import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, from } from 'rxjs';
import { currentSession, popupLogin, logout } from 'solid-auth-client';

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

  constructor(private router: Router) {
    this.isSessionActive();
  }

  /*
   * This will check if current session is active to avoid security problems
  */
  isSessionActive = async () => {
    this.session = from(currentSession());
  }

  solidLogin = async () => {
    try {
      await popupLogin({ popupUri: './login'});
      // Check if session is valid to avoid redirect issues
      await this.isSessionActive();

      // popupLogin success redirect to dashboard
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }

  solidSignOut = async () => {
    try {
      await logout();
      // Remove localStorage
      localStorage.removeItem('solid-auth-client');
      // Redirect to home page
      this.router.navigate(['/']);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }
}
