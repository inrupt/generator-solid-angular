import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// Auth Service
import { RdfService } from '../services/rdf.service';
import { AuthService } from '../services/solid.auth.service';


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit  {
  name: string;
  company: string;
  role: string;
  image = '';
  address: Object = {
    street: '',
    contry_name: '',
    region: '',
    locality: '',
  };

  profile: any = {};

  constructor(private rdf: RdfService, private route: ActivatedRoute, private auth: AuthService) {}

  ngOnInit() {
    console.log('log');
    this.loadProfile();
  }

  async loadProfile() {
    try {
    const profile = null; // await this.rdf.getProfile();

    if (profile) {
      this.name = profile.name;
      this.company = profile.company;
      this.role = profile.role;
      this.image = profile.image;
      this.address = profile.address;
    } else {
      this.profile.name = 'James Martin';
      this.profile.company = 'Janeiro Digital';
      this.profile.role = 'Senior Front End Developer';
      this.profile.image = '/assets/images/Inrupt.png';
      this.profile.phone = '(555) 123-4567';
      this.profile.address = profile.address;
    }

    // this.auth.updateProfile();
    } catch (error) {
      console.log(`Error: ${error}`);
    }

  }

}
