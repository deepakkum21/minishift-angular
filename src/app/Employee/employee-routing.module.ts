import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListEmployeesComponent } from './list-employees/list-employees.component';
import { CreateEmployeeComponent } from './create-employee/create-employee.component';

const employeeRoutes: Routes = [

  {
    path: '',
    component: ListEmployeesComponent
  },
  {
    path: 'create',
    component: CreateEmployeeComponent
  },
  {
    path: 'edit/:id',
    component: CreateEmployeeComponent
  }

];

// for making a route prefixed with ame route
/*
const employeeRoutes: Routes = [
  {
    path: 'employees',
    children: [
      {
        path: '',
        component: ListEmployeesComponent
      },
      {
        path: 'create',
        component: CreateEmployeeComponent
      },
      {
        path: 'edit/:id',
        component: CreateEmployeeComponent
      }
    ]
  }
];  */

@NgModule({
  imports: [
    RouterModule.forChild(employeeRoutes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class EmployeeRoutingModule { }
