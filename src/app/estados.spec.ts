import { TestBed } from '@angular/core/testing';

import { Estados } from './estados';

describe('Estados', () => {
  let service: Estados;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Estados);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
