import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsInvoiceItemsComponent } from './reports-invoice-items.component';

describe('ReportsInvoiceItemsComponent', () => {
  let component: ReportsInvoiceItemsComponent;
  let fixture: ComponentFixture<ReportsInvoiceItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsInvoiceItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsInvoiceItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
