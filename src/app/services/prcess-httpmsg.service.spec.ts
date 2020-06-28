import { TestBed } from '@angular/core/testing';

import { ProcessHTTPMsgService } from './process-h-t-t-p-msg.service';

describe('PrcessHTTPMsgService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProcessHTTPMsgService = TestBed.get(ProcessHTTPMsgService);
    expect(service).toBeTruthy();
  });
});
