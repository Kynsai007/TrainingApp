import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TableDirective } from './table.directive';


@NgModule({
  declarations: [
    TableDirective
  ],
  imports: [
    CommonModule,
    HttpClientModule,
  ]
})
export class AllSongsModule { }
