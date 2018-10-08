import { Component, OnInit, ViewChild } from '@angular/core';
import { item } from '../facture-supply/facture-supply.component';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StockService } from '../stock/stock.service';
import swal from 'sweetalert2';
import { FactureReturnService } from './facture-return.service';
import { Router } from '@angular/router';
import { FactureComponent } from '../facture/facture.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { DatePipe } from '../../../node_modules/@angular/common';
import { Hotkey, HotkeysService } from '../../../node_modules/angular2-hotkeys';
declare var $: any;

@Component({
  selector: 'app-facture-return',
  templateUrl: './facture-return.component.html',
  styleUrls: ['./facture-return.component.css']
})
export class FactureReturnComponent implements OnInit {
  @ViewChild('f') myNgForm;
  modalReference: any;
  invoiceForm: FormGroup;
  options;
  itemsEdit: any;
  items: any;
  // order: any;
  newItemForm: FormGroup;
  rechargeCardForm: FormGroup;
  static selectedItems: fcItem[] = new Array();
  static globalMultiSelectDT;
  orderNoConfirm;
  dataComfirm={};
  addEditBtn;
  factureDetails;
  editFactureTitle="";
  deliveryDate;

  constructor(private datePipe: DatePipe,
    private router: Router,private fb: FormBuilder,
    private factureReturnService: FactureReturnService,
    private modalService: NgbModal,
    private stockService: StockService,
    private factureComponent: FactureComponent,
    private _hotkeysService: HotkeysService) {
      
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
     this.deliveryDate = currentDate.toISOString().substring(0, 10);
    var s = this.datePipe.transform(currentDate,"MM/d/yyyy");
    
      if(this.factureComponent.factureID != -1){
        document.getElementById('submit').style.display = "none";
        this.getFactureDetails(this.factureComponent.factureID);
      } else{
        document.getElementById('update').style.display = "none";
      }
      this.invoiceForm = this.fb.group({
        invID : '-1',
        invoiceDate: [this.deliveryDate, Validators.required],
        clientName: ['', Validators.required],
        searchClient: '',
        clientID: '',
        itemsEdit: this.fb.array([]),
        items: this.fb.array([])
      });
      this.onClientNameChange();
    }
    ngOnDestroy() {
      this._hotkeysService.reset();
      FactureReturnComponent.selectedItems = [];
    }
    getFactureDetails(FactureID){
      this.factureReturnService.getFactureDetails(FactureID,'FR').subscribe(Response => {
        this.factureDetails = Response;
        for (var i = 0; i < this.factureDetails.length;i++){
          const item = this.fb.group({
            ordID: [this.factureDetails[i].ordID, Validators.required],
            itemID: [this.factureDetails[i].ord_itemID, Validators.required],
            itemName: [this.factureDetails[i].item_name],
            isDamaged:[this.factureDetails[i].ord_item_isDamaged],
            colisage:[this.factureDetails[i].item_packing_list],
            crt: [this.factureDetails[i].ord_crt],
            piece: [this.factureDetails[i].ord_piece],
            isDeleted: 0
          });
          this.itemsEditForm.push(item)
        }
        this.invoiceForm.get('invID').setValue(FactureID)
        this.invoiceForm.get('invoiceDate').setValue(this.factureDetails[0].inv_date_req)
        this.invoiceForm.get('clientName').setValue(this.factureDetails[0].per_name)
        this.invoiceForm.get('clientID').setValue(this.factureDetails[0].perID)
        this.editFactureTitle = "Edit Facture: "+this.factureDetails[0].inv_code;
      },error => {
        console.log(error)
      });
    }
    onClientNameChange(): void {
      this.invoiceForm.get('searchClient').valueChanges.subscribe(val => {
        var data = this.invoiceForm.get('searchClient').value;
        if (data == "") {
          this.options = [];
          return;
        }
        this.factureReturnService.searchPerson(data,1).subscribe(Response => {
          this.options = Response;
        })
      });
    }
  
    addRow(element) {
      const item = this.fb.group({
        itemID: [element['id'], Validators.required],
        itemName: [element['name']],
        isDamaged:[element['isDamaged']],
        colisage:[element['colisage']],
        crt: [''],
        piece: ['']
  
      });
      this.itemsForm.push(item);
    }
  
  
    deleteItemEdit(i) {
      this.itemsEditForm.controls[i].get('isDeleted').setValue(1);
    }
    deleteItem(i, id,itemIsDamaged) {
      this.itemsForm.removeAt(i);
      var index = FactureReturnComponent.findWithAttr(FactureReturnComponent.selectedItems, 'id','gate', id.value , itemIsDamaged.value);
      FactureReturnComponent.selectedItems.splice(index, 1);
    }
  
    test(id, name) {
      this.invoiceForm.get('searchClient').setValue('');
      this.invoiceForm.get('clientName').setValue(name);
      this.invoiceForm.get('clientID').setValue(id);
    }

    addReturnInvoice() {
        this.factureReturnService.newReturnInvoice(this.invoiceForm.value).subscribe(Response => {
          swal({
            type: 'success',
            title: 'Success',
            text: 'Facture Retourn Code: '+Response,
            showConfirmButton: false,
            timer: 4000
          });
        }, error => {
          swal({
            type: 'error',
            title: error.statusText,
            text: error.message
          });
        });
        while (this.itemsForm.length !== 0) {
          this.itemsForm.removeAt(0)
        }
        FactureReturnComponent.selectedItems=[];
        this.invoiceForm.reset();
        this.myNgForm.resetForm();
        this.invoiceForm.get('invoiceDate').setValue(this.deliveryDate);
    }
    editReturnInvoice(){
      debugger
        this.factureReturnService.editReturnInvoice(this.invoiceForm.value).subscribe(Response => {
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
        while (this.itemsForm.length !== 0) {
          this.itemsForm.removeAt(0)
        }
        while (this.itemsEditForm.length !== 0) {
          this.itemsEditForm.removeAt(0)
        }
        var routerHistory = localStorage.getItem('routerHistory');
        this.router.navigate([routerHistory]);
    }
    addItemsToFacture() {
      FactureReturnComponent.globalMultiSelectDT.destroy();
      this.modalReference.close();
      FactureReturnComponent.selectedItems.forEach(element => {
        var ID = element['id'];
        var isDamaged = element['isDamaged'];
        var i = FactureReturnComponent.findWithAttr(this.itemsForm.value, 'itemID', 'isDamaged', ID, isDamaged);
        if(this.itemsEditForm.length == 0){
          if(i == -1)
            this.addRow(element);
        } else if(this.itemsEditForm.length != 0){
          var i2 = FactureReturnComponent.findWithAttr2(this.itemsEditForm.value, 'itemID', 'isDamaged', ID, isDamaged);
          if( i == -1 && i2 == -1)
              this.addRow(element);
        }
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
          var isDamaged = multiSelectDT.row(element).data()['item_is_damaged'];
          var colisage = multiSelectDT.row(element).data()['item_packing_list'];
  
          if (FactureReturnComponent.findWithAttr(FactureReturnComponent.selectedItems, 'id', 'isDamaged', ID, isDamaged) == -1)
            FactureReturnComponent.selectedItems.push({ id: ID, name: name, isDamaged: isDamaged, colisage: colisage });
        });
      });
  
      multiSelectDT.on('deselect', function (e, dt, type, indexes) {
        var rows = multiSelectDT.rows('.selected').indexes().toArray();
        FactureReturnComponent.selectedItems = [];
        rows.forEach(element => {
          var ID = multiSelectDT.row(element).data()['ID'];
          var name = multiSelectDT.row(element).data()['item_name'];
          var isDamaged = multiSelectDT.row(element).data()['item_is_damaged'];
          var colisage = multiSelectDT.row(element).data()['item_packing_list'];
          FactureReturnComponent.selectedItems.push({ id: ID, name: name, isDamaged: isDamaged, colisage: colisage });
        });
      });
  
  
      FactureReturnComponent.globalMultiSelectDT = multiSelectDT;
    }
  
    get itemsEditForm() {
      return this.invoiceForm.get('itemsEdit') as FormArray;
    }
    get itemsForm() {
      return this.invoiceForm.get('items') as FormArray;
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
    static findWithAttr2(array, attr, attr2, value, value2) {
      var index = -1;
      for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value && array[i][attr2] === value2 && array[i]['isDeleted'] === 0) {
          index = i ;
        }
      }
      return index;
    }
  }
  
  export interface fcItem {
    id: number;
    name: string;
    isDamaged: number;
    colisage :number;
  }
