import { TestBed } from '@angular/core/testing';

import { ClientFormModalServiceService } from './client-form-modal-service.service';

describe('ClientFormModalServiceService', () => {
  let service: ClientFormModalServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientFormModalServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
