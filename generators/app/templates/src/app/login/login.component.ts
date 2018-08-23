import { Component, OnInit, ElementRef } from '@angular/core';
declare let popup: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {



  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.runScript();
  }

  runScript () {
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = '/assets/js/libs/popup.js';
    this.elementRef.nativeElement.appendChild(s);
    // s.onload = () => this.triggerDuo();
  }

}
