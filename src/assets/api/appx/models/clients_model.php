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
            return true;
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

}
