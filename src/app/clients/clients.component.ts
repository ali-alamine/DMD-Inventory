import { Component, OnInit, OnDestroy, ElementRef } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, Validators, FormControl } from "@angular/forms";
import { ClientsService } from "./clients.service";
import { MenuItem } from "primeng/api";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
declare var $: any;



@Component({
  selector: "app-clients",
  templateUrl: "./clients.component.html",
  styleUrls: ["./clients.component.css"]
})
export class ClientsComponent implements OnInit, OnDestroy {
  modalReference: any;
  private clientForm;
  clientModalTitle;
  editFlag = false;
  private static selectedRowData;
  private static selectedClientID;
  editedClientData = {};
  items: MenuItem[];
  isExist;

  static nameSearch = "";
  static codeSearch = "";
  static addressSearch = "";
  static phoneSearch = "";
  static globalClientsDT;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private clientsService: ClientsService,
    private router: Router,
    private elRef:ElementRef
  ) {}

  ngOnInit() {
    if (localStorage.getItem("user") !== "1") {
      this.router.navigate(["login"]);
    }

    $("#clientsDT thead tr")
      .clone(true)
      .appendTo("#clientsDT thead");
    $("#clientsDT thead tr:eq(1) th").each(function(i) {
      var title = $(this).text();
      $(this).html(
        '<input class="test123" type="text" placeholder="Rechercher ' +
          title +
          '" />'
      );

      $("input", this).on("keyup change", function() {
        if (i == 0) ClientsComponent.nameSearch = this.value;
        else if (i == 1) ClientsComponent.phoneSearch = this.value;
        else if (i == 2) ClientsComponent.addressSearch = this.value;
        else if (i == 3) ClientsComponent.codeSearch = this.value;
        ClientsComponent.globalClientsDT.ajax.reload();
      });
    });

    var subscriberDataTable = $("#clientsDT").DataTable({
      responsive: false,
      orderCellsTop: true,
      paging: true,
      pagingType: "full_numbers",
      serverSide: true,
      processing: true,
      searching: false,
      ordering: true,
      stateSave: false,
      fixedHeader: true,
      select: {
        style: "single"
      },
      lengthMenu: [[25, 50, 100, 150, 200, 300], [25, 50, 100, 150, 200, 300]],
      ajax: {
        type: "get",
        url:
          "http://localhost/DMD-Inventory/src/assets/api/dataTables/clientsDataTable.php",
        data: function(d) {
          return $.extend({}, d, {
            nameSearch: ClientsComponent.nameSearch,
            codeSearch: ClientsComponent.codeSearch,
            phoneSearch: ClientsComponent.phoneSearch,
            addressSearch: ClientsComponent.addressSearch
          });
        },
        cache: true,
        async: true
      },
      order: [[0, "asc"]],
      columns: [
        { data: "per_name", title: "Nom" },
        { data: "per_phone", title: "Téléphone" },
        { data: "per_address", title: "Adresse" },
        { data: "per_code", title: "Code" }
      ],
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

    this.items = [
      {
        label: "Modifier",
        icon: "pi pi-fw pi-pencil",
        command: event => {
          let element: HTMLElement = document.getElementById(
            "editClientBtn"
          ) as HTMLElement;
          element.click();
        }
      },
      {
        label: "Supprimer",
        icon: "pi pi-fw pi-times",
        command: event => {
          let element: HTMLElement = document.getElementById(
            "deleteBtn"
          ) as HTMLElement;
          element.click();
        }
      },
    ];
    ClientsComponent.globalClientsDT = subscriberDataTable;

    subscriberDataTable.on("select", function(e, dt, type, indexes) {
      if (type === "row") {
        ClientsComponent.selectedRowData = subscriberDataTable
          .row(indexes)
          .data();
        var data = subscriberDataTable.row(indexes).data()["ID"];
        ClientsComponent.selectedClientID = data;
      } else if (type === "column") {
        ClientsComponent.selectedClientID = -1;
      }
    });

    $("#clientsDT tbody").on("mousedown", "tr", function(event) {
      if (event.which == 3) {
        subscriberDataTable.row(this).select();
      }
    });

    $("#clientsDT").on("key-focus.dt", function(e, datatable, cell) {
      $(subscriberDataTable.row(cell.index().row).node()).addClass("selected");
    });
    $("#clientsDT").on("key-blur.dt", function(e, datatable, cell) {
      $(subscriberDataTable.row(cell.index().row).node()).removeClass(
        "selected"
      );
    });
  }

  ngOnDestroy() {
    ClientsComponent.nameSearch = "";
    ClientsComponent.phoneSearch = "";
    ClientsComponent.addressSearch = "";
    ClientsComponent.codeSearch = "";
    ClientsComponent.globalClientsDT.fixedHeader.disable();
  }

  openClientModal(clientModal) {
    this.modalReference = this.modalService.open(clientModal, {
      centered: true,
      ariaLabelledBy: "modal-basic-title"
    });
    var name = "";
    var phone = "";
    var address = "";
    this.clientModalTitle = "Ajouter Client";

    if (this.editFlag == true) {
      this.clientModalTitle = "Modifier Client";
      name = ClientsComponent.selectedRowData["per_name"];
      phone = ClientsComponent.selectedRowData["per_phone"];
      address = ClientsComponent.selectedRowData["per_address"];
    }
    this.clientForm = this.fb.group({
      name: [name, [Validators.required, Validators.minLength(3)]],
      phone: [phone, Validators.required],
      address: [address, Validators.required]
    });
    this.onClientIsExistChange();
    this.isExist == false;
  }

  onClientIsExistChange(): void {
    this.clientForm.get("name").valueChanges.subscribe(val => {
      var data = this.clientForm.get("name").value;
      // var dataString = JSON.stringify(data);
      this.clientsService.searchClientName(data).subscribe(Response => {
        if (Response == 1) {
          this.isExist = true;
        } else this.isExist = false;
      });
    });
  }

  addEditClient() {
    if (this.editFlag == true) {
      this.editedClientData["per_name"] = this.name.value;
      this.editedClientData["per_address"] = this.address.value;
      this.editedClientData["per_phone"] = this.phoneNumber.value;
      this.editedClientData["perID"] = ClientsComponent.selectedClientID;
      this.clientsService.editClient(this.editedClientData).subscribe(
        Response => {
          ClientsComponent.globalClientsDT.ajax.reload(null, false);
          Swal({
            type: "success",
            title: "Succès",
            text: "Modifier client",
            showConfirmButton: false,
            timer: 1000
          });
        },
        error => {
          Swal({
            type: "error",
            title: error.statusText,
            text: error.message
          });
        }
      );
    } else {
      this.clientsService.addNewClient(this.clientForm.value).subscribe(
        Response => {
          ClientsComponent.globalClientsDT.ajax.reload(null, false);
          Swal({
            type: "success",
            title: "Succès",
            text: "Ajouter client",
            showConfirmButton: false,
            timer: 1000
          });
        },
        error => {
          Swal({
            type: "error",
            title: error.statusText,
            text: error.message
          });
        }
      );
    }

    this.modalReference.close();
  }
  deleteClient() {
    Swal({
      title: "Supprimer",
      text: "vous voulez vraiment supprimer?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui!",
      cancelButtonText: "Non"
    }).then(result => {
      if (result.value) {
        this.clientsService
          .deleteClient(ClientsComponent.selectedClientID)
          .subscribe(
            Response => {
              ClientsComponent.globalClientsDT.ajax.reload(null, false);
              Swal({
                type: "success",
                title: "Succès",
                showConfirmButton: false,
                timer: 1000
              });
            },
            error => {
              Swal({
                type: "error",
                title: "Attention",
                text: "Ce client se trouve dans des factures",
                confirmButtonText: "Oui",
    });
            }
          );
      }
    });
  }
  get name() {
    return this.clientForm.get("name");
  }
  get phoneNumber() {
    return this.clientForm.get("phone");
  }
  get address() {
    return this.clientForm.get("address");
  }
}
