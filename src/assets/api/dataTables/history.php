<?php
include './connection.php';
openConn();

$requestData = $_REQUEST;
$rowsReq = (isset($_GET['length'])) ? intval($_GET['length']) : 10;
$start = (isset($_GET['start'])) ? intval($_GET['start']) : 0;
$orderString = "";

$rowsCount = mysqli_fetch_assoc(mysqli_query(openConn(), "SELECT COUNT(ODID) as exp FROM order_detail"))['exp'];

if (count($_GET['order'])) {
    $orderBy = $_GET['columns'][$_GET['order'][0]['column']]['data'];
    if ($orderBy == 'ID') {
        $orderBy = 'IID';
    }

    $orderDir = $_GET['order'][0]['dir'];
    $orderString = " ORDER BY " . $orderBy . " " . $orderDir;
}
if (isset($_GET["search"]["value"]) && !empty($_GET["search"]["value"])) {
    $search = $_GET["search"]["value"];

    $getAllFactureQuery = "select * from order_detail as o INNER JOIN client as c on c.CID = o.ord_det_CID  where (o.ord_det_date_req like '%" . $search . "%' OR c.client_name like '%" . $search . "%' OR ord_det_code like '%" . $search . "%' ) " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;

} else {

    $getAllFactureQuery = "select * from order_detail as o INNER JOIN client as c on c.CID = o.ord_det_CID  " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;

}

$getAllFactureQuerySQL = mysqli_query(openConn(), $getAllFactureQuery);
// $rowsCountFilter = mysqli_num_rows($getAllFactureQuerySQL);
$jsonData = "";
if ($getAllFactureQuerySQL) {
    while ($row = mysqli_fetch_assoc($getAllFactureQuerySQL)) {
        if ($row != null) {
            if ($jsonData != "") {
                $jsonData = $jsonData . ",";
            }
            $jsonData = $jsonData . '{"ID":"' . $row['ODID'] . '",';
            $jsonData = $jsonData . '"client_name":"' . $row['client_name'] . '",';
            $jsonData = $jsonData . '"client_phone":"' . $row['client_phone'] . '",';
            $jsonData = $jsonData . '"client_location":"' . $row['client_location'] . '",';
            $jsonData = $jsonData . '"ord_det_code":"' . $row['ord_det_code'] . '",';
            $jsonData = $jsonData . '"ord_det_type":"' . $row['ord_det_type'] . '",';
            $jsonData = $jsonData . '"ord_det_date_del":"' . date($row['ord_det_date_del']) . '",';
            $jsonData = $jsonData . '"ord_det_date_req":"' . date($row['ord_det_date_req']) . '"}';
        }
    }
}
$jsonData = '[' . $jsonData . ']';
$jsonData2 = '{"draw":' . intval($requestData['draw']) . ',"recordsTotal":' . $rowsCount . ', "recordsFiltered":' . $rowsCount . ', "data":' . $jsonData . '}';
echo ($jsonData2);
closeConn();
