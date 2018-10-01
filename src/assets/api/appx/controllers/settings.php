<?php
require APPPATH . '/libraries/REST_Controller.php';
class settings extends REST_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('clients_model');
        $this->load->library('upload');
        $this->load->dbutil();
    }

    // public function restoreUpload_post()
    // {
    //     $test1 = file_get_contents('php://input');
    //     $uploaddir = './uploads/';
    //     $file_name = underscore($_FILES['file']['name']);
    //     $uploadfile = $uploaddir.$file_name;

    //     if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {
    //         $dataDB['status'] = 'success';
    //         $dataDB['filename'] = $file_name;
    //      } else {
    //         $dataDB['status'] =  'failure';
    //      }
    //      $this->response($dataDB, 200);
    // }

    public function backup_get()
    {
        $prefs = array(
            'tables' => array('convt', 'invoice', 'item', 'order_inv', 'person', 'return_details'), // Array of tables to backup.
            'ignore' => array(), // List of tables to omit from the backup
            'format' => 'zip', // gzip, zip, txt
            'filename' => 'backup.sql', // File name - NEEDED ONLY WITH ZIP FILES
            'add_drop' => true, // Whether to add DROP TABLE statements to backup file
            'add_insert' => true, // Whether to add INSERT data to backup file
            'newline' => "\n", // Newline character used in backup file
        );

        $backup = $this->dbutil->backup($prefs);
        $db_name = 'backup-on-' . date("Y-m-d-H-i-s") . '.zip';
        $save = './backup/' . $db_name;
        $this->load->helper('file');
        write_file($save, $backup);


        http_response_code(200);
        header('Content-Length: ' . filesize($save));
        header("Content-Type: application/zip");
        header('Content-Disposition: attachment; filename="backup.zip"');
        readfile($save);
        exit;
    }

}
