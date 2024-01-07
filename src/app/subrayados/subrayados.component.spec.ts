import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubrayadosComponent } from './subrayados.component';

describe('SubrayadosComponent', () => {
  let component: SubrayadosComponent;
  let fixture: ComponentFixture<SubrayadosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubrayadosComponent]
    });
    fixture = TestBed.createComponent(SubrayadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
