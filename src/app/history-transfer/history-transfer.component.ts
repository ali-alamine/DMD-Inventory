import { Component, OnInit } from '@angular/core';
import { Router } from '../../../node_modules/@angular/router';
declare var $: any;
@Component({
  selector: 'app-history-transfer',
  templateUrl: './history-transfer.component.html',
  styleUrls: ['./history-transfer.component.css']
})
export class HistoryTransferComponent implements OnInit {
  private globalClientsDT;
  constructor(private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem("user") !== '1') {
      this.router.navigate(["login"]);
    }
    var historyTransferDT = $('#historyTransferDT').DataTable({
      responsive: false,
      paging: true,
      pagingType: "full_numbers",
      serverSide: true,
      processing: true,
      ordering: true,
      stateSave: false,
      fixedHeader: true,
      select: {
        "style": "single"
      },
      searching: true,
      lengthMenu: [[25, 50, 100, 150, 200, 300], [25, 50, 100, 150, 200, 300]],
      ajax: {
        type: "get",
        url: "http://localhost/DMD-Inventory/src/assets/api/dataTables/historyTransferDT.php",
        data: {},
        cache: true,
        async: true
      },
      order: [[0, 'desc']],
      columns: [
        { data: "conv_date", title: "Date" },
        { data: "item_code", title: "Code" },
        { data: "item_name", title: "Article" },
        { data: "conv_crt", title: "CRT" },
        { data: "conv_piece", title: "Piece" }

      ]
    });

    
    
    
  }

}

