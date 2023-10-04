import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {

  private confirmationSubject = new BehaviorSubject<boolean>(false);

  constructor(private dialog: MatDialog) {}

  openConfirmationDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px', 
    });

    dialogRef.afterClosed().subscribe(result => {
      this.confirmationSubject.next(result === true);
    });
  }

  getConfirmationResult(): BehaviorSubject<boolean> {
    return this.confirmationSubject;
  }
}
