import { Component, inject, DestroyRef, signal, input, output, EventEmitter } from '@angular/core';
import { ConversationsService } from './conversations.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroUserCircleSolid } from '@ng-icons/heroicons/solid';
import { AuthService } from '../../../services/auth.service';
import { MessagesService } from '../messages/messages.service';

type User = {
	_id: string;	
	name: string;
	email: string;
}

@Component({
  selector: 'app-conversations',
  standalone: true,
  imports: [NgIcon],
  templateUrl: './conversations.component.html',
  styleUrl: './conversations.component.scss',
  providers: [provideIcons({ heroUserCircleSolid })]
})

export class ConversationsComponent {
	isFetching = signal<Boolean>(true);
	conversations = signal<any[]>([]);
	displayConversations = signal<any[]>([]);
	searchChat = signal<string>('');
	selectedConversation = output<{user: User, conversationId: string }>();

	selectedCurrentChat = signal<{user: User, conversationId: string } | undefined>(undefined)

	user = signal<User | undefined>(undefined)

	private conversationsService = inject(ConversationsService);
	private destroyRef = inject(DestroyRef);
	private authService = inject(AuthService)
	private messagesService = inject(MessagesService)


	ngOnInit() {
		this.user.set(this.authService.user())
        const userId = this.user()?._id;	

		if(userId) {
			this.conversationsService.loadConversations(userId);

			const sub = this.conversationsService.conversations$.subscribe({
				next: (convos) => {
				  this.conversations.set(convos);
				  this.displayConversations.set(convos);
				  if (convos.length) {
					this.setCurrentChat(convos[0].participants, convos[0]._id);
				  }
				  this.isFetching.set(false);
				}
			});


			this.destroyRef.onDestroy(() => {
				sub.unsubscribe();
			});
		}

	}

	setCurrentChat(users: User[], conversationId: string) {
		const user = users.find((user) => user._id !== this.user()?._id);
		if (user) {
			this.selectedCurrentChat.set({user, conversationId});
			this.selectedConversation.emit({user, conversationId});
			this.messagesService.markAsRead(conversationId, user._id).subscribe({
				next: (response) => {
					console.log('Messages marked as read:', response);
				}
			});
		} else {
			console.error('No valid user found to emit.');
		}
	}

	handleSearch(e: Event){
		const searchTerm = (e.target as HTMLInputElement).value.toLowerCase();

		const filteredConversations = this.conversations().filter((conversation) => {
			const user = conversation.participants.find((user: User) => user._id !== this.user()?._id);
			return user && (user.name.toLowerCase().includes(searchTerm) || user.email.toLowerCase().includes(searchTerm));
		}
		);
		if(searchTerm){
			this.displayConversations.set(filteredConversations);
		}else{
			this.displayConversations.set(this.conversations());
		} 
	}

}
