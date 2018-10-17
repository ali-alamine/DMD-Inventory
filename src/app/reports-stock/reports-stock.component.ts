import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
declare var $: any;
@Component({
  selector: 'app-reports-stock',
  templateUrl: './reports-stock.component.html',
  styleUrls: ['./reports-stock.component.css']
})
export class ReportsStockComponent implements OnInit {
  panelOpenState = false;
  filterForm;
  private static globalDataTable;
  private static gateSearch=-1;
  static qunatityStatus = -1;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    var stockDT = $('#stockReportDT').DataTable({
      responsive: true,
      dom: 'Bfrtip',
      buttons: [
        {
            extend: 'print',
            messageTop: 'Subscribers Report',
            text: 'Print all',
            exportOptions: {
                columns: ':visible',
                modifier: {
                  selected: null
              }
            }
        },
        'colvis',
        {
          extend: 'print',
          text: 'Print selected'
      },
      'pageLength',
      'excel'
      // ,
      // {
      //   extend: 'pdf',
      //   customize: function (doc) {
      //     doc.content[1].table.alignment = 'center';
      //     doc.content[1].table.widths = 
      //         Array(doc.content[1].table.body[0].length + 1).join('*').split('');
      //   }
      // }
    ],
      paging: true,
      pagingType: "full_numbers",
      serverSide: true,
      processing: true,
      ordering: true,
      searching: false,
      stateSave: false,
      fixedHeader: true,
      select: true,
      lengthMenu: [[ 100, 200, 400,800], [ 100, 200, 400,800]],
      ajax: {
        type: "get",
        url: "http://localhost/DMD-Inventory/src/assets/api/dataTables/report-stock.php",
        data: function ( d ) {
          return $.extend( {}, d, {
            "gate":ReportsStockComponent.gateSearch,
            "qunatityStatus":ReportsStockComponent.qunatityStatus
          } );
        },
        cache: true,
        async: true
      },
      order: [[0, 'asc']],
      columns: [
        { data: "item_name", title: "name" },
        { data: "item_is_damaged", title: "gate" },
        { data: "item_code", title: "code" },
        { data: "item_packing_list", title: "colisage" },
        { data: "item_piece", title: "piece" },
        { data: "crt", title: "CRT" }

      ]
    });
    ReportsStockComponent.globalDataTable=stockDT;
    this.filterForm = this.fb.group({
      status: ['-1'],
      gate: ['-1']
    });
  }

  searchSubmit(){    
    ReportsStockComponent.qunatityStatus=this.filterForm.get('status').value;
    ReportsStockComponent.gateSearch=this.filterForm.get('gate').value;
    ReportsStockComponent.globalDataTable.ajax.reload();
  }

}
