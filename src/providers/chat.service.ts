import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AngularFire, FirebaseAuthState, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { BaseService } from "./base.service";
import { Chat } from './../models/chat.model';

@Injectable()
export class ChatService extends BaseService {

  chats: FirebaseListObservable<Chat[]>;

  constructor(
    public af: AngularFire,
    public http: Http
  ) {
    super();
    this.setChats();
  }

  private setChats(): void {
    this.af.auth
      .subscribe((authState: FirebaseAuthState) => {
        if (authState) {

          this.chats = <FirebaseListObservable<Chat[]>>this.af.database.list(`/chats/${authState.auth.uid}`, {
            query: {
              orderByChild: 'timestamp'
            }
          }).map((chats: Chat[]) => {
            return chats.reverse();
          }).catch(this.handleObservableError);

        }
      });
  }

  create(chat: Chat, userId1: string, userId2: string): firebase.Promise<void> {
    return this.af.database.object(`/chats/${userId1}/${userId2}`)
      .set(chat)
      .catch(this.handlePromiseError);
  }

  getDeepChat(userId1: string, userId2: string): FirebaseObjectObservable<Chat> {
    return <FirebaseObjectObservable<Chat>>this.af.database.object(`/chats/${userId1}/${userId2}`)
      .catch(this.handleObservableError);
  }

  updatePhoto(chat: FirebaseObjectObservable<Chat>, chatPhoto: string, recipientUserPhoto: string): firebase.Promise<boolean> {
    if (chatPhoto != recipientUserPhoto) {
      return chat.update({
        photo: recipientUserPhoto
      }).then(() => {
        return true;
      }).catch(this.handlePromiseError);
    }
    return Promise.resolve(false);
  }

}
