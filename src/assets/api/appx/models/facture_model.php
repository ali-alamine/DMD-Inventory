<?php
class facture_model extends CI_Model
{
    public function __construct()
    {
        $this->load->database();
    }

    public function addSupplyInvoice($data)
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
            return true;
        } else {
            return false;
        }
    }
   
}
