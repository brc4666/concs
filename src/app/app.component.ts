import { Component } from '@angular/core';
import { PayableRule } from './models/payable-rule';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'concs';
  model = PayableRule;
}
