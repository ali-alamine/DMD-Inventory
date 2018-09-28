import { TestBed, inject } from '@angular/core/testing';

import { FactureReturnService } from './facture-return.service';

describe('FactureReturnService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FactureReturnService]
    });
  });

  it('should be created', inject([FactureReturnService], (service: FactureReturnService) => {
    expect(service).toBeTruthy();
  }));
});
