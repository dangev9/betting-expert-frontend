import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';
import { ChangePasswordForm } from '../../shared/components/change-password-form/change-password-form';
import { LoadingSpinner } from '../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-account',
  imports: [ChangePasswordForm, LoadingSpinner, DatePipe],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class Account implements OnInit {
  private readonly userService = inject(UserService);

  readonly me = signal<User | null>(null);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.userService.me().subscribe({
      next: (user) => {
        this.me.set(user);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
