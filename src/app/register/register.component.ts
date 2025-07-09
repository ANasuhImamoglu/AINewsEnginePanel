import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MaterialModule } from '../material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MaterialModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;
  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/news']);
    }

    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, this.passwordValidator]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  // Şifre validatörü - backend kurallarına uygun
  passwordValidator(control: any) {
    const password = control.value;
    if (!password) return null;

    const errors: any = {};

    // En az 6 karakter
    if (password.length < 6) {
      errors.minLength = true;
    }

    // En az 1 büyük harf
    if (!/[A-Z]/.test(password)) {
      errors.uppercase = true;
    }

    // En az 1 küçük harf
    if (!/[a-z]/.test(password)) {
      errors.lowercase = true;
    }

    // En az 1 rakam
    if (!/[0-9]/.test(password)) {
      errors.digit = true;
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = { ...this.registerForm.value };
    delete formData.confirmPassword;

    this.authService.register(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Register response:', response);
        
        if (response.success) {
          this.successMessage = response.message || 'Kayıt başarılı!';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.errorMessage = response.message || 'Kayıt başarısız.';
          console.error('Register failed:', response);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Register component error:', error);
        
        // Detaylı hata mesajı göster
        if (error && typeof error === 'string') {
          this.errorMessage = error;
        } else {
          this.errorMessage = 'Bir hata oluştu. Tekrar deneyin.';
        }
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
