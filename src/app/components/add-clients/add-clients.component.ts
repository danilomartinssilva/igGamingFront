import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  ionCheckmarkCircle,
  ionCloseCircle,
  ionCalendar,
  ionMail,
  ionPerson,
} from '@ng-icons/ionicons';
import { IClient } from '../../app/types/IClients';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-clients',
  standalone: true,
  imports: [CommonModule, NgIcon, ReactiveFormsModule],
  templateUrl: './add-clients.component.html',
  styleUrl: './add-clients.component.css',
  providers: [
    provideIcons({
      ionCheckmarkCircle,
      ionCloseCircle,
      ionCalendar,
      ionMail,
      ionPerson,
    }),
  ],
})
export class AddClientsComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);
  @Input() isVisible: boolean = false;
  @Input() clientData: IClient | null = null;
  @Input() loading: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmitForm = new EventEmitter<Partial<IClient>>();

  clientForm!: FormGroup;
  isEditMode: boolean = false;

  ngOnInit(): void {
    this.initForm();
  }
  private initForm(): void {
    this.clientForm = this.fb.group({
      name: ['Danilo Martins', [Validators.required, Validators.minLength(3)]],
      email: ['xpto@example.com', [Validators.required, Validators.email]],
      birthday: ['2022-01-01', [Validators.required]],
      phone: [
        '(11) 99999-9999',
        [Validators.required, Validators.pattern(/^\(\d{2}\) \d{5}-\d{4}$/)],
      ],
      balance: [0],
      status: [true],
    });
  }

  private populateForm(client: IClient): void {
    const birthday = client.birthday
      ? new Date(client.birthday).toISOString().split('T')[0]
      : '';

    this.clientForm.patchValue({
      name: client.name,
      email: client.email,
      birthday: birthday,
      balance: client.balance || 0,
      status: client.status !== undefined ? client.status : true,
    });
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      const formValue = this.clientForm.value;

      const formData: Partial<IClient> = {
        ...formValue,
        birthday: new Date(formValue.birthday),
        currency: 'BRL',
      };

      this.onSubmitForm.emit(formData);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.clientForm.controls).forEach((key) => {
      const control = this.clientForm.get(key);
      control?.markAsTouched();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible'] && this.isVisible) {
      this.initForm();
      this.isEditMode = !!this.clientData;

      if (this.clientData) {
        this.populateForm(this.clientData);
      }

      document.body.style.overflow = 'hidden';
    } else if (changes['isVisible'] && !this.isVisible) {
      document.body.style.overflow = 'auto';
    }
  }

  close(): void {
    this.onClose.emit();
  }
}
