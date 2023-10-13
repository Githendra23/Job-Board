<?php
$email = $_POST["email"];
$password = $_POST["password"];
$role = $_POST["role"];

$apiUrl = "http://localhost:8080/$role/verify";

$data = [
    "email" => $email,
    "password" => $password
];

$jsonData = json_encode($data);

$ch = curl_init($apiUrl);

curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Content-Length: ' . strlen($jsonData)
]);

$response = curl_exec($ch);

if (curl_errno($ch)) 
{
    echo "cURL Error: " . curl_error($ch);
} 
else 
{
    curl_close($ch);

    if ($response === false) 
    {
        echo "Failed to fetch data from the API";
    } 
    else 
    {
        $data = json_decode($response);

        if ($data) 
        {
            var_dump($data);
        } 
        else 
        {
            echo "Failed to parse JSON data from the API";
        }
    }
}
?>
