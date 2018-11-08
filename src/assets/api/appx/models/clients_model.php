<?php
class clients_model extends CI_Model
{
    public function __construct()
    {
        $this->load->database();
    }

    public function add($data)
    {
        if ($this->db->insert('person', $data)) {
            $perID = $this->db->insert_id();
            return $perID;
        } else {
            return false;
        }
    }

    public function update($id, $data)
    {
        $this->db->where('perID', $id);
        if ($this->db->update('person', $data)) {
            return true;
        } else {
            return false;
        }

    }

    public function getRepeatedCodeCount($prefix)
    {
        $this->db->count_all_results('person');
        $this->db->like('per_code', $prefix, 'after');
        $this->db->from('person');
        return $this->db->count_all_results();

    }
    public function searchClientName($keyword){

        // $keyword = json_encode($keyword,true);
        $query = $this->db->query("SELECT perID FROM person WHERE per_isActivated = 1 and  per_name = '".$keyword."' ");
        if ($query->num_rows() > 0) {
            return 1;
        } else {
            return 0;
        }
    }
    public function deleteClient($id)
    {
        $flag = $this->checkClientInInvoices($id);
        if ( $flag == 0) {
            $this->db->where('perID', $id);
            $this->db->set('per_isActivated',0, false);
            $this->db->update('person');
            return true;
        } else {
            return false;
        }
    }
    public function checkClientInInvoices($id)
    {
        $this->db->select('*');
        $this->db->from('invoice');       
        $this->db->where('inv_perID', $id);
        $query = $this->db->get();
        return $query->num_rows();       

    }

}
