import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { formatDate } from "@angular/common";
import { ReportsService } from "../reports/reports.service";
import { Router } from "@angular/router";
import { ClientsService } from "../clients/clients.service";
import swal from "sweetalert2";
declare var $: any;
@Component({
  selector: "app-reports-invoice",
  templateUrl: "./reports-invoice.component.html",
  styleUrls: ["./reports-invoice.component.css"]
})
export class ReportsInvoiceComponent implements OnInit,OnDestroy {
  panelOpenState = false;
  filterForm;
  private static globalDataTable;
  private static invoiceType;

  private static fromDate;
  private static toDate;
  options: any[];
  static clientID: any;
  allClients: [];
  static toCode: any;
  static fromCode: any;
  static selectedClients="";

  constructor(
    private fb: FormBuilder,
    private reportService: ReportsService,
    private router: Router,
    private clientsService: ClientsService
  ) {}

  ngOnDestroy(): void {
    ReportsInvoiceComponent.globalDataTable.fixedHeader.disable();
  }

  ngOnInit() {
    this.clientsService.getAllClient().subscribe(Response => {
      this.allClients = Response;
    });

    if (localStorage.getItem("user") !== "1") {
      this.router.navigate(["login"]);
    }
    var subscriberDataTable = $("#invoiceReportDT").DataTable({
      responsive: false,
      dom: "Bfrtip",
      buttons: [
        {
          extend: "print",
          messageTop: "Facture Rapport",
          text: "Imprimer",
          exportOptions: {
            columns: ":visible",
            modifier: {
              selected: null
            }
          }
        },
        {
          extend: "print",
          text: "Imprimer sélectionné"
        },
        {
          extend: "colvis",
          text: "visibilité des colonnes"
        },
        "pageLength",
        "excel"
      ],
      language: {
        sProcessing: "Traitement en cours...",
        sSearch: "Rechercher&nbsp;:",
        sLengthMenu: "Afficher _MENU_ &eacute;l&eacute;ments",
        sInfo:
          "Affichage de l'&eacute;l&eacute;ment _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
        sInfoEmpty:
          "Affichage de l'&eacute;l&eacute;ment 0 &agrave; 0 sur 0 &eacute;l&eacute;ment",
        sInfoFiltered:
          "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
        sInfoPostFix: "",
        sLoadingRecords: "Chargement en cours...",
        sZeroRecords: "Aucun &eacute;l&eacute;ment &agrave; afficher",
        sEmptyTable: "Aucune donn&eacute;e disponible dans le tableau",
        oPaginate: {
          sFirst: "Premier",
          sPrevious: "Pr&eacute;c&eacute;dent",
          sNext: "Suivant",
          sLast: "Dernier"
        },
        oAria: {
          sSortAscending: ": activer pour trier la colonne par ordre croissant",
          sSortDescending:
            ": activer pour trier la colonne par ordre d&eacute;croissant"
        },
        select: {
          rows: {
            _: "%d lignes séléctionnées",
            0: "Aucune ligne séléctionnée",
            1: "1 ligne séléctionnée"
          }
        },
        buttons: {
          pageLength: {
            _: "Afficher %d éléments",
            "-1": "Tout afficher"
          }
        }
      },
      paging: true,
      pagingType: "full_numbers",
      serverSide: true,
      processing: true,
      ordering: true,
      searching: false,
      stateSave: false,
      fixedHeader: true,
      select: true,
      width:'100%',
      lengthMenu: [[100, 200, 400, 800, 1600], [100, 200, 400, 800, 1600]],
      ajax: {
        type: "get",
        url:
          "http://localhost/DMD-Inventory/src/assets/api/dataTables/report-invoice.php",
        data: function(d) {
          return $.extend({}, d, {
            invoiceType: ReportsInvoiceComponent.invoiceType,
            clientID: ReportsInvoiceComponent.selectedClients,
            fromDate: ReportsInvoiceComponent.fromDate,
            toDate: ReportsInvoiceComponent.toDate,
            fromCode: ReportsInvoiceComponent.fromCode,
            toCode: ReportsInvoiceComponent.toCode
          });
        },
        cache: true,
        async: true
      },
      order: [[0, "asc"]],
      columns: [
        // { data: "invID", title: "invID" },
        { data: "inv_code", title: "Code" },
        { data: "inv_type", title: "Type" },
        { data: "inv_date_req", title: "Date de Commande" },
        { data: "per_name", title: "Nom Client" }
      ]
    });
    ReportsInvoiceComponent.globalDataTable = subscriberDataTable;
    this.filterForm = this.fb.group({
      clientID: [""],
      invoiceType: ["-1"],
      fromDateCtrl: [],
      toDateCtrl: [],
      fromCode: [],
      toCode: [],
      selectedClients:[],
      FC: [true],
      FR: [true],
      FD: [true]
    });

  }

  searchSubmit() {
    if (this.filterForm.get("fromDateCtrl").value != null &&this.filterForm.get("toDateCtrl").value != null) {
      ReportsInvoiceComponent.fromDate = formatDate(this.filterForm.get("fromDateCtrl").value,"yyyy-MM-dd","en");
      ReportsInvoiceComponent.toDate = formatDate(this.filterForm.get("toDateCtrl").value,"yyyy-MM-dd","en");
    } else if (
      this.filterForm.get("fromDateCtrl").value != null || this.filterForm.get("toDateCtrl").value != null) {
      if (this.filterForm.get("fromDateCtrl").value != null) {
        ReportsInvoiceComponent.fromDate = formatDate(this.filterForm.get("fromDateCtrl").value,"yyyy-MM-dd","en");
        ReportsInvoiceComponent.toDate = formatDate(this.filterForm.get("fromDateCtrl").value,"yyyy-MM-dd","en");
      } else {
        ReportsInvoiceComponent.fromDate = formatDate(
          this.filterForm.get("toDateCtrl").value,"yyyy-MM-dd","en");
        ReportsInvoiceComponent.toDate = formatDate(this.filterForm.get("toDateCtrl").value,"yyyy-MM-dd","en");
      }
    } else {
      ReportsInvoiceComponent.fromDate = "";
      ReportsInvoiceComponent.toDate = "";
    }

    if ((this.filterForm.get("fromCode").value == null && this.filterForm.get("toCode").value != null) || (this.filterForm.get("fromCode").value != null && this.filterForm.get("toCode").value == null) ) {
      swal({
        type: 'error',
        title: 'please fill all code inputs',
        text: ''
      });
      return;
    }

    if (!this.filterForm.get("FC").value && !this.filterForm.get("FR").value && !this.filterForm.get("FD").value) {
      swal({
        type: 'error',
        title: 'select at least one type',
        text: ''
      });
      return;
    }


    if (this.filterForm.get("FC").value && this.filterForm.get("FR").value && this.filterForm.get("FD").value) {
      ReportsInvoiceComponent.invoiceType = '-1';
    }

    else{
      var temp="";
      temp="";
      if(this.filterForm.get("FC").value){
        temp +="\'FC\'\,";
      }
      if(this.filterForm.get("FR").value){
        temp +="\'FR\'\,";
      }
      if(this.filterForm.get("FD").value){
        temp +="\'FD\'\,";
      }
      temp = temp.substring(0, temp.length - 1);     
      ReportsInvoiceComponent.invoiceType = temp;      
    }

    ReportsInvoiceComponent.selectedClients="";
    if(this.filterForm.get("selectedClients").value != null && this.filterForm.get("selectedClients").value.length !=0 ){
      this.filterForm.get("selectedClients").value.forEach(element => {
        ReportsInvoiceComponent.selectedClients +=(element['perID'])+",";
      });
      ReportsInvoiceComponent.selectedClients = ReportsInvoiceComponent.selectedClients.substring(0, ReportsInvoiceComponent.selectedClients.length - 1);
    }
    else{
      ReportsInvoiceComponent.selectedClients="-1";
    }

    ReportsInvoiceComponent.clientID = this.filterForm.get("clientID").value;
    ReportsInvoiceComponent.fromCode = this.filterForm.get("fromCode").value;
    ReportsInvoiceComponent.toCode = this.filterForm.get("toCode").value;
    ReportsInvoiceComponent.globalDataTable.ajax.reload();
  }

}
