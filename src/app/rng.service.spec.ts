import { TestBed } from '@angular/core/testing';

import { RNGService } from './rng.service';

describe('RNGService', () => {
  let service: RNGService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RNGService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
