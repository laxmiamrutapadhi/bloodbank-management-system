<?php
header('Content-Type: application/json');
include "connect.php";

$bloodGroup = isset($_GET['bloodGroup']) ? $conn->real_escape_string($_GET['bloodGroup']) : '';
$city       = isset($_GET['city'])       ? $conn->real_escape_string($_GET['city'])       : '';

$sql = "SELECT fullName, bloodGroup, phone, city, state FROM donors WHERE 1=1";
if (!empty($bloodGroup)) $sql .= " AND bloodGroup = '$bloodGroup'";
if (!empty($city))       $sql .= " AND city LIKE '%$city%'";
$sql .= " ORDER BY id DESC";

$result = $conn->query($sql);
$donors = [];
if ($result) {
    while($row = $result->fetch_assoc()) $donors[] = $row;
}
echo json_encode($donors);
$conn->close();
?>
