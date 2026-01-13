$(function () {
    $('body').on('click', '.megamenu-btn', function () {
        $('.megamenu-vertical').toggleClass('show-all');
    });

    $('body').on('click', '.btn-mega-mobile', function () {
        $('html').toggleClass('show-bs-megamenu');
    });

    $('body').on('click', '.megamenu-overlay', function () {
        $('html').removeClass('show-bs-megamenu');
    });

    $('body').on('click', '.btn-drop-mobile', function () {
        $(this).closest('.item').toggleClass('active');
    });
    function moveMegamenuToMobile(){
        var doc_width = $(window).width();

        if (doc_width <= 1023) {
            var horizontalMegaMenu = $('div[data-mega-desktop="horizontal"] .menu-items');
            var verticalMegaMenu = $('div[data-mega-desktop="vertical"] .menu-items');
            $('div[data-mega-mobile="horizontal"]').append(horizontalMegaMenu);
            $('div[data-mega-mobile="vertical"]').append(verticalMegaMenu);
        } else {
            var horizontalMegaMenu = $('div[data-mega-mobile="horizontal"] .menu-items');
            var verticalMegaMenu = $('div[data-mega-mobile="vertical"] .menu-items');
            $('div[data-mega-desktop="horizontal"]').append(horizontalMegaMenu);
            $('div[data-mega-desktop="vertical"]').prepend(verticalMegaMenu);
        }
        
    }

    moveMegamenuToMobile();

    $(window).resize(function () {
        moveMegamenuToMobile();
    });
});