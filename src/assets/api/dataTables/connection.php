<?php
header("Access-Control-Allow-Origin: *");
// open connection
function openConn(){
	$servername = "localhost";
	$username = "root";
	$password = "";
	$db = "mousanet";
	$conn = mysqli_connect($servername, $username, $password, $db);
	return $conn;
}
// close connection
function closeConn(){
	$closConnection = mysqli_close(openConn());
	return $closConnection;
}
 ?>