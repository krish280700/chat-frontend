import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [RouterLink, ReactiveFormsModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss'
})
export class LoginComponent {
	logInForm = new FormGroup({
		email: new FormControl(''),
		password: new FormControl('')
	})

	private validateLogin = inject(AuthService)
	private router = inject(Router);

	ngOnInit(){
		if(this.validateLogin.isAuthenticated()){
			this.router.navigate(['/']);
		}
	}

	onSubmit() {
		const { email, password } = this.logInForm.value;
		if(email && password) {
			this.validateLogin.login(email, password).subscribe({
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
