import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// Auth Service
import { RdfService } from '../services/rdf.service';


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

  constructor(private rdf: RdfService, private route: ActivatedRoute) {}

  ngOnInit() {
    console.log('log');
    this.loadProfile();
  }

  async loadProfile() {
    try {
    const profile = await this.rdf.getProfile();

    this.name = profile.name;
    this.company = profile.company;
    this.role = profile.role;
    this.image = profile.image;
    this.address = profile.address;
    } catch (error) {
      console.log(`Error: ${error}`);
    }

  }

}
