import { Component, Input } from '@angular/core';
import { Person } from '../person';
import { PersonService } from '../person.service';

@Component({
  selector: 'person-details',
  templateUrl: './person-details.component.html',
  styleUrls: ['./person-details.component.css']
})
export class PersonDetailsComponent {
  @Input()
  person: Person;

  @Input()
  createHandler: Function;
  @Input()
  updateHandler: Function;
  @Input()
  deleteHandler: Function;

  constructor (private personService: PersonService) {}

  createPerson(person: Person) {
    this.personService.createPerson(person).then((newPerson: Person) => {
      this.createHandler(newPerson);
    });
  }

  updatePerson(person: Person): void {
    this.personService.updatePerson(person).then((updatedPerson: Person) => {
      this.updateHandler(updatedPerson);
    });
  }

  deletePerson(personId: String): void {
    this.personService.deletePerson(personId).then((deletedPersonId: String) => {
      this.deleteHandler(deletedPersonId);
    });
  }
}
