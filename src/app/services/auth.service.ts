import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

type User = {
  _id: string;
  name: string;
  email: string;
}

type LoginResponse = {
  message: string;
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
	private isLoggedIn = false;
	private token: string | null = null; // Initialize token as null
	private httpClient = inject(HttpClient);

	user = signal<User | undefined>(undefined); // Initialize user as an empty object

	login(email: string, password: string) {
		return this.httpClient.post<LoginResponse>(`${environment.apiUrl}/login`, { email, password }).pipe(
			map((resData) => {
				this.token = resData.token; // Store the token when logging in
				this.user.set(resData.user); // Store the user data when logging in
				this.isLoggedIn = true; // Set isLoggedIn to true
				localStorage.setItem('token', resData.token); // Store the token in local storage
				localStorage.setItem('isLoggedIn', 'true'); // Store the login status in local storage
				localStorage.setItem('user', JSON.stringify(resData.user)); // Store the user data in local storage
				return resData
	        }),

			catchError((error) => {
				console.error('Error logging in:', error);
				return throwError(() => new Error("Failed to login")); // Return an empty array on error
			})
		)
	}

	signup(name: string, email: string, password: string) {
		return this.httpClient.post<LoginResponse>(`${environment.apiUrl}/register`, { name, email, password }).pipe(
			map((resData) => {
				this.token = resData.token; // Store the token when signing up
				this.user.set(resData.user); // Store the user data when signing up
				this.isLoggedIn = true; // Set isLoggedIn to true
				localStorage.setItem('token', resData.token); // Store the token in local storage
				localStorage.setItem('isLoggedIn', 'true'); // Store the login status in local storage
				localStorage.setItem('user', JSON.stringify(resData.user)); // Store the user data in local storage
				return resData
	        }),

			catchError((error) => {
				console.error('Error signing up:', error);
				return throwError(() => new Error("Failed to signup")); // Return an empty array on error
			})
		)
	}

	logout(): Observable<string> {
		this.isLoggedIn = false;
		this.token = null; // Clear the token when logging out
		this.user.set(undefined); // Clear the user data when logging out
		localStorage.removeItem('token'); // Remove the token from local storage
		localStorage.removeItem('isLoggedIn'); 
		localStorage.removeItem('user'); // Remove the user data from local storage
		return of("Logged out successfully"); // Return a success message
	}

	isAuthenticated(): boolean {
		if (this.isBrowser()) {
			this.token = localStorage.getItem('token'); // Retrieve the token from local storage
			this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; // Retrieve the login status from local storage
		
			const storedToken = localStorage.getItem('token'); // Retrieve the token from local storage
			const storedIsLoggedIn = localStorage.getItem('isLoggedIn'); // Retrieve the login status from local storage
			const storedUser = localStorage.getItem('user'); // Retrieve the user data from local storage
			this.user.set(storedUser ? JSON.parse(storedUser) : undefined); // Set the user data from local storage
			return (this.isLoggedIn && this.token !== null) || (storedIsLoggedIn == 'true' && storedToken !== null); // Check if the user is logged in and token is not null
		}
		return false; // If not in browser, return false
	}

	getToken(): string | null {
		return this.token; // Return the stored token
	}

	isBrowser(): boolean {
		return typeof window !== 'undefined';
	}
	  

}
