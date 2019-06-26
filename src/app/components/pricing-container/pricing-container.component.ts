import { Component, OnInit } from '@angular/core';
import { PayableRule } from 'src/app/models/payable-rule';

@Component({
  selector: 'app-pricing-container',
  templateUrl: './pricing-container.component.html',
  styleUrls: ['./pricing-container.component.scss']
})
export class PricingContainerComponent implements OnInit {
  model = PayableRule;
  constructor() { }

  ngOnInit() {
  }

}
