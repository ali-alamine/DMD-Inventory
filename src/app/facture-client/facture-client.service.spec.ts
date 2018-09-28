import { TestBed, inject } from '@angular/core/testing';

import { FactureClientService } from './facture-client.service';

describe('FactureClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FactureClientService]
    });
  });

  it('should be created', inject([FactureClientService], (service: FactureClientService) => {
    expect(service).toBeTruthy();
  }));
});
