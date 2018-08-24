import { Injectable } from '@angular/core';
import * as $rdf from 'rdflib/lib/index.js';

const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
const VCARD = $rdf.Namespace('http://www.w3.org/2006/vcard/ns#');

@Injectable({
  providedIn: 'root',
})
export class RdfService {
  session: {
    webId: string,
  };
  store = $rdf.graph();
  fetcher = new $rdf.Fetcher(this.store);

  constructor () {
    this.getSession();
  }

  getSession = () => {
    const localSession = localStorage.getItem('solid-auth-client');

    if (localSession) {
      this.session = JSON.parse(localSession).session;
    }
  }

  getProfile = async () => {
    try {
      await this.fetcher.load(this.session.webId);

      return this.store.any($rdf.sym(this.session.webId), VCARD('fn')).value;
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }
}
