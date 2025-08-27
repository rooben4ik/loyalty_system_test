import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidatorFn } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

import { AuthService, ApiResponse, SchemaElement } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, InputTextModule, ButtonModule],
  templateUrl: './info.component.html',
})
export class InfoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  schema: ApiResponse['schema'] | null = null;
  form: FormGroup | null = null;
  loading = false;
  errorText: string | null = null;

  ngOnInit(): void {
    if (!this.auth.isAuthenticated()) {
      this.errorText = 'SID empty';
      return;
    }
    this.fetchSchema();
  }

  private fetchSchema() {
    this.loading = true;
    this.auth.fetchSchema().subscribe({
      next: (res) => {
        this.loading = false;
        if (res?.result?.resultCode !== 200 || !res?.schema) {
          this.errorText = res?.result?.resultComment || 'Error';
          return;
        }
        this.schema = res.schema;
        this.buildForm(res.schema.elements);
      },
      error: (err) => {
        this.loading = false;
        this.errorText = 'Schema error';
        console.error('Schema error:', err);
      },
    });
  }

  private normalizeControlName(name: string) {
    return name.trim().toLowerCase().replace(/\s+/g, '_');
  }

  private buildForm(elements: SchemaElement[]) {
    const group: Record<string, any> = {};
    for (const el of elements) {
      const key = this.normalizeControlName(el.name);
      const validators: ValidatorFn[] = [];

      if (el.type === 'text') {
        validators.push(Validators.pattern(/^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ]*$/));
      }
      if (el.type === 'number') {
        validators.push(Validators.pattern(/^\d*$/));
      }
      group[key] = this.fb.control<string>('', validators);
    }
    this.form = this.fb.group(group);
  }

  onKeyDownNumberOnly(e: KeyboardEvent) {
    const ok = ['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End'];
    if (ok.includes(e.key)) return;
    if (!/^[0-9]$/.test(e.key)) e.preventDefault();
  }
  onPasteNumberOnly(e: ClipboardEvent) {
    const t = e.clipboardData?.getData('text') ?? '';
    if (!/^\d+$/.test(t)) e.preventDefault();
  }
  onKeyDownLettersOnly(e: KeyboardEvent) {
    const ok = ['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End'];
    if (ok.includes(e.key)) return;
    if (!/^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ]$/.test(e.key)) e.preventDefault();
  }
  onPasteLettersOnly(e: ClipboardEvent) {
    const t = e.clipboardData?.getData('text') ?? '';
    if (!/^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ]+$/.test(t)) e.preventDefault();
  }

  trackByName = (_: number, el: SchemaElement) => el.name;
  controlNameOf(el: SchemaElement) { return this.normalizeControlName(el.name); }
}
