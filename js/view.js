var view = {
    init: function() {
        var self = this;
        $(document).ready(function() {
            self.favoriteCountElem = $('#favoriteCount');
            self.nearCountElem = $('#nearCount');
            // $('.collapsible').collapsible({
            //     accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
            // });

            var expanded = true;
            $('#collapsible-header').click(function() {
                requestAnimationFrame(function() {
                    var icon = expanded ? 'expand_less' : 'expand_more';
                    $('#accordion_icon').html(icon);
                    expanded = !expanded;
                });
            });

            // $('select').material_select();
            $(".dropdown-button").dropdown();

            $('ul.tabs').tabs({
                onShow: function(elem) {
                    closeInfoWindow();
                    var selectedTab = elem[0].id;
                    viewModel.searchString('');
                    $('input').blur();
                    if (selectedTab === 'favorites') {
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

    initCarousel: function() {
        $(document).ready(function() {
            $('.carousel').carousel({
                dist: 0,
                shift: 0,
                padding: 20
            });
        });
    },
    initTooltips: function() {
        $(document).ready(function() {
            $('.tooltipped').tooltip({ delay: 30 });
        });
    },
    updateFavoriteCounter: function(placeName) {
        this.favoriteCountElem.addClass('light-green lighten-1');
        var $toastContent = $('<span class="teal-text text-lighten-1"><img src="images/smily-cupcake35.png" alt="" class="toast__image">' + placeName + ' added to favorites!</span>');
        Materialize.toast($toastContent, 1400, 'rounded');
    },
    updateNearCounter: function(placeName) {
        this.nearCountElem.addClass('yellow lighten-3');
        var $toastContent = $('<span class="teal-text text-lighten-1"><img src="images/smily-cupcake35.png" alt="" class="toast__image">' + placeName + ' removed from favorites!</span>');
        Materialize.toast($toastContent, 1400, 'rounded');
    }
}
