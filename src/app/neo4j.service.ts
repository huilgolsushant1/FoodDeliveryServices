import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Neo4jService {

  private apiUrl = 'http://localhost:3001/api/banners/getTop5';
  private _getReviews = 'http://localhost:3001/api/banners/getReviews';
  private _getAdditionalDetails = 'http://localhost:3001/api/banners/getAdditionalDetails';
  private _getAvgCostForTwo = 'http://localhost:3001/api/banners/getAvgCostForTwo';

  constructor(private http: HttpClient) { }

  getData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getReviews(id: any): Observable<any[]> {
    return this.http.get<any[]>(`${this._getReviews}/${id}`);
  }
  
  getAdditionalDetails(id: any): Observable<any[]> {
    return this.http.get<any[]>(`${this._getAdditionalDetails}/${id}`);
  }
  getAvgCostForTwo(id: any): Observable<any[]> {
    return this.http.get<any[]>(`${this._getAvgCostForTwo}/${id}`);
  }

  checkPrice(object: any): Observable<any[]> {
    return this.http.post<any[]>(`http://localhost:3001/api/order/checkprice`, object);
  }

  placeOrder(object: any): Observable<any[]> {
    return this.http.post<any[]>(`http://localhost:3001/api/order/confirm`, object);
  }
  
}
