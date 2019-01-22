import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/custom.validators';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { IEmployee } from '../iemployee';
import { ISkill } from '../iskill';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {

  employeeForm: FormGroup;
  employee: IEmployee;
  formTitle: string;

  // This object will hold the messages to be displayed to the user
  // Notice, each key in this object has the same name as the
  // corresponding form control
  formErrors = {
    /*
    'fullName': '',
    'email': '',
    'confirmEmail': '',
    'emailGroup': '',
    'phone': '',
    'skillName': '',
    'experienceInYears': '',
    'proficiency': ''
    */
  };

  // This object contains all the validation messages for this form
  validationMessages = {
    'fullName': {
      'required': 'Full Name is required.',
      'minlength': 'Full Name must be greater than 2 characters.',
      'maxlength': 'Full Name must be less than 15 characters.'
    },
    'email': {
      'required': 'Email is required.',
      'emailDomain': 'Email domian should be sysbiz.com'
    },
    'confirmEmail': {
      'required': 'Confirm Email is required.'
    },
    'emailGroup': {
      'emailMismatch': 'Email and Confirm Email do not match'
    },
    'phone': {
      'required': 'Phone is required.'
    },
    // since the logic has been moved to the template page
    /*
    'skillName': {
      'required': 'Skill Name is required.',
    },
    'experienceInYears': {
      'required': 'Experience is required.',
    },
    'proficiency': {
      'required': 'Proficiency is required.',
    }, */
  };

  constructor(private _formBuilder: FormBuilder, private _activatedRoute: ActivatedRoute,
    private _employeeService: EmployeeService, private _router: Router) { }

  ngOnInit() {
    // using explicit formGroup, formControl
    /*
    this.employeeForm = new FormGroup({
      fullName: new FormControl,
      email: new FormControl,
      // creating nested formgroup
      skills: new FormGroup({
        skillName: new FormControl,
        experienceInYears: new FormControl,
        proficiency: new FormControl
      })
    }); */

    // using formBuilder
    this.employeeForm = this._formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
      contactPreference: ['email'],
      emailGroup: this._formBuilder.group({
        email: ['', [Validators.required, CustomValidators.emailDomainValidationWithParam('sysbiz.com')]],
        confirmEmail: ['', Validators.required],
      }, { validator: CustomValidators.matchEmailAndConfirmEmail }),
      phone: [''],
      skills: this._formBuilder.array([this.addSkillsFormGroup()]),
    });

    // When any of the form control value in employee form changes
    // our validation function logValidationErrors() is called
    this.employeeForm.get('contactPreference').valueChanges.subscribe(
      (selectedValue: string) => this.onContactPreferenceChange(selectedValue)
    );

    this.employeeForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.employeeForm);
    });

    this._activatedRoute.paramMap.subscribe(params => {
      const employeeId = +params.get('id');
      if (employeeId) {
        this.formTitle = 'Edit Employee Form';
        this.getEmployee(employeeId);
      } else {
        this.formTitle = 'Create Employee Form';
        this.employee = {
          id: null,
          fullName: '',
          contactPreference: '',
          email: '',
          phone: null,
          skills: []
        };
      }
    });
  }

  getEmployee(employeeId: number) {
    this._employeeService.getEmployee(employeeId).subscribe(
      (employee: IEmployee) => {
        this.editEmployee(employee);
        this.employee = employee;
      },
      (error: any) => console.log(error)
    );
  }

  editEmployee(employee: IEmployee) {
    this.employeeForm.patchValue({
      fullName: employee.fullName,
      contactPreference: employee.contactPreference,
      emailGroup: {
        email: employee.email,
        confirmEmail: employee.email
      },
      phone: employee.phone
    });

    // adding Existing FormArray data to formArray cannot be done using patchValue()
    // setControl() on the form has to be called to set the particular formArray
    this.employeeForm.setControl('skills', this.setExistingSkills(employee.skills));
  }

  setExistingSkills(skillSets: ISkill[]): FormArray {
    const formArray = new FormArray([]);
    skillSets.forEach((skill) => {
      formArray.push(this._formBuilder.group({
        skillName: skill.skillName,
        experienceInYears: skill.experienceInYears,
        proficiency: skill.proficiency
      }));
    });
    return formArray;
  }

  logValidationErrors(formGroup: FormGroup = this.employeeForm): void {
    // loop through each key in the FormGroup
    Object.keys(formGroup.controls).forEach((key: string) => {
      // Get a reference to the control using the FormGroup.get() method
      const abstractControl = formGroup.get(key);
      // Clear the existing validation errors
      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty || abstractControl.value !== '')) {
        // Get all the validation messages of the form control
        // that has failed the validation
        const errorMessage = this.validationMessages[key];
        // Find which validation has failed. For example required,
        // minlength or maxlength. Store that error message in the
        // formErrors object. The UI will bind to this object to
        // display the validation errors
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += errorMessage[errorKey] + ' ';
          }
        }
      }
      // If the control is an instance of FormGroup i.e a nested FormGroup
      // then recursively call this same method (logKeyValuePairs) passing it
      // the FormGroup so we can get to the form controls in it
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
        // If the control is not a FormGroup then we know it's a FormControl
      }

      // We need this additional check to get to the FormGroup
      // in the FormArray and then recursively call this
      // logValidationErrors() method to fix the broken validation
      /*
      if (abstractControl instanceof FormArray) {
        for (const control of abstractControl.controls) {
          if (control instanceof FormGroup) {
            this.logValidationErrors(control);
          }
        }
      } */
    });
  }

  addSkillsFormGroup(): FormGroup {
    return this._formBuilder.group({
      skillName: ['', [Validators.required]],
      experienceInYears: ['', [Validators.required]],
      proficiency: ['', [Validators.required]]
    });
  }

  onContactPreferenceChange(selectedValue: string) {
    const phoneControl = this.employeeForm.get('phone');
    if (selectedValue === 'phone') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }

  addSkillButtonClick(): void {
    (<FormArray>this.employeeForm.get('skills')).push(this.addSkillsFormGroup());
  }

  onDeleteButtonClick(skillGroupIndex: number): void {
    const skillsFormArray = <FormArray>this.employeeForm.get('skills');
    // since after deleting skill the touched , dirty property were not changing so have to make it programatically
    /* Important - Programmatically changing a formarray in angular does not change dirty state : At this point, if
       you remove one of the skill groups from the FormArray by clicking the "Delete Skill" button, notice the dirty
       and touched state of the form is still false.

      This is because, the state properties like dirty, touched etc are designed to indicate whether a user has interacted with the form.

      By default, programmatic change to value of a form control will not flip the value of these properties. However,
      in some cases you may need to mark form controls, form groups and form arrays as touched, dirty etc.
      In such cases you can explicitly do so by calling markAsDirty() and markAsTouched() methods.

      In our case, when a SKILL form group is removed from the FormArray we want to mark the formArray as touched and dirty.
      To achieve this, we are using markAsDirty() and markAsTouched() methods.*/
    skillsFormArray.removeAt(skillGroupIndex);
    skillsFormArray.markAsDirty();
    skillsFormArray.markAsTouched();
  }
  onSubmitClick() {
    this.mapFormValuesToEmployeeModel();
    if (this.employee.id) {
      this._employeeService.updateEmployee(this.employee).subscribe(
        () => this._router.navigate(['employees']),
        (error: any) => console.log(error)
      );
    } else {
      this._employeeService.addEmployee(this.employee).subscribe(
        () => this._router.navigate(['employees']),
        (error: any) => console.log(error)
      );
    }

  }

  mapFormValuesToEmployeeModel() {
    this.employee.fullName = this.employeeForm.value.fullName;
    this.employee.contactPreference = this.employeeForm.value.contactPreference;
    this.employee.email = this.employeeForm.value.emailGroup.email;
    this.employee.phone = this.employeeForm.value.phone;
    this.employee.skills = this.employeeForm.value.skills;
  }
}


