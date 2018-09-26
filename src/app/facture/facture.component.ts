import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StockService } from '../stock/stock.service';
import { SupplyService } from '../supply/supply.service';
import swal from 'sweetalert2';
declare var $: any;
@Component({
  selector: 'app-facture',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.css']
})
export class FactureComponent implements OnInit {
  modalReference: any;
  supplyForm: FormGroup;
  options;
  items: any;
  newItemForm: FormGroup;
  rechargeCardForm: FormGroup;
  static selectedItems: number[] = new Array();
  constructor(private fb: FormBuilder, private supplyService: SupplyService, private modalService: NgbModal, private stockService: StockService) {
  }

  ngOnInit() {
    this.supplyForm = this.fb.group({
      supplyDate: ['', Validators.required],
      supplierName: ['', Validators.required],
      searchSupplier: '',
      supplierID: '',
      items: this.fb.array([])
    });
    this.onSupplierNameChange();
    this.addRow();
  }


  onItemNameChange(index) {
    var data = this.itemsForm.controls[index].get('searchItem').value;
    if (data == "") {
      this.items = [];
      return;
    }
    this.supplyService.searchItem(data, 1).subscribe(Response => {
      this.items = Response;
    })
  }

  onSupplierNameChange(): void {
    this.supplyForm.get('searchSupplier').valueChanges.subscribe(val => {
      var data = this.supplyForm.get('searchSupplier').value;
      if (data == "") {
        this.options = [];
        return;
      }
      this.supplyService.searchSupplier(data).subscribe(Response => {
        this.options = Response;
      })
    });
  }

  addRow() {
    const item = this.fb.group({
      searchItem: [],
      itemID: ['', Validators.required],
      price: [0, Validators.min(1)],
      quantity: [0, Validators.min(1)],
      itemTotalPrice: [0, Validators.min(1)]
    });
    this.itemsForm.push(item);
  }

  addItem(i, id, name) {
    this.itemsForm.controls[i].get('searchItem').setValue(name);
    this.itemsForm.controls[i].get('searchItem').disable();
    this.itemsForm.controls[i].get('itemID').setValue(id);
    this.items = [];
  }

  deleteItem(i, editPrice) {
    this.itemsForm.removeAt(i);
  }

  test(id, name) {
    this.supplyForm.get('searchSupplier').setValue('');
    this.supplyForm.get('supplierName').setValue(name);
    this.supplyForm.get('supplierID').setValue(id);
  }



  addSupplyInvoice() {
    this.supplyService.addSupply(this.supplyForm.value).subscribe(Response => {
      swal({
        type: 'success',
        title: 'Success',
        text: 'Supply Successfully',
        showConfirmButton: false,
        timer: 1000
      });
    }, error => {
      swal({
        type: 'error',
        title: error.statusText,
        text: error.message
      });
    });
    this.supplyForm.reset();
    this.supplyForm.get('totalPrice').setValue(0);
    this.supplyForm.get('type').setValue('RC');
    this.supplyForm.get('drawer').setValue('M');
    this.supplyForm.get('paid').setValue(0);
  }

  openMultiSelect(mutliSelectModal) {

    debugger;

    this.modalReference = this.modalService.open(mutliSelectModal, { centered: true, size: 'lg', ariaLabelledBy: 'modal-basic-title' });

    var multiSelectDT = $('#stockDT').DataTable({
      responsive: false,
      paging: true,
      pagingType: "full_numbers",
      serverSide: true,
      processing: true,
      deferRender: true,
      ordering: true,
      stateSave: false,
      fixedHeader: true,
      select: true,
      searching: true,
      lengthMenu: [[5, 10, 25, 50, 100, 150, 200, 300], [5, 10, 25, 50, 100, 150, 200, 300]],
      ajax: {
        type: "get",
        url: "http://localhost/DMD-Inventory/src/assets/api/dataTables/stockDataTable.php",
        data: {},
        cache: true,
        async: true
      },
      order: [[0, 'asc']],
      columns: [
        { data: "ID", title: "ID" },
        { data: "item_name", title: "Article" },
        { data: "item_code", title: "Code" },
        { data: "item_crt", title: "CRT" },
        { data: "item_piece", title: "Piece" },
        { data: "item_packing_list", title: "Colisage" }

      ],
      rowId: 'ID'
    });


    multiSelectDT.on('select', function (e, dt, type, indexes) {
      var rowData = multiSelectDT.rows(indexes).data().toArray();


      rowData.forEach(element => {
        FactureComponent.selectedItems.push(element['ID']);
      });
      console.log(FactureComponent.selectedItems);
    });

    multiSelectDT.on('deselect', function (e, dt, type, indexes) {
      var rowData = multiSelectDT.rows(indexes).data().toArray();

      console.log(indexes)
      rowData.forEach(element => {
        var index =FactureComponent.selectedItems.indexOf(element['ID']);
        FactureComponent.selectedItems.slice(index,1);
      });

      console.log('selected:',FactureComponent.selectedItems);

      
    });



    $('#subsMonths').on('key-focus.dt', function (e, datatable, cell) {
      $(multiSelectDT.row(cell.index().row).node()).addClass('selected');


    });
    $('#subsMonths').on('key-blur.dt', function (e, datatable, cell) {
      $(multiSelectDT.row(cell.index().row).node()).removeClass('selected');
    });



  }



  tabKey(data) {
    if (data == this.itemsForm.length - 1)
      this.addRow();
  }

  get itemsForm() {
    return this.supplyForm.get('items') as FormArray
  }

  get itemPrice() {
    return this.itemsForm.controls[0].get('itemPrice');
  }

  get tt() {
    return this.supplyForm.get('totalPrice');
  }

}


