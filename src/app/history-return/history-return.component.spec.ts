import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryReturnComponent } from './history-return.component';

describe('HistoryReturnComponent', () => {
  let component: HistoryReturnComponent;
  let fixture: ComponentFixture<HistoryReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
