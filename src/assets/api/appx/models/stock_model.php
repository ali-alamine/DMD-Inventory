<?php
class stock_model extends CI_Model
{
    public function __construct()
    {
        $this->load->database();
    }

    public function add($data){
        if($this->db->insert('item', $data)){
           return true;
        }else{
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

    public function addTransferOperation($data){
        if($this->db->insert('convt', $data)){           
           return true;
        }else{
           return false;
        }
    }

    // public function updateDamagedStock($data){
    //     $query = $this->db->query(" INSERT INTO item (itemID, item_is_damaged, item_code, item_name, item_packing_list, item_crt, item_piece, item_isActivated) VALUES (NULL, '0', '', '', '', '0', '0', '1') ON DUPLICATE KEY UPDATE name=VALUES(name)");
    //     if($query)){            
    //        return true;
    //     }else{
    //        return false;
    //     }
    // }


}
