<?php
require APPPATH . '/libraries/REST_Controller.php';
class history extends REST_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('history_model');
    }

    public function getFactureDetails_get(){
        $ID = $this->get('ID');
        $type = $this->get('type');
        $result = $this->history_model->getFactureDetails($ID,$type);
        if ($result) {
            $this->response($result, 200);
            exit;
        }
    }
    public function deleteFacture_get()
    {
        $invID = $this->get('invID');
        $type = $this->get('type');
        $selectItem = $this->history_model->getFactureDetails($invID,$type);
        if($selectItem == 0 ){
            $result = $this->history_model->deleteFacture($invID);
            if ($result) {
                $this->response($result, 200);
                exit;
            }
        }else{
            $this->response('0', 200);
        }
    }
    public function deleteItem_get()
    {
        $invID = $this->get('invID');
        $ordID = $this->get('ordID');
        $type = $this->get('type');
        $result = $this->history_model->getOrderDetails($ordID);
        foreach ($result as $row) {
            // $ordID = $row['ordID'];
            $crt = $row['ord_crt'];
            $piece = $row['ord_piece'];
            $packingList = $row['item_packing_list'];
            $itemID = $row['ord_itemID'];
            $isDamaged = $row['ord_item_isDamaged'];
            $quantityToAdd = ($packingList * $crt) + $piece;
            if($type == "FR" || $type == "FD")
                $this->history_model->updateStock($itemID,-$quantityToAdd,$isDamaged);
            if($type == "FC")
                $this->history_model->updateStock($itemID,+$quantityToAdd,$isDamaged);
            $result = $this->history_model->deletedItemOrder($ordID,$type);
        }
        if ($result) {
            $this->response($result, 200);
            exit;
        }
    } 
    public function getFactureReturnDetails_get(){
        $invID = $this->get('ID');
        $result = $this->history_model->getFactureReturnDetails($invID);
        if ($result) {
            $this->response($result, 200);
            exit;
        }
    }  
    public function confirmOrder_post(){       
        $ordID = $this->post('ordID');
        $invID = $this->post('invID');
        $crt = $this->post('crt');
        $piece = $this->post('piece');
        $itemID = $this->post('itemID');
        $isDamaged = $this->post('isDamaged');
        $packingList = $this->post('packingList');
        date_default_timezone_set("Africa/Ouagadougou");
        $date_com=date("Y-m-d H:i:s");
        $this->db->trans_begin();
        $this->history_model->updateOrder($ordID,1,$date_com);
        $quantityToAdd = ($packingList * $crt) + $piece;
        $this->history_model->updateStock($itemID,+$quantityToAdd,$isDamaged);
        $count = $this->history_model->checkInvoice($invID,0);
        // echo $count;
        if($count == 0)
            $this->history_model->updateInvoice($invID,1);
        if ($this->db->trans_status() === false) {
            $this->db->trans_rollback();
            $this->response("Invoice information could not be saved. Try again.", 404);
        } else {
            $this->db->trans_commit();
            $this->response($count, 200);
        }
    }
    public function rejectOrder_get(){
        $ordID = $this->get('ordID');
        $invID = $this->get('invID');
        $this->db->trans_begin();
        $this->history_model->deletedOrder($ordID);
        $count = $this->history_model->checkInvoice($invID,0);
        $count2 = $this->history_model->checkInvoice($invID,1);
        if($count == 0 && $count2 != 0)
            $this->history_model->updateInvoice($invID,1);
        if($count == 0 && $count2 == 0)
            $this->history_model->updateInvoice($invID,0);
        if ($this->db->trans_status() === false) {
            $this->db->trans_rollback();
            $this->response("Invoice information could not be saved. Try again.", 404);
        } else {
            $this->db->trans_commit();
            $this->response($count, 200);
        }
    } 
    public function getOrderNoConfirm_get()
    {
        $result = $this->history_model->getOrderNoConfirm();
        if ($result) {
            $this->response($result, 200);
            exit;
        }
    }
    public function confirmAll_get(){ 
        $invID = $this->get('invID');
        date_default_timezone_set("Africa/Ouagadougou");
        $date_com=date("Y-m-d H:i:s");
        $this->db->trans_begin();
        $result = $this->history_model->getFactureReturnDetails($invID);
        foreach ($result as $row) {
            $ordID = $row['ordID'];
            $crt = $row['ord_crt'];
            $piece = $row['ord_piece'];
            $packingList = $row['item_packing_list'];
            $itemID = $row['ord_itemID'];
            $isDamaged = $row['ord_item_isDamaged'];

            $this->history_model->updateOrder($ordID,1,$date_com);
            $quantityToAdd = ($packingList * $crt) + $piece;
            $this->history_model->updateStock($itemID,+$quantityToAdd,$isDamaged);
        }
        $this->history_model->updateInvoice($invID,1);
        if ($this->db->trans_status() === false) {
            $this->db->trans_rollback();
            $this->response("Invoice information could not be saved. Try again.", 404);
        } else {
            $this->db->trans_commit();
            $this->response('success', 200);
        }
    }
    
    public function rejectAll_get(){
        $invID = $this->get('invID');
        $this->db->trans_begin();
        $result = $this->history_model->getFactureReturnDetails($invID);
        foreach ($result as $row) {
            $ordID = $row['ordID'];
            $this->history_model->deletedOrder($ordID);
        }
        $count = $this->history_model->checkInvoice($invID,1);
        if($count != 0)
            $this->history_model->updateInvoice($invID,1);
        if($count == 0)
            $this->history_model->updateInvoice($invID,0);
        if ($this->db->trans_status() === false) {
            $this->db->trans_rollback();
            $this->response("Invoice information could not be saved. Try again.", 404);
        } else {
            $this->db->trans_commit();
            $this->response('success', 200);
        }
    }
    // public function getCountFR_get(){
    //     $count = $this->history_model->getCountFR();
    //     if ($count) {
    //         $this->response($count, 200);
    //         exit;
    //     }
    // }
}
