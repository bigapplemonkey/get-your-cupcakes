var view = {
    init: function() {
        $(document).ready(function() {
            $('.collapsible').collapsible({
                accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
            });

            var expanded = true;
            $('#collapsible-header').click(function() {
                requestAnimationFrame(function() {
                    var icon = expanded ? 'expand_less' : 'expand_more';
                    $('#accordion_icon').html(icon);
                    expanded = !expanded;
                });
            });

            $('select').material_select();

            $('ul.tabs').tabs({
                onShow: function(elem) {
                    closeInfoWindow();
                    var selectedTab = elem[0].id;
                    viewModel.searchString('');
                    $('input').blur();
                    if (selectedTab === 'test1') viewModel.isTab1Selected(true);
                    else viewModel.isTab1Selected(false);

                }
            });

        });
    }
}
