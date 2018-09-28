import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StockService } from '../stock/stock.service';
import { SupplyService } from '../facture-supply/facture-supply.service';
import swal from 'sweetalert2';
import { FactureClientService } from './facture-client.service';
declare var $: any;
@Component({
  selector: 'app-facture',
  templateUrl: './facture-client.component.html',
  styleUrls: ['./facture-client.component.css']
})

export class FactureClientComponent implements OnInit {
  modalReference: any;
  supplyForm: FormGroup;
  options;
  items: any;
  newItemForm: FormGroup;
  rechargeCardForm: FormGroup;
  static selectedItems: item[] = new Array();
  static globalMultiSelectDT;
  constructor(private fb: FormBuilder, private factureClientService: FactureClientService, private modalService: NgbModal, private stockService: StockService) {
  }

  ngOnInit() {
    this.supplyForm = this.fb.group({
      supplyDate: ['', Validators.required],
      delDate: ['', Validators.required],
      supplierName: ['', Validators.required],
      searchSupplier: '',
      supplierID: '',
      items: this.fb.array([])
    });
    this.onSupplierNameChange();
  }

  onSupplierNameChange(): void {
    this.supplyForm.get('searchSupplier').valueChanges.subscribe(val => {
      var data = this.supplyForm.get('searchSupplier').value;
      if (data == "") {
        this.options = [];
        return;
      }
      this.factureClientService.searchClient(data).subscribe(Response => {
        this.options = Response;
      })
    });
  }

  addRow(element) {
    const item = this.fb.group({
      itemID: [element['id'], Validators.required],
      itemName: [element['name']],
      crt: [0],
      piece: [0],
      comment: ['']

    });
    this.itemsForm.push(item);
  }


  deleteItem(i, id) {
    debugger;
    this.itemsForm.removeAt(i);
    var index = FactureClientComponent.findWithAttr(FactureClientComponent.selectedItems, 'id', id.value);
    FactureClientComponent.selectedItems.splice(index, 1);
  }

  test(id, name) {
    this.supplyForm.get('searchSupplier').setValue('');
    this.supplyForm.get('supplierName').setValue(name);
    this.supplyForm.get('supplierID').setValue(id);
  }



  addSupplyInvoice() {
    // this.supplyService.addSupply(this.supplyForm.value).subscribe(Response => {
    //   swal({
    //     type: 'success',
    //     title: 'Success',
    //     text: 'Supply Successfully',
    //     showConfirmButton: false,
    //     timer: 1000
    //   });
    // }, error => {
    //   swal({
    //     type: 'error',
    //     title: error.statusText,
    //     text: error.message
    //   });
    // });
    console.log(this.supplyForm.value);
    this.supplyForm.reset();
  }

  addItemsToFacture() {
    FactureClientComponent.globalMultiSelectDT.destroy();
    this.modalReference.close();
    while (this.itemsForm.length !== 0) {
      this.itemsForm.removeAt(0)
    }
    FactureClientComponent.selectedItems.forEach(element => {
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
      fixedHeader: true,
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
        if (FactureClientComponent.findWithAttr(FactureClientComponent.selectedItems, 'id', data['ID']) > -1) {
          multiSelectDT.row(row).select();
        }
      }
    });


    multiSelectDT.on('select', function (e, dt, type, indexes) {
      var rows = multiSelectDT.rows('.selected').indexes().toArray();
      rows.forEach(element => {
        var ID = multiSelectDT.row(element).data()['ID'];
        var name = multiSelectDT.row(element).data()['item_name'];

        if (FactureClientComponent.findWithAttr(FactureClientComponent.selectedItems, 'id', ID) == -1)
          FactureClientComponent.selectedItems.push({ id: ID, name: name });
      });
    });

    multiSelectDT.on('deselect', function (e, dt, type, indexes) {
      var rows = multiSelectDT.rows('.selected').indexes().toArray();
      FactureClientComponent.selectedItems = [];
      rows.forEach(element => {
        var ID = multiSelectDT.row(element).data()['ID'];
        var name = multiSelectDT.row(element).data()['item_name'];
        FactureClientComponent.selectedItems.push({ id: ID, name: name });
      });
    });



    $('#subsMonths').on('key-focus.dt', function (e, datatable, cell) {
      $(multiSelectDT.row(cell.index().row).node()).addClass('selected');


    });
    $('#subsMonths').on('key-blur.dt', function (e, datatable, cell) {
      $(multiSelectDT.row(cell.index().row).node()).removeClass('selected');
    });

    FactureClientComponent.globalMultiSelectDT = multiSelectDT;
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
}

