import { Component, Inject, Input } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.css']
})
export class ErrorDialogComponent {
  @Input() isErrorMessage: boolean;
  message: string;

  constructor() {}

  setMessage(message: string) {
    this.message = message;
  }

  dismiss(): void {
  }

}