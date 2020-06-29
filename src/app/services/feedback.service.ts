import { Injectable } from '@angular/core';
import {Feedback} from '../shared/feedback';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Dish} from '../shared/Dish';
import {baseURL} from '../shared/baseurl';
import {catchError} from 'rxjs/operators';
import {ProcessHTTPMsgService} from './process-h-t-t-p-msg.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient,
              private processHTTPMsgService: ProcessHTTPMsgService) { }

  submitFeedback(feedback: Feedback) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.post<Feedback>(baseURL + 'feedback', feedback, httpOptions)
      .pipe(catchError(this.processHTTPMsgService.handleError));

  }
}
