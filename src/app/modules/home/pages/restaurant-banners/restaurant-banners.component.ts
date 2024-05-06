import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Neo4jService } from '../../../../neo4j.service';

@Component({
  selector: 'app-restaurant-banners',
  templateUrl: './restaurant-banners.component.html',
  styleUrls: ['./restaurant-banners.component.css']
})
export class RestaurantBannersComponent implements OnInit {
  top5Influencer: any[] = [];

  constructor(private neo4jService: Neo4jService, private router: Router) {}

  ngOnInit() {
    this.neo4jService.getData().subscribe(
      (data) => {
        this.top5Influencer = data;
        console.log("Data from Neo4j:", this.top5Influencer);
      },
      (error) => {
        console.error("Error fetching data from Neo4j:", error);
      }
    );
  }

  onRowClick(restaurant: any) {
    this.router.navigate(['/details'], { state: { restaurant } });
  }
}