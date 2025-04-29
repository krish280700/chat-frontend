import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

type User = {
  _id: string;	
  name: string;
  email: string;
}

type Conversation = {
  _id: string;
  participants: User[];
}

@Injectable({
  providedIn: 'root'
})

export class ConversationsService {

  private httpClient = inject(HttpClient);
  private conversationsSubject = new BehaviorSubject<Conversation[]>([]); // Initialize conversations as an empty array
  conversations$ = this.conversationsSubject.asObservable(); // Expose the observable for external use

  loadConversations(userId: string | undefined) {
    if (userId) {
      return this.fetchConversations(environment.apiUrl, userId).subscribe({
        next: (convos) => this.conversationsSubject.next(convos),
        error: (err) => console.error('Failed to load conversations:', err)
      })
    }

    return throwError(() => new Error("ID is required to load conversations"));
  }

  private fetchConversations(url: string, userId: string | undefined) {
    console.log("Fetching conversations for userId:", userId);
    return this.httpClient.get<{ chats: Conversation[]}>(`${url}/chats/user/${userId}`).pipe(
      map((resData) => {
        return resData.chats
      }),
      catchError((error) => {
        console.error('Error fetching users:', error);
        return throwError(() => new Error("Failed to fetch")); // Return an empty array on error
      })		  
    )
  }  
  
}
