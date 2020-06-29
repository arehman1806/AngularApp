import {Component, Inject, OnInit} from '@angular/core';
import {PromotionService} from '../services/promotion.service';
import {DishService} from '../services/dish.service';
import {Promotion} from '../shared/promotion';
import {Dish} from '../shared/Dish';
import {Leader} from '../shared/leader';
import {LeaderService} from '../services/leader.service';
import {expand, flyInOut} from '../animations/app.animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class HomeComponent implements OnInit {

  dish: Dish;
  promotion: Promotion;
  leader: Leader;
  disherrMess: string;

  constructor(private dishservice: DishService,
              private promotionservice: PromotionService,
              private leaderservice: LeaderService,
              @Inject('BaseURL') public baseURL) { }

  ngOnInit() {
    this.dishservice.getFeaturedDish()
      .subscribe(dish => this.dish = dish,
        errmess => this.disherrMess = <any>errmess);
    this.promotionservice.getFeaturedPromotion()
      .then(promotion => this.promotion = promotion);
    this.leaderservice.getFeaturedLeader()
      .then(leader => this.leader = leader);
  }

}
