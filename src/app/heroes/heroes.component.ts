import { HeroService } from '../services/hero.service';
import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero.interface';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss'],
})
export class HeroesComponent implements OnInit {

  heroes: Hero[];

  constructor(
    private heroService: HeroService,
  ) {}

  ngOnInit(): void {
    this.getHeroes();
   }

  private getHeroes(): void {
     this.heroService.getHeroes().subscribe( heroes => this.heroes = heroes.data);
  }

  public add(name: string): void {
    name = name.trim();
    if ( !name ) { return; }
    this.heroService.addHero( name )
      .subscribe( hero => { this.heroes.push( hero.data );
      });
  }


  public delete(hero: Hero) {
  this.heroes = this.heroes.filter( h => h !== hero );
  this.heroService.deleteHero(hero).subscribe();
  }
}
