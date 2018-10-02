<?php
class history_model extends CI_Model
{
    public function __construct()
    {
        $this->load->database();
    }
    public function getFactureDetails($ID,$type){
        if($type=='FR'){
            $query = $this->db->query("SELECT * FROM order_inv  
            INNER JOIN item ON itemID = ord_itemID and item_is_deleted = ord_item_isDeleted INNER JOIN return_details on date_ordID = ordID
            where ord_invID = '".$ID."' and ord_isDeleted = '0' and ord_status = '1' ");
        } else{
            $query = $this->db->query("SELECT * FROM order_inv  
            INNER JOIN item ON itemID = ord_itemID and item_is_damaged = ord_item_isDamaged
            where ord_invID = '".$ID."' and ord_isDeleted = '0'");
        }
        if ($query->num_rows() > 0) {
            return $query->result_array();
        } else {
            return 0;
        }
    }
    public function deleteFacture($ID)
    {
        $this->db->set('inv_status', -1);
        $this->db->where('invID', $ID);        
        if ($this->db->update('invoice')) {
            return true;
        } else {
            return false;
        }
    }
    public function deleteItem($ID)
    {
        $this->db->set('ord_isDeleted', 1);
        $this->db->where('ordID', $ID);        
        if ($this->db->update('order_inv')) {
            return true;
        } else {
            return false;
        }
    }
}
