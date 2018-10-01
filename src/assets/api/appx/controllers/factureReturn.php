<?php
require APPPATH . '/libraries/REST_Controller.php';
class factureReturn extends REST_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('factureReturn_model');
        $this->load->helper('string');
    }   
    public function generateFactureCode($factureType){
        $factureType=strtoupper($factureType);
        $suffix='00001';
        $repeatedCount = $this->factureReturn_model->getRepeatedCodeCount($factureType);    
        $code=$factureType.$suffix;
        for($i=0;$i<$repeatedCount;$i++){
            $code=increment_string($code,'');
        }
        return $code;
    }
    public function searchPerson_get(){
        $name = $this->get('keyword');
        $isClient = $this->get('isClient');
        $result = $this->factureReturn_model->searchPerson($name,$isClient);      
        if ($result) {
            $this->response($result, 200);

            exit;
        }
    }
    public function newReturnInvoice_post()
    {
        $invoiceDate = $this->post('invoiceDate');
        // $deliveryDate = $this->post('delDate');
        $clientID = $this->post('clientID');

        $invoiceItems = $this->post('items');

        $invoiceCorrectDate = new DateTime($invoiceDate);
        $invoiceCorrectDate->setTimezone(new DateTimeZone('Asia/Beirut'));

        // $deliveryCorrectDate = new DateTime($deliveryDate);
        // $deliveryCorrectDate->setTimezone(new DateTimeZone('Asia/Beirut'));

        $invoiceCode = $this->generateFactureCode('FR');

        $this->db->trans_begin();

        $invoiceID = $this->factureReturn_model->addReturnInvoice(array("inv_perID" =>  $clientID, "inv_code" => $invoiceCode, "inv_type" => 'FR', "inv_date_req" => $invoiceCorrectDate->format('Y-m-d H:i:s'), "inv_status" => -1));

        foreach ($invoiceItems as $row) {
            $itemData = array(
                "ord_itemID" => $row['itemID'],
                "ord_item_isDamaged" => $row['isDamaged'],
                "ord_piece" => $row['piece'],
                "ord_crt" => $row['crt'],
                "ord_invID" => $invoiceID,
                "ord_isDeleted" => -1
            );

            $ordID = $this->factureReturn_model->addItemToInvoice($itemData);
            if ($ordID === 0) {
                $this->response("Item information could not be saved. Try again.", 404);
            } else {
                $reqCorrectDate = new DateTime($row['date_req']);
                $reqCorrectDate->setTimezone(new DateTimeZone('Asia/Beirut'));
                $comCorrectDate = new DateTime($row['date_com']);
                $comCorrectDate->setTimezone(new DateTimeZone('Asia/Beirut'));
                $this->factureReturn_model->addDateReturn(array('date_ordID' => $ordID,'ord_perID' => $clientID,'ord_date_req' => $reqCorrectDate->format('Y-m-d'),'ord_date_com' =>$comCorrectDate->format('Y-m-d')));
            }
        }

        if ($this->db->trans_status() === false) {
            $this->db->trans_rollback();
            $this->response("Invoice information could not be saved. Try again.", 404);
        } else {
            $this->db->trans_commit();
            $this->response("success", 200);
        }
    }
    public function getOrderNoConfirm_get()
    {
        $result = $this->factureReturn_model->getOrderNoConfirm();
        if ($result) {
            $this->response($result, 200);
            exit;
        }
    }
    public function confirmOrder_get()
    {
        $ordID = $this->get('ordID');
        $invID = $this->get('invID');
        $crt = $this->get('crt');
        $piece = $this->get('piece');
        $itemID = $this->get('itemID');
        $isDamaged = $this->get('isDamaged');
        $packingList = $this->get('packingList');
        $this->db->trans_begin();

        $this->factureReturn_model->updateOrder($ordID,1);
        $this->factureReturn_model->updateInvoice($invID,0);

            // $itemID =  $row['itemID'];
            $quantityToAdd = ($packingList * $crt) + $piece;

            // $this->factureReturn_model->addItemToInvoice($itemData);
            $this->factureReturn_model->updateStock($itemID,+$quantityToAdd,$isDamaged);

        if ($this->db->trans_status() === false) {
            $this->db->trans_rollback();
            $this->response("Invoice information could not be saved. Try again.", 404);
        } else {
            $this->db->trans_commit();
            $this->response("success", 200);
        }
    }
    public function rejectOrder_post()
    {
        $ordID = $this->post('ordID');
        $this->db->trans_begin();

        $this->factureReturn_model->updateOrder($ordID,-1);
        if ($this->db->trans_status() === false) {
            $this->db->trans_rollback();
            $this->response("Invoice information could not be saved. Try again.", 404);
        } else {
            $this->db->trans_commit();
            $this->response("success", 200);
        }
    }
}
