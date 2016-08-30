var view = {
    init: function() {
        var self = this;
        $(document).ready(function() {
            self.favoriteCountElem = $('#favoriteCount');
            self.nearCountElem = $('#nearCount');

            var expanded = true;
            $('#collapsible-header').click(function() {
                requestAnimationFrame(function() {
                    var icon = expanded ? 'expand_less' : 'expand_more';
                    $('#accordion_icon').html(icon);
                    expanded = !expanded;
                });
            });

            $(".dropdown-button").dropdown();

            $('ul.tabs').tabs({
                onShow: function(elem) {
                    googleMap.closeInfoWindow();
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
    initCardElems: function() {
        $(document).ready(function() {
            $('.materialboxed').materialbox();
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
    },
    getNextPhoto: function(place, up) {
        var $imageElem = $('#' + place.placeID);
        var index = $imageElem.data('index');

        if (up) {
            ++index;
            if (index >= place.photos.length) index = 0;
        } else {
            --index;
            if (index < 0) index = place.photos.length - 1;
        }

        $imageElem.fadeOut(150, function() {
            $(this).attr('src', place.photos[index]).bind('onreadystatechange load', function() {
                if (this.complete) $(this).fadeIn(150);
            });
        });

        $imageElem.data('index', index);
    }
}
