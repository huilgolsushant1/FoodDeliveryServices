import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Neo4jService } from "../../../../neo4j.service";
import { take } from "rxjs/operators";
import { combineLatest } from "rxjs";

@Component({
  selector: "app-restaurant-banners",
  templateUrl: "./restaurant-banners.component.html",
  styleUrls: ["./restaurant-banners.component.css"],
})
export class RestaurantBannersComponent implements OnInit {
  topInfluencer: any[] = [];
  topRestaurants: any[] = [];
  topCuisines: any[] = [];
  topSelectedCuisine: any[] = [];
  topBudgetFriendly: any[] = [];

  constructor(private neo4jService: Neo4jService, private router: Router) {}

  ngOnInit() {
    combineLatest([
      this.neo4jService.getInfluencerPicks(),
      this.neo4jService.getTopRestaurants(),
      this.neo4jService.getTopCuisines(),
      this.neo4jService.getTopBudgetFriendly(),
    ])
      .pipe(take(1))
      .subscribe(([influencers, restaurants, cuisines, budget]) => {
        this.topInfluencer = influencers;
        this.topRestaurants = restaurants;
        this.topCuisines = cuisines;
        this.topSelectedCuisine = this.topCuisines[0].topRestaurants;
        this.topBudgetFriendly = budget;
      });
    // this.neo4jService.getInfluencerPicks().subscribe(
    //   (data) => {
    //     this.topInfluencer = data;
    //     console.log("Data from Neo4j:", this.topInfluencer);
    //   },
    //   (error) => {
    //     console.error("Error fetching data from Neo4j:", error);
    //   }
    // );
  }

  onRowClick(restaurantId: number) {
    this.router.navigate(["/details", restaurantId]);
  }

  onCuisineChange(selectedCuisine: any): void {
    if (selectedCuisine.target && selectedCuisine.target.value) {
      this.topSelectedCuisine = this.topCuisines.find(
        ({ cuisine }) => cuisine === selectedCuisine.target.value
      )?.topRestaurants;
    }
  }
}
