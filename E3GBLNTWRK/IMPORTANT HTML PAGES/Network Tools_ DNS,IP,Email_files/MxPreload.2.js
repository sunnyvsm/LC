//// Global JavaScript exception handling
if (window.attachEvent) { //IE DOM
    window.attachEvent("onerror", eventListener);
} else if (window.addEventListener) { //W3C DOM
    window.onerror = eventListener; // webkit & chrome support this.
} else {
    // Not much we can do
}

function eventListener(evt, url, linenumber, column, errorObj) {
    try {
        var details = "";
        if (evt) {
            if (evt.lineno) {
                details = evt.message + ", in " + evt.filename + "(line " + evt.lineno + ")";
            }
        }
        if (details === "") {
            for (var i = 0; i < arguments.length; i++) {
                details += arguments[i] + ", ";
            }
        }
        if (details === "") {
            details = "I have no js info";
        }


        // ignore some js files
        var ignorableErrors = ["show_ads.js", "conversion.js"];

        for (var i = 0; i < ignorableErrors.length; i++) {
            if (details.indexOf(ignorableErrors[i]) !== -1) {
                return;
            }
        }

        if (url) {
            details += ", Url: " + url
        }
        if (linenumber) {
            details += ", Linenumber: " + linenumber
        }
        if (column) {
            details += ", Column: " + column
        }
        if (errorObj) {
            details += ", ErrorObj: " + errorObj
        }
        var href = window.location.href;
        var params = {
            "input": "unhandled exception",
            "details": details,
            "stackTrace": details + " at\n" + href, //started 2013-05-23 - We will record the page at least so we have something in the stack trace to hash for mx_errors
            "userAgent": navigator.userAgent
        };
        $.ajax({
            type: "POST",
            url: document.location.protocol + "//" + document.location.host + "/Public/Lookup.aspx/ReportException3",
            data: JSON.stringify(params),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                //console.log(msg);
            },
            error: function (err) {
                //console.log(err);
            }
        });
        try {
            var page = window.location.pathname.replace(/^.*\//, "").replace(/\?.*$/, "");
            ga('create', 'UA-196877-1', 'auto');
            ga('send', 'event', 'javascript_exception', details, page);
        } catch (ex) {
            // we dont' want to report on this exception
        }
    } catch (ex) {
        // if this fails, there isn't much we can do about it
    }
}

function MxErrorHandler(input, details, e) {
    if (typeof e == "undefined") {
        e = "undefined";
    }

    var userAgent = "";

    if (navigator) {
        if (navigator.userAgent) {
            userAgent = navigator.userAgent;
        }
    }

    var params = {
        "input": input,
        "details": details,
        "stackTrace": e,
        "userAgent": userAgent
    };
    $.ajax({
        type: "POST",
        url: GetMxWebsite() + "Public/Lookup.aspx/ReportException3",
        data: JSON.stringify(params),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            //console.log(msg);
        },
        error: function (err) {
            //console.log(err);
        }
    });

    // Send the exception to GA
    try {
        page = window.location.pathname.replace(/^.*\//, "").replace(/\?.*$/, "");
        ga('create', 'UA-196877-1', 'auto');
        ga('send', 'event', 'javascript_exception', details, page);
    } catch (ex) {
    }
}

// JavaScript Document
function blurLinks() {
    oLinks = document.getElementsByTagName("a");

    for (i = 0; i < oLinks.length; i++) {
        oLinks[i].onfocus = function () { this.blur(); };
    }
}

window.onload = function () {
    blurLinks();
}

function GetMxWebsite() {
    if (window) {
        if (window.location) {
            if (!window.location.origin) {
                window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
            }

            return window.location.origin + "/";
        }
    }
    return "http://mxtoolbox.com/";
}

// JavaScript Document
function sendMailTo(name, company, domain) {
    locationstring = 'mai' + 'lto:' + name + '@' + company + '.' + domain;
    window.location.replace(locationstring);
}

// load src files after the page is loaded
function AddDeferredJS(fileLocation) {
    var mycode = document.createElement("script");
    mycode.type = "text/javascript";
    mycode.src = fileLocation;
    var firstScript = $('script')[0];
    firstScript.parentNode.insertBefore(mycode, firstScript);
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}


function toggleTile(t) {
    var $t = $('#' + t);
    //Check if we're expanding or contracting
    if ($t.hasClass('enlarged')) { //If enlarged, we're contracting
        closeTile($t);
    } else { //Enlarge a tile
        if ($('.enlarged')) { close($('.enlarged')); } //Close any enlarged tiles
        openTile($t);
    }
}
function openTile($t) {
    if ($t){
        var $prev = $t.prev();
        //Get the index to determine if we're opening left or right
        var index = "";
        var $tiles = $('li.tiles').get();
        var length = $tiles.length;
        for (var i = 0; i <= length; i++) {
            if ($tiles[i] == $t[0]) { index = i; }
        }
        if (index % 2 != 0) { $prev.insertAfter($t); $t.toggleClass('right'); }
        $t.toggleClass('enlarged', 'slow');
    }
}
function closeTile($t) {
    var $next = $t.next();
    if ($t.hasClass('right')) { $next.insertBefore($t); $t.toggleClass('right'); }
    $t.toggleClass('enlarged').attr('style', '');
}
// Add tiles to Products.aspx & MonitorEditor.ascx

function AddTile(tileUri, destinationUL, agUID) {
    var spinner = document.createElement("li");
    $(spinner).attr("style", "text-align:center;");
    $(spinner).attr("class", "tiles");
    destinationUL.append(spinner);
    var img = document.createElement("img")
    img.type = "text/javascript";
    img.src = "/Public/images/ajax-loader-yellow.gif";
    $(img).attr("style", "position:relative; top:70px");
    $(spinner).append(img);
    var params = {
        tileName: tileUri
    };

    var apiUrl = '/api/internal/Tile/GetTile/' + tileUri + '/?ag=' + agUID;

    $.ajax({
        url: apiUrl,
        type: "GET",
        dataType: 'json',
        success: function (msg) {
            $(spinner).replaceWith(msg);
        },      // Error!
        error: function () {
            console.log(arguments);
        }
    });
}

// VWO Variations
function showReasonRows() {
    //VWO MXTPRO-866 
    var vwoRows = $('tr[id^="MXTPRO_886"]');
    vwoRows.show();
}

// End ToolHandler Header Styles - http://v2.visualwebsiteoptimizer.com/reports/?test_id=116 

// First Alert Added
function variationHideExtraReasons() {
    $('#extraReasons').toggle();
}

function variationHideVideo() {
    $('#extraReasons').insertBefore(".upgrade_video_container");
    $('.upgrade_video_container').hide();
    $('#extraReasons').css("float", "right");
    $('#extraReasons').css("margin-left", "20px");
    $('#extraReasons').css("padding", "10px");
    $('#extraLine').hide();
}

// Scrollable div for ProblemDetails
function variationScrollableDetails() {
    $('.problem-description').css("overflow-y", "auto");
    $('.problem-description').css("overflow-x", "hidden");
    $('.problem-description').css("height", "600px");
    $('.problem-description').css("width", "630px");
    $('.problem-description').css("padding-right", "20px");
}

function variationFreeTrial(freeTrailDays) {
    if (freeTrailDays > 0) {
        $('[id$="btnSignUp"]').val('Start Free ' + freeTrailDays + ' Day Trial');
        $('[id$="offerFreeTrialDays"]').val(freeTrailDays);

        // Always set the button links to "Start Free...Day Trial"
        $('.btn-link').text('Start Free ' + freeTrailDays + ' Day Trial');

        if (!window._is_logged_in || !window._is_paid) {
            $('[id$="offerSignupType"]').val('trial');
        }

        $('.btn-link').click(function () {
            setupFreeTrialSignup(freeTrailDays);

            // If the user is not logged in
            if (!window._is_logged_in) {
                // Return false so the model window is used
                return false;
            }
        });

        $('[id$="btnSignUp"]').click(function () {
            setupFreeTrialSignup(freeTrailDays);

            // If the user is not logged in
            if (!window._is_logged_in) {
                // Return false so the model window is used
                return false;
            }
        });
    }
}

function setupFreeTrialSignup(freeTrialDays) {
    if (!window._is_paid) {
        // If the user is not logged in
        if (!window._is_logged_in) {
            // Show the sign in model
            ShowSignIn();

            // Set the text of the sign up button
            $('#btnModalSignIn').val('Start Free ' + freeTrialDays + ' Day Trial');
        }

        var redirectUrl = $('[id$="hfRedirectSignUp"]').val();

        $('[id$="hfRedirectSignUp"]').val(redirectUrl + '&FreeTrialDays=' + freeTrialDays);
    }
}

//VWO
function ShowBlacklist_Custom_VWO(variation) {
    if (!window._is_paid) {
        var title = content = linkUrl = linkText = "";
        switch (variation) {
            case 1:
                title = "Prevent Permanent Blacklistings";
                content = "If you have been blacklisted, the most critical thing you need to do is fix the underlying cause of the blacklisting. Failure to fix the underlying problem will cause your IP or domain to get blacklisted again. If an IP or domain is blacklisted too many times then it can become permanently blacklisted. As a result, that IP or domain might not be able to be removed from the blacklist, potentially causing email delivery or domain reputation issues. MxToolBox can help you remedy this issue and prevent future blacklist issues, including preventing permanent blacklistings.";

                var ip = getParameterByName("ip");
                var action = getParameterByName("action");

                linkUrl = GetMxWebsite() + "BlacklistSuggestions.aspx?leadtag=blacklistinghelp" + "&ip=" + ip + "&action=" + action + "&page=blacklistinghelp";
                linkText = "Get Blacklist Help";
                break;
            default:
        }
        if (title || content) {
            var container = $('[id$="blacklist_custom"]');
            container.empty();
            //H2
            if (title) {
                container.append("<h2>" + title + "</h2>");
            }
            //P
            if (content) {
                container.append("<p>" + content);
            }
            //A
            if (linkUrl) {
                container.append("<a href='" + linkUrl + "' target='_blank' rel='nofollow'>" + (linkText || linkUrl) + "</a></p>");
            }
            else {
                container.append("</p>");
            }
            return true;
        }
        return false;
    }
}

// Fix for requestAnimationFrame for older browsers
(function () {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];

    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());