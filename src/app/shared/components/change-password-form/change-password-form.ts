import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-change-password-form',
  imports: [ReactiveFormsModule],
  templateUrl: './change-password-form.html',
  styleUrl: './change-password-form.scss',
})
export class ChangePasswordForm {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);

  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  });

  submit(): void {
    this.successMessage.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = this.form.getRawValue();
    if (newPassword !== confirmPassword) {
      this.errorMessage.set('Новите лозинки не се совпаѓаат.');
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    this.userService.changePassword({ currentPassword, newPassword }).subscribe({
      next: () => {
        this.successMessage.set('Лозинката е успешно променета.');
        this.form.reset();
        this.submitting.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(
          err.status === 0
            ? 'Не успеавме да се поврземе со серверот. Проверете ја врската и обидете се повторно.'
            : err.status === 400
              ? 'Тековната лозинка не е точна.'
              : 'Настана грешка. Обидете се повторно.',
        );
        this.submitting.set(false);
      },
    });
  }
}
