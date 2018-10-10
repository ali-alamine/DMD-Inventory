import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SupplyService } from './facture-supply.service';
import swal from 'sweetalert2';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { Router, ActivatedRoute } from '@angular/router';
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
  private sub;
  factureID;
  factureHeader = [];
  factureDetails = [];
  editFactureTitle="";

  constructor(private fb: FormBuilder, private supplyService: SupplyService,private router: Router, private modalService: NgbModal, private _hotkeysService: HotkeysService, private route: ActivatedRoute) { 
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
    var factureDate = currentDate.toISOString().substring(0, 10);
    this.sub = this.route.queryParams.subscribe(params => {
      this.factureID = params['factureID'] || '-1';
    });
    this.supplyForm = this.fb.group({
      supplyDate: [factureDate, Validators.required],
      items: this.fb.array([]),
      invoiceID: []
    });
    
    if(this.factureID != '-1'){
      this.supplyService.getFactureDetails(this.factureID).subscribe(Response => {        
        this.factureHeader = Response[0];
        this.factureDetails = Response[1];
        var supplyDate = this.factureHeader[0]['inv_date_req'];
        this.factureDate.setValue(supplyDate);
        this.invoiceID.setValue(this.factureID);
        this.factureDetails.forEach(element => {
          this.addFactureEditRow(element);
          SupplyComponent.selectedItems.push({ id: element['itemID'], name: element['item_name'], colisage:element['item_packing_list'] });
        });
        this.editFactureTitle = "Modifier Facture: "+this.factureHeader[0]['inv_code'];        
      }, error => {
        swal({
          type: 'error',
          title: error.statusText,
          text: error.message
        });
      });
    }   
  }

  ngOnDestroy() {
    this._hotkeysService.reset();
    SupplyComponent.selectedItems = [];
  }

  addFactureEditRow(element) {
    const item = this.fb.group({
      itemID: [element['itemID'], Validators.required],
      itemName: [element['item_name']],
      colisage:[element['item_packing_list']],
      crt: [element['ord_crt']],
      piece: [element['ord_piece']],
      comment: [element['ord_note']]

    });
    this.itemsForm.push(item);
  }

  addRow(element) {
    const item = this.fb.group({
      itemID: [element['id'], Validators.required],
      itemName: [element['name']],
      colisage:[element['colisage']],
      crt: [''],
      piece: [''],
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
    if(this.factureID != '-1')
    {
      this.supplyService.editSupplyInvoice(this.supplyForm.value).subscribe(Response => {
        swal({
          type: 'success',
          title: 'Succès',
          text: 'Mis à jour avec succés',
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
    }
    else{
      this.supplyService.newSupplyInvoice(this.supplyForm.value).subscribe(Response => {
        swal({
          type: 'success',
          title: 'Succès',
          text: 'Facture Supply Code: '+Response,
          showConfirmButton: true,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
          timer: 4000
        });
      }, error => {
        swal({
          type: 'error',
          title: error.statusText,
          text: error.message
        });
      });
    }
    while (this.itemsForm.length !== 0) {
      this.itemsForm.removeAt(0)
    }
    SupplyComponent.selectedItems=[];
    this.supplyForm.reset();
    this.myNgForm.resetForm();
    const currentDate = new Date();
    var factureDate = currentDate.toISOString().substring(0, 10);
    this.factureDate.setValue(factureDate);
  }

  addItemsToFacture() {
    SupplyComponent.globalMultiSelectDT.destroy();
    this.modalReference.close();
    SupplyComponent.selectedItems.forEach(element => {
      var ID = element['id'];
      if(SupplyComponent.findWithAttr(this.itemsForm.value, 'itemID', ID) == -1)
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
      rowId: 'ID'
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

    SupplyComponent.globalMultiSelectDT = multiSelectDT;
  }

  get itemsForm() {
    return this.supplyForm.get('items') as FormArray
  }

  get factureDate() {
    return this.supplyForm.get('supplyDate');
  }

  get invoiceID() {
    return this.supplyForm.get('invoiceID');
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
