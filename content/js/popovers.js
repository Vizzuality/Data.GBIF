/*
* =============
* DATE POPOVER
* =============
*/

var datePopover = (function() {
  var el;
  var displayed = false;
  var $popover;
  var transitionSpeed = 150;
  var title;
  var message;
  var day, month, year;
  var $day, $month, $year;

  var months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG", "SEP","OCT","NOV","DEC"];

  var template = '<div id="date-selector" class="date-selector">\
    <div class="month"><span></span></div>\
      <div class="day"><span></span></div>\
        <div class="year"><span></span></div>\
          </div>';
  function toggle(e, event, opt) {
    event.stopPropagation();
    event.preventDefault();

    el = e;
    displayed ? hide(): show();
  }

  function setupBindings() {
    // don't do anything if we click inside of the select…

    $popover.click(function(event) {
      event.stopPropagation();
    });

    $year.click(function(event) {
      event.stopPropagation();
      $(this).toggleClass("selected");
      $(".day, .month").removeClass("selected");
      var pane = $(this).find('.inner').jScrollPane({ verticalDragMinHeight: 20});
      pane.data('jsp').scrollToY(15*(year - 1950));
    });

    $month.click(function(event) {
      event.stopPropagation();
      $(this).toggleClass("selected");
      $(".year, .day").removeClass("selected");
      var pane = $(this).find('.inner').jScrollPane({ verticalDragMinHeight: 20});
      pane.data('jsp').scrollToY(month);
    });

    $day.click(function(event) {
      event.stopPropagation();
      $(this).toggleClass("selected");
      $(".year, .month").removeClass("selected");
      var pane = $(this).find('.inner').jScrollPane({ verticalDragMinHeight: 20});
      pane.data('jsp').scrollToY(15*(day - 1));


    });

    // … but clicking anywhere else closes the popover
    $('html').click(function() {
      displayed && hide();
    });
  }

  function hide() {
    if (displayed) {
      $(".day, .month, .year").removeClass("selected");
      $('html').unbind("click");

      if (is_ie) {
        $popover.hide();
        $popover.remove();
        displayed = false;
      } else {
        $popover.animate({top:$popover.position().top - 20, opacity:0}, transitionSpeed, function() { $popover.remove(); displayed = false; });
      }
    }
  }

  function createPopover() {
    $("#content").prepend(template);

    // get id of the popover
    popover_id = $(template).attr("id");
    $popover = $("#"+popover_id);

    $day   = $popover.find(".day");
    $month = $popover.find(".month");
    $year  = $popover.find(".year");
  }

  function captureDate() {
    var date = new Date(el.attr("datetime"));

    day = date.getDate();
    month = date.getMonth();
    year = date.getFullYear();
  }

  function setupLists() {
    $month.find("span").html(months[month]);
    $day.find("span").html(day);
    $year.find("span").html(year);

    $month.append('<div class="listing"><div class="inner"><ul></ul></div></div>');
    $day.append('<div class="listing"><div class="inner"><ul></ul></div></div>');
    $year.append('<div class="listing"><div class="inner"><ul></ul></div></div>');

    $popover.find('.listing, .jspVerticalBar').click(function(event) {
      event.stopPropagation();
    });

    _.each(months, function(m, index) {
      if (index == month) {
        $month.find(".listing ul").append('<li class="selected">'+m+'</li>');
      } else {
        $month.find(".listing ul").append("<li>"+m+"</li>");
      }
    });

    for(var i = 1; i <= 31; i++) {
      if (i == day) {
        $day.find(".listing ul").append("<li class='selected'>"+i+"</li>");
      } else {
        $day.find(".listing ul").append("<li>"+i+"</li>");
      }
    }

    for(var i = 1950; i <= 2020; i++) {
      if (i == year) {
        $year.find(".listing ul").append("<li class='selected'>"+i+"</li>");
      } else {
        $year.find(".listing ul").append("<li>"+i+"</li>");
      }
    }
  }

  function zeroPad(num,count)
  {
    var numZeropad = num + '';
    while(numZeropad.length < count) {
      numZeropad = "0" + numZeropad;
    }
    return numZeropad;
  }

  function updateDate() {
    if (day == 1) {
      n = "st";
    } else if (day == 2){
      n = "nd";
    } else {
      n = "th";
    }

    el.html(months[month].toProperCase() + " " + day + n + ", " + year);
    el.attr("datetime", year+"/"+zeroPad(month+1, 2)+"/"+day);
  }

  function adjustCalendar() {
    var month_index = _.indexOf(months, month) + 1;

    if (month_index == 2) { // February has only 28 days
      var isLeap = new Date(year,1,29).getDate() == 29;

      isLeap ?  $day.find("li").eq(28).show() : $day.find("li").eq(28).hide();

      $day.find("li").eq(29).hide(); // 30
      $day.find("li").eq(30).hide(); // 31
    } else if (_.include([4, 6, 9, 11], month_index)) {
      $day.find("li").eq(30).hide(); // 31
    } else {
      $day.find("li").eq(28).show(); // 29
      $day.find("li").eq(29).show(); // 30
      $day.find("li").eq(30).show(); // 31
    }
  }

  function showPopover() {
    var x = el.offset().left;
    var y = el.offset().top ;
    var w = $popover.width();
    var el_w = el.width();

      $popover.css("left", x - Math.floor(w/2) + Math.floor(el_w/2) - 4); // 4px == shadow

    if (is_ie) {
      $popover.css("top", y + 9 );
      $popover.show(transitionSpeed, function() {
        displayed = true;
      });
    } else {
      $popover.css("top", y + 9 + 20);
      $popover.animate({top:$popover.position().top - 20, opacity:1}, transitionSpeed, function() { displayed = true; });
    }
  }

  function show() {
    createPopover();
    setupBindings();
    captureDate();
    setupLists();

    $year.find("li").click(function(event){
      event.stopPropagation();
      year = $(this).html();

      adjustCalendar();

      $year.find("li").removeClass("selected");
      $(this).addClass("selected");

      $year.find("span").animate({opacity:0}, transitionSpeed, function() {
        $(this).html(year);
        $(this).animate({opacity:1}, transitionSpeed);
      });
      $year.removeClass("selected");
      updateDate();
    });

    $month.find("li").click(function(event){
      event.stopPropagation();
      month = _.indexOf(months, $(this).html());

      adjustCalendar();

      $month.find("li").removeClass("selected");
      $(this).addClass("selected");

      $month.find("span").animate({opacity:0}, transitionSpeed, function() {
        $(this).html(months[month]);
        $(this).animate({opacity:1}, transitionSpeed);
      });
      $month.removeClass("selected");
      updateDate();
    });

    $day.find("li").click(function(event){
      event.stopPropagation();
      day = $(this).html();

      $day.find("li").removeClass("selected");
      $(this).addClass("selected");

      $day.find("span").animate({opacity:0}, transitionSpeed, function() {
        $(this).html(day);
        $(this).animate({opacity:1}, transitionSpeed);
      });

      $day.removeClass("selected");
      updateDate();
    });

    showPopover();
  }

  return {
    toggle: toggle
  };
})();



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

      if (is_ie) {
        $popover.hide();
        $popover.remove();
        displayed = false;
      } else {
        $popover.animate({top:$popover.position().top - 20,opacity:0}, transitionSpeed, function() { $popover.remove(); displayed = false; });
      }
    }
  }

  function showPopover() {
    // get the coordinates and width of the popover
    var x = el.offset().left;
    var y = el.offset().top ;
    var w = $popover.width();
    var h = $popover.height();

    $popover.css("left", x - w/2 + 7);

    if (is_ie) {
      $popover.css("top", y - h);
      $popover.show(transitionSpeed, function() {
        $popover.show();
        displayed = true;
      });
    } else {
      $popover.css("top", y - h - 10);
      $popover.animate({top: y-h,opacity:1}, transitionSpeed, function() { displayed = true; });
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

    showPopover();
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
  var that = this;
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
        var $li =  $("ul.values").append('<li class="filter_remove"><div class="value">'+selected+'<span class="remove"></span></div></li>');
        $("ul.values").after(templates.add);


      } else {
        var $li = $("ul.values").append('<li class="filter_remove"><div class="value">'+selected+'<span class="remove"></span></div></li>');
      }

      $li.find("span.remove").click(function() {
        alert('remove');
      });

      count++;

     // el.die("click");
     // el.unbind("click");
     // el.removeclass("filter");

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
  var transitionSpeed = 200;
  var links = {};

  var templates = {
    main:'<div class="white_narrow_popover"><div class="arrow"></div><ul></ul></div>',
    li:'<li><a href="<%=value%>"><span><%=label%></span></a></li>'
  }

  function toggle(e, event, opt) {
    event.stopPropagation();
    event.preventDefault();
    el = e;

    if (opt) {
      links = opt.links
    }

    displayed ? hide(): show();
  }
  function setupInterface () {
    _.each(links, addLink);
    $popover.find("ul li:first-child").addClass("first");
    $popover.find("ul li:last-child").addClass("last");
  }

  function addLink(value, label) {
    $popover.find("ul").append(_.template(templates.li, {value:value, label:label}));
  }

  function hide() {
    $('html').unbind("click");

    if (is_ie) {
      $popover.hide();
      $popover.remove();
      displayed = false;
    } else {
      $popover.animate({top:$popover.position().top - 20, opacity:0}, transitionSpeed, function() { $popover.remove(); displayed = false; });
    }
  }

  function showPopover() {
    // get the coordinates and width of the popover
    var x = el.find("span").offset().left;
    var y = el.find("span").offset().top;
    var w = $(".white_narrow_popover").width();

    // center the popover
    $popover.css("left", x - w/2 + 4);

    if (is_ie) {
      $popover.css("top", y - 5);
      $popover.show(transitionSpeed, function() {
        displayed = true;
      });
    } else {
      $popover.css("top", y + 15);
      $popover.animate({top:$popover.position().top - 20, opacity:1}, transitionSpeed, function() { displayed = true; });
    }
  }

  function show() {
    $("#content").prepend(templates.main);
    $popover = $(".white_narrow_popover");
    setupInterface();

    // clicking anywhere closes the popover
    $('html').click(function() {
      displayed && hide();
    });

    showPopover();

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
  var transitionSpeed = 200;

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

    if (is_ie) {
      $popover.hide();
      $popover.remove();
      displayed = false;
    } else {
      $popover.animate({top:$popover.position().top - 20, opacity:0}, transitionSpeed, function() { $popover.remove(); displayed = false; });
    }
  }

  function showPopover() {
    // get the coordinates and width of the popover
    var x = el.find("span").offset().left;
    var y = el.find("span").offset().top;
    var w = $(".white_popover").width();

    // center the popover
    $popover.css("left", x - w/2 + 4);

    if (is_ie) {
      $popover.css("top", y - 5);
      $popover.show(transitionSpeed, function() {
        displayed = true;
      });
    } else {
      $popover.css("top", y + 15);
      $popover.animate({top:$popover.position().top - 20, opacity:1}, transitionSpeed, function() { displayed = true; });
    }
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

    showPopover();
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
  var selected_template;
  var errorEmail, errorPassword;
  var transitionSpeed = 200;

  var templates = {login: "<article id='login' class='infowindow'>\
                <header></header>\
                <span class='close'></span>\
                <div class='content'>\
                <h2>SIGN IN TO GBIF</h2>\
                <p>You need to log in GBIF in order to download the data.</p>\
                <form autocomplete='off' method='post' action='test'>\
                <div class='light_box'>\
                <div class='field email'>\
                <h3>Email</h3>\
                <span class='input_text'>\
                <input id='email' name='email' type='text' />\
                </span>\
                </div>\
                <div class='field password'>\
                <h3>Password</h3>\
                <span class='input_text'>\
                <input id='password' name='password' type='password' />\
                </span>\
                </div>\
                <div class='tl'></div><div class='tr'></div><div class='bl'></div><div class='br'></div>\
                </div>\
                <a href='#' class='recover_password' title='Recover your password'>Forgot your password?</a>\
                <button type='submit' class='candy_blue_button'><span>Login</span></button>\
                </form>\
                <div class='footer'>Do yo need to Sign up? <a href='/user/register/step0.html' title='Create your account'>Create your account</a></div>\
                </div>\
                <footer></footer>\
                </article>",
                password: "<article id='recover_password' class='infowindow'>\
                <header></header>\
                <span class='close'></span>\
                <div class='content'>\
                <h2>RECOVER YOUR PASSWORD</h2>\
                <form autocomplete='off' method='post'>\
                <div class='light_box'>\
                <div class='field'>\
                <h3>Your email</h3>\
                <span class='input_text'>\
                <input id='email' name='email' type='text' />\
                </span>\
                </div>\
                <div class='tl'></div><div class='tr'></div><div class='bl'></div><div class='br'></div>\
                </div>\
                <a href='#' class='back_to_login' title='Back to the sign in form'>Back to the sign in form</a>\
                <button type='submit' class='candy_blue_button'><span>Send email</span></button>\
                </form>\
                <div class='footer'>Do yo need to Sign up? <a href='/user/register/step0.html' title='Create your account'>Create your account</a></div>\
                </div>\
                <footer></footer>\
                </article>"};



  function toggle(e, event, opt) {
    event.stopPropagation();
    event.preventDefault();
    el = e;

    displayed ? hide(): show();
  }

  function changePopover(selected_template){

    $popover.fadeOut(transitionSpeed, function() {

      // let's remove the old popover and unbind the old buttons
      $popover.find('a.download, a.close').unbind("click");
      $popover.remove();

      // we can now open the new popover: "password"
      rendered_template = _.template(selected_template);
      $("#content").prepend(rendered_template);

      // get the id of the popover
      popover_id = $(selected_template).attr("id");
      $popover = $("#"+popover_id);

      $popover.find("p a").click(function(event) {
        window.location.href = $(this).attr("href");
      });

      // finally bind everyhting so it keeps working
      setupBindings();

      $popover.css("top", getTopPosition() + "px");
      $popover.fadeIn(transitionSpeed);
    });
  }

  function getTopPosition() {
    return (( $(window).height() - $popover.height()) / 2) + $(window).scrollTop();
  }

  function setupBindings() {

    errorEmail = false;
    errorPassword = false;

    $popover.find("form").submit(function(event) {
      event.preventDefault();

      if (!errorEmail) {
        $popover.find(".field.email").addClass("error");
        $popover.find(".field.email h3").append("<span class='error' style='display:none'>Email not recognized</span>");
        $popover.find(".field.email h3 span").fadeIn(transitionSpeed);
        errorEmail = true;
      }
      if (!errorPassword) {
        $popover.find(".field.password").addClass("error");
        $popover.find(".field.password h3").append("<span class='error' style='display:none'>Wrong password</span>");
        $popover.find(".field.password h3 span").fadeIn(transitionSpeed);
        errorPassword = true;
      }
    });

    $popover.find("input").focus(function(event) {
      event.preventDefault();
        if ($(this).parents(".field.error").hasClass("email")) {
          errorEmail = false;
        } else {
          errorPassword = false;
        }

        $(this).parents(".field.error").find("h3 span").fadeOut(transitionSpeed, function() {$(this).remove();});
        $(this).parents(".field.error").removeClass("error");
    });

    $popover.find(".back_to_login").click(function(event) {
      event.preventDefault();
      changePopover(templates.login);
    });

    $popover.find(".recover_password").click(function(event) {
      event.preventDefault();
      changePopover(templates.password);
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
    var rendered_template = _.template(templates.login);
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
    $popover = $(".download_popover");
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
