import { TestBed, inject } from '@angular/core/testing';

import { HistoryFactureService } from './history-facture.service';

describe('HistoryFactureService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HistoryFactureService]
    });
  });

  it('should be created', inject([HistoryFactureService], (service: HistoryFactureService) => {
    expect(service).toBeTruthy();
  }));
});
