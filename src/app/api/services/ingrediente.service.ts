import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IngredienteDto } from "../dtos/models/ingrediente.model";

@Injectable()
export class IngredienService {

  public constructor(private httpClient: HttpClient) { }

  public getIngrediente(): Observable<any> {
    return this.httpClient.get('https://localhost:7093/ingredient')
  }

  public addIngredient(ingredient: IngredienteDto): Observable<any> {
    const sessionData = JSON.parse(sessionStorage.getItem('Session Data') as string);
    return this.httpClient.post('https://localhost:7093/ingredient', ingredient, {
      headers: {
        'authorization': `Bearer ${sessionData.bearerToken}`
      }
    });
  }

  public updateIngredient(id: number, ingredient: { ingrName: string }): Observable<any> {
    const sessionData = JSON.parse(sessionStorage.getItem('Session Data') as string);
    return this.httpClient.put(`https://localhost:7093/ingredient/${id}`, ingredient, {
      headers: {
        'authorization': `Bearer ${sessionData.bearerToken}`
      }
    });
  }

  public deleteIngredient(id: number): Observable<any> {
    const sessionData = JSON.parse(sessionStorage.getItem('Session Data') as string);
    return this.httpClient.delete(`https://localhost:7093/ingredient/${id}`, {
      headers: {
        'authorization': `Bearer ${sessionData.bearerToken}`
      }
    })
  }
}