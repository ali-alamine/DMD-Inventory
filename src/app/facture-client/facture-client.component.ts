import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';
import { FactureClientService } from './facture-client.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { Router, ActivatedRoute } from '@angular/router';
declare var $: any;
import { DatePipe } from '@angular/common';
import { FactureComponent } from '../facture/facture.component';
import { AppDateAdapter, APP_DATE_FORMATS } from '../date.adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';

@Component({
  selector: 'app-facture',
  templateUrl: './facture-client.component.html',
  styleUrls: ['./facture-client.component.css'],
  providers: [
    {
        provide: DateAdapter, useClass: AppDateAdapter
    },
    {
        provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
    ]
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
  isExist; newCode="-1";
  p_clientName; p_clientPhone; p_dateReq;p_clientAddress;
  lengthDeleted = 0;
  
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
    if (localStorage.getItem("user") !== '1') {
      this.router.navigate(["login"]);
  
    }
    // alert("h")
    document.getElementById("searchClientNameFC").focus();
    const currentDate = new Date();
    this.deliveryDate = currentDate.toISOString().substring(0, 10);
    this.invoiceDate = this.datePipe.transform(currentDate,"dd-MM-yyyy");
    this.invoiceForm = this.fb.group({
      invID : [],
      invoiceDate: [this.invoiceDate, Validators.required],
      delDate: [this.deliveryDate, Validators.required],
      clientName: ['', Validators.required],
      clientPhone:["", Validators.required],
      clientAddress: ["", Validators.required],
      clientID: ['',Validators.required],
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
        var dateReq = this.factureHeader[0]['inv_date_req'];
        var dateDel = this.factureHeader[0]['inv_date_del'];
        this.factureDate.setValue(dateReq);
        this.delDate.setValue(dateDel);
        this.invID.setValue(this.factureID);
        this.clientName.setValue(this.factureHeader[0]['per_name']);
        this.clientPhone.setValue(this.factureHeader[0]['inv_per_phone']);
        this.clientAddress.setValue(this.factureHeader[0]['inv_per_address']);
        this.clientID.setValue(this.factureHeader[0]['perID']);
        this.invoiceForm.controls['clientName'].disable();
        this.editFactureTitle = "Modifier Facture: "+this.factureHeader[0]['inv_code'];   

        if(Response[1]!=0){
          this.factureDetails = Response[1];    
          this.factureDetails.forEach(element => {
            const item = this.fb.group({
              ordID: [element['ordID'], Validators.required],
              itemID: [element['ord_itemID'], Validators.required],
              itemName: [element['item_name']],
              isDamaged:[element['ord_item_isDamaged']],
              colisage:[element['item_packing_list']],
              stockCrt: [element['item_crt']],
              stockPiece: [element['item_piece']],
              crtNoEdit: [element['ord_crt']],
              pieceNoEdit: [element['ord_piece']],
              crt: [element['ord_crt']],
              piece: [element['ord_piece']],
              comment: [element['ord_note']],
              isDeleted: 0
            });
            this.itemsEditForm.push(item)
            this.lengthDeleted ++ ;
          });
          setTimeout(function(){ document.getElementById("crtEdit0").focus();},200)
        } 

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
    FactureClientComponent.selectedItems = [];
  }

  onClientIsExistChange(): void {
    this.clientForm.get('name').valueChanges.subscribe(val => {
      var data = this.clientForm.get('name').value;
      this.factureClientService.searchClientName(data).subscribe(Response => {
        if(Response == 1){
          this.isExist = true;
        }
        else
          this.isExist = false;
      })
    })
  }

  onClientNameChange(): void {
    this.invoiceForm.get('clientName').valueChanges.subscribe(val => {
      var data = this.invoiceForm.get('clientName').value;
      if (data == "") {
        this.options = [];
        return;
      }
      this.factureClientService.searchClient(data).subscribe(Response => {
        this.options = Response;
      })
    });    
  }

  checkQuantity(i){
    var stockCrt = this.itemsForm.controls[i].get('stockCrt').value;
    var stockPiece = this.itemsForm.controls[i].get('stockPiece').value;
    var packing_list = this.itemsForm.controls[i].get('colisage').value;
    var crt = this.itemsForm.controls[i].get('crt').value;
    var piece = this.itemsForm.controls[i].get('piece').value;
    var inputCrt= "#crt"+i;
    var inputPiece= "#piece"+i;
    if(crt > stockCrt){
      $(inputCrt).addClass("text-danger");
    } 
    else{
      $(inputCrt).removeClass("text-danger");
    }  
    var remainingPiece = stockPiece - (crt * packing_list);
    if (piece > remainingPiece) {
        $(inputPiece).addClass("text-danger");
    } else {
        $(inputPiece).removeClass("text-danger");
    }
  }

  checkQuantityEdit(i){
    var stockCrt = parseInt(this.itemsEditForm.controls[i].get('stockCrt').value);
    var stockPiece = parseInt(this.itemsEditForm.controls[i].get('stockPiece').value);
    var packing_list = parseInt(this.itemsEditForm.controls[i].get('colisage').value);
    var crtNoEdit = parseInt(this.itemsEditForm.controls[i].get('crtNoEdit').value);
    var pieceNoEdit = parseInt(this.itemsEditForm.controls[i].get('pieceNoEdit').value);
    var crt = this.itemsEditForm.controls[i].get('crt').value;
    var piece = this.itemsEditForm.controls[i].get('piece').value;
    stockCrt = stockCrt + crtNoEdit ;
    stockPiece = stockPiece + pieceNoEdit ;
    var inputCrt= "#crtEdit"+i;
    var inputPiece= "#pieceEdit"+i;
    if(crt > stockCrt){
      $(inputCrt).addClass("text-danger");
    } 
    else{
      $(inputCrt).removeClass("text-danger");
    }  
    var remainingPiece = stockPiece - (crt * packing_list);
    if (piece > remainingPiece) {
        $(inputPiece).addClass("text-danger");
    } else {
        $(inputPiece).removeClass("text-danger");
    }
  }
  addRow(element) {
    const item = this.fb.group({
      itemID: [element['id'], Validators.required],
      itemName: [element['name']],
      isDamaged: [element['isDamaged']],
      colisage: [element['colisage']],
      stockCrt: [element['crt']],
      stockPiece: [element['piece']],
      crt:'',
      piece:'',
      comment: ['']

    });
    this.itemsForm.push(item);
  }

  deleteItemEdit(i) {
    this.itemsEditForm.controls[i].get('isDeleted').setValue(1);
    this.lengthDeleted -- ;
  }

  deleteItem(i, id, itemIsDamaged) {
    this.itemsForm.removeAt(i);
    var index = FactureClientComponent.findWithAttr(FactureClientComponent.selectedItems, 'id', 'isDamaged', id.value, itemIsDamaged.value);
    FactureClientComponent.selectedItems.splice(index, 1);
      setTimeout(function(){ document.getElementById("crt0").focus();},200)
    
  }

  setClientName(id, name,phone,address) {
    this.p_clientName = name ;
    this.invoiceForm.get('clientName').setValue(name);
    this.invoiceForm.get('clientPhone').setValue(phone);
    this.invoiceForm.get('clientAddress').setValue(address);
    this.invoiceForm.get('clientID').setValue(id);
    this.invoiceForm.controls['clientName'].disable();
    setTimeout(function(){ document.getElementById("delDate").focus();},200)
  }

  addClientInvoice() {
    this.factureClientService.newClientInvoice(this.invoiceForm.value).subscribe(Response => {
      this.newCode = Response;
      var msg = 'Facture Client Code: '+Response;
      msg = msg +'<br/> Vous voulez imprimer?';
      swal({
        type: 'success',
        title: 'Success',
        html: msg,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non',
      }).then((result) => {
        if (result.value) {
          this.printFactureClient();
        }
        FactureClientComponent.selectedItems = [];
        this.invoiceForm.reset();
        this.myNgForm.resetForm();
        this.invoiceForm.get('invoiceDate').setValue(this.invoiceDate);
        this.invoiceForm.get('delDate').setValue(this.deliveryDate);
        this.invoiceForm.controls['clientName'].enable();
        while (this.itemsForm.length !== 0) {
          this.itemsForm.removeAt(0)
        }
      })
    }, error => {
      swal({
        type: 'error',
        title: error.statusText,
        text: error.message
      });
    });
    
  }

  printFactureClient(){
      var printContents = document.getElementById('printFacture').innerHTML;
      var popupWin = window.open('', '_blank', 'width=800,height=600');
      popupWin.document.open();
      popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="../../styles.css"></head><body onload="window.print()">' + printContents + '</body></html>');
      popupWin.document.close();
      setTimeout(function(){ popupWin.close(); }, 1000);
      this.p_clientName = '';
  }

  editClientInvoice(){
    this.factureClientService.editClientInvoice(this.invoiceForm.value).subscribe(Response => {
      swal({
        type: 'success',
        title: 'Succès',
        text: 'Modifier facture client',
        showConfirmButton: false,
        timer: 1000
      });
      var routerHistory = localStorage.getItem('routerHistory');
      this.router.navigate([routerHistory]);
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
  }

  addItemsToFacture() {
    FactureClientComponent.globalMultiSelectDT.destroy();
    this.modalReference.close();
    FactureClientComponent.selectedItems.forEach(element => {
      var ID = element['id'];
      var isDamaged = element['isDamaged'];
      var i = FactureClientComponent.findWithAttr(this.itemsForm.value, 'itemID', 'isDamaged', ID, isDamaged);
      if(this.itemsEditForm.length == 0){
        if(i == -1)
        this.addRow(element);
      } else if(this.itemsEditForm.length != 0){
        var i2 = FactureClientComponent.findWithAttr2(this.itemsEditForm.value, 'itemID', 'isDamaged', ID, isDamaged);
        if( i == -1 && i2 == -1)
        this.addRow(element);
      }
    });
    FactureClientComponent.selectedItems=[];
    setTimeout(function(){ document.getElementById("crt0").focus();},200)
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
      this.invoiceForm.get('clientID').setValue(Response);
      this.invoiceForm.get('clientPhone').setValue(this.clientForm.value.phone);
      this.invoiceForm.get('clientAddress').setValue(this.clientForm.value.address);
      this.invoiceForm.get('clientName').setValue(this.clientForm.value.name);
      this.p_clientName=this.clientForm.value.name;
      this.invoiceForm.controls['clientName'].disable();
      document.getElementById("delDate").focus();
      swal({
        type: 'success',
        title: 'Succès',
        text: 'Ajouter client',
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
  clearClientName() {
    this.p_clientName = '';
    this.invoiceForm.get("clientName").setValue("");
    this.invoiceForm.get("clientPhone").setValue("");
    this.invoiceForm.get("clientAddress").setValue("");
    this.invoiceForm.get("clientID").setValue("");
    this.invoiceForm.controls['clientName'].enable();
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
      "createdRow": function (row, data, index) {
        if (data['item_is_damaged'] == 1) {
          $(row).addClass("text-danger");
        }

        var ID = multiSelectDT.row(row).data()['ID'];
        var isDamaged = multiSelectDT.row(row).data()['item_is_damaged'];        

        if(FactureClientComponent.findWithAttr(FactureClientComponent.selectedItems, 'id', 'isDamaged', ID, isDamaged) !=-1){
          
          multiSelectDT.row(row).select();
        }
      },
      language: {
        "sProcessing":     "Traitement en cours...",
        "sSearch":         "Rechercher&nbsp;:",
        "sLengthMenu":     "Afficher _MENU_ &eacute;l&eacute;ments",
        "sInfo":           "Affichage de l'&eacute;l&eacute;ment _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
        "sInfoEmpty":      "Affichage de l'&eacute;l&eacute;ment 0 &agrave; 0 sur 0 &eacute;l&eacute;ment",
        "sInfoFiltered":   "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
        "sInfoPostFix":    "",
        "sLoadingRecords": "Chargement en cours...",
        "sZeroRecords":    "Aucun &eacute;l&eacute;ment &agrave; afficher",
        "sEmptyTable":     "Aucune donn&eacute;e disponible dans le tableau",
        "oPaginate": {
            "sFirst":      "Premier",
            "sPrevious":   "Pr&eacute;c&eacute;dent",
            "sNext":       "Suivant",
            "sLast":       "Dernier"
        },
        "oAria": {
            "sSortAscending":  ": activer pour trier la colonne par ordre croissant",
            "sSortDescending": ": activer pour trier la colonne par ordre d&eacute;croissant"
        },
        "select": {
                "rows": {
                    _: "%d lignes séléctionnées",
                    0: "Aucune ligne séléctionnée",
                    1: "1 ligne séléctionnée"
                } 
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
        var crt = multiSelectDT.row(element).data()['item_crt'];
        var piece = multiSelectDT.row(element).data()['item_piece'];
        var i = FactureClientComponent.findWithAttr(FactureClientComponent.selectedItems, 'id', 'isDamaged', ID, isDamaged);
        if (i == -1)
          FactureClientComponent.selectedItems.push({ id: ID, name: name, isDamaged: isDamaged, colisage: colisage,crt: crt,piece: piece});
      });
    });

    multiSelectDT.on('deselect', function (e, dt, type, indexes) {
      var rows = multiSelectDT.rows('.selected').indexes().toArray();
      FactureClientComponent.selectedItems = [];
      rows.forEach(element => {
        var ID = multiSelectDT.row(element).data()['ID'];
        var name = multiSelectDT.row(element).data()['item_name'];
        var isDamaged = multiSelectDT.row(element).data()['item_is_damaged'];
        var colisage = multiSelectDT.row(element).data()['item_packing_list'];
        var crt = multiSelectDT.row(element).data()['item_crt'];
        var piece = multiSelectDT.row(element).data()['item_piece'];
        FactureClientComponent.selectedItems.push({ id: ID, name: name, isDamaged: isDamaged, colisage: colisage,crt: crt,piece: piece });
      });
    });


    FactureClientComponent.globalMultiSelectDT = multiSelectDT;
    $('div.dataTables_filter input').focus();
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
  get clientPhone() {
    return this.invoiceForm.get('clientPhone');
  }
  get clientAddress() {
    return this.invoiceForm.get('clientAddress');
  }
  get clientID() {
    return this.invoiceForm.get('clientID');
  }
  get itemIsDamaged() {
    return this.invoiceForm.get('isDamaged');
  }
  get name (){
    return this.clientForm.get('name');
  }
  static findWithAttr(array, attr, attr2, value, value2) {
    var index = -1;
    for (var i = 0; i < array.length; i += 1) {
      if (array[i][attr] === value && array[i][attr2] === value2) {
        index = i ;
      }
    }
    return index;
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
  colisage: number;
  crt: number;
  piece: number;
}