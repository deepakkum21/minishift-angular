import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { IEmployee } from '../iemployee';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-employees',
  templateUrl: './list-employees.component.html',
  styleUrls: ['./list-employees.component.css']
})
export class ListEmployeesComponent implements OnInit {

  employees: IEmployee[];

  constructor(private _employeeService: EmployeeService, private _router: Router) { }

  ngOnInit() {
    this._employeeService.getEmployees().subscribe(
      (employeesList) => this.employees = employeesList,
      (error) => console.log(error)
    );
  }

  onEditButtonClick(employeeId: number) {
    this._router.navigate(['/employees/edit', employeeId]);
  }

}
