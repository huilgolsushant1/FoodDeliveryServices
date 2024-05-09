import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-riders',
  templateUrl: './riders.component.html',
  styleUrls: ['./riders.component.css']
})
export class RidersComponent {
  riders: any[] = [];

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    sessionStorage.clear();
    this.fetchRiders();
  }

  fetchRiders() {
    this.http.get<any[]>('http://localhost:3001/api/riders').subscribe(
      (data) => {
        this.riders = data;
      },
      (error) => {
        console.error('Error fetching customers:', error);
      }
    );
  }
  selectRider(rider: any) {
    sessionStorage.setItem('rider', JSON.stringify(rider));
    this.router.navigate(['/rider']);
  }
}
