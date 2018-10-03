import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StockService } from '../stock/stock.service';
import { SupplyService } from '../facture-supply/facture-supply.service';
import swal from 'sweetalert2';
import { FactureClientService } from './facture-client.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { Router } from '@angular/router';
declare var $: any;
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-facture',
  templateUrl: './facture-client.component.html',
  styleUrls: ['./facture-client.component.css']
})

export class FactureClientComponent implements OnInit {
  @ViewChild('f') myNgForm;
  focusDate = false;
  modalReference: any;
  invoiceForm: FormGroup;
  options;
  items: any;
  static selectedItems: fcItem[] = new Array();
  static globalMultiSelectDT;
  constructor(private datePipe: DatePipe,private fb: FormBuilder, private factureClientService: FactureClientService, private router: Router, private modalService: NgbModal, private _hotkeysService: HotkeysService) {
    this._hotkeysService.add(new Hotkey('ctrl+`', (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('multiSelectBtn') as HTMLElement;
      element.click();
      return false;
    }));
    this._hotkeysService.add(new Hotkey('ctrl+z', (event: KeyboardEvent): boolean => {
      this.router.navigate(["facture/supply"]);
      return false;
    }));
    this._hotkeysService.add(new Hotkey('ctrl+a', (event: KeyboardEvent): boolean => {
      this.router.navigate(["facture/client"]);
      return false;
    }));
    this._hotkeysService.add(new Hotkey('ctrl+e', (event: KeyboardEvent): boolean => {
      this.router.navigate(["facture/return"]);
      return false;
    }));
  }

  ngOnInit() {
    const currentDate = new Date();
    var deliveryDate = currentDate.toISOString().substring(0, 10);
    var s = this.datePipe.transform(currentDate,"MM/d/yyyy");
    
    this.invoiceForm = this.fb.group({
      invoiceDate: [s, Validators.required],
      delDate: [deliveryDate, Validators.required],
      clientName: ['', Validators.required],
      searchClient: '',
      clientID: '',
      items: this.fb.array([])
    });
    this.onClientNameChange();
  }

  ngOnDestroy() {
    this._hotkeysService.reset();
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
      isDamaged: [element['gate']],
      colisage: [element['colisage']],
      crt: [''],
      piece: [''],
      comment: ['']

    });
    this.itemsForm.push(item);
  }


  deleteItem(i, id, itemIsDamaged) {
    this.itemsForm.removeAt(i);
    var index = FactureClientComponent.findWithAttr(FactureClientComponent.selectedItems, 'id', 'gate', id.value, itemIsDamaged.value);
    FactureClientComponent.selectedItems.splice(index, 1);
    
  }

  setClientName(id, name) {
    this.invoiceForm.get('searchClient').setValue('');
    this.invoiceForm.get('clientName').setValue(name);
    this.invoiceForm.get('clientID').setValue(id);
    console.log(this.itemsForm.value)
  }



  addClientInvoice(flag) {
    this.factureClientService.newClientInvoice(this.invoiceForm.value).subscribe(Response => {
      swal({
        type: 'success',
        title: 'Success',
        text: 'Invoice Added Successfully',
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
    FactureClientComponent.selectedItems = [];
    this.invoiceForm.reset();
    this.myNgForm.resetForm();

    if(flag == true)
    this.printFactureClient()
  }

   printFactureClient(){
    var printContents = document.getElementById('printFacture').innerHTML;
    var popupWin = window.open('', '_blank', 'width=800,height=600');
    popupWin.document.open();
    popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="../../styles.css"></head><body onload="window.print()">' + printContents + '</body></html>');
    popupWin.document.close();
    setTimeout(function(){ popupWin.close(); }, 1000);
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
      fixedHeader: false,
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
        if (FactureClientComponent.findWithAttr(FactureClientComponent.selectedItems, 'id', 'gate', data['ID'], data['item_is_damaged']) > -1) {
          multiSelectDT.row(row).select();
        }

        if (data['item_is_damaged'] == 1) {
          $(row).addClass("text-danger");
        }
      }
    });


    multiSelectDT.on('select', function (e, dt, type, indexes) {
      var rows = multiSelectDT.rows('.selected').indexes().toArray();
      rows.forEach(element => {
        var ID = multiSelectDT.row(element).data()['ID'];
        var name = multiSelectDT.row(element).data()['item_name'];
        var gate = multiSelectDT.row(element).data()['item_is_damaged'];
        var colisage = multiSelectDT.row(element).data()['item_packing_list'];

        if (FactureClientComponent.findWithAttr(FactureClientComponent.selectedItems, 'id', 'gate', ID, gate) == -1)
          FactureClientComponent.selectedItems.push({ id: ID, name: name, gate: gate, colisage: colisage });
      });
    });

    multiSelectDT.on('deselect', function (e, dt, type, indexes) {
      var rows = multiSelectDT.rows('.selected').indexes().toArray();
      FactureClientComponent.selectedItems = [];
      rows.forEach(element => {
        var ID = multiSelectDT.row(element).data()['ID'];
        var name = multiSelectDT.row(element).data()['item_name'];
        var gate = multiSelectDT.row(element).data()['item_is_damaged'];
        var colisage = multiSelectDT.row(element).data()['item_packing_list'];
        FactureClientComponent.selectedItems.push({ id: ID, name: name, gate: gate, colisage: colisage });
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
  get clientName() {
    return this.invoiceForm.get('clientName');
  }

  

  get itemIsDamaged() {
    return this.invoiceForm.get('isDamaged');
  }

  static findWithAttr(array, attr, attr2, value, value2) {
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
  colisage: number;
}

