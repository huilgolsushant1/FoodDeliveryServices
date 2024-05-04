import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodsCartComponent } from './foods-cart.component';

describe('FoodsCartComponent', () => {
  let component: FoodsCartComponent;
  let fixture: ComponentFixture<FoodsCartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FoodsCartComponent]
    });
    fixture = TestBed.createComponent(FoodsCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
