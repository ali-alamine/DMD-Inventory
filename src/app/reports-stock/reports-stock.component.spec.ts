import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsStockComponent } from './reports-stock.component';

describe('ReportsStockComponent', () => {
  let component: ReportsStockComponent;
  let fixture: ComponentFixture<ReportsStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
