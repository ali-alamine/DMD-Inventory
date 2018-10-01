import { Component, OnInit, ViewChild } from '@angular/core';
import { item } from '../facture-supply/facture-supply.component';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StockService } from '../stock/stock.service';
import swal from 'sweetalert2';
import { FactureReturnService } from './facture-return.service';
import { Router } from '@angular/router';
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
  items: any;
  // order: any;
  newItemForm: FormGroup;
  rechargeCardForm: FormGroup;
  static selectedItems: fcItem[] = new Array();
  static globalMultiSelectDT;
  orderNoConfirm;
  dataComfirm={};
  // private clientName;


  constructor(private router: Router,private fb: FormBuilder,
    private factureReturnService: FactureReturnService,
    private modalService: NgbModal,
    private stockService: StockService) { }

    ngOnInit() {
      this.router.navigate(["facture/client"]);

      this.getOrderNoConfirm();
      this.invoiceForm = this.fb.group({
        invoiceDate: ['', Validators.required],
        clientName: ['', Validators.required],
        searchClient: '',
        clientID: '',
        code: '',
        items: this.fb.array([])
      });
      this.onClientNameChange();
    }
    getOrderNoConfirm(){
      this.factureReturnService.getOrderNoConfirm().subscribe(Response => {
        this.orderNoConfirm = Response;

        // console.log(this.orderNoConfirm)
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
        isDamaged:[element['gate']],
        colisage:[element['colisage']],
        crt: [0],
        piece: [0],
        date_req: ['', Validators.required],
        date_com: ['', Validators.required]
  
      });
      this.itemsForm.push(item);
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
  
  
  
    addSupplyInvoice() {
      this.factureReturnService.newReturnInvoice(this.invoiceForm.value).subscribe(Response => {
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
      // console.log(this.invoiceForm.value);
      while (this.itemsForm.length !== 0) {
        this.itemsForm.removeAt(0)
      }
      FactureReturnComponent.selectedItems=[];
      this.invoiceForm.reset();
      this.myNgForm.resetForm();
      this.getOrderNoConfirm(); 
    }


    confirmOrder(ordID,invID,crt,piece,itemID,isDamaged,packingList){
      // console.log(ordID)
      this.dataComfirm['ordID']= ordID;
      this.dataComfirm['invID']=invID;
      this.dataComfirm['crt']=crt;
      this.dataComfirm['piece']=piece;
      this.dataComfirm['itemID']=itemID;
      this.dataComfirm['isDamaged']=isDamaged;
      this.dataComfirm['packingList']=packingList;
      // console.log(this.dataComfirm)
      this.factureReturnService.confirmOrder(this.dataComfirm).subscribe(Response => {
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
      this.getOrderNoConfirm();
    }

    rejectOrder(ordID){
      this.factureReturnService.rejectOrder(ordID).subscribe(Response => {
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
      this.getOrderNoConfirm();
    }
    
    addItemsToFacture() {
      FactureReturnComponent.globalMultiSelectDT.destroy();
      this.modalReference.close();
      while (this.itemsForm.length !== 0) {
        this.itemsForm.removeAt(0)
      }
      FactureReturnComponent.selectedItems.forEach(element => {
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
          if (FactureReturnComponent.findWithAttr(FactureReturnComponent.selectedItems, 'id','gate', data['ID'],data['item_is_damaged']) > -1) {
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
          var colisage = multiSelectDT.row(element).data()['item_packing_list'];
  
          if (FactureReturnComponent.findWithAttr(FactureReturnComponent.selectedItems, 'id','gate', ID,gate) == -1)
          FactureReturnComponent.selectedItems.push({ id: ID, name: name ,gate:gate , colisage:colisage});
        });
      });
  
      multiSelectDT.on('deselect', function (e, dt, type, indexes) {
        var rows = multiSelectDT.rows('.selected').indexes().toArray();
        FactureReturnComponent.selectedItems = [];
        rows.forEach(element => {
          var ID = multiSelectDT.row(element).data()['ID'];
          var name = multiSelectDT.row(element).data()['item_name'];
          var gate = multiSelectDT.row(element).data()['item_is_damaged'];
          var colisage = multiSelectDT.row(element).data()['item_packing_list'];
          FactureReturnComponent.selectedItems.push({ id: ID, name: name ,gate:gate,colisage:colisage});
        });
      });
  
  
      FactureReturnComponent.globalMultiSelectDT = multiSelectDT;
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
  
  }
  
  export interface fcItem {
    id: number;
    name: string;
    gate: boolean;
    colisage :number;
  }
