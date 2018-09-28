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

    public function addClientInvoice($data)
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

    public function searchForClient($name)
    {
        $this->db->select('*');
        $this->db->from('person');
        $this->db->like('per_name', $name, 'after');
        $this->db->where('per_isClient', 1);
        $this->db->where('per_isActivated', 1);
        $this->db->limit(20);
        $query = $this->db->get();
        if ($query->num_rows() > 0) {
            return $query->result_array();
        } else {
            return 0;
        }
    }

}
