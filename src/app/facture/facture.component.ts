import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';

@Component({
  selector: 'app-facture',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.css']
})
export class FactureComponent implements OnInit {
  constructor(private router: Router, private _hotkeysService: HotkeysService) {
    this._hotkeysService.add(new Hotkey('ctrl+z', (event: KeyboardEvent): boolean => {
      this.router.navigate(["facture/supply"]);
      return false;
    }));
    this._hotkeysService.add(new Hotkey('ctrl+a', (event: KeyboardEvent): boolean => {
      this.router.navigate(["facture/client"]);
      return false;
    }));
    this._hotkeysService.add(new Hotkey('ctrl+e', (event: KeyboardEvent): boolean => {
      this.router.navigate(["facture/return"]);
      return false;
    }));
  }
  ngOnInit() {

    this.router.navigate(["facture/client"]);

  }

 


}

