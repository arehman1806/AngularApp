import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Dish} from '../shared/Dish';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {DishService} from '../services/dish.service';
import {switchMap} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})

export class DishdetailComponent implements OnInit {

  dish: Dish;
  public prev: string;
  private dishIds: string[];
  public next: string;
  private loading: boolean;
  public commentForm: FormGroup;
  comment: Comment;

  formErrors = {
    'rating': '',
    'author': '',
    'comment': '',
    'date': ''
  };

  validationMessages = {
    'author': {
      'required':      'Your Name is required.',
      'minlength':     'Your Name must be at least 2 characters long.',
      'maxlength':     'Your Name cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'Review is required.',
      'minlength':     'Your Comment must be at least 30 characters long.'
    }
  };

  @ViewChild('cform') commentFormDirective;
  dishcopy: Dish;
  errMess: string;

  constructor(private dishservice: DishService,
              private route: ActivatedRoute,
              private location: Location,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params
      .pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); },
        errmess => this.errMess = <any>errmess );
    this.createForm();
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  createForm(): void {
    this.commentForm = this.fb.group({
      'rating': [5],
      'comment': ['', [Validators.required, Validators.minLength(30)]],
      'author': ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      'date': ['2012-10-16T17:57:28.556094Z']
    });
    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  formatLabelOnSlider(value: number) {
    return value + 'stars';
  }

  onSubmit() {
    this.comment = this.commentForm.value;
    this.comment['date'] = Date.now();
    console.log(this.comment);
    this.commentForm.reset( {
      'rating': 5,
      'comment': '',
      'author': '',
      'date': ''
    });
    this.commentFormDirective.resetForm( {
      'rating': 5,
      'comment': '',
      'author': '',
      'date': ''
    });
    // @ts-ignore
    this.dishcopy.comments.push(this.comment);
    this.dishservice.putDish(this.dishcopy)
      .subscribe(dish => {
          this.dish = dish; this.dishcopy = dish;
        },
        errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
}
