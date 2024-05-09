import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-riders-list',
  templateUrl: './riders-list.component.html',
  styleUrls: ['./riders-list.component.css']
})
export class RidersListComponent {
  riders: any[] = [];

  constructor(private http: HttpClient, private router: Router){}

  selectRider(rider: any) {
    sessionStorage.setItem('customer', JSON.stringify(rider));
    this.router.navigate(['/home']);
  }
}
