import { Component } from '@angular/core';
import { ChangePasswordForm } from '../../../shared/components/change-password-form/change-password-form';

@Component({
  selector: 'app-admin-settings',
  imports: [ChangePasswordForm],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class AdminSettings {}
