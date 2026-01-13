(function($) {
  $(document).ready(function() {
    bzo_bs.init();
  });

  if ($(".block-layered-nav")) {
    History.Adapter.bind(window, 'statechange', function() {
      var State = History.getState();
      if (!bzo_bs.isFilterAjaxClick) {
        bzo_bs.shopifyParam();
        var newurl = bzo_bs.sidebarCreateUrl();
        bzo_bs.ajaxGetContent(newurl);
        bzo_bs.reActivateSidebar();
      }
      bzo_bs.isFilterAjaxClick = false;
    });
  }

  var bzo_bs = {
    isFilterAjaxClick: false,
    loadingtimeout: null,
    init: function() {
      this.shopifyParam();
      this.initSidebar();
      this.initToolbar();

      $('.filter-tags dd > ol').each(function() {
        if (!$(this).children().length) {
          $(this).closest('dl').css('display', 'none');
          $(this).parents('dd').css('display', 'none');
          $(this).parents('dd').prev().css('display', 'none');
        }
      })
    },
    initSidebar: function() {
      if ($(".block-layered-nav").length > 0) {
        bzo_bs.typeEvents();
        bzo_bs.filterClear();
        bzo_bs.sidebarModeView();
      }
    },
    shopifyParam: function() {
      Shopify.queryParams = {};
      if (location.search.length) {
        for (var aKeyValue, i = 0, aCouples = location.search.substr(1).split('&'); i < aCouples.length; i++) {
          aKeyValue = aCouples[i].split('=');
          if (aKeyValue.length > 1) {
            Shopify.queryParams[decodeURIComponent(aKeyValue[0])] = decodeURIComponent(aKeyValue[1]);
          }
        }
      }
    },
    initToolbar: function() {
      if (Shopify.queryParams.sort_by) {
        var sortValue = Shopify.queryParams.sort_by;
        $(".filters-toolbar__input--sort option[value='"+sortValue+"']").attr("selected","selected");
      }
    },
    sidebarModeView: function() {
      $(".filters-toolbar-wrapper .changeView").click(function(e) {
        if (!$(this).hasClass("active")) {
          var paging = $(".filter-show > button span").text();
          if ($(this).data("view") == 'list') {
            Shopify.queryParams.view = "list" + paging;
          }
          else {
            Shopify.queryParams.view = paging;
          }
          bzo_bs.ajaxClick();
          $(".filters-toolbar-wrapper .changeView").removeClass("active");
          $(this).addClass("active");
        }
        e.preventDefault();
      })
    },
    initSortbyEvent: function() {
      $(document).on('change', '.filters-toolbar .filters-toolbar__input--sort', function(e) {
        Shopify.queryParams.sort_by = $(this).val();
        bzo_bs.ajaxClick();
        $(".filters-toolbar__input--sort option[value='"+$(this).val()+"']").attr("selected","selected");
        e.preventDefault();
      });
    },
    initCountProduct: function() {

    },
    sidebarCreateUrl: function(baseLink) {
      var newQuery = $.param(Shopify.queryParams).replace(/%2B/g, '+');
      if (baseLink) {
        if (newQuery != "")
          return baseLink + "?" + newQuery;
        else
          return baseLink;
      }
      return location.pathname + "?" + newQuery;
    },
    typeEvents: function() {
      bzo_bs.filterByTags();
      bzo_bs.initSortbyEvent();
      bzo_bs.initCountProduct();
    },
    filterByTags: function() {
      $('.filter-tags dd ol li a:not(".clear"), .filter-tags dd ol li label').click(function(e) {
        var currentTags = [];
        if (Shopify.queryParams.constraint) {
          currentTags = Shopify.queryParams.constraint.split('+');
        }

        if (!window.enable_sidebar_multiple_choice && !$(this).prev().is(":checked")) {
          var otherTag = $(this).parent('.filter-tags').find("input:checked");
          if (otherTag.length > 0) {
            var tagName = otherTag.val();
            if (tagName) {
              var tagPos = currentTags.indexOf(tagName);
              if (tagPos >= 0) {
                currentTags.splice(tagPos, 1);
              }
            }
          }
        }

        var tagName = $(this).prev().val();
        if (tagName) {
          var tagPos = currentTags.indexOf(tagName);
          if (tagPos >= 0) {
            currentTags.splice(tagPos, 1);
          } else {
            currentTags.push(tagName);
          }
        }
        if (currentTags.length) {
          Shopify.queryParams.constraint = currentTags.join('+');
        } else {
          delete Shopify.queryParams.constraint;
        }
        bzo_bs.ajaxClick();
        e.preventDefault();
      });
    },
    ajaxClick: function(baseLink) {
      delete Shopify.queryParams.page;
      var newurl = bzo_bs.sidebarCreateUrl(baseLink);
      bzo_bs.isFilterAjaxClick = true;
      History.pushState({
        param: Shopify.queryParams
      }, newurl, newurl);
      bzo_bs.ajaxGetContent(newurl);
    },
    ajaxGetContent: function(newurl) {
      $.ajax({
        type: 'get',
        url: newurl,
        beforeSend: function() {
          bzo_bs.showLoading();
        },
        success: function(data) {
          bzo_bs.hideLoading();
          bzo_bs.pageData(data);
          bzo_bs.filterByTags();
          bzo_bs.filterClear();
		  
          $('.filter-tags dd > ol').each(function() {
            if (!$(this).children().length) {
              $(this).closest('dl').css('display', 'none');
              $(this).parents('dd').css('display', 'none');
              $(this).parents('dd').prev().css('display', 'none');
            }
          })
        },
        error: function(xhr, text) {
          bzo_bs.hideLoading();
        }
      });
    },
    pageData: function(data) {
      var content = $(data).find(".col-main #products-listing").html();
      $('#products-listing').html(content);
      var count = $('#products-listing .product-item').length;
      $('.products-total').html(count + '<span> items</span>');
      $('body').removeClass('show-filter');
	  ajaxify();
      
      //replace paging
      if ($(".padding").length > 0) {
        $(".padding").replaceWith($(data).find(".padding"));
      } else {
        $(".col-main").append($(data).find(".padding"));
      }
      //gallery product
      $('.product-card__gallery .item-img').on("mouseover touchstart", function (e) {
        $(this).addClass('thumb-active').siblings().removeClass('thumb-active');
        var thumb_src = $(this).attr("data-src");
        $(this).closest('.product-item-container').find('.img-responsive.s-img').attr("src",thumb_src);
      });
      var currentHeader = $(".collection_info");
      var dataHeader = $(data).find(".collection_info");
      if (currentHeader.find("h3.page-title").text() != dataHeader.find("h3.page-title").text()) {
        currentHeader.find("h3.page-title").replaceWith(dataHeader.find("h3.page-title"));
      }

      var currentDes = $(".collection-des");
      var dataDes = $(data).find(".collection-des");		
      if (currentDes.length) {
        if (dataDes.length) {
          currentDes.html(dataDes);
        } else {
          currentDes.hide();
        }
      } else {
        currentHeader.append('<div class="collection-des"></div>');
        currentDes.html(dataDes);
      }

      if (Shopify.queryParams.sort_by) {
        var sortValue = Shopify.queryParams.sort_by;
        $(".filters-toolbar__input--sort option[value='"+sortValue+"']").attr("selected","selected");
      }

      //replace tags
      $(".filter-tags").replaceWith($(data).find(".filter-tags"));

      //product review
      if ($(".spr-badge").length > 0) {
        return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
      }
    },

    filterClear: function() {
      $(".filter-tags dd ol li").each(function() {
        var sidebarTag = $(this);
        if (sidebarTag.find("input:checked").length > 0) {
          //has active tag
          sidebarTag.parent().parent().prev().find(".clear").show().click(function(e) {
            var currentTags = [];
            if (Shopify.queryParams.constraint) {
              currentTags = Shopify.queryParams.constraint.split('+');
            }
            sidebarTag.find("input:checked").each(function() {
              var selectedTag = $(this);
              var tagName = selectedTag.val();
              if (tagName) {
                var tagPos = currentTags.indexOf(tagName);
                if (tagPos >= 0) {
                  //remove tag
                  currentTags.splice(tagPos, 1);
                }
              }
            });
            if (currentTags.length) {
              Shopify.queryParams.constraint = currentTags.join('+');
            } else {
              delete Shopify.queryParams.constraint;
            }
            bzo_bs.ajaxClick();
            e.preventDefault();
          });
        }
      });
    },
    reActivateSidebar: function() {
      $(".filter-category .active").removeClass("active");
      $(".filter-tags input:checked").attr("checked", false);

      //category
      var cat = location.pathname.match(/\/collections\/(.*)(\?)?/);
      if (cat && cat[1]) {
        $(".filter-category a[href='" + cat[0] + "']").addClass("active");
      }
    },
    showLoading: function() {
      $('.bs-loading').show();
    },
    hideLoading: function() {
      $('.bs-loading').hide();
    }
  }
  })(jQuery);