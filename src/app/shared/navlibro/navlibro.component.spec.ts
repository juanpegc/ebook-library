import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavlibroComponent } from './navlibro.component';

describe('NavlibroComponent', () => {
  let component: NavlibroComponent;
  let fixture: ComponentFixture<NavlibroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavlibroComponent]
    });
    fixture = TestBed.createComponent(NavlibroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
