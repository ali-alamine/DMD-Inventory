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
    public function newReturnInvoice_post(){
        $invoiceDate = $this->post('invoiceDate');
        $clientID = $this->post('clientID');
        $invoiceItems = $this->post('items');
        $invoiceCorrectDate = new DateTime($invoiceDate);
        $invoiceCorrectDate->setTimezone(new DateTimeZone('Asia/Beirut'));
        $invoiceCode = $this->generateFactureCode('FR');
        $this->db->trans_begin();
        $invoiceID = $this->factureReturn_model->addReturnInvoice(array("inv_perID" =>  $clientID, "inv_code" => $invoiceCode, 
        "inv_type" => 'FR', "inv_date_req" => $invoiceCorrectDate->format('Y-m-d H:i:s'), "inv_status" => -1));
        foreach ($invoiceItems as $row) {
            $itemData = array(
                "ord_itemID" => $row['itemID'],
                "ord_item_isDamaged" => $row['isDamaged'],
                "ord_piece" => $row['piece'],
                "ord_crt" => $row['crt'],
                "ord_invID" => $invoiceID,
                "ord_isDeleted" => 0
            );
            $ordID = $this->factureReturn_model->addItemToInvoice($itemData);
            if ($ordID === 0) {
                $this->response("Item information could not be saved. Try again.", 404);
            } else {
                // $reqCorrectDate = new DateTime($row['date_req']);
                // $reqCorrectDate->setTimezone(new DateTimeZone('Asia/Beirut'));
                // $comCorrectDate = new DateTime($row['date_com']);
                // $comCorrectDate->setTimezone(new DateTimeZone('Asia/Beirut'));
                date_default_timezone_set("Asia/Beirut");
                $date=date("Y-m-d H:i:s");
                $this->factureReturn_model->addDateReturn(array('date_ordID' => $ordID,'ord_perID' => $clientID,
                'ord_date_req' => $date));
            }
        }
        if ($this->db->trans_status() === false) {
            $this->db->trans_rollback();
            $this->response("Invoice information could not be saved. Try again.", 404);
        } else {
            $this->db->trans_commit();
            $this->response($invoiceCode);
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
    // public function confirmOrder_post(){        
    //     $ordID = $this->post('ordID');
    //     $invID = $this->post('invID');
    //     $crt = $this->post('crt');
    //     $piece = $this->post('piece');
    //     $itemID = $this->post('itemID');
    //     $isDamaged = $this->post('isDamaged');
    //     $packingList = $this->post('packingList');
    //     date_default_timezone_set("Asia/Beirut");
    //     $date_com=date("Y-m-d H:i:s");
    //     $this->db->trans_begin();
    //     $this->factureReturn_model->updateOrder($ordID,1,$date_com);
    //     $this->factureReturn_model->updateInvoice($invID,1);
    //     $quantityToAdd = ($packingList * $crt) + $piece;
    //     $this->factureReturn_model->updateStock($itemID,+$quantityToAdd,$isDamaged);
    //     if ($this->db->trans_status() === false) {
    //         $this->db->trans_rollback();
    //         $this->response("Invoice information could not be saved. Try again.", 404);
    //     } else {
    //         $this->db->trans_commit();
    //         $this->response("success", 200);
    //     }
    // }
    // public function rejectOrder_get(){
    //     $ordID = $this->get('ordID');
    //     $this->db->trans_begin();
    //     $this->factureReturn_model->deletedOrder($ordID);
    //     if ($this->db->trans_status() === false) {
    //         $this->db->trans_rollback();
    //         $this->response("Invoice information could not be saved. Try again.", 404);
    //     } else {
    //         $this->db->trans_commit();
    //         $this->response("success", 200);
    //     }
    // }
    public function getFactureDetails_get()
    {
        $invID = $this->get('invID');
        $result = $this->factureReturn_model->getFactureDetails($invID);      
        if ($result) {
            $this->response($result, 200);
            exit;
        }
    }
    public function editReturnInvoice_post(){
        $invoiceDate = $this->post('invoiceDate');
        $invID = $this->post('invID');
        $clientID = $this->post('clientID');
        $invoiceItemsEdit = $this->post('itemsEdit');
        $invoiceItems = $this->post('items');
        $invoiceCorrectDate = new DateTime($invoiceDate);
        $invoiceCorrectDate->setTimezone(new DateTimeZone('Asia/Beirut'));
        $this->db->trans_begin();

        $this->factureReturn_model->editReturnInvoice($invID,array("inv_perID" =>  $clientID, 
        "inv_date_req" => $invoiceCorrectDate->format('Y-m-d H:i:s')));
        foreach ($invoiceItemsEdit as $row) {
            $query = $this->db->query("SELECT ord_crt,ord_piece,ord_perID FROM order_inv INNER JOIN return_details on date_ordID = ordID where ordID = '".$row['ordID']."'");
            if ($query->num_rows() > 0) {     
                $result = $query->result_array();
                foreach ($result as $rowQuantity) {
                    $crt = $rowQuantity['ord_crt'];
                    $piece = $rowQuantity['ord_piece'];
                    $ord_perID = $rowQuantity['ord_perID'];
                }
            }
            if($crt != $row['crt'] || $piece != $row['piece'] || $row['isDeleted'] == "1"){
                $quantityToAdd = ($row['colisage'] * $crt) + $piece;
                $this->factureReturn_model->updateStock($row['itemID'],-$quantityToAdd,$row['isDamaged']);
                if($row['isDeleted'] == "0"){
                    $quantityToAdd = ($row['colisage'] * $row['crt']) + $row['piece'];
                    $this->factureReturn_model->updateStock($row['itemID'],$quantityToAdd,$row['isDamaged']);
                    $itemData = array(
                        "ord_piece" => $row['piece'],
                        "ord_crt" => $row['crt']
                    );
                    $this->factureReturn_model->editItemToInvoice($row['ordID'],$itemData);
                }
            }
            if($ord_perID != $clientID)
                $this->factureReturn_model->editDateReturn($row['ordID'],array('ord_perID' => $clientID));
            if($row['isDeleted'] == "1"){
                $this->factureReturn_model->deletedOrder($row['ordID']);
            }            
        }
        foreach ($invoiceItems as $row) {
            $itemData = array(
                "ord_itemID" => $row['itemID'],
                "ord_item_isDamaged" => $row['isDamaged'],
                "ord_piece" => $row['piece'],
                "ord_crt" => $row['crt'],
                "ord_invID" => $invID,
                "ord_isDeleted" => 0
            );

            $ordID = $this->factureReturn_model->addItemToInvoice($itemData);
            if ($ordID === 0) {
                $this->response("Item information could not be saved. Try again.", 404);
            } else {
                date_default_timezone_set("Asia/Beirut");
                $date=date("Y-m-d H:i:s");
                $this->factureReturn_model->addDateReturn(array('date_ordID' => $ordID,'ord_perID' => $clientID,
                'ord_date_req' => $date,'ord_date_com' =>$date,'ord_status'=> 1));
            }
            $quantityToAdd = ($row['colisage'] * $row['crt']) + $row['piece'];
            $this->factureReturn_model->updateStock($row['itemID'],$quantityToAdd,$row['isDamaged']);
        }
        if ($this->db->trans_status() === false) {
            $this->db->trans_rollback();
            $this->response("Invoice information could not be saved. Try again.", 404);
        } else {
            $this->db->trans_commit();
            $this->response("success", 200);
        }
    }
}
