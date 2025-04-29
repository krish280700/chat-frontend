import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-register',
	standalone: true,
	imports: [RouterLink, ReactiveFormsModule],
	templateUrl: './register.component.html',
	styleUrl: './register.component.scss'
})
export class RegisterComponent {
	registerForm = new FormGroup({	
		name: new FormControl(''),
		email: new FormControl(''),
		password: new FormControl('')
	})

	private register = inject(AuthService)
	private router = inject(Router)

	onSubmit() {
		const { name, email, password } = this.registerForm.value;
		if(name && email && password) {
			this.register.signup(name, email, password).subscribe({
				next: (response) => {
					this.router.navigate(['/']);
				},
				error: (error) => {
					console.error('Login failed:', error);
				}
			});
		}
	}
}
