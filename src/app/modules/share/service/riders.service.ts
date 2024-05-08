import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RidersService {
  private baseUrl = 'http://localhost:3001/api/path/shortest';
  constructor(private http: HttpClient) { }

  getRoute(sourceAddr: string, destAddr: string): Observable<{}> {
    return this.http.post(this.baseUrl, { sourceAddress: sourceAddr, destAddress:destAddr});
  }

  fetchDeliveryAddresses(searchString:string){
    return this.http.get(`http://localhost:3001/api/addresses?searchString=${searchString}`);
  }
}