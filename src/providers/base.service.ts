import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { AngularFireList, AngularFireObject } from 'angularfire2/database';

const extractError = (error: Response | any): string => {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
        const body = error.json() || '';
        const err = body.error || JSON.stringify(body);
        errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
        errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);

    return errMsg;
}

export abstract class BaseService {

    protected handlePromiseError(error: Response | any): Promise<any> {
        return Promise.reject(extractError(error));
    }

    protected handleObservableError(error: Response | any): Observable<any> {
        return Observable.throw(extractError(error));
    }

    mapListKeys<T>(list: AngularFireList<T>): Observable<T[]> {
        return list
          .snapshotChanges()
          .map(actions => actions.map(action => ({ $key: action.key, ...action.payload.val() })));
    }
    
    mapObjectKey<T>(object: AngularFireObject<T>): Observable<T> {
        return object
          .snapshotChanges()
          .map(action => ({ $key: action.key, ...action.payload.val() }));
    }

}