<?php
$conn = new mysqli("localhost", "root", "", "bloodstream", 3307);
if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(["status"=>"error","message"=>"DB connection failed: ".$conn->connect_error]));
}
$conn->set_charset("utf8mb4");
?>
