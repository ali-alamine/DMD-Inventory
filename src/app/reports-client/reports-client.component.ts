import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-reports-client',
  templateUrl: './reports-client.component.html',
  styleUrls: ['./reports-client.component.css']
})
export class ReportsClientComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    var clientDataTable = $('#clientDataTable').DataTable({
      responsive: true,
      dom: 'Bfrtip',
      buttons: [
        {
            extend: 'print',
            messageTop: 'Clients Report',
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
          text: 'Print Selected'
      },
      'pageLength',
      'excel'
    ],
      paging: true,
      pagingType: "full_numbers",
      serverSide: true,
      processing: true,
      ordering: true,
      searching: false,
      stateSave: false,
      fixedHeader: true,
      select:true,
      lengthMenu: [[ 100, 200, 400,800], [100, 200, 400,800]],
      ajax: {
        type: "get",
        url: "http://localhost/DMD-Inventory/src/assets/api/dataTables/report-client.php",
        data: function ( d ) {
          return $.extend( {}, d, {
          } );
        },
        cache: true,
        async: true
      },
      order: [[0, 'asc']],
      columns: [
        { data: "name", title: "Name" },
        { data: "phone", title: "Phone" },
        { data: "address", title: "Address" },
        { data: "code", title: "Code" }
      ]
    });
  }

}
