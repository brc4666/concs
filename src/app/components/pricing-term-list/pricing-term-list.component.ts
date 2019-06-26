import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { IFieldDef } from 'src/app/models/_base';

@Component({
  selector: 'app-pricing-term-list',
  templateUrl: './pricing-term-list.component.html',
  styleUrls: ['./pricing-term-list.component.scss']
})
export class PricingTermListComponent implements OnInit {
  @Input() model: any;
  @Input() pricingTerms$: Observable<any[]>;
  @Input() fieldDefs$: Observable<IFieldDef[]>;

  constructor() { }

  ngOnInit() {
  }

}
