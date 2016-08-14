var view = {
    init: function() {
        var self = this;
        $(document).ready(function() {
            self.favoriteCountElem = $('#favoriteCount');
            self.nearCountElem = $('#nearCount');
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
                    if (selectedTab === 'test1') {
                        viewModel.isTab1Selected(true);
                        self.favoriteCountElem.removeClass('light-green lighten-1');
                    } else {
                        viewModel.isTab1Selected(false);
                        self.nearCountElem.removeClass('yellow lighten-3');
                    }

                }
            });

        });
    },
    updateFavoriteCounter: function(placeName) {
        this.favoriteCountElem.addClass('light-green lighten-1');
        Materialize.toast(placeName + ' added to favorites!', 1500, 'rounded');
    },
    updateNearCounter: function(placeName) {
        this.nearCountElem.addClass('yellow lighten-3');
        Materialize.toast(placeName + ' removed from favorites!', 1500, 'rounded');
    }
}
