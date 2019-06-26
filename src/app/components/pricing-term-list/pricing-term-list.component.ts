import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pricing-term-list',
  templateUrl: './pricing-term-list.component.html',
  styleUrls: ['./pricing-term-list.component.scss']
})
export class PricingTermListComponent implements OnInit {
  @Input() title: string;

  constructor() { }

  ngOnInit() {
  }

}
