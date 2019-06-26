import { Component, OnInit } from '@angular/core';
import { PricingTermService } from 'src/app/shared/pricing-term.service';

@Component({
  selector: 'app-pricing-container',
  templateUrl: './pricing-container.component.html',
  styleUrls: ['./pricing-container.component.scss']
})
export class PricingContainerComponent implements OnInit {
  models: any[];

  constructor(private pricingTermService: PricingTermService) { }

  ngOnInit() {
    this.models = this.pricingTermService.getPricingTermModels();
  }

}
