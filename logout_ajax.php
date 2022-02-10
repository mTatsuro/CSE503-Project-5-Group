<?php
require 'database.php';

header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

ini_set("session.cookie_httponly", 1);
session_start();

// Check if the user is logged in
if(isset($_SESSION['username'])){  // The user is logged in
  session_destroy();
	echo json_encode(array(
		"success" => true
	));
	exit;
}else{    // The user is not logged in
	echo json_encode(array(
		"success" => false,
		"message" => "You are not logged in"
	));
	exit;
}
?>
