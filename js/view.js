$(document).ready(function() {
    $('.collapsible').collapsible({
        accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
    var expanded = true;
    $('#collapsible-header').click(function() {
        requestAnimationFrame(function() {
            var icon = expanded ? 'expand_less' : 'expand_more';
            // var offset = expanded ? 400 : -400;
            $('#accordion_icon').html(icon);
            // map.panBy(offset,0);
            expanded = !expanded;
        });
    });

});
