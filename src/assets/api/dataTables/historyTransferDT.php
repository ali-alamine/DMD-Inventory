<?php
include './connection.php';
openConn();

$requestData = $_REQUEST;
$rowsReq = (isset($_GET['length'])) ? intval($_GET['length']) : 10;
$start = (isset($_GET['start'])) ? intval($_GET['start']) : 0;
$orderString = "";

$rowsCount = mysqli_fetch_assoc(mysqli_query(openConn(), "SELECT COUNT(convtID) as exp FROM convt"))['exp'];

if (count($_GET['order'])) {
    $orderBy = $_GET['columns'][$_GET['order'][0]['column']]['data'];
    
    $orderDir = $_GET['order'][0]['dir'];
    $orderString = " ORDER BY " . $orderBy . " " . $orderDir;
}

if (isset($_GET["search"]["value"]) && !empty($_GET["search"]["value"])) {
    $search = $_GET["search"]["value"];

    $getAllFactureQuery = "select *,DATE_FORMAT(conv_date,'%d-%m-%Y') AS conv_date from convt inner join item on convt.conv_itemID = item.itemID  where item_is_damaged = 0 and ( conv_date like '%" . $search . "%' OR item_name like '%" . $search . "%' OR item_code like '%" . $search . "%' ) " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;

} 
else {
    $getAllFactureQuery = "select *,DATE_FORMAT(conv_date,'%d-%m-%Y') AS conv_date from convt inner join item on convt.conv_itemID = item.itemID where item_is_damaged = 0  " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;

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
            $jsonData = $jsonData . '{"convtID":"' . $row['convtID'] . '",';
            $jsonData = $jsonData . '"conv_date":"' . $row['conv_date'] . '",';
            $jsonData = $jsonData . '"conv_crt":"' . $row['conv_crt'] . '",';
            $jsonData = $jsonData . '"item_code":"' . $row['item_code'] . '",';
            $jsonData = $jsonData . '"conv_piece":"' . $row['conv_piece'] . '",';
            $jsonData = $jsonData . '"item_name":"' . $row['item_name'] . '"}';
        }
    }
}
$jsonData = '[' . $jsonData . ']';
$jsonData2 = '{"draw":' . intval($requestData['draw']) . ',"recordsTotal":' . $rowsCount . ', "recordsFiltered":' . $rowsCount . ', "data":' . $jsonData . '}';
echo ($jsonData2);
closeConn();
