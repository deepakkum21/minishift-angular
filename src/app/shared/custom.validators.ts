import { AbstractControl } from '@angular/forms';

export class CustomValidators {
    // this is a custom validator without parameter
    // so if any logic need to be changed for validation has to changed in this as it is hardcoded
    static emailDomainValidationWithoutParam(control: AbstractControl): { [key: string]: any } | null {
        const email: string = control.value;
        const emailDomain: string = email.substring(email.lastIndexOf('@') + 1);
        if (email === '' || emailDomain.toLowerCase() === 'sysbiz.com') {
            return null;
        } else {
            return { 'emailDomain': true };
        }
    }

    // this is a custom validator with parameter
    // so if any logic need to be changed for validation will come throuh parameter
    static emailDomainValidationWithParam(emailDomainParam: string) {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const email: string = control.value;
            const emailDomain: string = email.substring(email.lastIndexOf('@') + 1);
            if (email === '' || emailDomain.toLowerCase() === emailDomainParam.toLowerCase()) {
                return null;
            } else {
                return { 'emailDomain': true };
            }
        };
    }

    // Nested form group (emailGroup) is passed as a parameter. Retrieve email and
    // confirmEmail form controls. If the values are equal return null to indicate
    // validation passed otherwise an object with emailMismatch key. Please note we
    // used this same key in the validationMessages object against emailGroup
    // property to store the corresponding validation error message
    static matchEmailAndConfirmEmail(emailGroup: AbstractControl): { [key: string]: any } | null {
        const emailControl = emailGroup.get('email');
        const confirmEmailControl = emailGroup.get('confirmEmail');
        if (emailControl.value === confirmEmailControl.value || (confirmEmailControl.pristine && confirmEmailControl.value === '')) {
            return null;
        } else {
            return { 'emailMismatch': true };
        }
    }
}
