import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NumToArrPipe } from './num-to-arr.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Material components
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';


@NgModule({
  declarations: [
    AppComponent,
    NumToArrPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
