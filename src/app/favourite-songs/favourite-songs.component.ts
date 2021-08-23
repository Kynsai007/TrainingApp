import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Songs } from '../all-songs/song';
import { TableService } from '../all-songs/table.service';
import {DecimalPipe} from '@angular/common';
@Component({
  selector: 'app-favourite-songs',
  templateUrl: './favourite-songs.component.html',
  styleUrls: ['./favourite-songs.component.css'],
  providers: [TableService, DecimalPipe]
})
export class FavouriteSongsComponent implements OnInit {
  songs$: Observable<Songs[]>;
  total$: Observable<number>;
  favorites: Songs[];
  constructor(public service:TableService) {
    this.favorites = JSON.parse(localStorage.getItem("Favourites") || '{}');
    service.setFav(this.favorites);
    this.songs$ = service.fav$;
    this.total$ = service.total$;
    
  }
  remove(id:number){
    this.favorites = this.favorites.slice(this.favorites.findIndex(a => a.id == id));
    this.service.setFav(this.favorites); 
  }


  ngOnInit(): void {
  }

}
