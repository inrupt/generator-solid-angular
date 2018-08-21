import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { popupLogin } from 'solid-auth-client/dist-lib/solid-auth-client.bundle.js';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor( private router: Router) { }

  ngOnInit() {
  }

  onLogin = async () => {
    try {
      await popupLogin({ popupUri: './login'});
      // popupLogin success redirect to dashboard
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }

}
