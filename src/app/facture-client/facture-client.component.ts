import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StockService } from '../stock/stock.service';
import { SupplyService } from '../facture-supply/facture-supply.service';
import swal from 'sweetalert2';
import { FactureClientService } from './facture-client.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { Router, ActivatedRoute } from '@angular/router';
declare var $: any;
import { DatePipe } from '@angular/common';
import { FactureComponent } from '../facture/facture.component';
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
  editForm: any;
  static selectedItems: fcItem[] = new Array();
  static globalMultiSelectDT;
  editFactureTitle='';
  deliveryDate;
  invoiceDate;
  private sub;
  factureID;
  factureHeader = [];
  factureDetails = [];
  private clientForm;
  isExist;
  
  constructor(private datePipe: DatePipe,
    private fb: FormBuilder,
    private factureClientService: FactureClientService,
    private router: Router, 
    private modalService: NgbModal, 
    private _hotkeysService: HotkeysService,
    private route: ActivatedRoute) {

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
    this.invoiceDate = this.datePipe.transform(currentDate,"MM/d/yyyy");
    this.invoiceForm = this.fb.group({
      invID : [],
      invoiceDate: [this.invoiceDate, Validators.required],
      delDate: [this.deliveryDate, Validators.required],
      clientName: ['', Validators.required],
      searchClient: '',
      clientID: '',
      itemsEdit: this.fb.array([]),
      items: this.fb.array([])
    });
    this.sub = this.route.queryParams.subscribe(params => {
      this.factureID = params['factureID'] || '-1';
    });
    if(this.factureID != -1){
      document.getElementById('submit').style.display = "none";
    } else{
      document.getElementById('update').style.display = "none";
    }

    if(this.factureID != '-1'){
      this.factureClientService.getFactureDetails(this.factureID).subscribe(Response => {        
        this.factureHeader = Response[0];
        this.factureDetails = Response[1];
        var dateReq = this.factureHeader[0]['inv_date_req'];
        var dateDel = this.factureHeader[0]['inv_date_del'];
        this.factureDate.setValue(dateReq);
        this.delDate.setValue(dateDel);
        this.invID.setValue(this.factureID);
        this.clientName.setValue(this.factureHeader[0]['per_name']);
        this.clientID.setValue(this.factureHeader[0]['perID']);
        console.log(this.factureDetails)
        this.factureDetails.forEach(element => {
          const item = this.fb.group({
            ordID: [element['ordID'], Validators.required],
            itemID: [element['ord_itemID'], Validators.required],
            itemName: [element['item_name']],
            isDamaged:[element['ord_item_isDamaged']],
            colisage:[element['item_packing_list']],
            crt: [element['ord_crt']],
            piece: [element['ord_piece']],
            comment: [element['ord_note']],
            // date_req: [this.factureDetails[i].ord_date_req, Validators.required],
            // date_com: [this.factureDetails[i].ord_date_com, Validators.required],
            isDeleted: 0
          });
          this.itemsEditForm.push(item)
          // SupplyComponent.selectedItems.push({ id: element['itemID'], name: element['item_name'], colisage:element['item_packing_list'] });
        });
        this.editFactureTitle = "Edit Facture: "+this.factureHeader[0]['inv_code'];        
      }, error => {
        swal({
          type: 'error',
          title: error.statusText,
          text: error.message
        });
      });
    } 
    
    this.onClientNameChange();
  }

  ngOnDestroy() {
    this._hotkeysService.reset();
  }
  onClientIsExistChange(): void {
    this.clientForm.get('name').valueChanges.subscribe(val => {
      var data = this.clientForm.get('name').value;
      this.factureClientService.searchClientName(data).subscribe(Response => {
        console.log(Response)
        if(Response == 1){
          // alert('exist')
          this.isExist = true;
        }
        else
          this.isExist = false;
      })
    })
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
      crt:'',
      piece:'',
      // crt: ['',[Validators.required, Validators.min(0)]],
      // piece: ['',[Validators.required, Validators.min(0)]],
      comment: ['']

    });
    this.itemsForm.push(item);
  }
  deleteItemEdit(i) {
    this.itemsEditForm.controls[i].get('isDeleted').setValue(1);
    // this.itemsEditForm.controls[i].disable(;
    // this.itemsEditForm.removeAt(i);
    console.log(this.itemsEditForm.value)
    // var index = FactureReturnComponent.findWithAttr(FactureReturnComponent.selectedItems, 'id','gate', id.value , itemIsDamaged.value);
    // FactureReturnComponent.selectedItems.splice(index, 1);
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
        text: 'Facture Client Code: '+Response,
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
    console.log(this.invoiceForm.value);
    while (this.itemsForm.length !== 0) {
      this.itemsForm.removeAt(0)
    }
    FactureClientComponent.selectedItems = [];
    this.invoiceForm.reset();
    this.myNgForm.resetForm();
    this.invoiceForm.get('invoiceDate').setValue(this.invoiceDate);
    this.invoiceForm.get('delDate').setValue(this.deliveryDate);
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
  editClientInvoice(){
    this.factureClientService.editClientInvoice(this.invoiceForm.value).subscribe(Response => {
      swal({
        type: 'success',
        title: 'Success',
        text: 'Invoice Mis a Jour Successfully',
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
    var routerHistory = localStorage.getItem('routerHistory');
    this.router.navigate([routerHistory]);
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
  openClientModal(clientModal) {
    this.modalReference = this.modalService.open(clientModal, { centered: true, ariaLabelledBy: 'modal-basic-title' });
    this.clientForm = this.fb.group({
      name: ['', [Validators.required,Validators.minLength(3)]],
      phone: ['', Validators.required],
      address: ['', Validators.required]
    });
    this.onClientIsExistChange();

  }
  
  addClient() {
    
      this.factureClientService.addNewClient(this.clientForm.value).subscribe(Response => {
        this.invoiceForm.get('clientName').setValue(this.clientForm.get('name').value);
        this.invoiceForm.get('clientID').setValue(Response);
        swal({
          type: 'success',
          title: 'Success',
          text: 'Client Added Successfully',
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

    this.modalReference.close();
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
  get itemsEditForm() {
    return this.invoiceForm.get('itemsEdit') as FormArray;
  }
  get itemsForm() {
    return this.invoiceForm.get('items') as FormArray
  }
  get factureDate() {
    return this.invoiceForm.get('invoiceDate');
  }
  get delDate(){
    return this.invoiceForm.get('delDate');
  }
  get invID() {
    return this.invoiceForm.get('invID');
  }
  get itemID() {
    return this.invoiceForm.get('itemID');
  }
  get clientName() {
    return this.invoiceForm.get('clientName');
  }
  get clientID() {
    return this.invoiceForm.get('clientID');
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

