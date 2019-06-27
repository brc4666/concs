import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MatCardModule,
        MatToolbarModule,
        MatButtonModule,
        MatTabsModule
    ],
    exports: [
        MatCardModule,
        MatToolbarModule,
        MatButtonModule,
        MatTabsModule
    ]
})
export class MaterialModule { }
