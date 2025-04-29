import { Component, DestroyRef, inject, signal } from '@angular/core';
import { UsersService } from './users.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroUserCircleSolid } from '@ng-icons/heroicons/solid';
import { heroUserPlus } from '@ng-icons/heroicons/outline';
import { AuthService } from '../../../services/auth.service';
import { ConversationsService } from '../conversations/conversations.service';

type User = {
	_id: number;	
	name: string;
	email: string;
}

@Component({
	selector: 'app-users',
	standalone: true,
	imports: [NgIcon ],
	templateUrl: './users.component.html',
	styleUrl: './users.component.scss',
	providers: [provideIcons({ heroUserCircleSolid, heroUserPlus })]
})
export class UsersComponent {
	isFetching = signal<Boolean>(true);
	users = signal<User[]>([]);
	
	private usersService = inject(UsersService);
	private destroyRef = inject(DestroyRef);
	private user = inject(AuthService)
	private conversationsService = inject(ConversationsService)

	ngOnInit() {
	
		const subsciption = this.loadUserSubscriptions();

		this.destroyRef.onDestroy(() => {
			subsciption.unsubscribe();
		});	
	}

	addUserToChat(participantId: string | undefined) {
		if(participantId){
			this.usersService.createChat(this.user.user()?._id, participantId).subscribe({
				next: (response) => {
					this.conversationsService.loadConversations(this.user.user()?._id)
					this.loadUserSubscriptions()
					console.log('User added to chat:', response);
				},
				error: (error) => {
					console.error('Error adding user to chat:', error);
				}
			});
		}
	}

	loadUserSubscriptions() {
		return this.usersService.loadUsers(this.user.user()?._id).subscribe({
			next: (users) => {
				this.users.set(users);
			},
			error: (error) => {
				console.error('Error fetching users:', error);
			},
			complete: () => {
				this.isFetching.set(false);
			}
		});
	}
}
