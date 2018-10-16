import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
declare var $: any;
@Component({
  selector: 'app-reports-invoice',
  templateUrl: './reports-invoice.component.html',
  styleUrls: ['./reports-invoice.component.css']
})
export class ReportsInvoiceComponent implements OnInit {
  panelOpenState = false;
  filterForm;
  private static globalDataTable;
  private static invoiceType=-1;

  private static fromDate;
  private static toDate;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    var subscriberDataTable = $('#subscribersRprtDT').DataTable({
      responsive: false,
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
      'pageLength'
    ],
      paging: true,
      pagingType: "full_numbers",
      serverSide: true,
      processing: true,
      ordering: true,
      searching: false,
      stateSave: false,
      fixedHeader: true,
      select: {
        "style": "multi"
      },
      lengthMenu: [[ 25, 50, 100, 200, 400,800,1600], [25, 50, 100, 200, 400,800,1600]],
      ajax: {
        type: "get",
        url: "http://localhost/DMD-Inventory/src/assets/api/dataTables/report-invoice.php",
        data: function ( d ) {
          return $.extend( {}, d, {
            "invoiceType": ReportsInvoiceComponent.invoiceType,            
            "fromDate":ReportsInvoiceComponent.fromDate,
            "toDate":ReportsInvoiceComponent.toDate
          } );
        },
        cache: true,
        async: true
      },
      order: [[0, 'asc']],
      columns: [
        { data: "invID", title: "invID" },
        { data: "inv_code", title: "inv_code" },
        { data: "inv_type", title: "inv_type" },
        { data: "inv_date_req", title: "inv_date_req" }
      ]
    });
    ReportsInvoiceComponent.globalDataTable=subscriberDataTable;
    this.filterForm = this.fb.group({
      invoiceType: ['-1'],
      fromDateCtrl:[],
      toDateCtrl:[],
    });
  }

  searchSubmit(){
    console.log(this.filterForm.value)
    if(this.filterForm.get('fromDateCtrl').value != null && this.filterForm.get('toDateCtrl').value != null){
      ReportsInvoiceComponent.fromDate=formatDate(this.filterForm.get('fromDateCtrl').value,'yyyy-MM-dd','en');
      ReportsInvoiceComponent.toDate=formatDate(this.filterForm.get('toDateCtrl').value,'yyyy-MM-dd','en');
    }
    else if(this.filterForm.get('fromDateCtrl').value != null || this.filterForm.get('toDateCtrl').value != null){
      if(this.filterForm.get('fromDateCtrl').value != null){
        ReportsInvoiceComponent.fromDate=formatDate(this.filterForm.get('fromDateCtrl').value,'yyyy-MM-dd','en');
        ReportsInvoiceComponent.toDate=formatDate(this.filterForm.get('fromDateCtrl').value,'yyyy-MM-dd','en');
      }
      else{
        ReportsInvoiceComponent.fromDate=formatDate(this.filterForm.get('toDateCtrl').value,'yyyy-MM-dd','en');
        ReportsInvoiceComponent.toDate=formatDate(this.filterForm.get('toDateCtrl').value,'yyyy-MM-dd','en');
      }
      
    }
    else{
      ReportsInvoiceComponent.fromDate="";
      ReportsInvoiceComponent.toDate="";
    }
    ReportsInvoiceComponent.invoiceType=this.filterForm.get('invoiceType').value;
    ReportsInvoiceComponent.globalDataTable.ajax.reload();
  }

}
