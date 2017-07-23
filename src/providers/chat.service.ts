import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import { BaseService } from "./base.service";
import { Chat } from './../models/chat.model';

import * as firebase from 'firebase/app';

@Injectable()
export class ChatService extends BaseService {

  chats: FirebaseListObservable<Chat[]>;

  constructor(
    public afAuth: AngularFireAuth,
    public db: AngularFireDatabase,
    public http: Http
  ) {
    super();
    this.setChats();
  }

  private setChats(): void {
    this.afAuth.authState
      .subscribe((authUser: firebase.User) => {
        if (authUser) {

          this.chats = <FirebaseListObservable<Chat[]>>this.db.list(`/chats/${authUser.uid}`, {
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
    return this.db.object(`/chats/${userId1}/${userId2}`)
      .set(chat)
      .catch(this.handlePromiseError);
  }

  getDeepChat(userId1: string, userId2: string): FirebaseObjectObservable<Chat> {
    return <FirebaseObjectObservable<Chat>>this.db.object(`/chats/${userId1}/${userId2}`)
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
