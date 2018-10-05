import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryTransferComponent } from './history-transfer.component';

describe('HistoryTransferComponent', () => {
  let component: HistoryTransferComponent;
  let fixture: ComponentFixture<HistoryTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
