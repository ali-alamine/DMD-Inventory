import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StockService } from '../stock/stock.service';
import { SupplyService } from './facture-supply.service';
import swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-supply',
  templateUrl: './facture-supply.component.html',
  styleUrls: ['./facture-supply.component.css']
})


export class SupplyComponent implements OnInit {

  @ViewChild('f') myNgForm;

  modalReference: any;
  supplyForm: FormGroup;
  items: any;
  static selectedItems: item[] = new Array();
  static globalMultiSelectDT;

  constructor(private fb: FormBuilder, private supplyService: SupplyService, private modalService: NgbModal) { }

  ngOnInit() {
    this.supplyForm = this.fb.group({
      supplyDate: ['', Validators.required],
      items: this.fb.array([])
    });
  }
 

  addRow(element) {
    const item = this.fb.group({
      itemID: [element['id'], Validators.required],
      itemName: [element['name']],
      colisage:[element['colisage']],
      crt: [0],
      piece: [0],
      comment: ['']

    });
    this.itemsForm.push(item);
  }

  deleteItem(i, id) {
    this.itemsForm.removeAt(i);
    var index = SupplyComponent.findWithAttr(SupplyComponent.selectedItems, 'id', id.value);
    SupplyComponent.selectedItems.splice(index, 1);
  }

  addSupplyInvoice() {
    this.supplyService.newSupplyInvoice(this.supplyForm.value).subscribe(Response => {
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
    console.log(this.supplyForm.value);
    while (this.itemsForm.length !== 0) {
      this.itemsForm.removeAt(0)
    }
    SupplyComponent.selectedItems=[];
    this.supplyForm.reset();
    this.myNgForm.resetForm();
  }

  addItemsToFacture() {
    SupplyComponent.globalMultiSelectDT.destroy();
    this.modalReference.close();
    while (this.itemsForm.length !== 0) {
      this.itemsForm.removeAt(0)
    }
    SupplyComponent.selectedItems.forEach(element => {
      this.addRow(element);
    });

  }

  openMultiSelect(mutliSelectModal) {


    this.modalReference = this.modalService.open(mutliSelectModal, { centered: true, size: 'lg', ariaLabelledBy: 'modal-basic-title' });

    var multiSelectDT = $('#stockDT').DataTable({
      responsive: false,
      paging: true,
      pagingType: "numbers",
      serverSide: true,
      processing: true,
      deferRender: true,
      ordering: true,
      stateSave: false,
      fixedHeader: false,
      select: true,
      searching: true,
      lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
      ajax: {
        type: "get",
        url: "http://localhost/DMD-Inventory/src/assets/api/dataTables/multiselectDT-NoGate.php",
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
      rowId: 'ID',
      "createdRow": function (row, data, index) {
        if (SupplyComponent.findWithAttr(SupplyComponent.selectedItems, 'id', data['ID']) > -1) {
          multiSelectDT.row(row).select();
        }
      }
    });


    multiSelectDT.on('select', function (e, dt, type, indexes) {
      var rows = multiSelectDT.rows('.selected').indexes().toArray();
      rows.forEach(element => {
        var ID = multiSelectDT.row(element).data()['ID'];
        var name = multiSelectDT.row(element).data()['item_name'];
        var colisage = multiSelectDT.row(element).data()['item_packing_list'];

        if (SupplyComponent.findWithAttr(SupplyComponent.selectedItems, 'id', ID) == -1)
          SupplyComponent.selectedItems.push({ id: ID, name: name, colisage:colisage });
      });
    });

    multiSelectDT.on('deselect', function (e, dt, type, indexes) {
      var rows = multiSelectDT.rows('.selected').indexes().toArray();
      SupplyComponent.selectedItems = [];
      rows.forEach(element => {
        var ID = multiSelectDT.row(element).data()['ID'];
        var name = multiSelectDT.row(element).data()['item_name'];
        var colisage = multiSelectDT.row(element).data()['item_packing_list'];

        SupplyComponent.selectedItems.push({ id: ID, name: name ,colisage:colisage});
      });
    });



    $('#subsMonths').on('key-focus.dt', function (e, datatable, cell) {
      $(multiSelectDT.row(cell.index().row).node()).addClass('selected');


    });
    $('#subsMonths').on('key-blur.dt', function (e, datatable, cell) {
      $(multiSelectDT.row(cell.index().row).node()).removeClass('selected');
    });

    SupplyComponent.globalMultiSelectDT = multiSelectDT;
  }

  get itemsForm() {
    return this.supplyForm.get('items') as FormArray
  }

  get itemID() {
    return this.supplyForm.get('itemID');
  }

  static findWithAttr(array, attr, value) {
    for (var i = 0; i < array.length; i += 1) {
      if (array[i][attr] === value) {
        return i;
      }
    }
    return -1;
  }
}

export interface item {
  id: number;
  name: string;
  colisage: number;
  
}
