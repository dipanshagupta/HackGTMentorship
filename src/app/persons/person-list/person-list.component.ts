import { Component, OnInit } from '@angular/core';
import { Person } from '../person';
import { PersonService } from '../person.service';
import { PersonDetailsComponent } from '../person-details/person-details.component';


@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.css'],
  providers: [PersonService]
})
export class PersonListComponent implements OnInit {

  persons: Person[]
  selectedPerson: Person

  constructor(private personService: PersonService) { }

  ngOnInit() {
     this.personService
      .getPersons()
      .then((persons: Person[]) => {
        this.persons = persons.map((person) => {
          if (!person.interest) {
            person.interest = [{
              area_id = ''
            }]
          }
          return person;
        });
      });
  }

  private getIndexOfPerson = (personId: String) => {
    return this.persons.findIndex((person) => {
      return person._id === personId;
    });
  }

  selectPerson(person: Person) {
    this.selectedPerson = person
  }

  createNewPerson() {
    var person: Person = {
      name: '',
      email: '',
      linkedin: '',
      twitter: '',
      role: '',
  
      interest: [{area_id: ''}],
  
      university: '',
      password: ''
    };

    // By default, a newly-created person will have the selected state.
    this.selectPerson(person);
  }

  deletePerson = (personId: String) => {
    var idx = this.getIndexOfPerson(personId);
    if (idx !== -1) {
      this.persons.splice(idx, 1);
      this.selectPerson(null);
    }
    return this.persons;
  }

  addPerson = (person: Person) => {
    this.persons.push(person);
    this.selectPerson(person);
    return this.persons;
  }

  updatePerson = (person: Person) => {
    var idx = this.getIndexOfPerson(person._id);
    if (idx !== -1) {
      this.persons[idx] = person;
      this.selectPerson(person);
    }
    return this.persons;
  }

}
