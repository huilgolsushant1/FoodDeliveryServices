import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit{
  customers: any[] = [];

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    sessionStorage.clear();
    this.fetchCustomers();
  }

  fetchCustomers() {
    this.http.get<any[]>('http://localhost:3001/api/getCustomers/customers').subscribe(
      (data) => {
        this.customers = data;
      },
      (error) => {
        console.error('Error fetching customers:', error);
      }
    );
  }
  selectCustomer(customer: any) {
    sessionStorage.setItem('customer', JSON.stringify(customer));
    this.router.navigate(['/home']);
  }
}
