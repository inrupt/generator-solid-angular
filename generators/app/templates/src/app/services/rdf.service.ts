import { Injectable } from '@angular/core';
import * as $rdf from 'rdflib/lib/index.js';

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

  storeAny = (node: string, webId?: string) => {
    return this.store.any($rdf.sym(webId || this.session.webId), VCARD(node)).value;
  }

  getAddress = () => {
    const linkedUri = this.storeAny('hasAddress');

    if (linkedUri) {
      return {
        locality: this.storeAny('locality', linkedUri),
        country_name: this.storeAny('country-name', linkedUri),
        region: this.storeAny('region', linkedUri),
        street: this.storeAny('street-address', linkedUri),
      };
    }

    return {};
  }

  getProfile = async () => {
    try {
      await this.fetcher.load(this.session.webId);

      return {
        name : this.storeAny('fn'),
        company : this.storeAny('organization-name'),
        role: this.storeAny('role'),
        image: this.storeAny('hasPhoto'),
        address: this.getAddress(),
      };
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }
}
