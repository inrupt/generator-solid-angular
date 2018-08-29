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

      // popupLogin success redirect to dashboard
      this.router.navigate(['/dashboard']);
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

  parseUpdateSparkQL = (options) => {
    return `DELETE {  <${this.rdf.session.webId}> <http://xmlns.com/foaf/0.1/${options.key}> "${options.value}". }
    INSERT { <${this.rdf.session.webId}> <http://xmlns.com/foaf/0.1/${options.key}> "${options.nextValue}". }`;
  }

  parseInsertDeleteSarkQL = (options: Object) => {
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

  insertDeleteProfile = async (key: string, value: any, action: stirng = 'INSERT') => {
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
}
