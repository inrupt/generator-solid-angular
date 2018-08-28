import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, from } from 'rxjs';
import * as solid from 'solid-auth-client';

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

  constructor(private router: Router, private rdf: RdfService) {
    this.isSessionActive();
  }

  /*
   * This will check if current session is active to avoid security problems
  */
  isSessionActive = async () => {
    this.session = from(solid.currentSession());
  }

  solidLogin = async () => {
    try {
      await solid.popupLogin({ popupUri: './login'});
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
      await solid.logout();
      // Remove localStorage
      localStorage.removeItem('solid-auth-client');
      // Redirect to home page
      this.router.navigate(['/']);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }

  updateProfile = async () => {
    try {
      const init = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/sparql-update',
        },
        body: `PREFIX foaf: <http://xmlns.com/foaf/0.1/>
              DELETE { <${this.rdf.session.webId}> foaf:name "Jairo Campos"@en }
              INSERT { <${this.rdf.session.webId}> foaf:givenName "Jairo"@en }`,
      };
      // console.log(fecthv);
      const result = await solid.fetch(this.rdf.session.webId, init);
      console.log(result, 'rresult');
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }
}
