<?php

/*Define Globals*/
define("BASEDIR",     __dir__);
define("BASEURL", ((strstr('https',$_SERVER['SERVER_PROTOCOL']) === false)?'http':'https').'://'.$_SERVER['HTTP_HOST'].(dirname($_SERVER['SCRIPT_NAME']) != '/' ? dirname($_SERVER["SCRIPT_NAME"]): '')); 


/*Get request Path*/
$path = substr($_SERVER["REQUEST_URI"], strlen((dirname($_SERVER['SCRIPT_NAME']) != '/' ? dirname($_SERVER["SCRIPT_NAME"]).'/' : '/')));
        
if(strpos($path, "?") !== false){
    $path = substr($path, 0, strpos($path, "?"));
}

$path = trim($path, "/");
if(!$path){$path = "index";}

/*Load Slides*/

/*Load view*/
require_once BASEDIR.'/view.php';