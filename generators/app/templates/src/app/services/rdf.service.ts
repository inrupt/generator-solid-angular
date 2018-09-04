import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  updateManager = new $rdf.UpdateManager(this.store);

  constructor () {
    this.getSession();
  }

  getSession = async() => {
    this.session = await solid.auth.currentSession(localStorage);
  }

  storeAny = (node: string, webId?: string) => {
    const store = this.store.any($rdf.sym(webId || this.session.webId), VCARD(node));
    if (store) {
      return store.value;
    }
    return '';
  }

  storyName = (node: string, webId?: string) => {
    const store = this.store.any($rdf.sym(webId || this.session.webId), FOAF(node));
    if (store) {
      return store.value;
    }
    return '';
  }

  transformDataForm = (form: NgForm, me: any, doc: any) => {
    const insertion = [];
    const deletions = [];
    const fields = Object.keys(form.value);

    fields.map(field => {
      deletions.push($rdf.st(me, VCARD(field), '', doc));
      insertion.push($rdf.st(me, VCARD(field), form.value[field], doc));
    });

    return {
      deletions,
      insertion
    };
  }

  updateProfile = async (form: NgForm) => {
    const me = $rdf.sym(this.session.webId);
    const doc = $rdf.NamedNode.fromValue(this.session.webId.split('#')[0]);
    const data = this.transformDataForm(form, me, doc);
    this.updateManager.update(data.deletions, data.insertion, () => {});
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

  getEmail = () => {
    const linkedUri = this.storeAny('hasEmail');

    if (linkedUri) {
      return this.storeAny('value', linkedUri).split('mailto:')[1];
    }

    return '';
  }

  getProfile = async () => {

    if (!this.session) {
      await this.getSession();
    }

    try {
      await this.fetcher.load(this.session.webId);

      return {
        name : this.storyName('name'),
        company : this.storeAny('organization-name'),
        phone: this.storeAny('phone'),
        role: this.storeAny('role'),
        image: this.storeAny('hasPhoto'),
        address: this.getAddress(),
        email: this.getEmail(),
      };
    } catch (error) {
      console.log(`Error fecther: ${error}`);
    }
  }
}
