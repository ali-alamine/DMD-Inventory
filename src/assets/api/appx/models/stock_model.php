<?php
class stock_model extends CI_Model
{
    public function __construct()
    {
        $this->load->database();
    }

    public function add($data)
    {
        if ($this->db->insert('item', $data)) {
            return true;
        } else {
            return false;
        }
    }

    public function update($id, $data)
    {
        $this->db->where('itemID', $id);
        if ($this->db->update('item', $data)) {
            return true;
        } else {
            return false;
        }

    }

    public function getRepeatedCodeCount($prefix)
    {
        $this->db->count_all_results('item');
        $this->db->like('item_code', $prefix, 'after');
        $this->db->from('item');
        return $this->db->count_all_results();

    }

    public function addTransferOperation($data)
    {
        if ($this->db->insert('convt', $data)) {
            return true;
        } else {
            return false;
        }
    }

    public function updateDamagedStock($itemID, $crt, $piece, $colisage, $itemCode, $itemName)
    {

        $pieceToAdd = ($crt * $colisage) + $piece;

        $sql = " INSERT INTO item (itemID, item_is_damaged, item_code, item_name, item_packing_list, item_piece, item_isActivated) VALUES (?,1, ?, ?, ?, ?,1) ON DUPLICATE KEY UPDATE item_piece = item_piece + ? ";

        $query = $this->db->query($sql, array($itemID, $itemCode, $itemName, $colisage, $pieceToAdd, $pieceToAdd));

        $this->db->where('itemID', $itemID);
        $this->db->where('item_is_damaged', 0);
        $this->db->set('item_piece', 'item_piece - ' . $pieceToAdd, false);
        $this->db->update('item');

        if ($query) {
            return true;
        } else {
            return false;
        }
    }

    public function deleteItem($id)
    {
        $flag = $this->checkItemInInvoices($id);
        if ( $flag == 0) {
            $this->db->where('itemID', $id);
            $this->db->set('item_isActivated',0, false);
            $this->db->update('item');
            return true;
        } else {
            return false;
        }
    }

    public function checkItemInInvoices($itemID)
    {
        $this->db->select('*');
        $this->db->from('order_inv');       
        $this->db->where('ord_itemID', $itemID);
        $query = $this->db->get();
        return $query->num_rows();       

    }

}
