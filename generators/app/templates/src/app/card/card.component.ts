import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
// Auth Service
import { RdfService } from '../services/rdf.service';
import { AuthService } from '../services/solid.auth.service';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit  {

  profile: object = {};

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

}
