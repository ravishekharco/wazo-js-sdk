// @flow

import Session from './Session';
import newFrom from '../utils/new-from';

export type NewContact = {
  firstName: string,
  lastName: string,
  phoneNumber: string,
  email: ?string,
  address: ?string,
  entreprise: ?string,
  birthday: ?string,
  note: ?string
};

type ContactResponse = {
  source: string,
  column_values: Array<any>,
  relations: {
    user_id: number,
    xivo_id: string,
    agent_id: ?number,
    endpoint_id: number,
    user_uuid: string,
    source_entry_id: string
  }
};

type ContactsResponse = {
  column_types: Array<?string>,
  term: string,
  column_headers: Array<string>,
  results: Array<ContactResponse>
};

type ContactPersonalResponse = {
  id: string,
  firstName: ?string,
  lastName: ?string,
  number: ?string,
  email: ?string,
  entreprise: ?string,
  birthday: ?string,
  address: ?string,
  note: ?string,
  // @TODO: legacy ?
  firstname: ?string,
  lastname: ?string
};

type ContactArguments = {
  id?: string,
  uuid?: string,
  name?: string,
  number?: string,
  favorited?: boolean,
  email?: string,
  entreprise?: string,
  birthday?: string,
  address?: string,
  note?: string,
  endpointId?: number,
  personal?: boolean,
  presence?: string,
  source?: string,
  sourceId?: string,
  status?: number,
  endpointId?: number,
  uuid?: string
};

export default class Contact {
  id: ?string;
  uuid: ?string;
  name: ?string;
  number: ?string;
  favorited: ?boolean;
  email: ?string;
  entreprise: ?string;
  birthday: ?string;
  address: ?string;
  note: ?string;
  endpointId: ?number;
  personal: ?boolean;
  presence: ?string;
  source: ?string;
  sourceId: string;
  status: ?number;
  uuid: ?string;

  static merge(oldContacts: Array<Contact>, newContacts: Array<Contact>): Array<Contact> {
    return newContacts.map(current => {
      const old = oldContacts.find(contact => contact.is(current));

      return typeof old !== 'undefined' ? current.merge(old) : current;
    });
  }

  static parseMany(response: ContactsResponse): Array<Contact> {
    return response.results.map(r => Contact.parse(r, response.column_types));
  }

  static parse(plain: ContactResponse, columns: Array<?string>): Contact {
    return new Contact({
      name: plain.column_values[columns.indexOf('name')],
      number: plain.column_values[columns.indexOf('number')] || '',
      favorited: plain.column_values[columns.indexOf('favorite')],
      email: plain.column_values[columns.indexOf('email')] || '',
      entreprise: plain.column_values[columns.indexOf('entreprise')] || '',
      birthday: plain.column_values[columns.indexOf('birthday')] || '',
      address: plain.column_values[columns.indexOf('address')] || '',
      note: plain.column_values[columns.indexOf('note')] || '',
      endpointId: plain.relations.endpoint_id,
      personal: plain.column_values[columns.indexOf('personal')],
      source: plain.source,
      sourceId: plain.relations.source_entry_id,
      uuid: plain.relations.user_uuid
    });
  }

  static parseManyPersonal(results: Array<ContactPersonalResponse>): Array<?Contact> {
    return results.map(r => Contact.parsePersonal(r));
  }

  static parsePersonal(plain: ContactPersonalResponse): ?Contact {
    return new Contact({
      name: `${plain.firstName || plain.firstname || ''} ${plain.lastName || plain.lastname || ''}`,
      number: plain.number || '',
      email: plain.email || '',
      source: 'personal',
      sourceId: plain.id,
      entreprise: plain.entreprise || '',
      birthday: plain.birthday || '',
      address: plain.address || '',
      note: plain.note || '',
      favorited: false,
      personal: true
    });
  }

  static newFrom(profile: Contact) {
    return newFrom(profile, Contact);
  }

  constructor({
    id,
    uuid,
    name,
    number,
    email,
    source,
    sourceId,
    entreprise,
    birthday,
    address,
    note,
    presence,
    status,
    endpointId,
    personal
  }: ContactArguments = {}) {
    this.id = id;
    this.uuid = uuid;
    this.name = name;
    this.number = number;
    this.email = email;
    this.source = source;
    this.sourceId = sourceId || '';
    this.entreprise = entreprise;
    this.birthday = birthday;
    this.address = address;
    this.note = note;
    this.presence = presence;
    this.status = status;
    this.endpointId = endpointId;
    this.personal = personal;
  }

  setFavorite(value: boolean) {
    this.favorited = value;

    return this;
  }

  is(other: Contact): boolean {
    return Boolean(other) && this.sourceId === other.sourceId && (this.uuid ? this.uuid === other.uuid : true);
  }

  hasId(id: string): boolean {
    return this.uuid === id;
  }

  hasNumber(number: string): boolean {
    return this.number === number;
  }

  hasEndpointId(endpointId: number): boolean {
    return this.endpointId === endpointId;
  }

  isAvailable(): boolean {
    return this.presence === 'available';
  }

  isDoNotDisturb(): boolean {
    return this.presence === 'donotdisturb';
  }

  isDisconnected(): boolean {
    return this.presence === 'disconnected';
  }

  merge(old: Contact): Contact {
    this.presence = old.presence;
    this.status = old.status;

    return this;
  }

  isIntern(): boolean {
    return !!this.uuid;
  }

  isCallable(session: Session): boolean {
    return !!this.number && !!session && !session.is(this);
  }

  separateName(): { firstName: string, lastName: string } {
    if (!this.name) {
      return {
        firstName: '',
        lastName: ''
      };
    }
    const names = this.name.split(' ');
    const firstName = names[0];
    const lastName = names.slice(1).join(' ');

    return {
      firstName,
      lastName
    };
  }
}
