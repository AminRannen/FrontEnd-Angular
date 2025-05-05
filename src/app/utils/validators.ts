import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function mustMatch(controlName: string, matchingControlName: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    // Return if controls haven't been initialized yet
    if (!control || !matchingControl) {
      return null;
    }

    // Don't show error if matching control has errors (but not a mustMatch error)
    if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
      return null;
    }

    // Set error if controls don't match
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
      return { mustMatch: true };
    } else {
      matchingControl.setErrors(null);
      return null;
    }
  };
}