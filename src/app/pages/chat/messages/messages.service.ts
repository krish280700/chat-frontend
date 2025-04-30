import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

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

type MessageReq = {
  sender: string;
  receiver: string;
  content: string;
  chatId: string;
}

const headers = new HttpHeaders({
  'X-Api-Key': environment.emoji_access_key
});

@Injectable({
  providedIn: 'root'
})

export class MessagesService {

  private httpClient = inject(HttpClient); // Expose the observable for external use

  loadMessages(id: string | undefined) {
    if (id) {
      return this.fetchMessages(id);

    }
    return throwError(() => new Error("ID is required to load messages"));
  }

  loadEmoji(){
    return this.httpClient.get<any>(`https://api.api-ninjas.com/v1/emoji?name=slightly smiling face`, {headers}).pipe(
      map((resData) => {
        console.log('Emoji fetched successfully:', resData);
        return resData
      }),
      catchError((error) => {
        console.error('Error fetching emojis:', error);
        return throwError(() => new Error("Failed to fetch")); // Return an empty array on error
      })		  
    )
  }

  loadAllEmojis(){
    return this.httpClient.get<any>(`https://api.api-ninjas.com/v1/emoji?group=smileys_emotion`, {headers}).pipe(
      map((resData) => {
        console.log('Emoji fetched successfully:', resData);
        return resData
      }),
      catchError((error) => {
        console.error('Error fetching emojis:', error);
        return throwError(() => new Error("Failed to fetch")); // Return an empty array on error
      })		  
    )
  }

  sendMessage(message: MessageReq) {
    if (message) {
      return this.sendNewMessage(message)
    }

    return throwError(() => new Error("Message is required to send message"));
  }

  markAsRead(chatId: string, userId: string) {
    if (chatId && userId) {
      return this.updateMessageMarkAsRead(chatId, userId)
    }

    return throwError(() => new Error("Chat ID and User ID are required to mark as read"));
  }

  private fetchMessages( id: string | undefined) {

    return this.httpClient.get<{ messages: messages[]}>(`${environment.apiUrl}/messages/chat/${id}`).pipe(
      map((resData) => {
        return resData.messages
      }),
      catchError((error) => {
        console.error('Error fetching users:', error);
        return throwError(() => new Error("Failed to fetch")); // Return an empty array on error
      })		  
    )
  }
  
  private sendNewMessage(messageData: MessageReq) {
    return this.httpClient.post<{message: messages}>(`${environment.apiUrl}/messages`, messageData).pipe(
      map((resData) => {
        console.log('Message sent successfully:', resData);
        return resData.message
      }),
      catchError((error) => {
        console.error('Error adding user to chat:', error);
        return throwError(() => new Error("Failed to add user to chat")); // Return an empty array on error
      })		
    )
  }
  
  private updateMessageMarkAsRead(chatId: string, userId: string ) {
    return this.httpClient.put(`${environment.apiUrl}/messages/chat/${chatId}/user/${userId}`, '').pipe(
      map((resData) => {
        console.log('Message sent successfully:', resData);
        return 'Successfully marked as read'
      }),
      catchError((error) => {
        console.error('Error adding user to chat:', error);
        return throwError(() => new Error("Failed to add user to chat")); // Return an empty array on error
      })
    )
  }
}
