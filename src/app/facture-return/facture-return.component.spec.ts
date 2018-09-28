import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureReturnComponent } from './facture-return.component';

describe('FactureReturnComponent', () => {
  let component: FactureReturnComponent;
  let fixture: ComponentFixture<FactureReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactureReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactureReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
