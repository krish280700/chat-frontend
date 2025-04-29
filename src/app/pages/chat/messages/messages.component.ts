import { Component, inject,input, signal, DestroyRef, ViewChild, ElementRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesService } from './messages.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowRightCircleSolid } from '@ng-icons/heroicons/solid';
import { AuthService } from '../../../services/auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { SocketService } from '../../../services/socket/socket.service';

type User = {
	_id: string;	
	name: string;
	email: string;
  }
  
  type messages = {
	_id?: string;
	sender: User;
	receiver: User;
	content: string;
	chatId: string;
	isRead?: boolean;
	timestamp?: string;
  }

@Component({
	selector: 'app-messages',
	standalone: true,
	imports: [NgIcon, CommonModule, FormsModule],
	templateUrl: './messages.component.html',
	styleUrl: './messages.component.scss',
	providers: [provideIcons({ heroArrowRightCircleSolid })]
})
export class MessagesComponent {
	messages = signal<messages[]>([]);
	isFetching = signal<Boolean>(true);
	user = signal<User | undefined>(undefined)
	
    currentChatPerson = input<User | undefined>(undefined) 
	currentChatId = input<string | undefined>('')

	private destroyRef = inject(DestroyRef);
	private messagesService = inject(MessagesService);
	private authService = inject(AuthService)
	private socketService = inject(SocketService)

	@ViewChild('chatHeader') header!: ElementRef;
	@ViewChild('chatMessage') chatMessage!: ElementRef;
	@ViewChild('chatInput') input!: ElementRef;
	
	ngOnInit(){
		this.user.set(this.authService.user())

		const userId = this.authService.user()?._id;
	  
		// Set up listener ONCE
		this.socketService.onMessage((msg) => {
		  this.messages.set([...this.messages(), msg]); // Update signal or state here
		});
	}

	ngOnChanges() {
		const subsciption = this.messagesService.loadMessages(this.currentChatId()).subscribe({
			next: (messages) => {
				this.messages.set(messages);
			},
			error: (error) => {
				console.error('Error fetching messages:', error);
			},
			complete: () => {
				this.isFetching.set(false);
			}
		});

		this.destroyRef.onDestroy(() => {
			subsciption.unsubscribe();
		});
	}

	ngAfterViewInit() {
		this.setChatMessageHeight();	
		window.addEventListener('resize', () => {
			this.setChatMessageHeight();
		});
	}

	setChatMessageHeight() {
		const headerHeight = this.header.nativeElement.offsetHeight; // height of header
		const inputHeight = this.input.nativeElement.offsetHeight; // height of input field
	
		const totalUsedHeight = headerHeight + inputHeight;
	
		// Get the height of the viewport (screen height)
		const viewportHeight = window.innerHeight;
	
		// Calculate the available height for the chat messages
		const availableHeight = viewportHeight - totalUsedHeight - 100;
	
		// Set the height of the chat-message container
		this.chatMessage.nativeElement.style.height = `${availableHeight}px`;
    }

	handleSendMessage(form: NgForm){
		const {messageContent} = form.value
		const sender = this.user()?._id
		const receiver = this.currentChatPerson()?._id
		const chatId = this.currentChatId()
		if(messageContent && sender && receiver && chatId) {
			const message = {sender, receiver,chatId, content: messageContent}

			this.socketService.sendMessage(message, (ack) => {
				if (ack.success) {
				  this.messages.set([...this.messages(), ack.message]);
				  form.resetForm();
				} else {
				  console.error("Message failed to send:", ack.error);
				}
			});
		}
	}
}
