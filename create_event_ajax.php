<?php
require 'database.php';
ini_set("session.cookie_httponly", 1);
session_start();

header("Content-Type: application/json");

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

//Variables can be accessed as such:
$title = (string) $json_obj['title'];
$time = (string) $json_obj['time'];
$date = (string) $json_obj['date'];
$tag = (string) $json_obj['tag'];
$share_with = (string) $json_obj['share_with'];
$username = $_SESSION['username'];

// Make sure the safety against CSRF
if(!hash_equals($_SESSION['token'], (string) $json_obj['token'])){
  echo json_encode(array(
		"success" => false,
		"message" => "Request forgery detected"
	));
	exit;
}

// Check if the username is valid
$stmt = $mysqli->prepare("SELECT COUNT(*) FROM users WHERE username=?");
$stmt->bind_param('s', $username);
$stmt->execute();
$stmt->bind_result($cnt);
$stmt->fetch();
$stmt->close();

if ($cnt == 1) {
  $stmt = $mysqli->prepare("insert into events (title, date, time, tag, username, shared_username) values (?, ?, ?, ?, ?, ?)");
  if(!$stmt){
    printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
  }
  $stmt->bind_param('ssssss', $title, $date, $time, $tag, $username, $share_with);
  $stmt->execute();
  $stmt->close();

  echo json_encode(array(
    "success" => true
  ));
  exit;
} else {
  echo json_encode(array(
		"success" => false,
		"message" => "You need to log in to create an event"
	));
	exit;
}

?>
