import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ItemDto } from "../dtos/models/item.model";
import { ShoppingCartItem } from "../dtos/models/shopping-card.model";
import { ComandaDto } from "../dtos/models/comanda.model";
import { Order } from "../dtos/models/order.model";
import { StatusComada } from "../dtos/enums/statusComanda.enum";

@Injectable()
export class ComandaService {
  public constructor(private httpClient: HttpClient) { }

  public getComanda(): Observable<any> {
    const sessionData = JSON.parse(sessionStorage.getItem('Session Data') as string);
    return this.httpClient.get('https://localhost:7093/comanda', {
      headers: {
        'authorization': `Bearer ${sessionData.bearerToken}`
      }
    })
  }

  public addComanda(comanda: { total: number, userId: number, item: Array<ShoppingCartItem> }): Observable<any> {
    const sessionData = JSON.parse(sessionStorage.getItem('Session Data') as string);
    return this.httpClient.post('https://localhost:7093/comanda', comanda, {
      headers: {
        'authorization': `Bearer ${sessionData.bearerToken}`
      }
    })
  }

  public deleteComanda(id: number): Observable<any> {
    const sessionData = JSON.parse(sessionStorage.getItem('Session Data') as string);
    return this.httpClient.delete(`https://localhost:7093/comanda?id=${id}`, {
      headers: {
        'authorization': `Bearer ${sessionData.bearerToken}`
      }
    });
  }

  public updateComanda(id: number, comanda: Order): Observable<any> {
    const sessionData = JSON.parse(sessionStorage.getItem('Session Data') as string);
    return this.httpClient.put(`https://localhost:7093/comanda?id=${id}`, comanda, {
      headers: {
        'authorization': `Bearer ${sessionData.bearerToken}`
      }
    });
  }

  public updateStatusComanda(id: number, status: StatusComada): Observable<any> {
    const sessionData = JSON.parse(sessionStorage.getItem('Session Data') as string);

    return this.httpClient.put(`https://localhost:7093/comanda/status?id=${id}&status=${status}`, {}, {
      headers: {
        'authorization': `Bearer ${sessionData.bearerToken}`
      }
    })
  }
}