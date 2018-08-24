import { Component, OnInit } from '@angular/core';

// Auth Service
import { RdfService } from '../services/rdf.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  name: string;

  constructor(private rdf: RdfService) { }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile = async () => {
    this.name = await this.rdf.getProfile();
  }

}
