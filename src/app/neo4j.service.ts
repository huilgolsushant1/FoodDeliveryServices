import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class Neo4jService {
  private apiUrl = "http://localhost:3001/api";

  constructor(private http: HttpClient) {}

  getInfluencerPicks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/banners/getTop5`);
  }

  getTopRestaurants(): Observable<any[]> {
    return this.http
      .get<any[]>(
        `${
          this.apiUrl
        }/topRated/top-rated-restaurants?customerName=${encodeURIComponent(
          "New Customer"
        )}`
      )
      .pipe(map((response) => (response as any).data));
  }

  getTopCuisines(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/topRated/cuisineRestaurants`)
      .pipe(map((response) => (response as any).data));
  }

  getTopBudgetFriendly(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/topRated/restaurants?customerName=${encodeURIComponent(
        "New Customer"
      )}`
    ).pipe(map((response) => (response as any).data));
  }

  getReviews(id: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/banners/getReviews/${id}`);
  }

  getAdditionalDetails(id: any): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/banners/getAdditionalDetails/${id}`
    );
  }

  getAvgCostForTwo(id: any): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/banners/getAvgCostForTwo/${id}`
    );
  }

  checkPrice(object: any): Observable<any[]> {
    return this.http.post<any[]>(`http://localhost:3001/api/order/checkprice`, object);
  }

  placeOrder(object: any): Observable<any[]> {
    return this.http.post<any[]>(`http://localhost:3001/api/order/confirm`, object.data);
  }
  
}
