import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);

  form = this.fb.group({
    login: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  loading = false;

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.warn('Wrong form data:', this.form.value);
      return;
    }

    this.loading = true;
    const body = {
      login: this.form.value.login!,
      password: this.form.value.password!
    };

    this.auth.login(body).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/info'); 
      },
      error: (err) => {
        this.loading = false;
        console.error('Login error:', err);
      }
    });
  }

  get f() { return this.form.controls; }
}
