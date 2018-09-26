import { TestBed, inject } from '@angular/core/testing';

import { HistoryItemsService } from './history-items.service';

describe('HistoryItemsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HistoryItemsService]
    });
  });

  it('should be created', inject([HistoryItemsService], (service: HistoryItemsService) => {
    expect(service).toBeTruthy();
  }));
});
