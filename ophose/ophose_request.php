<?php
include_once("app/config/config.php");
include_once("app/request/request_processor.php");
?>

<html>

    <head>

        <?php include_once("app/dependencies/scripts.php"); ?>

        <style id="__ophose___page_style"></style>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <script>
        $(function() {
            route.go("<?php echo $REQUESTED_PAGE; ?>");
        });
        </script>

        <title><?php echo CONFIG["name"] ?></title>
    </head>

    <body>
        <noscript>
            <main
                style="width: 100vw; height: 100vh; position: fixed; z-index: 1000; background-color: black; top: 0; left: 0;">
                <h1
                    style="color: white; font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; text-align: center;">
                    JavaScript is required to run this application.</h1>
            </main>
        </noscript>

    </body>

</html>