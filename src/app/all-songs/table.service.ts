import { Injectable,PipeTransform} from '@angular/core';

import {BehaviorSubject, Observable, of, Subject} from 'rxjs';

import {Songs} from './song';
import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, map, switchMap, tap} from 'rxjs/operators';
import {SortColumn, SortDirection} from './table.directive';
import { HttpClient } from '@angular/common/http';

interface SearchResult {
  songs: Songs[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

const compare = (v1: string | number | boolean, v2: string | number | boolean) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(songs: Songs[], column: SortColumn, direction: string): Songs[] {
  if (direction === '' || column === '') {
    return songs;
  } else {
    return [...songs].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(song: Songs, term: string, pipe: PipeTransform) {
  return song.title.toLowerCase().includes(term.toLowerCase())
    || pipe.transform(song.id).includes(term);
  }
function sleep(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

@Injectable({providedIn: 'root'})
export class TableService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _songs$ = new BehaviorSubject<Songs[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private favorites$ = new BehaviorSubject<Songs[]>([]);
  allsongs : Songs[];
  private _state: State = {
    page: 1,
    pageSize: 6,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe,private http:HttpClient) {
    this.getSongs().subscribe(res => {
      this.allsongs = res;
      for(let i =0;i<this.allsongs.length;i++){
        this.allsongs[i]['isfavorite'] = false;
        this.allsongs[i]['time'] = Math.floor(Math.random() * 6)+ ":"+ Math.floor(Math.random() * 60);
      }
      this._search$.pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false))
      ).subscribe(result => {
        this._songs$.next(result.songs);
        this._total$.next(result.total);
      });
      this._search$.next();
    })
  }

  get songs$() { return this._songs$.asObservable(); }
  get fav$() { return this.favorites$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortColumn(sortColumn: SortColumn) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }
 
  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }
  public setFav(songs:Songs[]){
    this.favorites$.next(songs)
  }
  public setSongs(songs:Songs[]){
    this._songs$.next(songs);
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;
    let songs = sort(this.allsongs, sortColumn, sortDirection);
    songs = songs.filter(song => matches(song, searchTerm, this.pipe));
    const total = songs.length;
    songs = songs.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({songs, total});
  }
  public getSongs(): Observable<Songs[]> {
    return this.http.get<Songs[]>('https://jsonplaceholder.typicode.com/albums');
  }
}
