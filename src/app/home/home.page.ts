import { Component } from '@angular/core';
import { RestService } from '../rest.service'; 
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  address: FormGroup;
  results: Array<Result> = []
  response: any
  price: any
  number: any
  processing: boolean = false;

  constructor (public estimatorService: RestService, private formBuilder: FormBuilder, public loadingController: LoadingController){
    this.address = this.formBuilder.group({
      postcode: [''],
      street: [''],
    });
  }

  estimate() {
    this.processing=true;

    if (document.getElementById('img').className == 'img1') {
      document.getElementById('img').className = 'img2' ;
    } else {
      document.getElementById('img').className = 'img1'; 
    }

    this.estimatorService.estimate(this.address.value.postcode, this.address.value.street).then(data => {
      this.response = data;
      this.number = this.response.numberOfSales;
      this.price = this.response.price;
      this.results = [new Result(this.address.value.postcode, this.address.value.street, this.response.price, this.response.numberOfSales)].concat(this.results);
      this.processing=false;
      console.log(this.response);
    });
    
  }
}

class Result {
  constructor(private postcode: string, private street: string, private price: string, private number: string) {}
}
