import { Component, signal } from '@angular/core';
import { UsersComponent } from './users/users.component';
import { ConversationsComponent } from './conversations/conversations.component';
import { MessagesComponent } from './messages/messages.component';

type User = {
	_id: string;	
	name: string;
	email: string;
}


@Component({
	selector: 'app-chat',
	standalone: true,
	imports: [UsersComponent, ConversationsComponent, MessagesComponent],
	templateUrl: './chat.component.html',
	styleUrl: './chat.component.scss'
})
export class ChatComponent {
	currentChat = signal<User | undefined>(undefined);
	currentChatId = signal<string | undefined>(undefined);

	selectedConversation({user, conversationId}: {user: User, conversationId: string}) {
		// Set the current chat and conversation ID when a conversation is selected
		this.currentChatId.set(conversationId);
		this.currentChat.set(user);
	}
}
