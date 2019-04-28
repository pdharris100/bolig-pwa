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
  response: any;
  pricePerUnitArea: number = 0;
  processing: boolean = false;
  chart: Chart;

  constructor(public estimatorService: RestService, private formBuilder: FormBuilder, public loadingController: LoadingController) {
    this.address = this.formBuilder.group({
      postcode: [''],
      area: [''],
      street: ['']
    });
  }

  estimate() {
    this.processing = true;
    var st: string = this.address.value.street;
    st = st.trim();

    /*     if (document.getElementById('img').className == 'img1') {
          document.getElementById('img').className = 'img2';
        } else {
          document.getElementById('img').className = 'img1';
        } */

    try {      
      this.estimatorService.estimate(this.address.value.postcode, capitalise(st)).then(data => {
      this.response = data;
      this.pricePerUnitArea = this.response.price;

      if (this.chart != null) {
        this.chart.destroy()
      }

      this.chart = new Chart(document.getElementById('scatter'), {
        type: 'line',
        data: {
          datasets: [{
            type: 'line',
            fill: false,
            data: enrichData(this.response.trend),
            backgroundColor: "rgba(218,83,79, .7)",
            borderColor: "rgba(218,83,79, .7)",
          },
          {
            type: 'scatter',
            fill: false,
            data: enrichData(this.response.salesHistory),
            backgroundColor: "rgba(56, 128, 255, .7)",
            borderColor: "transparent"
          }]
        },
        options: {
          legend: {
            display: false
          },
          scales: {
            yAxes: [{
              ticks: {
                callback: function (value: number, index, values) {
                  return value.toLocaleString();
                }
              },
              scaleLabel: {
                display: true,
                labelString: 'kr/m2',
                padding: 0
              }
            }],
            xAxes: [{
              type: 'time',
              position: 'bottom',
              time: {
                unit: 'year',
                stepSize: 2,
                max: new Date().getTime()
              }
            }]
          }
        }
      })
      console.log(this.response);
      this.processing = false;
    })
  } catch (err) {
    this.processing = false;
  }

  }
}

function capitalise(str) 
{
    str = str.split(" ");

    for (var i = 0, x = str.length; i < x; i++) {
        str[i] = str[i][0].toUpperCase() + str[i].substr(1);
    }

    return str.join(" ");
}

function enrichData(salesHistory: any) {
  var result = [];
  for (let index = 0; index < salesHistory.length; index++) {
    var element = { x: salesHistory[index][0], y: salesHistory[index][1] };
    result.push(element);
  }
  return result;
}

