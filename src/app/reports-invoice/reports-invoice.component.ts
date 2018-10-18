import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { formatDate } from "@angular/common";
import { ReportsService } from "../reports/reports.service";
declare var $: any;
@Component({
  selector: "app-reports-invoice",
  templateUrl: "./reports-invoice.component.html",
  styleUrls: ["./reports-invoice.component.css"]
})
export class ReportsInvoiceComponent implements OnInit {
  panelOpenState = false;
  filterForm;
  private static globalDataTable;
  private static invoiceType = -1;

  private static fromDate;
  private static toDate;
  options: any[];
  static clientID: any;

  constructor(private fb: FormBuilder, private reportService: ReportsService) {}

  ngOnInit() {
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
          extend: 'colvis',
          text: 'visibilité des colonnes'
      },
        "pageLength",
        "excel"
      ],
      language: {
        buttons: {
            pageLength: {
                _: "Afficher %d éléments",
                '-1': "Tout afficher"
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
          "http://localhost/DMD-Inventory/src/assets/api/dataTables/report-invoice.php",
        data: function(d) {
          return $.extend({}, d, {
            invoiceType: ReportsInvoiceComponent.invoiceType,
            clientID: ReportsInvoiceComponent.clientID,
            fromDate: ReportsInvoiceComponent.fromDate,
            toDate: ReportsInvoiceComponent.toDate
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
        { data: "per_name", title: "Name" }
      ]
    });
    ReportsInvoiceComponent.globalDataTable = subscriberDataTable;
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
    console.log(this.filterForm.value);
    if (
      this.filterForm.get("fromDateCtrl").value != null &&
      this.filterForm.get("toDateCtrl").value != null
    ) {
      ReportsInvoiceComponent.fromDate = formatDate(
        this.filterForm.get("fromDateCtrl").value,
        "yyyy-MM-dd",
        "en"
      );
      ReportsInvoiceComponent.toDate = formatDate(
        this.filterForm.get("toDateCtrl").value,
        "yyyy-MM-dd",
        "en"
      );
    } else if (
      this.filterForm.get("fromDateCtrl").value != null ||
      this.filterForm.get("toDateCtrl").value != null
    ) {
      if (this.filterForm.get("fromDateCtrl").value != null) {
        ReportsInvoiceComponent.fromDate = formatDate(
          this.filterForm.get("fromDateCtrl").value,
          "yyyy-MM-dd",
          "en"
        );
        ReportsInvoiceComponent.toDate = formatDate(
          this.filterForm.get("fromDateCtrl").value,
          "yyyy-MM-dd",
          "en"
        );
      } else {
        ReportsInvoiceComponent.fromDate = formatDate(
          this.filterForm.get("toDateCtrl").value,
          "yyyy-MM-dd",
          "en"
        );
        ReportsInvoiceComponent.toDate = formatDate(
          this.filterForm.get("toDateCtrl").value,
          "yyyy-MM-dd",
          "en"
        );
      }
    } else {
      ReportsInvoiceComponent.fromDate = "";
      ReportsInvoiceComponent.toDate = "";
    }
    ReportsInvoiceComponent.invoiceType = this.filterForm.get(
      "invoiceType"
    ).value;
    ReportsInvoiceComponent.clientID = this.filterForm.get("clientID").value;
    ReportsInvoiceComponent.globalDataTable.ajax.reload();
  }

  onClientNameChange(): void {
    this.filterForm.get("searchClient").valueChanges.subscribe(val => {
      var data = this.filterForm.get("searchClient").value;
      if (data == "") {
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
