import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
declare var $: any;
import Swal from 'sweetalert2';
import { CreditInvoicesService } from './credit-invoices.service';

@Component({
  selector: 'app-credit-invoices',
  templateUrl: './credit-invoices.component.html',
  styleUrls: ['./credit-invoices.component.css']
})
export class CreditInvoicesComponent implements OnInit {
  items: MenuItem[];
  private globalCentralInvDT;
  private static selectedRowData;
  private static selectedCentralInvoiceID;
  constructor(private creditInvoicesService: CreditInvoicesService ) { }

  ngOnInit() {
    var internetInvoicesDT = $('#creditInvoicesDT').DataTable({
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
      lengthMenu: [[25, 50, 100, 200, 400, 800], [25, 50, 100, 200, 400, 800]],
      ajax: {
        type: "get",
        url: "http://localhost/MoussaNet/src/assets/api/dataTables/creditInvoicesDT.php",
        data: {},
        cache: true,
        async: true
      },
      order: [[0, 'desc']],
      columns: [

        { data: "date", title: "Sell Date" },
        { data: "name", title: "Item Name" },
        { data: "clientName", title: "Client Name" },
        { data: "quantity", title: "Quantity" },
        { data: "price", title: "Price", render: $.fn.dataTable.render.number(',', '.', 0, 'LL ') },
        { data: "profit", title: "Profit",render: $.fn.dataTable.render.number(',', '.', 0, 'LL ') }
      ]
    });


    this.items = [
      {
        label: 'Delete',
        icon: 'pi pi-fw pi-times',
        command: (event) => {
          let element: HTMLElement = document.getElementById('deleteInvoiceBtn') as HTMLElement;
          element.click();
        }

      },
      {
        label: 'Delete wo change',
        icon: 'pi pi-fw pi-times',
        command: (event) => {
          let element: HTMLElement = document.getElementById('deleteInvoiceWoChangeBtn') as HTMLElement;
          element.click();
        }

      }
    ];

    this.globalCentralInvDT = internetInvoicesDT;

    internetInvoicesDT.on('select', function (e, dt, type, indexes) {

      if (type === 'row') {
        CreditInvoicesComponent.selectedRowData = internetInvoicesDT.row(indexes).data();
        var data = internetInvoicesDT.row(indexes).data()['ID'];
        CreditInvoicesComponent.selectedCentralInvoiceID = data;
      }
      else if (type === 'column') {
        CreditInvoicesComponent.selectedCentralInvoiceID = -1;
      }
    });

    $('#creditInvoicesDT tbody').on('mousedown', 'tr', function (event) {
      if (event.which == 3) {
        internetInvoicesDT.row(this).select();
      }
    });

    $('#creditInvoicesDT').on('key-focus.dt', function (e, datatable, cell) {
      $(internetInvoicesDT.row(cell.index().row).node()).addClass('selected');

    });
    $('#creditInvoicesDT').on('key-blur.dt', function (e, datatable, cell) {
      $(internetInvoicesDT.row(cell.index().row).node()).removeClass('selected');
    });
  }

}
