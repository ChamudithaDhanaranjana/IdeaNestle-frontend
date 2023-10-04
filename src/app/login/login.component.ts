import { Component, ViewChild} from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from '../user';
import { WelcomeDialogComponent } from '../welcome-dialog/welcome-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent{
  username: string = '';
  password: string = '';
  roles:string='';
  errorMessage: string = '';
  location: any;

  constructor(private authService: AuthService, 
    private router: Router, 
    private dialog: MatDialog,
    private snackBar: MatSnackBar
    ) {}

  login(event: Event): void {
    event.preventDefault(); 
    this.errorMessage = '';
    this.authService.login(this.username, this.password).subscribe(
      (user: User) => {
        this.showWelcomePopup();
        this.navigateToRootWithReload();
      },
      (error) => {
        console.error(error);
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        }
        setTimeout(() => {
          this.errorMessage = '';
        }, 2000);
      }
    );
  }
  
  showWelcomePopup(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { message: 'Welcome!' };
    const dialogRef = this.dialog.open(WelcomeDialogComponent, dialogConfig);
  
    setTimeout(() => {
      dialogRef.close();
    }, 3000);
  }
  
  showErrorPopup(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { errorMessage: this.errorMessage };
    const dialogRef = this.dialog.open(ErrorDialogComponent, dialogConfig);
  
    setTimeout(() => {
      dialogRef.close();
    }, 4000);
  }
  
  navigateToRootWithReload() {
    this.router.navigate(['/']).then(() => {
      window.location.reload();
      this.location.replaceState('/');
    });
  }
 
}
