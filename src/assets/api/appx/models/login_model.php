<?php
class login_model extends CI_Model
{
    public function __construct(){
        $this->load->database();
    }

    public function getConnection($userName,$password){
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

    public function getUser(){
        $this->db->select('*');
        $this->db->from('user');
        $query = $this->db->get();
        if ($query->num_rows() > 0) {
            return $query->result_array();
        } else {
            return 0;
        }
    }

    public function update($id, $data){
        $this->db->where('UID', $id);
        if ($this->db->update('user', $data)) {
            return true;
        } else {
            return false;
        }

    }
}