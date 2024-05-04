import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantBannersComponent } from './restaurant-banners.component';

describe('RestaurantBannersComponent', () => {
  let component: RestaurantBannersComponent;
  let fixture: ComponentFixture<RestaurantBannersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RestaurantBannersComponent]
    });
    fixture = TestBed.createComponent(RestaurantBannersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
