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
    public function updateSupplyInvoice($id,$data)
    {
        $this->db->where('invID', $id);
        if ($this->db->update('invoice', $data)) {
            return true;
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

    public function getRepeatedCodeCount($prefix)
    {
        $this->db->count_all_results('invoice');
        $this->db->like('inv_type', $prefix, 'after');
        $this->db->from('invoice');
        return $this->db->count_all_results();

    }


    public function getFactureDetails($factureID)
    {
        $this->db->select('*,date(inv_date_req) as inv_date_req');
        $this->db->from('invoice');
        $this->db->join('person', 'perID=inv_perID', 'inner');
        $this->db->where('invID', $factureID);
        $query = $this->db->get();
        if ($query->num_rows() > 0) {
            return $query->result_array();
        } else {
            return 0;
        }
    }

    public function getOrderInvoiceDetails($factureID)
    {
        $this->db->select('*');
        $this->db->from('order_inv');
        $this->db->join('item', 'item.itemID = order_inv.ord_itemID and item.item_is_damaged=ord_item_isDamaged', 'inner');
        $this->db->where('ord_invID', $factureID);

        $query = $this->db->get();
        if ($query->num_rows() > 0) {
            return $query->result_array();
        } else {
            return 0;
        }
    }

    public function deleteOldOrderInvoice($factureID)
    {
        $this->db->where('ord_invID', $factureID);       
        if ($this->db->delete('order_inv')) {
            return true;
        } else {
            return false;
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

    public function deletedOrder($ordID){
        $this->db->where('ordID', $ordID);
        if ($this->db->delete('order_inv')) {
            return true;
        } else {
            return false;
        }
    }
    public function searchClientName($keyword){
        $query = $this->db->query('SELECT perID FROM person WHERE  per_name = "' . $keyword . '" ');
        if ($query->num_rows() > 0) {
            return 1;
        } else {
            return 0;
        }
    }

}
