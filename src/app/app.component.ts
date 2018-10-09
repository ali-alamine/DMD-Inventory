import { Component, HostListener } from '@angular/core';
import { Router } from '../../node_modules/@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DMD-Inventory';

  constructor(private router: Router) { }

  ngOnInit() {
    
    if (localStorage.getItem("user") !== '1') {
      this.router.navigate(["login"]);
       
    }
  }
  @HostListener('window:beforeunload')
  destroyLocalStorage() {
    localStorage.clear();
  }
}
