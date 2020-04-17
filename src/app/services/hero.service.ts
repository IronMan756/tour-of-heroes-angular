import { MessageService } from './message.service';
import { Injectable } from '@angular/core';
import { Heroes, Hero } from '../hero.interface';
import { Observable, of } from 'rxJs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HeroService {


  private baseUrl = 'http://localhost:8090';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) {}

  // tslint:disable-next-line: variable-name
  public  getHero( _id: string) {
    return this.http.get<Hero>(`${this.baseUrl}/heroes/${_id}`, this.httpOptions)
            .pipe(
              tap( _ => this.log('fetched heroes')),
              catchError(this.handleError<any>(`getHero id =${_id}`))
    );
  }


  public getHeroes(): Observable<Heroes> {
    return  this.http.get<any>(`${this.baseUrl}/heroes`)
          .pipe(
            tap( _ => this.log('fetched heroes')),
            catchError(this.handleError<Heroes>('getHeroes'))
    );
  }


  public  getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.baseUrl}/heroes?id=${id}`;
    return this.http.get<Hero[]>(url)
      .pipe(
        map(heroes => heroes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  public addHero( name: string ): Observable<any> {
    return  this.http.post<any>(`${this.baseUrl}/heroes`, { name }, this.httpOptions)
    .pipe(
        tap( (newHero: Hero) => this.log(`Added hero / id= ${newHero._id}`)),
        catchError( this.handleError<Hero>('addHero'))
        );
   }


  public  updateHero(hero: Hero): Observable<any> {
    return this.http.put(`${this.baseUrl}/heroes`, hero, this.httpOptions)
        .pipe(
            tap( _ => this.log(`update hero Id =${hero._id}`)),
            catchError(this.handleError<any>('updateHero'))
        );
  }


  public deleteHero( hero: Hero ): Observable<Hero> {
    return this.http.delete<any>(`${this.baseUrl}/heroes/${hero._id}`, this.httpOptions)
          .pipe(
            tap( _ => this.log(`deleted hero / id= ${hero._id}`)),
            catchError( this.handleError<Hero>('deletedHero'))

          );
  }

  public searchHeroes( term: string): Observable<any> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<any>(`${this.baseUrl}/heroes/search?name=${term}`)
          .pipe(
              tap( x => x.length ?
              this.log(` found heroes matching "${term}"`) :
              this.log(`no heroes matching "${term}"`)),
              catchError(this.handleError<Hero[]>('searchHeroes', []))
          );
  }


  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }



  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
 }
