import { NgModule } from '@angular/core';

import { CreateEmployeeComponent } from './create-employee/create-employee.component';
import { ListEmployeesComponent } from './list-employees/list-employees.component';
import { EmployeeRoutingModule } from './/employee-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    EmployeeRoutingModule,
    SharedModule
  ],
  declarations: [
    CreateEmployeeComponent,
    ListEmployeesComponent]
})
export class EmployeeModule { }
