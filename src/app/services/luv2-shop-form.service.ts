import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { State } from '../common/state'; 
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

  //Countries and states
  private countriesUrl = 'http://localhost:8080/countries';
  private statesUrl = 'http://localhost:8080/states';

  constructor(private httpClient: HttpClient) { }

  getCreditCardMonths(startMonth: number): Observable<number []> {

    let data: number[] = [];

    // build an array for "Month" dropdown list
    // - start at desired startMonth and loop until 12

    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }

    return of(data);
  }// end getCreditCardMonths


  getCreditCardYears(): Observable<number[]> {

    let data: number[] = [];

    // build an array for "Year" dropdown list
    // - start at current year and loop for next 10

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }

    return of(data);
  } // end getCreditCardYear

  
  //State
  getStates(theCountryCode: string): Observable<State[]> {

    // Search url
    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;

    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    );

  }

  //Cuntry
  getCountries():Observable<Country[]> {

    
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );

  }


}// End main class Luv2ShopFormService

interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}
