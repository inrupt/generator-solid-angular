import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/solid.auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  availableProviders: any[];

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.availableProviders = this.auth.getIdentityProviders();
    this.availableProviders = this.availableProviders.filter(idp => idp.providerLoginUrl !== null);
  }

}
