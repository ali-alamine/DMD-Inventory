import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryItemsComponent } from './history-items.component';

describe('HistoryItemsComponent', () => {
  let component: HistoryItemsComponent;
  let fixture: ComponentFixture<HistoryItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
