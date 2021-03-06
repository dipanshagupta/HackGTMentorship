import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { StudentDetailsComponent } from './students/student-details/student-details.component';
import { StudentListComponent } from './students/student-list/student-list.component';
import { PersonDetailsComponent } from './persons/person-details/person-details.component';
import { PersonListComponent } from './persons/person-list/person-list.component';
import { MentorDetailsComponent } from './mentors/mentor-details/mentor-details.component';
import { MentorListComponent } from './mentors/mentor-list/mentor-list.component';
import { AreaListComponent } from './areas/area-list/area-list.component';
import { AreaDetailsComponent } from './areas/area-details/area-details.component';

@NgModule({
  declarations: [
    AppComponent,
    StudentDetailsComponent,
    StudentListComponent,
    PersonDetailsComponent,
    PersonListComponent,
    MentorDetailsComponent,
    MentorListComponent,
    AreaListComponent,
    AreaDetailsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
