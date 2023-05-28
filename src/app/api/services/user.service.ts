import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserDto } from "../dtos/models/user.model";
import { UserWithoutPassword } from "../dtos/models/user-without-pasword.model";

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

  public getUsers(): Observable<Array<UserWithoutPassword>> {
    const sessionData = JSON.parse(sessionStorage.getItem('Session Data') as string);
    return this.httpCient.get<Array<UserWithoutPassword>>('https://localhost:7093/user',
      {
        headers: {
          'authorization': `Bearer ${sessionData.bearerToken}`
        }
      });
  }

  public getUser(id: number): Observable<UserDto> {
    const sessionData = JSON.parse(sessionStorage.getItem('Session Data') as string);
    return this.httpCient.get<UserDto>(`https://localhost:7093/user/${id}`, {
      headers: {
        'authorization': `Bearer ${sessionData.bearerToken}`
      }
    });
  }

  public updateUser(id: number, user: UserDto): Observable<any> {
    const sessionData = JSON.parse(sessionStorage.getItem('Session Data') as string);
    return this.httpCient.put<any>(`https://localhost:7093/user?id=${id}`, user, {
      headers: {
        'authorization': `Bearer ${sessionData.bearerToken}`
      }
    });
  }
}