$(function () {
    /**
     * Cart sidebar
     */
    $("body").on('click', '.btn-cart-sidebar', function (e) {
        e.preventDefault();
        showMiniCart();
    });

    $("body").on('click', '*[data-action="close-minicart"]', function (e) {
        e.preventDefault();
        closeMiniCart();
    });

    function showMiniCart(){
        $('body').toggleClass('show-cart-sidebar');
    }

    function closeMiniCart(){
        $('body').removeClass('show-cart-sidebar');
    }

    /**
     * Search popup
     */
    $("body").on('click', '.btn-search-popup', function (e) {
        e.preventDefault();
        showSearch();
    });

    $("body").on('click', '*[data-action="close-search"]', function (e) {
        e.preventDefault();
        closeSearch();
    });

    function showSearch(){
        $('body').toggleClass('show-search');
    }

    function closeSearch(){
        $('body').removeClass('show-search');
    }
    /* related posts slider */

  $(function () {
    $('.related-articles .owl-carousel').owlCarousel({
      loop: 0,
      autoplay: 0,
      margin: 30,
      nav: 1,
      dots: 0,
      responsive: {
        0: {
          items: 1,
        },
        481: {
            items: 2,
        },
        768: {
            items: 2,
        },
        992: {
            items: 3,
        },
        1200: {
            items: 3,
        },
        1441: {
            items: 3,
        },
        1681: {
            items: 3,
        },
        1921: {
            items: 3,
        }
      }
    });
  });

  $(function () {
    $('.partner-brand .owl-carousel').owlCarousel({
      loop: 0,
      autoplay: 0,
      margin: 30,
      nav: 1,
      dots: 0,
      responsive: {
        0: {
          items: 1,
        },
        481: {
            items: 2,
        },
        768: {
            items: 2,
        },
        992: {
            items: 3,
        },
        1200: {
            items: 3,
        },
        1441: {
            items: 3,
        },
        1681: {
            items: 3,
        },
        1921: {
            items: 3,
        }
      }
    });
  });

/* Mobile header */
function isEmpty( el ){
    return !$.trim(el.html())
}

function mobile_header(){
    if ($(window).width() <= 1024) {
        if (isEmpty($('#cart-mobile'))) { $('.header-desktop .header-cart.minicart-header').clone().appendTo('#cart-mobile'); }
        if (isEmpty($('#search-mobile'))) { $('.header-desktop .search-header #search-desktop').clone().appendTo('#search-mobile'); }
        if (isEmpty($('#menu-mobile'))) { $('.header-desktop .header-megamenu .megamenu-horizontal .horizontal-content').clone().appendTo('#menu-mobile'); }
    }
}
mobile_header();
var windowWidth = $(window).width();
$(window).on('resize', function(){
    // If the window width has changed...
    if(windowWidth != $(window).width()) {
        mobile_header();
    }
});

$("body").on('click', '#mobile-nav,.nav-mobile-overlay,.close-mobile', function () {
    $('body').toggleClass('show-nav-mobile');
});

$("#menu-mobile .menu-items >.item .btn-drop-mobile").on('click', function () {
    $(this).closest('.item').toggleClass('show-dropdown-menu');
});
if ($(window).width() <= 767) {
    
    $('.tab-container .list-tabs .tab-item.active .tab-title').clone().appendTo('.tabs-drop-mobile');
    $('.tabs-drop-mobile').on('click', function(){
        $(this).closest('.tab-container').toggleClass('active');
    });
    $('.tab-container .list-tabs .tab-item').on('click', function(){
        var tit = $(this).find('.tab-title').clone();
        $('.tabs-drop-mobile').html(tit);
        $(this).closest('.tab-container').removeClass('active');
    });
}


});