import { TestBed } from '@angular/core/testing';

import { DateFormattingUtilService } from './date-formatting-util.service';

describe('DateFormattingUtilService', () => {
  let service: DateFormattingUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateFormattingUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
