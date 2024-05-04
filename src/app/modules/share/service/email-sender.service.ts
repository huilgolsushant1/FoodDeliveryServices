import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Emai } from '../models/emai';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailSenderService {
  private url = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  sendEmail(email: Emai): Observable<Emai> {
    this.url = 'http://localhost:8080/email';
    return this.http.post(this.url, email);
  }
}
