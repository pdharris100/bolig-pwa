import { Component } from '@angular/core';
import { RestService } from '../rest.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Chart } from 'chart.js';

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

  constructor(public estimatorService: RestService, private formBuilder: FormBuilder, public loadingController: LoadingController) {
    this.address = this.formBuilder.group({
      postcode: [''],
      street: [''],
    });
  }

  estimate() {
    this.processing = true;

    if (document.getElementById('img').className == 'img1') {
      document.getElementById('img').className = 'img2';
    } else {
      document.getElementById('img').className = 'img1';
    }

    this.estimatorService.estimate(this.address.value.postcode, this.address.value.street).then(data => {
      this.response = data;
      this.number = this.response.numberOfSales;
      this.price = this.response.price;
      //this.results = [new Result(this.address.value.postcode, this.address.value.street, this.response.price, this.response.numberOfSales)].concat(this.results);
      this.results = [new Result(this.address.value.postcode, this.address.value.street, this.response.price, this.response.numberOfSales)];

      var chart = new Chart(document.getElementById('scatter'), {
        type: 'scatter',
        data: {
          datasets: [{
            type: 'scatter',
            data: getData(this.response.salesHistory),
            backgroundColor: "rgba(93,188,210, .7)",
            borderColor: "transparent"
          }]
        },
        options: {
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              type: 'time',
              position: 'bottom',
              time: {
                unit: 'year',
                max: new Date().getTime()
              }             
            }]
          }
        }
      })

      this.processing = false;
      console.log(this.response);
    });

  }
}

function getData(response: any) {
  var result = [];
  for (let index = 0; index < response[0].length; index++) {
    var element = { x: response[0][index], y: response[1][index] };
    result.push(element);
  }
  return result;
}

class Result {
  constructor(private postcode: string, private street: string, private price: string, private number: string) { }
}

