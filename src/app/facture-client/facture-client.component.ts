import { Component, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('f') myNgForm;
  modalReference: any;
  invoiceForm: FormGroup;
  options;
  items: any;
  static selectedItems: fcItem[] = new Array();
  static globalMultiSelectDT;
  constructor(private fb: FormBuilder, private factureClientService: FactureClientService, private modalService: NgbModal ) {
  }

  ngOnInit() {
    this.invoiceForm = this.fb.group({
      invoiceDate: ['', Validators.required],
      delDate: ['', Validators.required],
      clientName: ['', Validators.required],
      searchClient: '',
      clientID: '',
      items: this.fb.array([])
    });
    this.onClientNameChange();
  }

  onClientNameChange(): void {
    this.invoiceForm.get('searchClient').valueChanges.subscribe(val => {
      var data = this.invoiceForm.get('searchClient').value;
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
      isDamaged:[element['gate']],
      crt: [0],
      piece: [0],
      comment: ['']

    });
    this.itemsForm.push(item);
  }


  deleteItem(i, id,itemIsDamaged) {
    debugger;
    this.itemsForm.removeAt(i);
    var index = FactureClientComponent.findWithAttr(FactureClientComponent.selectedItems, 'id','gate', id.value , itemIsDamaged.value);
    FactureClientComponent.selectedItems.splice(index, 1);
  }

  setClientName(id, name) {
    this.invoiceForm.get('searchClient').setValue('');
    this.invoiceForm.get('clientName').setValue(name);
    this.invoiceForm.get('clientID').setValue(id);
  }



  addClientInvoice() {
    this.factureClientService.newClientInvoice(this.invoiceForm.value).subscribe(Response => {
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
    console.log(this.invoiceForm.value);
    while (this.itemsForm.length !== 0) {
      this.itemsForm.removeAt(0)
    }
    FactureClientComponent.selectedItems=[];
    this.invoiceForm.reset();
    this.myNgForm.resetForm();
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
        url: "http://localhost/DMD-Inventory/src/assets/api/dataTables/multiselectDT-Gate.php",
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
        if (FactureClientComponent.findWithAttr(FactureClientComponent.selectedItems, 'id','gate', data['ID'],data['item_is_damaged']) > -1) {
          multiSelectDT.row(row).select();
        }
      }
    });


    multiSelectDT.on('select', function (e, dt, type, indexes) {
      var rows = multiSelectDT.rows('.selected').indexes().toArray();
      rows.forEach(element => {
        var ID = multiSelectDT.row(element).data()['ID'];
        var name = multiSelectDT.row(element).data()['item_name'];
        var gate = multiSelectDT.row(element).data()['item_is_damaged'];

        if (FactureClientComponent.findWithAttr(FactureClientComponent.selectedItems, 'id','gate', ID,gate) == -1)
        FactureClientComponent.selectedItems.push({ id: ID, name: name ,gate:gate});
      });
    });

    multiSelectDT.on('deselect', function (e, dt, type, indexes) {
      var rows = multiSelectDT.rows('.selected').indexes().toArray();
      FactureClientComponent.selectedItems = [];
      rows.forEach(element => {
        var ID = multiSelectDT.row(element).data()['ID'];
        var name = multiSelectDT.row(element).data()['item_name'];
        var gate = multiSelectDT.row(element).data()['item_is_damaged'];
        FactureClientComponent.selectedItems.push({ id: ID, name: name ,gate:gate});
      });
    });


    FactureClientComponent.globalMultiSelectDT = multiSelectDT;
  }

  get itemsForm() {
    return this.invoiceForm.get('items') as FormArray
  }

  get itemID() {
    return this.invoiceForm.get('itemID');
  }

  get itemIsDamaged() {
    return this.invoiceForm.get('isDamaged');
  }

  static findWithAttr(array, attr, attr2, value , value2) {
    for (var i = 0; i < array.length; i += 1) {
      if (array[i][attr] === value && array[i][attr2] === value2) {
        return i;
      }
    }
    return -1;
  }

}

export interface fcItem {
  id: number;
  name: string;
  gate: boolean;
}

