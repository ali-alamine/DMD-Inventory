<?php
include './connection.php';
openConn();

$requestData = $_REQUEST;
$rowsReq = (isset($_GET['length'])) ? intval($_GET['length']) : 10;
$start = (isset($_GET['start'])) ? intval($_GET['start']) : 0;
$orderString = "";

$rowsCount = mysqli_fetch_assoc(mysqli_query(openConn(), "SELECT COUNT(perID) as exp FROM person where per_isClient=1 and per_isActivated=1"))['exp'];

if (count($_GET['order'])) {
    $orderBy = $_GET['columns'][$_GET['order'][0]['column']]['data'];
    if ($orderBy == 'ID') {
        $orderBy = 'perID';
    }
    if ($orderBy == 'name') {
        $orderBy = 'per_name';
    }
    if ($orderBy == 'phone') {
        $orderBy = 'per_phone';
    }
    if ($orderBy == 'address') {
        $orderBy = 'per_address';
    }
    if ($orderBy == 'code') {
        $orderBy = 'per_code';
    }

    $orderDir = $_GET['order'][0]['dir'];
    $orderString = " ORDER BY " . $orderBy . " " . $orderDir;
}

if (isset($_GET["search"]["value"]) && !empty($_GET["search"]["value"])) {
    $search = $_GET["search"]["value"];

    $getAllFactureQuery = "select * from person  where per_isClient = 1 AND  per_isActivated = 1 and (per_name like '%" . $search . "%' OR per_phone like '%" . $search . "%' OR per_address like '%" . $search . "%' ) " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;

} 
else {
    $getAllFactureQuery = "select * from person  where per_isClient = 1 and per_isActivated = 1 " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;

}

$getAllFactureQuerySQL = mysqli_query(openConn(), $getAllFactureQuery);
$rowsCountFilter = mysqli_num_rows($getAllFactureQuerySQL);
$jsonData = "";
if ($getAllFactureQuerySQL) {
    while ($row = mysqli_fetch_assoc($getAllFactureQuerySQL)) {
        if ($row != null) {
            if ($jsonData != "") {
                $jsonData = $jsonData . ",";
            }
            $jsonData = $jsonData . '{"ID":"' . $row['perID'] . '",';
            $jsonData = $jsonData . '"name":"' . $row['per_name'] . '",';
            $jsonData = $jsonData . '"phone":"' . $row['per_phone'] . '",';
            $jsonData = $jsonData . '"address":"' . $row['per_address'] . '",';
            $jsonData = $jsonData . '"code":"' . $row['per_code'] . '"}';
        }
    }
}
$jsonData = '[' . $jsonData . ']';
$jsonData2 = '{"draw":' . intval($requestData['draw']) . ',"recordsTotal":' . $rowsCount . ', "recordsFiltered":' . $rowsCount . ', "data":' . $jsonData . '}';
echo ($jsonData2);
closeConn();
