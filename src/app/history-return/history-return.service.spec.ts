import { TestBed, inject } from '@angular/core/testing';

import { HistoryReturnService } from './history-return.service';

describe('HistoryReturnService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HistoryReturnService]
    });
  });

  it('should be created', inject([HistoryReturnService], (service: HistoryReturnService) => {
    expect(service).toBeTruthy();
  }));
});
