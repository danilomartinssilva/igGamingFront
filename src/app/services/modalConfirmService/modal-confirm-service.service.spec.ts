import { TestBed } from '@angular/core/testing';

import { ModalConfirmServiceService } from './modal-confirm-service.service';

describe('ModalConfirmServiceService', () => {
  let service: ModalConfirmServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalConfirmServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
