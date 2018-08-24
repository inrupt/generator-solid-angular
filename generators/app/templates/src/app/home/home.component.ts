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

  ngOnInit() {
  }

  onLogin = async () => {
    try {
      await this.auth.solidLogin();
      // popupLogin success redirect to dashboard
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }

}
