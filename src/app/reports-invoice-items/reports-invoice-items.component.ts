import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { formatDate } from "@angular/common";
import { ReportsService } from "../reports/reports.service";
import { Router } from "../../../node_modules/@angular/router";
declare var $: any;

@Component({
  selector: "app-reports-invoice-items",
  templateUrl: "./reports-invoice-items.component.html",
  styleUrls: ["./reports-invoice-items.component.css"]
})
export class ReportsInvoiceItemsComponent implements OnInit {
  panelOpenState = false;
  filterForm;
  private static globalDataTable;
  private static invoiceType = -1;

  private static fromDate;
  private static toDate;
  options: any[];
  static clientID: any;
  constructor(private fb: FormBuilder, private reportService: ReportsService,private router: Router) {}

  ngOnInit() {
    if (localStorage.getItem("user") !== '1') {
      this.router.navigate(["login"]);
    }
    var reportInvItemDT = $("#invoiceItemReportDT").DataTable({
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
      lengthMenu: [[100, 200, 400, 800, 1600], [100, 200, 400, 800, 1600]],
      ajax: {
        type: "get",
        url:
          "http://localhost/DMD-Inventory/src/assets/api/dataTables/report-invoice-items.php",
        data: function(d) {
          return $.extend({}, d, {
            invoiceType: ReportsInvoiceItemsComponent.invoiceType,
            clientID: ReportsInvoiceItemsComponent.clientID,
            fromDate: ReportsInvoiceItemsComponent.fromDate,
            toDate: ReportsInvoiceItemsComponent.toDate
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
        { data: "item_name", title: "Article" },
        { data: "ord_crt", title: "CRT" },
        { data: "ord_piece", title: "Piece" },
        { data: "inv_date_req", title: "Date" },
        { data: "per_name", title: "Client" }
      ]
    });
    ReportsInvoiceItemsComponent.globalDataTable = reportInvItemDT;
    this.filterForm = this.fb.group({
      searchClient: [""],
      clientID: [""],
      invoiceType: ["-1"],
      fromDateCtrl: [],
      toDateCtrl: []
    });

    this.onClientNameChange();
  }

  searchSubmit() {
    // console.log(this.filterForm.value);
    if (
      this.filterForm.get("fromDateCtrl").value != null &&
      this.filterForm.get("toDateCtrl").value != null
    ) {
      ReportsInvoiceItemsComponent.fromDate = formatDate(
        this.filterForm.get("fromDateCtrl").value,
        "yyyy-MM-dd",
        "en"
      );
      ReportsInvoiceItemsComponent.toDate = formatDate(
        this.filterForm.get("toDateCtrl").value,
        "yyyy-MM-dd",
        "en"
      );
    } else if (
      this.filterForm.get("fromDateCtrl").value != null ||
      this.filterForm.get("toDateCtrl").value != null
    ) {
      if (this.filterForm.get("fromDateCtrl").value != null) {
        ReportsInvoiceItemsComponent.fromDate = formatDate(
          this.filterForm.get("fromDateCtrl").value,
          "yyyy-MM-dd",
          "en"
        );
        ReportsInvoiceItemsComponent.toDate = formatDate(
          this.filterForm.get("fromDateCtrl").value,
          "yyyy-MM-dd",
          "en"
        );
      } else {
        ReportsInvoiceItemsComponent.fromDate = formatDate(
          this.filterForm.get("toDateCtrl").value,
          "yyyy-MM-dd",
          "en"
        );
        ReportsInvoiceItemsComponent.toDate = formatDate(
          this.filterForm.get("toDateCtrl").value,
          "yyyy-MM-dd",
          "en"
        );
      }
    } else {
      ReportsInvoiceItemsComponent.fromDate = "";
      ReportsInvoiceItemsComponent.toDate = "";
    }
    ReportsInvoiceItemsComponent.invoiceType = this.filterForm.get(
      "invoiceType"
    ).value;
    ReportsInvoiceItemsComponent.clientID = this.filterForm.get(
      "clientID"
    ).value;
    ReportsInvoiceItemsComponent.globalDataTable.ajax.reload();
  }

  onClientNameChange(): void {
    this.filterForm.get("searchClient").valueChanges.subscribe(val => {
      var data = this.filterForm.get("searchClient").value;
      if (data == "") {
        this.filterForm.get("clientID").setValue(-1);
        this.options = [];
        return;
      }
      this.reportService.searchClient(data).subscribe(Response => {
        this.options = Response;
      });
    });
  }

  setClientName(id, clientName) {
    this.filterForm.get("searchClient").setValue(clientName);
    this.filterForm.get("clientID").setValue(id);
  }
}
