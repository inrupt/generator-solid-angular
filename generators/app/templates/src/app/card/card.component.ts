import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
// Auth Service
import { RdfService } from '../services/rdf.service';
import { AuthService } from '../services/solid.auth.service';


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit  {

  //TODO: Make a model
  profile: any = {
    image: null,
    name: null,
    address: {},
    organization: null,
    role: null,
    phone: null,
    email: null
  };
  profileImage: string;

  @ViewChild('f') cardForm: NgForm;

  constructor(private rdf: RdfService, private route: ActivatedRoute, private auth: AuthService) {}

  ngOnInit() {
    this.loadProfile();
  }

  async loadProfile() {
    try {
    const profile = await this.rdf.getProfile();
    console.log(profile);
    if (profile) {
      this.profile = profile;
    }

      this.setupProfileData();

    // this.auth.updateProfile();
    } catch (error) {
      console.log(`Error: ${error}`);
    }

  }

  onSubmit () {
    if (this.cardForm.valid) {
      this.auth.solidAuthForm(this.cardForm);
    }
  }

  private setupProfileData() {
    if(this.profile) {
      this.profileImage = this.profile.image ? this.profile.image : '/assets/images/profile.png';
    } else {
      this.profileImage = '/assets/images/profile.png';
    }
  }

  logout() {
    this.auth.solidSignOut();
  }
}
