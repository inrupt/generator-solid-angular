import { Injectable } from '@angular/core';
declare let $rdf: any;
declare let solid: any;

const VCARD = $rdf.Namespace('http://www.w3.org/2006/vcard/ns#');
const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');

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

  getSession = async() => {
      this.session = await solid.auth.currentSession();
      console.log(this.session);
  }

  storeAny = (node: string, webId?: string) => {
    return this.store.any($rdf.sym(webId || this.session.webId), VCARD(node)).value || '';
  }

  storyName = (node: string, webId?: string) => {
    return this.store.any($rdf.sym(webId || this.session.webId), FOAF(node)).value || '';
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

    if(!this.session) {
      await this.getSession();
    }
    
    try {
      await this.fetcher.load(this.session.webId);

      return {
        name : this.storyName('name'),
        company : this.storeAny('organization-name'),
        //phone: this.storeAny('phone'),
        role: this.storeAny('role'),
        image: this.storeAny('hasPhoto'),
        address: this.getAddress(),
      };
    } catch (error) {
      console.log(`Error fecther: ${error}`);
    }
  }
}
