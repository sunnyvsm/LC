//Copyright 2012 MxToolBox, Inc.  
//
//Please don't abuse our services.
//Scripting against our site is against our acceptable use policy

var previousResultDiv = "";
var thisResultDiv = "";
var resultIndex = 0;
var dnsResults = new Array();
var _commandArray = "";
var _buttonTextArray = "";

$(document).ready(function () {
    // Create an empty instance of the GA tracker if the agent is "googlebot"
    if (navigator.userAgent.match(/googlebot/i)) {
        ga = ga || function () { };
    }

    // set the query string parameter
    if (getParameterByName("action")) {
        $('#txtInput2').val(getParameterByName("action"));
    }

    //Event wire-up for tool_click          
    $('.tool_click').click(function (event) {
        event.preventDefault ? event.preventDefault() : event.returnValue = false; //supress postback on legacy master page
        DoPickerLookup();
    });

    //Event wire-up for txtInput         
    $('#txtInput2').bind('keypress', function (e) {
        inputKeyPress2(e);
    });

    //Event wire-up for txtInput
    $('#txtInput2').bind('click', function (e) {
        $('#txtInput2').select();
    });

    //Go get the CommandArray via Webmethod but do it Synchronously
    $.ajax({
        type: "POST",
        async: false,
        url: GetMxWebsite() + "public/Lookup.aspx/GetToolCommands",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            _commandArray = jQuery.parseJSON(msg.d);
            _commandArray.push('ping-smtp')
            _commandArray.push('axfr')
        },
        error: function (xhr, status, error) {
            console.log(xhr, status, error);
        }
    });

    //Go get the buttonText via Webmethod but do it Synchronously
    $.ajax({
        type: "POST",
        async: false,
        url: GetMxWebsite() + "public/Lookup.aspx/GetToolButtonText",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            _buttonTextArray = jQuery.parseJSON(msg.d);
        },
        error: function (xhr, status, error) {
            console.log(xhr, status, error);
        }
    });

    $('#txtInput2').focus();
    $.ajax({
        type: "POST",
        url: GetMxWebsite() + "public/Lookup.aspx/GetToolDropDown2",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            $('.picker2-items').empty().append(msg.d); // populate the drop down list
            if (($('#btnAction3').text() === '') || ($('#btnAction3').text() === 'MX Lookup')) {
                setCommand2('mx', 'MX Lookup');
            }
        },
        error: function (xhr, status, error) {
            console.log(xhr, status, error);
        }
    });

    //Check to see if the page has already put the text in the supertool
    if ($('#txtInput2').val() !== "") {
        doLookup2($('#txtInput2').val());  //if action spec'd then just do it
    }
});

function trackCommandEvent(command) {
    ga('create', 'UA-196877-1', 'auto');
    ga('send', 'event', 'supertool', 'picker2', command.trim());
};

function setCommand2(command, buttonText) {
    trackCommandEvent(command);
    $('#btnAction3').text(buttonText);
    $('#hiddenCommand').text(command);
    if (command.toLowerCase() === "whatismyip") {
        window.location = GetMxWebsite() + "whatismyip/";
    } else if (command === "blacklist") {
        $('[id$="hlBlacklistHelperPicker2"]').show();
    } else {
        $('[id$="hlBlacklistHelperPicker2"]').hide();
    }
}

function doLookup2() {
    if ($('#txtInput2').length > 0) {
        var command = $('#hiddenCommand').text().toLowerCase();
        var argument = $('#txtInput2').val();

        if (argument.toLowerCase() === "whatismyip") {
            window.location = GetMxWebsite() + "whatismyip/";
            return;
        }
        else if (argument.length === 0) {
            return;
        }

        var action = "";
        var new_command_index = -1;
        // The user might be overriding the command in the pulldown with one of their own
        var firstcolon = argument.indexOf(":");
        if (argument.indexOf(":") > -1) {
            var possible_command = argument.substring(0, firstcolon).toLowerCase();
            //'ns' is an alias for 'dns'
            if (possible_command === 'ns') {
                possible_command = 'dns';
            }
            new_command_index = $.inArray(possible_command, _commandArray);
            if (new_command_index !== -1) {
                // Only update command and argument if this is a valid command - otherwise stick with what we had - this is the case if they are giving us arguments e.g. tcp, etc.
                command = possible_command;
                argument = argument.substring(firstcolon + 1);
                var buttonText = _buttonTextArray[new_command_index];
                setCommand2(possible_command, buttonText);
            }
        }

        if (argument === "test") {
            action = "test";
        } else if (command === "whatismyip") {
            window.location = GetMxWebsite() + "whatismyip/";
        } else if (argument.length === 0) {
            // Empty Argument, exit
            $('#txtInput2').val("");
            return false;
        } else if (argument.indexOf(command) == 0 && firstcolon > -1 && new_command_index == -1) {
            action = argument; // the command is already sandwiched on the action and it wasn't overriden above.
        } else if (command !== "") {
            action = command + ":" + argument;
        } else {
            // some commands are not documented.  Just pass them on and see what happens
            action = argument;
        }
        // set the text
        $('#txtInput2').val(action);
        doLookup(action);
    }
}

function inputKeyPress2(event) {
    var charCode = event.which;
    if (charCode === 13) {
        event.preventDefault ? event.preventDefault() : event.returnValue = false; //supress postback on legacy master page
        doLookup2();
    } else if (charCode === 58) {
        //e.preventDefault(); //we'll add the colon ourselves
        //look to see if we need to modify the command
        var argument = $('#txtInput2').val().toLowerCase();
        //'ns' is an alias for 'dns'
        if (argument === 'ns') {
            argument = 'dns';
        }
        // The user is overriding the command in the pulldown with one of their own
        if ($.inArray(argument, _commandArray) !== -1) {
            var arrayPos = $.inArray(argument, _commandArray);
            var command = _commandArray[arrayPos];
            if (command === "whatismyip") {
                window.location = GetMxWebsite() + "whatismyip/";
                return;
            }
            var buttonText = _buttonTextArray[arrayPos] || command;
            setCommand2(command, buttonText);
            //$('[id$="txtInput2"]').val(right);
            //} else {
            //    $('[id$="txtInput2"]').val(argument);
        }
    }
}

////////////////////////////////////////
//            Hide Ignore             //
////////////////////////////////////////

function hideIgnore() {
    $('.ignore').hide();
}

function showIgnore() {
    $('.ignore').show();
}

//Quick Watch

function qw_setExpiration(exp) {
    $('select[id*="qw_expiration"]').val(exp);
}

function qw_ok() {
    // Google Analytics
    ga('send', 'event', 'monitor_add', 'quickwatch_add', $('[id*="hiddenQuickWatch_CommandArg"]').val().split(':')[0]);
}

function qw_cancel() {
    $('div[id^="quickwatchModal"]').modal('hide');
    return false;
}

function quickwatch(commandArg) {
    qw_setExpiration(72);
    //CommandArg
    $('[id*="hiddenQuickWatch_CommandArg"]').val(commandArg);
    //Title
    $('span[id^="qw_title"]').text(commandArg);
    //Text
    var command = commandArg.split(":")[0];
    var argument = commandArg.replace(command + ":", "");
    var text = "";
    if (command.toLowerCase() == "blacklist") {
        //Blacklist
        text = "MxToolBox will notify you when " + argument + " is added or removed from a blacklist.";
    }
    else if ($.inArray(command.toLowerCase(), ["ptr", "whois", "aaaa", "srv", "dnskey", "cert", "loc", "ipseckey", "cname", "txt", "soa", "a", "mx", "dns", "spf"]) >= 0) {
        //DNS
        text = "MxToolBox will notify you when the " + command + " DNS record for " + argument + " changes.";
    }
    else {
        //Other
        text = "MxToolbox will notify you when " + command + ":" + argument + " changes.";
    }
    $('span[id^="qw_text"]').text(text);
    //Show
    $('div[id^="quickwatchModal"]').modal('show');
}

function doLookup(commandArg) {
    if (commandArg.indexOf("exception3") != -1) { throw "Test Exception"; }
    try {
        resultIndex = resultIndex + 1;
        if (commandArg == "test") { runTestCases(); }
        document.documentElement.scrollTop = 0;
        var params = {
            "inputText": commandArg,
            "resultIndex": resultIndex
        };

        var command = commandArg.split(':')[0];
        var arrayPos = $.inArray(command, _commandArray);
        var buttonText = _buttonTextArray[arrayPos] || command;
        setCommand2(command, buttonText);

        if (window.supertoolx) {
            $('[id^="btnAction"]').attr('disabled', 'disabled');
        } else {
            $('[id^="btnAction"]').hide();
        }
        
        $('[id^="imgWait"]').show();
        $('#imgLogo').attr('src', GetMxWebsite() + 'Public/images/mxAnimation_v04.gif');   //turn on spinner
        $.ajax({
            type: "POST",
            url: "Public/Lookup.aspx/DoLookup2",
            data: JSON.stringify(params),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: onLookup,      // Error!
            error: function (xhr, status, error) {
                // We handle our regular exceptions above, this is for actual 500 errors coming off of the web method
                // Boil the ASP.NET AJAX error down to JSON, log it
                $('#imgLogo').attr('src', 'Public/images/logo.gif');  //turn OFF spinner
                $('#btnAction').attr('class', 'btn btn-mx');
                if (window.supertoolx) {
                    $('[id^="btnAction"]').removeAttr('disabled');
                } else {
                    $('[id^="btnAction"]').show();
                }
                
                $('#imgWait').hide();
                //var err = eval("(" + xhr.responseText + ")"); //This is throwing syntax exceptions
                //Don't write error if status = 0
                if (xhr.status != 0) {
                    MxErrorHandler(commandArg, "dolookup: status=" + status + " error=" + error + " xhr.status=" + xhr.status + " xhr.statusText= " + xhr.statusText, "xhr.responseText=" + xhr.responseText);
                }
                $('#lblResult').prepend("<div class='alert alert-block alert-error fade in' style='width:500px;'>An error has occurred with your lookup. Please try again.</div>");
                //$('#mdlRefresh').modal(); // force them to refresh
                //console.log(err);

            }
        });
        // Commented out 7/3/2013 to disable the DNS Warning Button
        ////if (window.location.host === 'beta.mxtoolbox.com' || window.location.host.indexOf('localhost') != -1) {
        //    $.ajax({
        //        type: "POST",
        //        url: "Public/Lookup.aspx/DnsLookup",
        //        data: JSON.stringify(params),
        //        contentType: "application/json; charset=utf-8",
        //        dataType: "json",
        //        success: onDnsLookup,
        //        error: function (xhr, status, error) {
        //            console.log("lookup dns failure");
        //        }
        //    });
        ////}
    }
    catch (e) {
        MxErrorHandler(commandArg, "unhandled: " + e.message, e.stack);
        //console.log(e.stack);
    }

};

function onLookup(msg) {
    var obj = jQuery.parseJSON(msg.d);
    $("#lblResult").prepend(obj.HTML_Value);
    //$(previousResultDiv).fadeTo("fast", 0.75);  //fade previous results
    thisResultDiv = '#' + obj.UID + '_resultDiv';
    $(document).trigger('stLoaded', thisResultDiv);  //raised each time ST result comes back (for external integrations) 
    $(thisResultDiv).slideToggle("fast");
    previousResultDiv = thisResultDiv;

    //Log to GA
    if (obj.ga_setCustomVar[0] != 'none') {
        ga('set', 'dimension' + obj.ga_setCustomVar[0], obj.ga_setCustomVar[1]);
    }
    ga('create', 'UA-196877-1', 'auto');
    ga('send', 'pageview', '/DoLookup/' + obj.Command);
    ga('send', 'event', 'supertool', 'lookup'); //6-15-12
    ga('send', 'event', 'supertool', 'lookup', obj.Command); //6-15-12

    if (obj.CommandArgument == 'reddit.com') {
        $("#lblResult").append('<img id="theImg" style="width:60%;height:60%;display:none;" src="public/images/watch-out-we-got-a-badass-over-here-meme.png" />');
        $('#theImg').delay(3000).slideToggle();
    };

    if (dnsResults[obj.ResultIndex]) {
        $('#dnsProblemButton_' + obj.ResultIndex).show();
    }

    $('#imgLogo').attr('src', 'Public/images/logo.gif');  //turn OFF spinner
    if (window.supertoolx) {
        $('[id^="btnAction"]').removeAttr('disabled');
    } else {
        $('[id^="btnAction"]').show();
    }
    
    $('[id^="imgWait"]').hide();
    $('#txtInput2').val(obj.CommandArgument);
    $('#txtInput2').focus();
    //VWO MXTPRO-694 MonitorThis vs FindProblems in DNS types
    var vwoFindProblems = $('a.VWO_MXTPRO_694:contains("Find Problems")');
    var vwoMonitorThis = $('a.VWO_MXTPRO_694:contains("Monitor This")');
    if (typeof (VWO_DNS_MonitorThis) !== "undefined" && VWO_DNS_MonitorThis) {
        vwoMonitorThis.show();
        vwoFindProblems.hide();
    }
    else {
        vwoMonitorThis.hide();
        vwoFindProblems.show();
    }

    //VWO MXTB-289 Quickwatch for free/anon users
    //Server is always displaying the button
    //To install just remove next code
    if (!window._is_paid) {
        //Just for non paid users we need to look up for the vwo variable
        if (typeof (VWO_QW_ShowAnonFree) === "undefined" || !VWO_QW_ShowAnonFree) {
            $('[id*="lnkQuickWatch"]').hide();
        } else {
            $('[id*="lnkQuickWatch"]').show();
        }
    }
}

function recordVWOGoal(id) {
    if (typeof (_vis_opt_top_initialize) == "function") {
        _vis_opt_goal_conversion(id);
        _vis_opt_pause(500);
    }
}

function onDnsLookup(msg) {
    if (msg.d !== '') {
        // is the lookupresult visible?  then update it, else store it so they can update it
        var obj = jQuery.parseJSON(msg.d);
        dnsResults[obj.ResultIndex] = msg;
        $('#dnsProblemButton_' + obj.ResultIndex).show(1000); // if dnsProblemButton_1 doesn't exist yet (dolookup has not completed), this line does nothing.  DoLookup will show the button
    }

}

function dnsProblemButtonClick(msg) {
    onLookup(msg);
    try {
        recordVWOGoal(209); //The VWO Goal for clicking on DNS
    } catch (ex) {
        //We tried to record it
    }
}



function showSpinner() {
    $('#lnkMonitorThis').hide();  //also hide all "monitor this" type links
    $('#btnAction').hide();
    $('#imgWait').show();
    $('#imgLogo').attr('src', 'Public/images/mxAnimation_v04.gif');   //turn on spinner

}

function runTestCases() {
    doLookup("www.google.com");   //host lookup with no A record, but CNAME record
    doLookup("cname:www.google.com");
    doLookup("spf:google.com");
    doLookup("google.com");
    doLookup("scan:mxtoolbox.com");
    doLookup("64.20.227.133");  //PTR lookup should be assumed and complete
    doLookup("ptr:64.20.227.133");
    doLookup("smtp:64.18.4.10");
    doLookup("blacklist:127.0.0.2");
    doLookup("mx:mxtoolbox.com");
    doLookup("soa:mxtoolbox.com");
    doLookup("ns:google.com");
    doLookup("ping:google.com");
    doLookup("trace:google.com");
}

//Post to the site that they clicked and redirect
function ClickAd(visitorAdID, navigateUrl, groupName, adName, variationID) {
    var errorList = [];
    var params = {
        "visitorAdID": visitorAdID,
        "variationID": variationID
    };
    $.ajax({
        type: "POST",
        url: GetMxWebsite() + "Public/Lookup.aspx/AdClick",
        data: JSON.stringify(params),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function () {
            if (ga) {
                ga('send', 'event', 'inlineAd', groupName + '_click', adName);
                window.location.href = navigateUrl;
            } else {
                errorList.push("ga Error (Supertool2.js=>ClickAd()): " + adName);
                errorList.push("ClickAd: " + adName);
                errorList.push("groupName: " + groupName);
                errorList.push("navigateUrl: " + navigateUrl);
                errorList.push("variationID: " + variationID);
                errorList.push("visitorAdID: " + visitorAdID);
                MxErrorHandler("", errorList.join('|'));
            }
        },      // Error!
        error: function () {
            MxErrorHandler("", "ClickAd: ");
            console.log(arguments);
        }
    });
}

// Build the InlineAd (fyi, adgroupID is really the VisitorAdID, we borrowed it to return here)
function BuildAd(adPerc, divAd) {
    var outHtml = "";
    outHtml += "<a href='#' onclick=\"ClickAd(" + adPerc.AdGroupID + ", '" + adPerc.AdNavigateUrl + "', '" + adPerc.AdGroupName + "', '" + adPerc.CampaignName + "', '" + adPerc.AdVariationID + "');\">";
    if (adPerc.AdHtml !== null && adPerc.AdHtml !== '') {
        outHtml += adPerc.AdHtml;
    } else {
        outHtml += "<img style='margin-top:-3px' src='" + GetMxWebsite() + adPerc.ImageURL + "' />";
    }
    outHtml += "</a>";


    if (adPerc.AdDelayMS !== 0) {
        divAd.hide();
        divAd.append(outHtml);
        var str = "<script>setTimeout(function(){ $('#" + divAd.attr('id') + "').slideToggle('slow');}, " + adPerc.AdDelayMS.toString() + ");";
        str += "<";
        str += "/script>";
        divAd.append(str);
    } else {
        divAd.html(outHtml);
    }
}

// if adID is in QueryString, then just get that one.  Otherwise, call to the server and determine which ad to get, then build it
function ShowAd(divAd, isLoggedIn, isPaid, adId) {
    var variationId = getParameterByName("variation") || adId;
    if (variationId) {
        var params = {
            "adVariationID": variationId
        };
        $.ajax({
            type: "POST",
            url: GetMxWebsite() + "Public/Lookup.aspx/GetInlineAd",
            data: JSON.stringify(params),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (adPerc) {
                BuildAd(adPerc.d, divAd);
                ga('send', 'event', 'inlineAd', adPerc.d.AdGroupName + '_impression', adPerc.d.AdName);
            },      // Error!
            error: function () {
                MxErrorHandler("Show ad: " + adId.toString(), "ShowAd Variation: ");
                console.log(arguments);
            }
        });
    } else {

        $.ajax({
            type: "POST",
            url: GetMxWebsite() + "Public/Lookup.aspx/GetNextInlineAd",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (adPerc) {
                if (adPerc.d != null) {
                    BuildAd(adPerc.d, divAd);
                    ga('send', 'event', 'inlineAd', adPerc.d.AdGroupName + '_impression', adPerc.d.AdName);
                }
            },      // Error!
            error: function () {
                MxErrorHandler("Show next ad", "ShowAd No Variation: ");
                console.log(arguments);
            }
        });
    }
}

