import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class IngredienService {

  public constructor(private httpClient: HttpClient) { }

  public getIngrediente(): Observable<any> {
    return this.httpClient.get('https://localhost:7093/ingredient')
  }
}