<?php
/**
 * Vision Touch Ltd — quote / contact enquiry handler.
 * Sends submissions from request-a-quote.html and contact.html to the
 * business inbox. Designed for standard shared hosting (cPanel/Hostinger/Namecheap).
 *
 * SETUP: set $TO below to the live inbox. For best deliverability, configure
 * SMTP via your host or a plugin; PHP mail() works on most cPanel hosts.
 */

// ---------------------------------------------------------------- Config
$TO          = 'inquiries@visiontouchltd.co.uk';            // <-- enquiries go here
$SUBJECT     = 'New Website Enquiry — Vision Touch Ltd';
$FROM_NAME   = 'Vision Touch Ltd Website';
// From address should be on YOUR domain for deliverability (avoid spoofing the visitor).
$FROM_EMAIL  = 'no-reply@visiontouchltd.co.uk';             // <-- update to a real domain mailbox

// ---------------------------------------------------------------- Helpers
$isAjax = isset($_SERVER['HTTP_X_REQUESTED_WITH']);
function respond($ok, $msg, $isAjax) {
  if ($isAjax) {
    header('Content-Type: application/json');
    http_response_code($ok ? 200 : 400);
    echo json_encode(['ok' => $ok, 'message' => $msg]);
  } else {
    // Non-JS fallback: redirect back with a status flag.
    $page = isset($_POST['_page']) ? $_POST['_page'] : 'contact.html';
    header('Location: ' . $page . ($ok ? '?sent=1' : '?error=1'));
  }
  exit;
}
function clean($v) { return trim(str_replace(["\r", "\n", "%0a", "%0d"], ' ', (string)$v)); }

// ---------------------------------------------------------------- Guard
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { respond(false, 'Invalid request method.', $isAjax); }

// Honeypot — bots fill this hidden field; humans never see it.
if (!empty($_POST['company_website'])) { respond(true, 'Thank you.', $isAjax); }

// ---------------------------------------------------------------- Validate
$name    = clean($_POST['name']    ?? '');
$phone   = clean($_POST['phone']   ?? '');
$email   = clean($_POST['email']   ?? '');
$consent = $_POST['consent'] ?? '';

$errors = [];
if ($name === '')  { $errors[] = 'name'; }
if ($phone === '') { $errors[] = 'phone'; }
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) { $errors[] = 'email'; }
if (empty($consent)) { $errors[] = 'consent'; }
if ($errors) { respond(false, 'Please complete all required fields.', $isAjax); }

// ---------------------------------------------------------------- Build email
$fields = [
  'Name'              => $name,
  'Phone'             => $phone,
  'Email'            => $email,
  'Project Location'  => clean($_POST['location'] ?? ''),
  'Service Required'  => clean($_POST['service'] ?? ''),
  'Project Budget'    => clean($_POST['budget'] ?? ''),
  'Preferred Contact' => clean($_POST['preferred_contact'] ?? ''),
  'Project Details'   => trim($_POST['details'] ?? ''),
];

$body  = "New enquiry from the Vision Touch Ltd website\n";
$body .= "------------------------------------------------\n\n";
foreach ($fields as $label => $value) {
  if ($value !== '') { $body .= $label . ":\n" . $value . "\n\n"; }
}
$body .= "------------------------------------------------\n";
$body .= "Submitted: " . date('d M Y, H:i') . "\n";
$body .= "IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . "\n";

$headers  = 'From: ' . $FROM_NAME . ' <' . $FROM_EMAIL . ">\r\n";
$headers .= 'Reply-To: ' . $name . ' <' . $email . ">\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// ---------------------------------------------------------------- Send
$sent = @mail($TO, $SUBJECT, $body, $headers);

if ($sent) {
  respond(true, 'Thank you — your enquiry has been sent. We will be in touch shortly.', $isAjax);
} else {
  // mail() not configured on this host — tell the client so the JS can fall back to mailto.
  respond(false, 'Mail could not be sent from the server. Please email us directly.', $isAjax);
}
