import { Injectable } from '@angular/core';
import { Person } from './person';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class PersonService {

  private personsUrl = '/api/persons';
  
      constructor (private http: Http) {}
  
      // get("/api/persons")
      getPersons(): Promise<void | Person []> {
        return this.http.get(this.personsUrl )
                   .toPromise()
                   .then(response => response.json() as Person[])
                   .catch(this.handleError);
      }

      // post("/api/persons")
      createPerson(newPerson: Person): Promise<void | Person> {
        return this.http.post(this.personsUrl, newPerson)
                   .toPromise()
                   .then(response => response.json() as Person)
                   .catch(this.handleError);
      } 

      // delete("/api/persons/:id")
      deletePerson(delPersonId: String): Promise<void | String> {
        return this.http.delete(this.personsUrl + '/' + delPersonId)
                   .toPromise()
                   .then(response => response.json() as String)
                   .catch(this.handleError);
      }

      // put("/api/persons/:id")
      updatePerson(putPerson: Person): Promise<void | Person> {
        var putUrl = this.personsUrl + '/' + putPerson._id;
        return this.http.put(putUrl, putPerson)
                   .toPromise()
                   .then(response => response.json() as Person)
                   .catch(this.handleError);
      }

      private handleError (error: any) {
        let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
      }

}
