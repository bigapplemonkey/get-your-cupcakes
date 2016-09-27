var view = {
    init: function() {
        var self = this;
        $(document).ready(function() {
            self.favoriteCountElem = $('#favoriteCount');
            self.nearCountElem = $('#nearCount');
            self.sortList = $('.sort-dropdown');

            // if (viewModel.filteredFavoriteList().length < 3) {
            //     $('#footerImage').addClass('fix-image');
            // }

            self.expanded = true;
            $('#collapsible-header').click(function() {
                requestAnimationFrame(function() {
                    var icon = 'expand_more';
                    if (self.expanded) {
                        icon = 'expand_less';
                        self.sortList.fadeOut(150);
                    } else {
                        self.sortList.fadeIn(150);
                    }
                    $('#accordion_icon').html(icon);
                    self.expanded = !self.expanded;
                });
            });

            var viewPortWidth = $(window).width();
            if (viewPortWidth < 501) $('#collapsible-header').trigger('click');

            $(window).resize(function() {
                var viewPortWidth = $(window).width();
                if (viewPortWidth > 500 && !self.expanded) $('#collapsible-header').trigger('click');

            });

            $(".dropdown-button").dropdown();

            $('ul.tabs').tabs({
                onShow: function(elem) {
                    // $('#footerImage').removeClass('fix-image');
                    googleMap.closeInfoWindow();
                    var selectedTab = elem[0].id;
                    viewModel.searchString('');
                    $('input').blur();
                    if (selectedTab === 'favorites') {
                        viewModel.isTab1Selected(true);
                        self.favoriteCountElem.removeClass('yellow lighten-3');
                        // if (viewModel.filteredFavoriteList().length < 3) {
                        //     $('#footerImage').addClass('fix-image');
                        // }
                    } else {
                        // if (viewModel.filteredNearList().length < 3) {
                        //     $('#footerImage').addClass('fix-image');
                        // }
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
        this.favoriteCountElem.addClass('yellow lighten-3');
        var $toastContent = $('<span class="toast__text"><img src="images/smily-cupcake35.png" alt="" class="toast__image">' + placeName + ' added to favorites</span>');
        Materialize.toast($toastContent, 1400, 'rounded');
    },
    updateNearCounter: function(placeName) {
        this.nearCountElem.addClass('yellow lighten-3');
        var $toastContent = $('<span class="toast__text"><img src="images/smily-cupcake35.png" alt="" class="toast__image">' + placeName + ' removed from favorites</span>');
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
    },
    showInList: function(placeID) {
        var self = this;
        if (!self.expanded) $('#collapsible-header').trigger('click');
        var $listHeader = $('#' + placeID + '_listHeader');
        var $listElem = $('#' + placeID + '_listElem');
        var $divScroll = $("#ladilla2");

        var elemHeight = $listHeader.height();
        var divScrollTop = $divScroll.scrollTop();

        if (!$listElem.hasClass('active')) $listHeader.trigger('click');

        var index = $listHeader.attr('data-index');
        var scrollTo = (elemHeight * index) - 5;

        if (divScrollTop > (scrollTo + 20) || divScrollTop < (scrollTo - 20)) {
            $divScroll.animate({
                scrollTop: scrollTo
            }, 800);
        }
    },
    clearInput: function() {
        viewModel.searchString('');
        $('input').blur();
    },
    displayError: function(errorMessage) {
        $('#errorMessage').html('<i class="material-icons error_icon">error_outline</i> ' + errorMessage);
        $('#preloader').fadeOut('slow');
    }

}
