import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { StockService } from './stock.service';
import { MenuItem } from 'primeng/api';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})

export class StockComponent implements OnInit {
  modalReference: any;
  private stockForm;
  stockModalTitle;
  editFlag = false;
  private static selectedRowData;
  private static selectedStockID;
  editedStockData = {};
  items: MenuItem[];
  private globalStocksDT;


  constructor(private modalService: NgbModal,  private fb: FormBuilder,private stockService: StockService) { }

  ngOnInit() {
    var subscriberDataTable = $('#stocksDT').DataTable({
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
        url: "http://localhost:8080/DMD-Inventory/src/assets/api/dataTables/stockDataTable.php",
        data: {},
        cache: true,
        async: true
      },
      order: [[0, 'asc']],
      columns: [
        { data: "colisage", title: "Colisage" },
        { data: "articles", title: "Articles" },
        { data: "piece", title: "Piece" },
        { data: "code", title: "Code", render: $.fn.dataTable.render.number(',', '.', 0, 'LL ') }

      ]
    });

    this.items = [
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
        command: (event) => {
          let element: HTMLElement = document.getElementById('editStockBtn') as HTMLElement;
          element.click();
        }

      }
    ];
    this.globalStocksDT = subscriberDataTable;

    subscriberDataTable.on('select', function (e, dt, type, indexes) {
      if (type === 'row') {
        StockComponent.selectedRowData = subscriberDataTable.row(indexes).data();
        var data = subscriberDataTable.row(indexes).data()['ID'];
        StockComponent.selectedStockID = data;
      }
      else if (type === 'column') {
        StockComponent.selectedStockID = -1;
      }
    });

    $('#stocksDT tbody').on('mousedown', 'tr', function (event) {
      if (event.which == 3) {
        subscriberDataTable.row(this).select();
      }
    });

    $('#stocksDT').on('key-focus.dt', function (e, datatable, cell) {
      $(subscriberDataTable.row(cell.index().row).node()).addClass('selected');

    });
    $('#stocksDT').on('key-blur.dt', function (e, datatable, cell) {
      $(subscriberDataTable.row(cell.index().row).node()).removeClass('selected');
    });
    
  }
  
  openStockModal(stockModal) {
    this.modalReference = this.modalService.open(stockModal, { centered: true, ariaLabelledBy: 'modal-basic-title' });
    var name = '';
    var quantity = '';
    var address = '';
    this.stockModalTitle = "Add Stock";

    if (this.editFlag == true) {
      this.stockModalTitle = "Edit Stock";
      name = StockComponent.selectedRowData['name'];
      quantity = StockComponent.selectedRowData['quantity'];
    }
    this.stockForm = this.fb.group({
      name: [name, [Validators.required, Validators.minLength(3)]],
      quantity: [quantity, [Validators.required, Validators.numberValidator]]
    });
  }

  addEditStock() {
    if (this.editFlag == true) {
      this.editedStockData['name'] = this.name.value;
      // this.editedStockData['phone'] = this.address.value;
      // this.editedStockData['address'] = this.phoneNumber.value;
      this.editedStockData['code'] = StockComponent.selectedStockID;

      console.log(this.editedStockData)
      this.stockService.editStockItem(this.editedStockData).subscribe(Response => {
        this.globalStocksDT.ajax.reload(null, false);
        Swal({
          type: 'success',
          title: 'Success',
          text: 'Stock Updated Successfully',
          showConfirmButton: false,
          timer: 1000
        });
      }, error => {
        Swal({
          type: 'error',
          title: error.statusText,
          text: error.message
        });
      });
    }
    else {
      this.stockService.addStockItem(this.stockForm.value).subscribe(Response => {
        this.globalStocksDT.ajax.reload(null, false);
        Swal({
          type: 'success',
          title: 'Success',
          text: 'Stock Added Successfully',
          showConfirmButton: false,
          timer: 1000
        });
      }, error => {
        Swal({
          type: 'error',
          title: error.statusText,
          text: error.message
        });
      });
    }

    this.modalReference.close();
  }

  get name() {
    return this.stockForm.get('name');
  }
  get quantity() {
    return this.stockForm.get('quantity');
  }

}
