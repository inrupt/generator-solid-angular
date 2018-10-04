import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { currentSession } from 'solid-auth-client';

// Services
import { AuthService } from '../services/solid.auth.service';

class Session {
  constructor() {}

  webId: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  session: Session = new Session();

  constructor(private auth: AuthService, private route: ActivatedRoute) {}

  ngOnInit() {
    console.log('hello');
    this.loadSession();
  }

  loadSession = async () => {
    // this.session = await currentSession();
  }

  onSignOut = () => {
    this.auth.solidSignOut();
  }

}
