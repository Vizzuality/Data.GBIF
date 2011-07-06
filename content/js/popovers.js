/*
* =============
* HELP POPOVER
* =============
*/

var helpPopover = (function() {
  var el;
  var displayed = false;
  var $popover;
  var transitionSpeed = 150;
  var title;
  var message;

  var template="<div class='yellow_popover'><div class='t'></div><div class='c'><h3><%= title %></h3><%= message %></div><div class='b'></div></div>";

  function toggle(e, event, opt) {
    event.stopPropagation();
    event.preventDefault();

    if (opt) {
      title   = opt.title;
      message = opt.message;
    }

    el = e;
    displayed ? hide(): show();
  }

  function hide() {
    if (displayed) {
      $('html').unbind("click");
      $popover.animate({top:$popover.position().top - 20,opacity:0}, transitionSpeed, function() { $popover.remove(); displayed = false; });
    }
  }

  function show() {
    var rendered_template = _.template(template, { title: title, message: message });
    $("#content").prepend(rendered_template);

    $popover = $(".yellow_popover");
    // don't do anything if we click inside of the select…
    $popover.click(function(event) {
      event.stopPropagation();
    });

    // … but clicking anywhere else closes the popover
    $('html').click(function() {
      displayed && hide();
    });

    // get the coordinates and width of the popover
    var x = el.offset().left;
    var y = el.offset().top ;
    var w = $popover.width();
    var h = $popover.height();

    // center the popover
    $popover.css("left", x - w/2 + 7);
    $popover.css("top", y - h - 10);

    $popover.animate({top: y-h,opacity:1}, transitionSpeed, function() { displayed = true; });
  }

  return {
    toggle: toggle
  };
})();

/*
* =============
* SELECT BOX
* =============
*/

var selectBox = (function() {
  var el;
  var selectedOptionText = "";
  var displayed = false;
  var $popover;
  var transitionSpeed = 200;

  function toggle(e, event, opt) {
    event.stopPropagation();

    el = e;

    if (opt) {
      transitionSpeed = opt.transitionSpeed;
      transitionSpeed = opt.transitionSpeed;
    }

    displayed ? hide(): show();
  }

  function select_option(option_text) {
    selectedOptionText = option_text;
    $popover.find("a").removeClass("selected");
    var selected_option = $('a *:contains('+selectedOptionText+')');
    selected_option.parent().addClass("selected");
  }

  function hide() {
    $('html').unbind("click");
    el.removeClass("selected");
    displayed = false;
  }

  function show() {
    el.toggleClass("selected");
    el.find('ul').jScrollPane({ verticalDragMinHeight: 20});
    displayed = true;

    // don't do anything if we click inside of the select…
    el.find('.listing, .jspVerticalBar').click(function(event) {
      event.stopPropagation();
    });

    // … but clicking anywhere else closes the popover
    $('html').click(function() {
      displayed && hide();
    });

    el.find("li").unbind("click");
    el.find("li").click(function(event) {
      var text = $(this).text();

      el.find("li").removeClass("selected");
      $(this).addClass("selected");

      if (text != selectedOptionText) {
        el.find("div.selected_option span").animate({ color: "#FFFFFF" }, transitionSpeed, function(){
          el.find("div.selected_option span").text(text);
          el.find("div.selected_option span").animate({ color: "#333" }, transitionSpeed);
        });
      }
      selectedOptionText = text;
      $("input#country").val(selectedOptionText);
      hide();
    });
  }

  return {
    toggle: toggle
  };
})();

/*
* =============
*  FILTER POPOVER
* =============
*/

var filterPopover = (function() {
  var el;
  var displayed = false;
  var instantiated;
  var $popover;
  var count = 0;

  var templates = {
  add: '<a href="#" class="filter add_more">Add more</a>',
  remove: '<div class="filter_delete"></div>',
  list: '<div class="select-filter">\
    <div class="arrow"></div>\
    <div class="listing">\
        <div class="inner">\
        <ul>\
          <li><a href="#">Value A</a></li>\
          <li><a href="#">Value B</a></li>\
          <li><a href="#">Value C</a></li>\
          <li><a href="#">Value D</a></li>\
          <li><a href="#">Value E</a></li>\
          <li><a href="#">Value F</a></li>\
          <li><a href="#">Value G</a></li>\
        </ul>\
      </div>\
      </div>\
    </div>'};

  function initialize() {
    console.log("initialized");
    $("#content").prepend(templates.list);
    return true;
  }

  function toggle(e, event) {
    event.stopPropagation();
    event.preventDefault();
    el = e;

    if (!instantiated){
      instantiated = initialize();
    }
    displayed ? hide(): show();
  }

  function hide() {
    $('html').unbind("click");
    $popover.find("li a").unbind("click");
    $popover.find("li a").die("click");
    $popover.slideUp("fast", function() { displayed = false; });
  }

  function select(selected) {
    el.html(selected + templates.remove);
    el.removeClass("add_more");
    el.addClass("filter_selected");

    el.bind("click", function(event){
      event.preventDefault();
   //   $(this).fadeOut("slow", function() { remove();});
    });
  }

  function show() {
    $popover = $(".select-filter");

    // don't do anything if we click inside of the select…
    $popover.click(function(event) {
      event.stopPropagation();
    });

    $popover.find("li a").click(function(event) {
      event.preventDefault();
      event.stopPropagation();

      displayed && hide();

      var selected = $(this).html();

      $(this).hide("slow");

      if (count == 0) {
        el.hide();
        el.after('<ul class="values"></ul>');
        $("ul.values").append('<li class="filter_remove"><div class="value">'+selected+'<span class="remove"></span></div></li>');
        $("ul.values").after(templates.add);
      } else {
        $("ul.values").append('<li class="filter_remove"><div class="value">'+selected+'<span class="remove"></span></div></li>');
      }

      count++;

     // el.die("click");
     // el.unbind("click");
     // el.removeClass("filter");

      //select(selected);

     // el.after(templates.add);

      //$(".add_more").die("click");
      //$(".add_more").bindFilterPopover();
    });

    $popover.find(".arrow").click(function(event) {
      displayed && hide();
    });

    // … but clicking anywhere else closes the popover
    $('html').click(function() {
      displayed && hide();
    });

    // get the coordinates and width of the popover
    var x = el.offset().left;
    var y = el.offset().top;
    var w = $popover.width();

    console.log(x, w);

    // center the popover
    $popover.css("left", x + Math.floor(el.width() / 2) - 9 - Math.floor(w/2) + 9);
    $popover.css("top", y - 2);

    $popover.slideDown("fast", function() { displayed = true; });
    $popover.find('ul').jScrollPane({ verticalDragMinHeight: 20});
  }

  return {
    toggle: toggle
  };
});

/*
* =============
*  LINK POPOVER
* =============
*/

var linkPopover = (function() {
  var el;
  var displayed = false;
  var $popover;

  var template = '<div class="white_narrow_popover">\
    <div class="arrow"></div>\
      <ul>\
        <li class="first"><a href="/countries/index.html"><span>Countries</span></a></li>\
          <li><a href="/members/index.html"><span>GBIF network</span></a></li>\
            <li><a href="/areas/index.html"><span>Areas</span></a></li>\
              <li><a href="/stats/index.html"><span>Stats</span></a></li>\
                <li class="last"><a href="/static/about.html"><span>About</span></a></li>\
                  </ul>\
                    </div>';

  function toggle(e, event) {
    event.stopPropagation();
    event.preventDefault();
    el = e;
    displayed ? hide(): show();
  }

  function hide() {
    $('html').unbind("click");
    $popover.slideUp("fast", function() { $popover.remove(); displayed = false; });
  }

  function show() {
    $("#content").prepend(template);
    $popover = $(".white_narrow_popover");

    // clicking anywhere closes the popover
    $('html').click(function() {
      displayed && hide();
    });

    // get the coordinates and width of the popover
    var x = el.find("span").offset().left;
    var y = el.find("span").offset().top;
    var w = $(".white_narrow_popover").width();

    // center the popover
    $popover.css("left", x - w/2 + 4);
    $popover.css("top", y - 5);

    $popover.slideDown("fast", function() { displayed = true; });
  }

  return {
    toggle: toggle
  };
})();

/*
* =============
* SORT POPOVER
* =============
*/

var sortPopover = (function() {
  var el;
  var selectedOptionText = "Sort by relevance";
  var displayed = false;
  var $popover;

  var template = '<div class="white_popover">\
    <div class="arrow"></div>\
      <ul>\
        <li class="first"><a href="#" class="relevance"><span>Sort by relevance</span></a></li>\
          <li><a href="#" class="occurrence"><span>Sort by ocurrence</span></a></li>\
            <li class="last"><a href="#" class="size"><span>Sort by size</span></a></li>\
              </ul>\
                </div>';

  function toggle(e, event) {
    event.stopPropagation();
    event.preventDefault();
    el = e;
    displayed ? hide(): show();
  }

  function select_option(option_text) {
    selectedOptionText = option_text;
    $popover.find("a").removeClass("selected");
    var selected_option = $('a *:contains('+selectedOptionText+')');
    selected_option.parent().addClass("selected");
  }

  function hide() {
    $('html').unbind("click");
    $popover.slideUp("fast", function() { $popover.remove(); displayed = false; });
  }

  function show() {
    $("#content").prepend(template);
    $popover = $(".white_popover");

    // clicking anywhere closes the popover
    $('html').click(function() {
      displayed && hide();
    });

    $popover.find("a").click(function(event){
      event.preventDefault();
      select_option($(this).text());
      el.html(selectedOptionText + "<span class='more'></span>");
      hide();
    });

    select_option(selectedOptionText);

    // get the coordinates and width of the popover
    var x = el.find("span").offset().left;
    var y = el.find("span").offset().top;
    var w = $(".white_popover").width();

    // center the popover
    $popover.css("left", x - w/2 + 4);
    $popover.css("top", y - 5);

    $popover.slideDown("fast", function() { displayed = true; });
  }

  return {
    toggle: toggle
  };
})();

/*
* =============
* LOGIN POPOVER
* =============
*/

var loginPopover = (function() {
  var displayed = false;
  var $login;
  var el;
  var explanation = "";
  var transitionSpeed = 200;

  var template = "<article id='login' class='infowindow login'>\
    <header></header>\
      <span class='close'></span>\
        <div class='content'>\
          <h2>SIGN IN TO GBIF</h2>\
            <p>You need to log in GBIF in order to download the data.</p>\
              <form autocomplete='off'>\
                <div class='light_box'>\
                  <div class='field'>\
                    <h3>Email</h3>\
                      <span class='input_text'>\
                        <input id='email' name='email' type='text' />\
                          </span>\
                            </div>\
                              <div class='field'>\
                                <h3>Password</h3>\
                                  <span class='input_text'>\
                                    <input id='password' name='password' type='password' />\
                                      </span>\
                                        </div>\
                                          <div class='tl'></div><div class='tr'></div><div class='bl'></div><div class='br'></div>\
                                            </div>\
                                              <span class='recover_password'><a href='#' title='Recover your password'>Forgot your password?</a></span>\
                                                <button type='submit' class='candy_blue_button'><span>Login</span></button>\
                                                  </form>\
                                                    <div class='footer'>Do yo need to Sign up? <a href='/user/register/step0.html' title='Create your account'>Create your account</a></div>\
                                                      </div>\
                                                        <footer></footer>\
                                                          </article>";

  function toggle(e, event, opt) {
    event.stopPropagation();
    event.preventDefault();
    el = e;

    displayed ? hide(): show();
  }

  function getTopPosition() {
    return (( $(window).height() - $popover.height()) / 2) + $(window).scrollTop();
  }

  function setupBindings() {

    $popover.find("button").click(function(event) {
      event.preventDefault();
      displayed && hide();
    });

    $popover.find(".footer a, span.recover_password a").click(function(event) {
      event.preventDefault();
      displayed && hide(function(){ window.location.href = $(this).attr("href"); });
    });

    $popover.find(".close").click(function(event) {
      event.preventDefault();
      displayed && hide();
    });

    $popover.click(function(event) {
      event.stopPropagation();
    });

    $('html').click(function() {
      displayed && hide();
    });
  }

  function show() {
    var rendered_template = _.template(template);
    $("#content").prepend(rendered_template);
    $popover = $("#login");

    setupBindings();
    $popover.css("top", getTopPosition() + "px");
    $popover.fadeIn("slow", function() { hidden = false; });
    $("body").append("<div id='lock_screen'></div>");
    $("#lock_screen").height($(document).height());
    $("#lock_screen").fadeIn("slow");
    displayed = true;
  }

  function hide(callback) {
    $popover.find('a.close').unbind("click");
    $('html').unbind("click");

    $popover.fadeOut(transitionSpeed, function() {
      $popover.remove(); displayed = false;
      callback && callback();
    });

    $("#lock_screen").fadeOut(transitionSpeed, function() { $("#lock_screen").remove(); });
  }

  return {
    toggle: toggle,
    hide: hide
  };
})();

/*
* ================
* DOWNLOAD POPOVER
* ================
*/

var downloadPopover = (function() {
  var displayed = false;
  var $login;
  var el;
  var explanation = "";
  var transitionSpeed = 200;
  var selected_template;

  var templates = { download_selector: "<article class='infowindow download_popover download_selector'>\
    <header></header>\
      <span class='close'></span>\
        <div class='content'>\
          <h2>DOWNLOAD DATA</h2>\
            <p><%= explanation %></p>\
              <div class='light_box'>\
                <h3>Select a format</h3>\
                  <ul>\
                    <li><input type='radio' name='format' value='csv' id='format_csv' /> <label for='format_csv'>CSV</label> <span class='size'>(≈150Kb)</span></li>\
                      <li><input type='radio' name='format' value='xls' id='format_xls' /> <label for='format_xls'>XLS</label></li>\
                        <li><input type='radio' name='format' value='xml' id='format_xml' /> <label for='format_xml'>XML</label></li>\
                          </ul>\
                            <div class='tl'></div><div class='tr'></div><div class='bl'></div><div class='br'></div>\
                              </div>\
                                <a class='candy_blue_button download' target='_blank' href='http://localhost:3000/tmp/download.zip'><span>Download</span></a>\
                                  </div>\
                                    <footer></footer>\
                                      </article>",
  direct_download: "<article class='infowindow download_popover direct_download'>\
    <header></header>\
      <span class='close'></span>\
        <div class='content'>\
          <h2>DOWNLOAD DATA</h2>\
            <div class='light_box package'>\
              <div class='content'>\
                <p><%= explanation %></p>\
                  </div>\
                    </div>\
                      <span class='filetype'><strong>CSV file</strong> <span class='size'>(≈150Kb)</span></span> <a class='candy_blue_button download' target='_blank' href='http://localhost:3000/tmp/download.zip'><span>Download</span></a>\
                        </div>\
                          <footer></footer>\
                            </article>",
  download_started: "<article class='infowindow download_has_started'>\
    <header></header>\
      <span class='close'></span>\
        <div class='content'>\
          <h2>DOWNLOAD STARTED</h2>\
            <p>Remember that the downloaded data has to be correctly cited if it is used in publications. You will receive a citation text vbundled in the file with your download.</p>\
              <p>If you have any doubt about the legal terms, please check our <a href='/static/terms_and_conditions.html' class='about' title='GBIF Data Terms and Conditions'>GBIF Data Terms and Conditions</a>.</p>\
                <a href='#' class='candy_white_button close'><span>Close</span></a>\
                  </div>\
                    <footer></footer>\
                      </article>"};

  function toggle(e, event, opt) {
    event.stopPropagation();
    event.preventDefault();
    el = e;

    selected_template = templates.download_selector;

    if (opt) {
      explanation = opt.explanation;
      if (opt.template && opt.template == "direct_download") {
        selected_template = templates.direct_download;
      }
    }

    displayed ? hide(): show();
  }

  function getTopPosition() {
    return (( $(window).height() - $popover.height()) / 2) + $(window).scrollTop() - 50;
  }

  function setupBindings() {
    $popover.find(".about").click(function(event) {
      event.preventDefault();
      displayed && hide(function(){ window.location.href = $(this).attr("href"); });
    });

    $popover.find(".close").click(function(event) {
      event.preventDefault();
      displayed && hide();
    });

    $popover.click(function(event) {
      event.stopPropagation();
    });

    $('html').click(function() {
      displayed && hide();
    });
  }

  function showDownloadHasStarted(){

    $popover.fadeOut(transitionSpeed, function() {

      // let's remove the old popover and unbind the old buttons
      $popover.find('a.download, a.close').unbind("click");
      $popover.remove();

      // we can now open the new popover: "download_has_started"
      rendered_template = _.template(templates.download_started);
      $("#content").prepend(rendered_template);
      $popover = $(".download_has_started");

      $popover.find("p a").click(function(event) {
        window.location.href = $(this).attr("href");
      });

      // bind everyhting so it keeps working
      setupBindings();

      $popover.css("top", getTopPosition() + "px");
      $popover.fadeIn(transitionSpeed);
    });
  }

  function show() {
    var rendered_template = _.template(selected_template, {explanation:explanation});
    $("#content").prepend(rendered_template);
    $popover = $(".download_popover");

    $popover.find("input[type='radio']").uniform();

    $popover.find(".download").click(function(event) {
      event.stopPropagation();
      event.preventDefault();
      window.location.href = $(this).attr("href");

      var checked = $popover.find("ul li input:checked");

      showDownloadHasStarted();
    });

    setupBindings();
    $popover.css("top", getTopPosition() + "px");
    $popover.fadeIn("slow", function() { hidden = false; });
    $("body").append("<div id='lock_screen'></div>");
    $("#lock_screen").height($(document).height());
    $("#lock_screen").fadeIn("slow");
    displayed = true;
  }

  function hide(callback) {

    $popover.find('a.close').unbind("click");
    $('html').unbind("click");

    $popover.fadeOut(transitionSpeed, function() { $popover.remove(); displayed = false; });

    $("#lock_screen").fadeOut(transitionSpeed, function() {
      $("#lock_screen").remove();
      callback && callback();
    });
  }

  return {
    toggle: toggle,
    hide: hide
  };
})();
