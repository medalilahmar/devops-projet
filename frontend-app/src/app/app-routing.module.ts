import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentComponent } from './department/department.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { StudentFormComponent } from './student-form/student-form.component';
import { StudentListComponent } from './student-list/student-list.component';


const routes: Routes = [
 { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'departments', component: DepartmentComponent },
  { path: 'students', component: StudentFormComponent },
  { path: 'studentslist', component: StudentListComponent },
  { path: 'students/:id', component: DepartmentComponent },

  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
