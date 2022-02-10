<?php
require 'database.php';

header("Content-Type: application/json");

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

ini_set("session.cookie_httponly", 1);
session_start();
$username = $_SESSION['username'];

// Check if the user is logged in
if(isset($_SESSION['username'])){  // The user is logged in
  // Use a prepared statement
  $stmt = $mysqli->prepare("SELECT id, title, date, time, tag FROM events WHERE username=?");

  // Bind the parameter
  $stmt->bind_param('s', $username);
  $stmt->execute();
  $result = $stmt->get_result();
  $stmt->close();

  echo json_encode(array(
    "success" => true,
    "events" => process_result($result)
  ));

	exit;
}else{    // The user is not logged in
	echo json_encode(array(
		"success" => false,
		"message" => "You are not logged in",
    "events" => array()
	));
	exit;
}

function process_result($result){
  $events = array();
  while($row = $result->fetch_assoc()){
    $events[$row["id"]] = array(
      "id" => $row["id"],
      "title" => htmlentities($row["title"]),      // making sure safety against XSS
      "date" => htmlentities($row["date"]),
      "time" => htmlentities($row["time"]),
      "tag" => htmlentities($row["tag"])
    );
    }
  return $events;
  }

?>
