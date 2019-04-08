import { FormBuilder, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { RestService } from '../rest.service'; 

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private address: FormGroup;
  results: Array<Result> = []
  response: any
  price: any
  number: any
  processing: boolean = false

  constructor (public estimatorService: RestService, private formBuilder: FormBuilder){
    this.address = this.formBuilder.group({
      postcode: [''],
      street: [''],
    });
  }

  estimate() {
    this.processing=true;
    this.estimatorService.estimate(this.address.value.postcode, this.address.value.street).then(data => {
      this.response = data;
      this.number = this.response.numberOfSales;
      this.price = this.response.price;
      this.results = [new Result(this.address.value.postcode, this.address.value.street, this.response.price, this.response.numberOfSales)].concat(this.results);
      console.log(this.response);
    });
    this.processing=false;
  }

}

class Result {
  constructor(private postcode: string, private street: string, private price: string, private number: string) {}
}
