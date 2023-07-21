<script src="/.ophose/d/jquery.js"></script>

<?php if (CONFIG["production_mode"]){ ?>

<script src="/.ophose/_js/js_bundle.js"></script>

<?php 
} else {
    ?>
<script src="/ophose/ophose.js"></script>
<script src="/ophose/js/html/render.js"></script>

<script src="/ophose/js/import.js"></script>
<script src="/ophose/js/script.js"></script>
<script src="/ophose/js/app.js"></script>
<script src="/ophose/js/event.js"></script>

<script src="/ophose/js/element/OphoseElement.js"></script>
<script src="/ophose/js/element/OphoseComponent.js"></script>
<script src="/ophose/js/element/OphoseModule.js"></script>
<script src="/ophose/js/element/OphosePage.js"></script>
<script src="/ophose/js/element/OphoseBase.js"></script>

<script src="/ophose/js/util/constant.js"></script>
<script src="/ophose/js/util/OphoseCut.js"></script>

<script src="/ophose/js/route/route.js"></script>

<script src="/ophose/js/rest/OphoseRest.js"></script>

<script src="/ophose/js/env/OphoseEnvironment.js"></script>

<script src="/ophose/js/dynamic/Live.js"></script>


<script src="/components/Base.js"></script>

<?php } ?>