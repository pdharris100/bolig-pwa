import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  url = 'https://estimatorservice.azurewebsites.net/estimate';
  //url = 'http://localhost:8081/estimate';
  constructor(public http: HttpClient) { }

  estimate(postcode: string, street: string){

  const options = postcode ?
   { params: new HttpParams().set('postcode', postcode).set('street', street) } : {};

    return new Promise(resolve => {
      this.http.get(this.url, options).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
}


