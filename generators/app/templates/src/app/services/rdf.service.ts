import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
declare let $rdf: any;
declare let solid: any;

const VCARD = $rdf.Namespace('http://www.w3.org/2006/vcard/ns#');
const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');

// A service layer for retrieving data from rdf sources
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

  constructor (private toastr: ToastrService) {
    this.getSession();
  }

  // Fetch session from Solid, and store results in localStorage
  getSession = async() => {
    this.session = await solid.auth.currentSession(localStorage);
  }

  getValueFromVcard = (node: string, webId?: string) => {
    const store = this.store.any($rdf.sym(webId || this.session.webId), VCARD(node));
    if (store) {
      return store.value;
    }
    return '';
  }

  getValueFromFoaf = (node: string, webId?: string) => {
    const store = this.store.any($rdf.sym(webId || this.session.webId), FOAF(node));
    if (store) {
      return store.value;
    }
    return '';
  }

  transformDataForm = (form: NgForm, me: any, doc: any) => {
    const insertions = [];
    const deletions = [];
    const fields = Object.keys(form.value);
    const oldProfileData = JSON.parse(localStorage.getItem('oldProfileData'));

    // We need to split out into three code paths here:
    // 1. There is an old value and a new value. This is the update path
    // 2. There is no old value and a new value. This is the insert path
    // 3. There is an old value and no new value. Ths is the delete path
    // These are separate codepaths because the system needs to know what to do in each case
    fields.map(field => {

      //Field name for use with rdf data. Pulled out because the naming convention isn't usable in javascript
      let fieldName = this.getFieldName(field);
      let linkedUri = this.getUriForField(field, me);
      let fieldValue = this.getFieldValue(form, field);
      let oldFieldValue = this.getOldFieldValue(field, oldProfileData);


      //Add a value to be updated
      if(oldProfileData[field] && form.value[field] && !form.controls[field].pristine) {
        deletions.push($rdf.st(linkedUri, VCARD(fieldName), oldFieldValue, doc));
        insertions.push($rdf.st(linkedUri, VCARD(fieldName), fieldValue, doc));
      }

      //Add a value to be deleted
      else if(oldProfileData[field] && !form.value[field] && !form.controls[field].pristine) {
        deletions.push($rdf.st(linkedUri, VCARD(fieldName), oldFieldValue, doc));
      }

      //Add a value to be inserted
      else if(!oldProfileData[field] && form.value[field] && !form.controls[field].pristine) {
        insertions.push($rdf.st(linkedUri, VCARD(fieldName), fieldValue, doc));
      }
    });

    return {
      insertions: insertions,
      deletions: deletions
    };
  }

  private getUriForField(field, me): string {
    let uri: any;

    switch(field) {
      case 'phone':
        uri = $rdf.sym(this.getValueFromVcard('hasTelephone'));
        break;
      case 'email':
        uri = $rdf.sym(this.getValueFromVcard('hasEmail'));
        break;
      default:
        uri = me;
        break;
    }

    return uri;
  }

  private getFieldValue(form, field): any {
    let fieldValue: any;

    switch(field) {
      case 'phone':
        fieldValue = $rdf.sym('tel:'+form.value[field]);
        break;
      case 'email':
        fieldValue = $rdf.sym('mailto:'+form.value[field]);
        break;
      default:
        fieldValue = form.value[field];
        break;
    }

    return fieldValue;
  }

  private getOldFieldValue(field, oldProfile): any {
    let oldValue: any;

    switch(field) {
      case 'phone':
        oldValue = $rdf.sym('tel:'+oldProfile[field]);
        break;
      case 'email':
        oldValue = $rdf.sym('mailto:'+oldProfile[field]);
        break;
      default:
        oldValue = oldProfile[field];
        break;
    }

    return oldValue;
  }

  private getFieldName(field): string {
    switch (field) {
      case 'company':
        return 'organization-name';
      case 'phone':
      case 'email':
        return 'value';
      default:
        return field;
    }
  }

  updateProfile = async (form: NgForm) => {
    const me = $rdf.sym(this.session.webId);
    const doc = $rdf.NamedNode.fromValue(this.session.webId.split('#')[0]);
    const data = this.transformDataForm(form, me, doc);

    //Update existing values
    if(data.insertions.length > 0 || data.deletions.length > 0) {
      this.updateManager.update(data.deletions, data.insertions, (response, success, message) => {
        if(success) {
          this.toastr.success('Your Solid profile has been successfully updated', 'Success!');
          form.form.markAsPristine();
          form.form.markAsTouched();
        } else {
          this.toastr.error('Message: '+ message, 'An error has occurred');
        }
      });
    }
  }

  getAddress = () => {
    const linkedUri = this.getValueFromVcard('hasAddress');

    if (linkedUri) {
      return {
        locality: this.getValueFromVcard('locality', linkedUri),
        country_name: this.getValueFromVcard('country-name', linkedUri),
        region: this.getValueFromVcard('region', linkedUri),
        street: this.getValueFromVcard('street-address', linkedUri),
      };
    }

    return {};
  }

  //Function to get email. This returns only the first email, which is temporary
  getEmail = () => {
    const linkedUri = this.getValueFromVcard('hasEmail');

    if (linkedUri) {
      return this.getValueFromVcard('value', linkedUri).split('mailto:')[1];
    }

    return '';
  }

  //Function to get phone number. This returns only the first phone number, which is temporary. It also ignores the type.
  getPhone = () => {
    const linkedUri = this.getValueFromVcard('hasTelephone');

    if(linkedUri) {
      return this.getValueFromVcard('value', linkedUri).split('tel:')[1];
    }
  }

  getProfile = async () => {

    if (!this.session) {
      await this.getSession();
    }

    try {
      await this.fetcher.load(this.session.webId);

      return {
        fn : this.getValueFromVcard('fn'),
        company : this.getValueFromVcard('organization-name'),
        phone: this.getPhone(),
        role: this.getValueFromVcard('role'),
        image: this.getValueFromVcard('hasPhoto'),
        address: this.getAddress(),
        email: this.getEmail(),
      };
    } catch (error) {
      console.log(`Error fetching data: ${error}`);
    }
  }
}
