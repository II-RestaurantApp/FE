import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class ComandaService{
  public constructor(private httpClient: HttpClient){}

  public getComanda(): Observable<any> {
    return this.httpClient.get('https://localhost:7093/comanda')
}
}