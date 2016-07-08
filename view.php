<!DOCTYPE html>
<html>
  <head>
    <title>presentation.js</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    
    <link href="<?php echo BASEURL ?>/public/css/presentation.css" rel="stylesheet">
    <link href="<?php echo BASEURL ?>/public/css/style.css" rel="stylesheet">
    
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
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
      
      <script type="text/javascript" src="<?php echo BASEURL ?>/public/js/presentation.js"></script>      
      <script type="text/javascript">
          var p_screen = new presentation_screen();
          p_screen.on("init_end", function(){console.log("init_end");});
          p_screen.on("layout_start", function(){console.log("layout_start");});
          p_screen.on("layout_end", function(){console.log("layout_end");});
          p_screen.init();
          
          var p_slides = new presentation_slides();
          p_slides.init();
          
//          setInterval(function(){
//              p_slides.next();
//          },2000)
          
      </script>
  </body>
</html>