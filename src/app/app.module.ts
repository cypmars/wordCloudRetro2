import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgWordCloudModule } from 'angular6-word-cloud-evolution';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { Ng2CompleterModule } from 'ng2-completer';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    Ng2CompleterModule,
    AgWordCloudModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
