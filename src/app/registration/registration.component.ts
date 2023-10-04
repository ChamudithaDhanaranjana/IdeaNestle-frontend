import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
  registrationForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar, private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      gender: ['MALE', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      return;
    }
    const formData = this.registrationForm.value;
    if (formData.password !== formData.confirmPassword) {
      this.errorMessage = 'Password and confirm password do not match';
      return;
    }

    const registrationData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      username: formData.username,
      password: formData.password,
      dob: formData.dob,
      gender: formData.gender,
    };

    this.authService.registerUser(registrationData).subscribe(
      (response) => {
        console.log('Registration successful', response);
        this.showSucces()
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Registration error', error);
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        }
      }
    );
  }

  showSucces() {
    const message = 'User Created Succesfully';
    const snackBarRef = this.snackBar.openFromComponent(ErrorDialogComponent, {
      data: { message },
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top', 
    });
    snackBarRef.instance.setMessage(message);
  }
}
