import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ng-detail-location',
  templateUrl: './detail-location.component.html',
  styleUrls: ['./detail-location.component.scss'],
})
export class DetailLocationComponent implements OnInit {
  constructor() {
    console.log("DetailLocationComponent");
  }

  ngOnInit(): void {
    console.log("tstest");
  }
}
