import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RidersComponent } from './riders.component';

describe('RidersComponent', () => {
  let component: RidersComponent;
  let fixture: ComponentFixture<RidersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RidersComponent]
    });
    fixture = TestBed.createComponent(RidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
