import { Component, OnInit } from '@angular/core';
import { currentSession } from 'solid-auth-client';

class Session {
  constructor(webId: string, accessToken: string, idp: string, idToken: string) {}
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  session: Session = {};

  constructor() { }

  async ngOnInit() {
    this.session = await currentSession();
  }

}
