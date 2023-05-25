import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserDto } from "../dtos/models/user.model";

@Injectable()
export class UserService {
  public constructor(
    private httpCient: HttpClient
  ) { }

  public addUser(user: UserDto): Observable<any> {
    return this.httpCient.post('https://localhost:7093/user', user);
  }

  public loginUser(user: UserDto): Observable<any> {
    return this.httpCient.post('https://localhost:7093/authorization', user);
  }

  public getUsers(): Observable<Array<UserDto>> {
    return this.httpCient.get<Array<UserDto>>('https://localhost:7093/user');
  }
}