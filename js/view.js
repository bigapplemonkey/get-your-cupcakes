var view = {
    // Initializes the view
    init: function() {
        var self = this;
        $(document).ready(function() {
            self.favoriteCountElem = $('#favoriteCount');
            self.nearCountElem = $('#nearCount');
            self.sortList = $('.sort-dropdown');
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
                    googleMap.closeInfoWindow();
                    var selectedTab = elem[0].id;
                    viewModel.searchString('');
                    $('input').blur();
                    if (selectedTab === 'favorites') {
                        viewModel.isTab1Selected(true);
                        requestAnimationFrame(function() { self.favoriteCountElem.removeClass('yellow lighten-3') });

                    } else {
                        viewModel.isTab1Selected(false);
                        requestAnimationFrame(function() { self.nearCountElem.removeClass('yellow lighten-3') });
                    }

                }
            });
        });
    },

    // Initializes the card elements
    initCardElems: function() {
        $(document).ready(function() {
            $('.materialboxed').materialbox();
        });
    },

    // Updates the favorites' counter
    updateFavoriteCounter: function(placeName) {
        this.favoriteCountElem.addClass('yellow lighten-3');
        var $toastContent = $('<span class="toast__text"><img src="images/smily-cupcake35.png" alt="" class="toast__image">' + placeName + ' added to favorites</span>');
        Materialize.toast($toastContent, 1400, 'rounded');
    },

    // Updates the near' counter
    updateNearCounter: function(placeName) {
        this.nearCountElem.addClass('yellow lighten-3');
        var $toastContent = $('<span class="toast__text"><img src="images/smily-cupcake35.png" alt="" class="toast__image">' + placeName + ' removed from favorites</span>');
        Materialize.toast($toastContent, 1400, 'rounded');
    },

    // Retrieves next photo in array
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

        requestAnimationFrame(function() {
            $imageElem.fadeOut(150, function() {
                $(this).attr('src', place.photos[index]).bind('onreadystatechange load', function() {
                    if (this.complete) $(this).fadeIn(150);
                });
            });
        });

        $imageElem.data('index', index);
    },

    // Displays element in the list
    showInList: function(placeID) {
        var self = this;
        if (!self.expanded) $('#collapsible-header').trigger('click');
        var $listHeader = $('#' + placeID + '_listHeader');
        var $listElem = $('#' + placeID + '_listElem');
        var $divScroll = $('#navigationContentBody');

        var elemHeight = $listHeader.height();
        var divScrollTop = $divScroll.scrollTop();

        if (!$listElem.hasClass('active')) $listHeader.trigger('click');

        var index = $listHeader.attr('data-index');
        var scrollTo = (elemHeight * index) - 5;

        if (divScrollTop > (scrollTo + 20) || divScrollTop < (scrollTo - 20)) {
            requestAnimationFrame(function() {
                $divScroll.animate({
                    scrollTop: scrollTo
                }, 800);
            });
        }
    },

    // Clears the search textbox
    clearInput: function() {
        viewModel.searchString('');
        requestAnimationFrame(function() { $('input').blur(); });
    },

    // Displays an error
    displayError: function(errorMessage) {
        requestAnimationFrame(function() {
            $('#errorMessage').html('<i class="material-icons error_icon">error_outline</i> ' + errorMessage);
            $('#preloader').fadeOut('slow');
        });
    },

    // Stops loader
    removeLoader: function() {
        $('#loader-wrapper').fadeOut('slow');
    },

    // Opens modal
    openModal: function() {
        $('#modal1').openModal();
    }

}
