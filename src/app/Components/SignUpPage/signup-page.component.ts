import { Component } from "@angular/core";
import { UserDto } from "src/app/api/dtos/models/user.model";
import { lastValueFrom } from "rxjs";
import { UserService } from "src/app/api/services/user.service";

@Component({
  selector: 'signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignUpComponent {
  public user: UserDto = {
    name: '',
    email: '',
    password: '',
    type: 0
  }

  constructor(private userService: UserService) { }

  public async signUp(): Promise<void> {
    if (!this.validateUserInput()) {
      alert("Not okay credentials")
      return;
    }
    const response = await lastValueFrom(this.userService.addUser(this.user));
    if (response.success) {
      alert("User registered succesful")
      sessionStorage.setItem('Session Data', JSON.stringify(response.sessionData));
      window.location.assign('login');
    }
  }

  private validateUserInput(): boolean {
    return this.user.email != '' && this.user.password != '' && this.user.name != '' && this.user.type != null &&
      this.user.email.indexOf('@') != null && this.user.password.length > 8;
  }

  public setType(number: number) {
    this.user.type = number;
  }

}