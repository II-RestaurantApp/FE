import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ItemDto } from "../dtos/models/item.model";
import { Observable } from "rxjs";

@Injectable()

export class ItemService {

  public constructor(private httpCient: HttpClient) { }



  public getItem(): Observable<any> {
    return this.httpCient.get('https://localhost:7093/item')
  }

  public createItem(item: ItemDto): Observable<any>{
    return this.httpCient.post('https://localhost:7093/item', item)
  }

  public updateItem(item: ItemDto, id: number): Observable<any> {
    return this.httpCient.put(`https://localhost:7093/item?id=${id}`, item);
  }

}