<?php
class history_model extends CI_Model
{
    public function __construct()
    {
        $this->load->database();
    }
    public function getFactureDetails($ID,$type){
        if($type=='FR'){
            $query = $this->db->query("SELECT *,DATE_FORMAT(ord_date_com,'%d-%m-%Y') as ord_date_com 
            FROM order_inv  
            INNER JOIN item ON itemID = ord_itemID and item_is_damaged = ord_item_isDamaged
            INNER JOIN return_details on date_ordID = ordID
            where ord_invID = '".$ID."' and ord_status = '1' ");
        } else{
            $query = $this->db->query("SELECT * FROM order_inv  
            INNER JOIN item ON itemID = ord_itemID and item_is_damaged = ord_item_isDamaged
            where ord_invID = '".$ID."'");
        }
        if ($query->num_rows() > 0) {
            return $query->result_array();
        } else {
            return 0;
        }
    }
    public function deleteFacture($invID)
    {
        $this->db->set('inv_status', 0);
        $this->db->where('invID', $invID);        
        if ($this->db->update('invoice')) {
            return true;
        } else {
            return false;
        }
    }
    public function getFactureReturnDetails($invID){
        $query = $this->db->query("SELECT * FROM order_inv 
        INNER JOIN return_details on date_ordID = ordID 
        -- INNER JOIN person on ord_perID = perID 
        INNER JOIN item on itemID = ord_itemID and item_is_Damaged = ord_item_isDamaged 
        where ord_status = 0 and ord_invID = '".$invID."' ");

        if ($query->num_rows() > 0) {
            return $query->result_array();
        } else {
            return 0;
        }
    }
    public function updateOrder($ordID,$status,$date_com){
        $this->db->where('date_ordID', $ordID);
        $this->db->set('ord_date_com',$date_com);
        $this->db->set('ord_status',$status);
        if ($this->db->update('return_details')) {
            return true;
        } else {
            return false;
        }
    }
    public function updateInvoice($invID,$status){
        $this->db->where('invID', $invID);
        $this->db->set('inv_status',$status);
        if ($this->db->update('invoice')) {
            return true;
        } else {
            return false;
        }
    }
    public function getOrderDetails($ordID){
        $query = $this->db->query("SELECT * FROM order_inv  
        INNER JOIN item ON itemID = ord_itemID and item_is_damaged = ord_item_isDamaged
        where ordID = '".$ordID."' ");
        if ($query->num_rows() > 0) {
            return $query->result_array();
        } else {
            return 0;
        }
    }
    public function updateStock($id, $quantity,$isDamaged){
        $this->db->where('itemID', $id);
        $this->db->where('item_is_damaged', $isDamaged);
        $this->db->set('item_piece', 'item_piece + ' . $quantity, false);
        if ($this->db->update('item')) {
            return true;
        } else {
            return false;
        }
    }
    public function deletedItemOrder($ordID,$type){
        if($type=="FR"){
            $this->db->where('date_ordID', $ordID);
            if ($this->db->delete('return_details')) {
                $this->db->where('ordID', $ordID);
                if ($this->db->delete('order_inv')) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else{
            $this->db->where('ordID', $ordID);
            if ($this->db->delete('order_inv')) {
                return true;
            } else {
                return false;
            }
        }
    }
    public function deletedOrder($ordID){
        $this->db->where('date_ordID', $ordID);
        if ($this->db->delete('return_details')) {
            $this->db->where('ordID', $ordID);
            if ($this->db->delete('order_inv')) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
       
    }
    public function getOrderNoConfirm()
    {
        $query = $this->db->query("SELECT * FROM order_inv 
        INNER JOIN return_details on date_ordID = ordID 
        INNER JOIN person on ord_perID = perID 
        INNER JOIN item on itemID = ord_itemID and item_is_Damaged = ord_item_isDamaged 
        where ord_status = 0 ");

        if ($query->num_rows() > 0) {
            return $query->result_array();
        } else {
            return 0;
        }

    }
    public function checkInvoice($invID,$status)
    {
        $query = $this->db->query("SELECT * FROM return_details
        INNER JOIN order_inv on ordID=date_ordID
        where ord_status = '".$status."' and ord_invID = '".$invID."' ");
        if ($query->num_rows() > 0) {
            return 1;
        } else {
            return 0;
        }

    }
    // public function getCountFR(){
    //     $query = $this->db->query("SELECT count(invID) as c FROM invoice
    //     -- INNER JOIN order_inv on ordID=date_ordID INNER JOIN return_details on ordID = date_ordID
    //     where inv_status = '-1' ");
    //     if ($query->num_rows() > 0) {
    //         return  $query->result_array();
    //     } else {
    //         return 0;
    //     }
    // }
}
