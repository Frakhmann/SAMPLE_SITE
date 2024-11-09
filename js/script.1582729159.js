Number.prototype.formatMoney = function(n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? ' ' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$& ');
};

function setMailHandler(formSelector, formLink, externalMessage) {
    var $form = $(formSelector);

    $form.on('submit', function(e) {
        $form.find('input, textarea').removeClass('error');
        $form.find('.arrow_box').remove();

        $.post(formLink,
            $form.serialize(),
            function(res) {
                switch (res.status) {
                    case 'wrong':
                        var fieldNames = [];
                        $.each(res.fields, function(id, val) {
                            var $field = $form.find('[name=' + val + ']');
                            if ($field.length > 0) {
                                $field.addClass('error');
                                var $error = $('<span></span>');
                                $error.addClass('arrow_box');
                                $error.addClass('field_' + val);
                                $error.text(res.message[val]);
                                $field.before($error);
                            }
                        });
                        setTimeout(function() {
                            $('.arrow_box').fadeOut('fast', function() {
                                $(this).remove();
                            });
                        }, 5000);
                        break;

                    case 'error':
                        alert(res.message);
                        break;

                    default:
                        if (externalMessage) {
                            $(externalMessage).html(res.message).fadeIn();
                            $('input', $form).val('');
                        } else {
                            $('.form-body', $form).hide().after('<div class="success">' + res.message + '</div>');
                        }
                }
            },
            'json'
        );
        return false;
    });
}
$(document).ready(function() {
    $('.catalog-slide-wrapper').each(function() {
        $('.catalog-item', this).matchHeight();
    });

    var $thumbsSlider = $('.thumbs-slider');
    if ($thumbsSlider.size() > 0) {
        $('.thumbs-slider').slick({
            autoplay: true,
            autoplaySpeed: 2000,
            prevArrow: $('#thumbsPrev'),
            nextArrow: $('#thumbsNext'),
            dots: false,
            infinite: true,
            speed: 500,
            swipeToSlide: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            responsive: [{
                breakpoint: 505,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    speed: 300
                }
            }]
        }).on('swipe', function() {
            $(this).addClass('on-drag');
        }).on('afterChange', function() {
            $(this).removeClass('on-drag');
        });
        $('.thumbs-slider .slick-slide').click(function(e) {
            e.preventDefault();
            if ($('.thumbs-slider').hasClass('on-drag')) {
                return false;
            }
            var src = $(this).attr('href');
            $('#image-preview').attr('src', src);
        });
    }

    var $catalogSlideWrapper = $('.catalog-slide-wrapper');
    slick_slider();
    $(window).resize(slick_slider);

    function slick_slider() {
        if ($catalogSlideWrapper.size() > 0) {
            $('.catalog-slide-wrapper').not('.slick-initialized').slick({
                dots: false,
                infinite: true,
                speed: 800,
                slidesToShow: 3,
                slidesToScroll: 3,
                responsive: [{
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3
                        }
                    },
                    {
                        breakpoint: 750,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2,
                            speed: 500
                        }
                    },
                    {
                        breakpoint: 505,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            speed: 300
                        }
                    },
                    {
                        breakpoint: 500,
                        settings: "unslick"
                    }
                ]
            });
        }
    }

    $('.mobile-btn').on('click', function(e) {
        e.preventDefault();
        $('.m-contact').removeClass('mobile-menu-show');
        $('.m-menu').toggleClass('mobile-menu-show');
    });
    $('.phone-btn').on('click', function(e) {
        e.preventDefault();
        $('.m-menu').removeClass('mobile-menu-show');
        $('.m-contact').toggleClass('mobile-menu-show');
    });
    $('.btn-close, .mobile-menu-overlay').on('click', function(e) {
        e.preventDefault();
        var $parent = $(this).closest('.mobile-menu');
        if ($parent.hasClass('m-menu')) {
            $('.mobile-btn').trigger('click');
        } else {
            $('.phone-btn').trigger('click');
        }
    });
    $(window).resize(function() {
        $('.m-menu,.m-contact').removeClass('mobile-menu-show');
    });

    var countTimer, speed = 300,
        inputCount = $('.count');
    if (inputCount.size() > 0) {
        $(document).on('click', '.btn-increase', function(e) {
            e.preventDefault();
            clearInterval(countTimer);
        });
        $(document).on('mousedown', '.btn-increase', function(e) {
            e.preventDefault();
            if (countTimer) {
                clearInterval(countTimer);
            }
            incrementCounter();
            countTimer = setInterval(incrementCounter, speed);
        });

        $(document).on('click', '.btn-decrease', function(e) {
            e.preventDefault();
            clearInterval(countTimer);
        });
        $(document).on('mousedown', '.btn-decrease', function(e) {
            e.preventDefault();
            if (countTimer) {
                clearInterval(countTimer);
            }
            decrementCounter();
            countTimer = setInterval(decrementCounter, speed);
        });

        // Увеличиваем счетчик
        function incrementCounter() {
            var prevVal = parseInt(inputCount.val());
            $(inputCount).val(prevVal + 1 + " м2");
            $(inputCount).trigger('change');
        }

        // Уменьшаем счетчик
        function decrementCounter() {
            var prevVal = parseInt(inputCount.val());
            if (prevVal > 1) {
                $(inputCount).val(prevVal - 1 + " м2");
                $(inputCount).trigger('change');
            }
        }

        $('.count').on('change', function() {
            var val = parseInt(inputCount.val());
            var price = parseInt($('.product-price').text().replace(/\D/, ''));
            $('#total').text((val * price).formatMoney(0));
            $('.product-order').attr('data-quantity', val);
        }).on('focus', function() {
            var val = parseInt(inputCount.val());
            inputCount.val(val);
        }).on('blur', function() {
            var val = parseInt(inputCount.val());
            inputCount.val(val + " м2");
        });
    }
    $('.m-catalog').on('click', function() {
        var top = $('#catalog-index').offset().top;
        $('html, body').stop().animate({
            scrollTop: top
        }, 1000);
    });
    $('.catalog-item').matchHeight();

    $('.product-order').on('click', function(e) {
        e.preventDefault();
        $.fancybox.open({
            src: '#form-popup',
            type: 'inline',
            touch: false,
            opts: {
                touch: false,
            },
            afterClose: function() {
                $("#form-popup .form-body").show();
                $("#form-popup .success").remove();
            }
        });
    });
    $(document).on('click', '#form-popup .b-btn', function(e) {
        e.preventDefault();
        var $form = $(this).closest('form');
        $form.submit();
    });
    $(document).on('click', '.popup-layout-close', function(e) {
        e.preventDefault();
        $.fancybox.close();
    });
    setMailHandler('#form-popup', '/mail/index.php');
});