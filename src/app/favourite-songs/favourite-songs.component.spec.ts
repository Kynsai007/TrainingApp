import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouriteSongsComponent } from './favourite-songs.component';

describe('FavouriteSongsComponent', () => {
  let component: FavouriteSongsComponent;
  let fixture: ComponentFixture<FavouriteSongsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavouriteSongsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouriteSongsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
