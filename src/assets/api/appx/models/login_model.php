<?php
class login_model extends CI_Model
{
    public function __construct()
    {
        $this->load->database();
    }

public function getConnection($userName,$password)
    {
        $this->db->select('*');
        $this->db->from('user');
        $this->db->where('user_name', $userName);
        $this->db->where('user_password', $password);
        $query = $this->db->get();
        if ($query->num_rows() > 0) {
            return 1;
        } else {
            return 0;
        }

    }
}