import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsDetailModalComponentComponent } from './clients-detail-modal-component.component';

describe('ClientsDetailModalComponentComponent', () => {
  let component: ClientsDetailModalComponentComponent;
  let fixture: ComponentFixture<ClientsDetailModalComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientsDetailModalComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientsDetailModalComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
