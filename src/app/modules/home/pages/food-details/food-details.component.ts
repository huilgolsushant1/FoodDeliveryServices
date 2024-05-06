import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Neo4jService } from "../../../../neo4j.service";

@Component({
  selector: 'app-food-details',
  templateUrl: './food-details.component.html',
  styleUrls: ['./food-details.component.css'],
})
export class FoodDetailsComponent implements OnInit {
  restaurant: any;
  getAdditionalRestaurantData: any;
  restaurantId: any;
  influencersReviews: any;
  nonInfluencersReviews: any;
  cuisine: any;
  dish: any;
  getAvgCostForTwo: any;
  collapsedSections: any = {}; // Object to track collapsed sections

  constructor(
    private neo4jService: Neo4jService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.restaurant = history.state.restaurant;
    this.restaurantId = this.restaurant.restaurantDetails.properties.id.low;
    this.neo4jService.getReviews(this.restaurantId).subscribe(
      (data) => {
        const separatedReviews = data.reduce(
          (acc, item) => {
            item.isInfluencer
              ? acc.influencers.push(item)
              : acc.nonInfluencers.push(item);
            return acc;
          },
          { influencers: [], nonInfluencers: [] }
        );
        this.influencersReviews = separatedReviews.influencers;
        this.nonInfluencersReviews = separatedReviews.nonInfluencers;
        console.log(
          "Data from separatedReviews (influencers):",
          separatedReviews.influencers
        );
        console.log(
          "Data from separatedReviews (non-influencers):",
          separatedReviews.nonInfluencers
        );
      },
      (error) => {
        console.error("Error fetching data from Neo4j:", error);
      }
    );

    this.neo4jService.getAdditionalDetails(this.restaurantId).subscribe(
      (data) => {
        this.getAdditionalRestaurantData = data;
        const cuisine = data[0].cuisine;
        const dish = data[0].dish;
        this.cuisine = cuisine;
        this.dish = dish;
      },
      (error) => {
        console.error("Error fetching data from Neo4j:", error);
      }
    );

    this.neo4jService.getAvgCostForTwo(this.restaurantId).subscribe(
      (data: any) => {
        this.getAvgCostForTwo = data?.cost?.low;
      },
      (error) => {
        console.error("Error fetching data from Neo4j:", error);
      }
    );
  }

  toggleCollapse(section: string) {
    this.collapsedSections[section] = !this.collapsedSections[section];
  }

}
