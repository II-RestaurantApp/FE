import { Component, OnInit } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { UserDto } from "src/app/api/dtos/user.model";
import { UserService } from "src/app/api/services/user.service";

@Component({
  selector: 'login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginComponent {

  public user: UserDto = {
    email: '',
    password: ''
  };

  public requestIsPending: boolean = false;
  public notificationMessage: string | undefined;
  public shouldDisplayNotification: boolean | undefined;

  constructor(private userService: UserService) { }

  async login(): Promise<void> {

    if (!this.validateUserInput()) {
      this.displayNotification('Credential validation faild!');
      this.requestIsPending = false;
      return;
    }
    const response = await lastValueFrom(this.userService.loginUser(this.user));

    if (response.success) {
      var type = response.sessionData.userType;
      if (type === 'CLIENT') {


        sessionStorage.setItem('Session Data', JSON.stringify(response.sessionData));
        window.location.assign('CustomerPage');
      }
    }

  }


  private displayNotification(message: string): void {
    this.notificationMessage = message;
    this.shouldDisplayNotification = true;
  }

  private validateUserInput(): boolean {
    return this.user.email != '' && this.user.password != '';
  }

}