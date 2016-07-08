<?php ob_start(); ?>
<!DOCTYPE html>
<html>
  <head>
    <title>presentation.js</title>
    <meta charset="utf-8">
    <link href="<?php echo BASEURL ?>/public/css/presentation-theme.css" rel="stylesheet">
    <link href="<?php echo BASEURL ?>/public/css/style.css" rel="stylesheet">
    <link href="<?php echo BASEURL ?>/public/css/pdf.css" rel="stylesheet">
  </head>
  <body>

    <div class="page_wrapper">
        <div class="page">
            <section style="background-color: red">
                section 1
            </section>
            <section style="background-color: yellow">
                section 2
            </section>
            <section style="background-color: green">
                section 3
            </section>
        </div>
    </div>
  </body>
</html>

<?php
$html = ob_get_contents();
ob_end_clean();

//echo $html; exit();

require_once BASEDIR.'/dompdf/autoload.inc.php';
$options = array("enable_remote" => true, "enable_html5_parser" => true);
$dompdf = new Dompdf\Dompdf($options);
$dompdf->loadHtml($html);
$dompdf->setPaper('A4', 'portrait');
$dompdf->render();
$dompdf->stream();