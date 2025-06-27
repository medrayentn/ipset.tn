<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Set UTF-8 headers for proper character handling
header('Content-Type: text/html; charset=UTF-8');

// Adjust path based on where PHPMailer is located
require '../assets/vendor/PHPMailer/PHPMailer.php';
require '../assets/vendor/PHPMailer/SMTP.php';
require '../assets/vendor/PHPMailer/Exception.php';

// Your Gmail address
$receiving_email_address = 'fakeipset@gmail.com';

// Validate form data
$email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);

// Check for empty email
if (empty($email)) {
    http_response_code(400);
    echo "Veuillez entrer une adresse email.";
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo "Adresse email invalide.";
    exit;
}

// Initialize PHPMailer
$mail = new PHPMailer(true);
try {
    // SMTP settings for Gmail
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'fakeipset@gmail.com';
    $mail->Password = 'pqpi tcsr pfhy ziyp'; // App Password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;
    
    // UTF-8 Email settings
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';

    // Email content
    $mail->setFrom('fakeipset@gmail.com', 'IPSET Newsletter');
    $mail->addAddress($receiving_email_address);
    $mail->Subject = "Nouvelle Inscription: " . $email;
    $mail->Body = "Un nouvel email s'est abonné à votre newsletter :\n\nEmail : " . $email;

    // Send email
    $mail->send();
    http_response_code(200);
    echo "OK";// Required by validate.js for success
} catch (Exception $e) {
    http_response_code(500);
    // Security: Don't expose full error info in production
    echo "Échec de l'envoi de l'email. Veuillez réessayer plus tard.";
    // For debugging only:
    // error_log('Mailer Error: ' . $e->getMessage());
}
?>