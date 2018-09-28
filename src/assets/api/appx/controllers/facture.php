<?php
require APPPATH . '/libraries/REST_Controller.php';
class facture extends REST_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('facture_model');
        $this->load->helper('string');
    }

    

    public function newSupplyInvoice_post()
    {
        $supplyDate = $this->post('supplyDate');
        $invoiceItems = $this->post('items');

        $correctDate = new DateTime($supplyDate);
        $correctDate->setTimezone(new DateTimeZone('Asia/Beirut'));

        $invoiceCode = $this->generateFactureCode('FD');
        $this->db->trans_begin();

        $invoiceID = $this->facture_model->addSupplyInvoice(array("inv_perID" => 1, "inv_code" => $invoiceCode, "inv_type" => 'FD', "inv_date_req" => $correctDate->format('Y-m-d H:i:s'), "inv_status" => 0));

        foreach ($invoiceItems as $row) {
            $itemData = array(
                "ord_itemID" => $row['itemID'],
                "ord_piece" => $row['piece'],
                "ord_crt" => $row['crt'],
                "ord_note" => $row['comment'],
                "ord_invID" => $invoiceID
            );

            $this->facture_model->addItemToInvoice($itemData);
        }

        if ($this->db->trans_status() === false) {
            $this->db->trans_rollback();
            $this->response("Invoice information could not be saved. Try again.", 404);
        } else {
            $this->db->trans_commit();
            $this->response("success", 200);
        }
    }

    public function newClientInvoice_post()
    {
        $invoiceDate = $this->post('invoiceDate');
        $deliveryDate = $this->post('delDate');
        $clientID = $this->post('clientID');

        $invoiceItems = $this->post('items');

        $invoiceCorrectDate = new DateTime($invoiceDate);
        $invoiceCorrectDate->setTimezone(new DateTimeZone('Asia/Beirut'));

        $deliveryCorrectDate = new DateTime($deliveryDate);
        $deliveryCorrectDate->setTimezone(new DateTimeZone('Asia/Beirut'));

        $invoiceCode = $this->generateFactureCode('FC');

        $this->db->trans_begin();

        $invoiceID = $this->facture_model->addClientInvoice(array("inv_perID" =>  $clientID, "inv_code" => $invoiceCode, "inv_type" => 'FC', "inv_date_req" => $invoiceCorrectDate->format('Y-m-d H:i:s'), "inv_date_del" => $deliveryCorrectDate->format('Y-m-d'), "inv_status" => 0));

        foreach ($invoiceItems as $row) {
            $itemData = array(
                "ord_itemID" => $row['itemID'],
                "ord_item_isDamaged" => $row['isDamaged'],
                "ord_piece" => $row['piece'],
                "ord_crt" => $row['crt'],
                "ord_note" => $row['comment'],
                "ord_invID" => $invoiceID
            );

            $this->facture_model->addItemToInvoice($itemData);
        }

        if ($this->db->trans_status() === false) {
            $this->db->trans_rollback();
            $this->response("Invoice information could not be saved. Try again.", 404);
        } else {
            $this->db->trans_commit();
            $this->response("success", 200);
        }
    }

    public function searchClient_get(){
        $keyword = $this->get('keyword');
        $result = $this->facture_model->searchForClient($keyword);      
        if ($result) {
            $this->response($result, 200);
            exit;
        }
    }

    public function generateFactureCode($factureType){
        $factureType=strtoupper($factureType);
        $suffix='00001';
        $repeatedCount = $this->facture_model->getRepeatedCodeCount($factureType);    
        $code=$factureType.$suffix;
        for($i=0;$i<$repeatedCount;$i++){
            $code=increment_string($code,'');
        }
        return $code;
    }

}
