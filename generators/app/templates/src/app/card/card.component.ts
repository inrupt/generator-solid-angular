import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { SolidProfile } from '../models/solid-profile.model';
import { RdfService } from '../services/rdf.service';
import { AuthService } from '../services/solid.auth.service';


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit  {

  profile: SolidProfile;
  profileImage: string;
  loadingProfile: Boolean;

  @ViewChild('f') cardForm: NgForm;

  constructor(private rdf: RdfService,
    private route: ActivatedRoute, private auth: AuthService) {}

  ngOnInit() {
    this.loadingProfile = true;
    this.loadProfile();

    // Clear cached profile data
    // TODO: Remove this code and find a better way to get the old data
    localStorage.removeItem('oldProfileData');
  }

  // Loads the profile from the rdf service and handles the response
  async loadProfile() {
    try {
      this.loadingProfile = true;
      const profile = await this.rdf.getProfile();
      if (profile) {
        this.profile = profile;
        this.auth.saveOldUserData(profile);
      }

      this.loadingProfile = false;
      this.setupProfileData();
    } catch (error) {
      console.log(`Error: ${error}`);
    }

  }

  // Submits the form, and saves the profile data using the auth/rdf service
  async onSubmit () {
    if (!this.cardForm.invalid) {
      try {
        await this.rdf.updateProfile(this.cardForm);
        localStorage.setItem('oldProfileData', JSON.stringify(this.profile));
      } catch (err) {
        console.log(`Error: ${err}`);
      }
    }
  }

  // Format data coming back from server. Intended purpose is to replace profile image with default if it's missing
  // and potentially format the address if we need to reformat it for this UI
  private setupProfileData() {
    if (this.profile) {
      this.profileImage = this.profile.image ? this.profile.image : '/assets/images/profile.png';
    } else {
      this.profileImage = '/assets/images/profile.png';
    }
  }

  // Example of logout functionality. Normally wouldn't be triggered by clicking the profile picture.
  logout() {
    this.auth.solidSignOut();
  }
}
