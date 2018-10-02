<?php
class factureReturn_model extends CI_Model
{
    public function __construct()
    {
        $this->load->database();
    }

    public function addReturnInvoice($data)
    {
        if ($this->db->insert('invoice', $data)) {
            return $this->db->insert_id();
        } else {
            return false;
        }
    }

    public function addItemToInvoice($data)
    {
        if ($this->db->insert('order_inv', $data)) {
            $ordID = $this->db->insert_id();
            return $ordID;
        } else {
            return false;
        }
    }

    public function updateStock($id, $quantity,$isDamaged) // update quantity of item 

    {
        $this->db->where('itemID', $id);
        $this->db->where('item_is_damaged', $isDamaged);
        $this->db->set('item_piece', 'item_piece + ' . $quantity, false);
        if ($this->db->update('item')) {
            return true;
        } else {
            return false;
        }
    }

    public function getRepeatedCodeCount($prefix)
    {
        $this->db->count_all_results('invoice');
        $this->db->like('inv_type', $prefix, 'after');
        $this->db->from('invoice');
        return $this->db->count_all_results();

    }
    public function searchPerson($name,$isClient){
        $this->db->select('*');
        $this->db->from('person');
        $this->db->like('per_name', $name, 'after'); 
        $this->db->where('per_isClient', $isClient);
        $this->db->where('per_isActivated', 1);
        $this->db->limit(20);
        $query = $this->db->get();
        if ($query->num_rows() > 0) {
            return $query->result_array();
        } else {
            return 0;
        }
    }
    public function addDateReturn($data)
    {
        if ($this->db->insert('return_details', $data)) {
            return true;
        } else {
            return false;
        }
    }
    public function getOrderNoConfirm()
    {
        $query = $this->db->query("SELECT * FROM order_inv INNER JOIN return_details on date_ordID = ordID INNER JOIN person on ord_perID = perID INNER JOIN item on itemID = ord_itemID and item_is_Damaged = ord_item_isDamaged where ord_status = 0 ");

        if ($query->num_rows() > 0) {
            return $query->result_array();
        } else {
            return 0;
        }

    }
    public function updateOrder($ordID,$status){
        $this->db->where('date_ordID', $ordID);
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
    public function getFactureDetails($invID){
        // if($type=='FR'){
            $query = $this->db->query("SELECT *,date(inv_date_req) as inv_date_req FROM order_inv  INNER JOIN invoice on invID = ord_invID 
            INNER JOIN item ON itemID = ord_itemID INNER JOIN return_details on date_ordID = ordID 
            INNER JOIN person on perID = ord_perID
            where ord_invID = '".$invID."' and ord_isDeleted = '0' and ord_status = '1' ");
        // } else{
        //     $query = $this->db->query("SELECT * FROM order_inv  
        //     INNER JOIN item ON itemID = ord_itemID
        //     where ord_invID = '".$ID."' and ord_isDeleted = '0'");
        // }
        if ($query->num_rows() > 0) {
            return $query->result_array();
        } else {
            return 0;
        }
    }
    public function editReturnInvoice($invID,$data){
        $this->db->where('invID', $invID);
        if ($this->db->update('invoice',$data)) {
            return true;
        } else {
            return false;
        }
    }
    public function editItemToInvoice($ordID,$data)
    {
        $this->db->where('ordID', $ordID);
        if ($this->db->update('order_inv',$data)) {
            return true;
        } else {
            return false;
        }
    }
    public function editDateReturn($ordID,$data)
    {
        $this->db->where('date_ordID', $ordID);
        if ($this->db->update('return_details',$data)) {
            return true;
        } else {
            return false;
        }
    }
}
