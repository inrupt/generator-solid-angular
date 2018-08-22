import { Component, OnInit } from '@angular/core';
import * as $rdf from 'rdflib/lib/index.js';

const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
const VCARD = $rdf.Namespace('http://www.w3.org/2006/vcard/ns#');

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  store = $rdf.graph();
  fetcher = new $rdf.Fetcher(this.store);
  name: string;

  constructor() { }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile = async () => {
    try {
      const session = JSON.parse(localStorage.getItem('solid-auth-client')).session;

      await this.fetcher.load(session.webId);
      this.name = this.store.any($rdf.sym(session.webId), VCARD('fn')).value;
      console.log(this.store.any($rdf.sym(session.webId), VCARD('fn')));
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }

}
