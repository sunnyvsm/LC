
// Blackjack Utility
function BlackJack(templateName, selector, variation) {
    var that = this;
    that.getPath = function (name) {
        return 'public/scripts/templates/blackjack.' + name + '.tmpl.html';
    };
    that.templateFile = this.getPath(templateName);
    that.selector = selector;
    that.variation = variation; //the data
    that.render = function () {
        if (typeof ($_vwo_variation) != 'undefined') { $_vwo_variation(); }; //apply any vwo variation that may have been applied
        $.ajax({
            url: (GetMxWebsite() + that.templateFile),
            type: 'GET',
            cache: true,
            success: function (tmplData) {
                $.templates({ tmpl: tmplData });
                $(that.selector).html($.render.tmpl(that.variation));
                // Bind the open and close
                $("#blackjack-main").click(function () {
                    // Only open, not close
                    if ($('#blackjack-learn-more').text() == "Learn More") {
                        $('[class^="blackjack"]').toggleClass('minimized');
                        $('#blackjack-learn-more').text("Learn Less");
                    };
                });
                $('#blackjack-learn-more').click(function () {
                    $('[class^="blackjack"]').toggleClass('minimized');
                    if ($('#blackjack-learn-more').text() == "Learn More") {
                        $('#blackjack-learn-more').text("Learn Less");
                    } else {
                        $('#blackjack-learn-more').text("Learn More");
                    };
                });
                // Hide /month if free
                if (variation.price == "FREE") {
                    $('.proplan_costsm').hide();
                };
                // Hide price section and expand H2 section if there is no price
                if (!variation.price) {
                    $('#second-tagline').css("width", "570px");
                    $('#mf_signup_offer').css("width", "112px");
                    $('#mf_signup_cost').hide();
                }

                // First show all the bullets
                $('.blackjack li').show();
                // Then hide any that are empty
                $('.blackjack li:empty').hide();
                that.visible = 1;
            }
        });
    };
    that.hide = function () {
        $(that.selector).hide();
        that.visible = 0;
    };
    that.show = function () {
        $(that.selector).show();
        that.visible = 1;
    };
    that.visible = 0;
}

// Prebuilt variations
function bj_domainHealth_control() {
    var variation = {
        "type": "domain",
        "headline": "Get Critical Performance Monitoring for Web, Email, and DNS Servers",
        "price": "$20",
        "buttontext": buttonText(),
        "buttonurl": domainHealthUpgradeURL(),
        "topbullet1": "Web, DNS and Email Servers + Blacklists all monitored",
        "topbullet2": "Be the first to know about critical domain issues",
        "bottomheadline": "Monitor Your Entire Domain: Web, DNS, Email, Blacklist, and More",
        "bottombullet1": "Easy to setup  Just give us your domain name &amp; we'll alert you to any critical issues",
        "bottombullet2": "All Web, DNS, and Email Servers monitored every 15 minutes",
        "bottombullet3": "Blacklist monitoring and MxReputation for each server in your mx record",
        "bottombullet4": "Get notified of any MX and SPF record changes",
        "bottombullet5": "Track Historical Performance of your servers",
    };
    if (typeof _is_paid != 'undefined' && _is_paid) {
        variation.price = "FREE";
    };
    return variation;
};

function bj_domiainHealth_variation1() {
    var control = bj_domainHealth_control();
    control.topbullet1 = "Monitor Email, Web, and DNS Servers + All Blacklists";
    control.topbullet2 = "140 point inspection for all your servers, every 15 minutes";
    return control;
};

function bj_domiainHealth_variation2() {
    var control = bj_domainHealth_control();
    control.topbullet1 = "Get 140 Email, Website, and DNS checks every 15 minutes";
    control.topbullet2 = "Be the first to know about critical domain issues";
    return control;
};

function bj_domiainHealth_variation3() {
    var control = bj_domainHealth_control();
    control.topbullet1 = "Checks Email, Website, and DNS servers every 15 minutes";
    control.topbullet2 = "If there is a problem, we alert you immediately";
    return control;
};

function bj_mailFlow_variation1() {
    var variation = {
        "type": "mailflow",
        "headline": "Mail <span class='MF_orangeh1'>Flow</span> Monitoring &ndash; Detect Email Problems Fast",
        "price": "$30",
        "buttontext": buttonText(),
        "buttonurl": mailflowUpgradeURL(),
        "topbullet1": "Test both your inbound and outbound email every 5 minutes",
        "topbullet2": "Easy to setup and works with any email server",
        "bottomheadline": "Know about email delays other monitors miss",
        "bottombullet1": "Performance graphs of mail delivery times",
        "bottombullet2": "Complete mail flow visibility to uncover issues that might be creating delays ",
        "bottombullet3": "See trends over weeks or months with historical data",
        "bottombullet4": "Share your account and alerts with as many people as you like",
        "bottombullet5": "",
    };

    return variation;
};

function bj_blacklist_variation1() {
    var variation = {
        "type": "blacklist",
        "headline": "If your server gets <span class='MF_orangeh1'>blacklisted</span> &ndash; What would that cost you?",
        "price": "",
        "buttontext": buttonText(),
        "buttonurl": blacklistUpgradeURL(),
        "topbullet1": "Start Monitoring 100+ Blacklists (70+ more than the free plan)",
        "topbullet2": "Be the first one alerted to critical blacklist issues",
        "bottomheadline": "Prevent Email Delivery Disasters",
        "bottombullet1": "Increased Blacklist Monitoring Frequency",
        "bottombullet2": "MxReputation Score - Know where your IP reputation ranks",
        "bottombullet3": "Blacklist Removal/Delisting Support",
        "bottombullet4": "Monitor multiple IP's, sites, and servers",
        "bottombullet5": "",
    };
    $('.pitchPanel').hide();
    $('.table-of-contents').show();
    return variation;
};

//Helper functions

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function buttonText() {
    if (typeof _is_logged_in != 'undefined' && _is_logged_in) {
        if (typeof _is_paid != 'undefined' && _is_paid) {
            //paid
            return "Add Now";
        } else {
            // free 
            return "Upgrade";
        }
    } else {
        //anon
        return "Sign Up";
    }
}

function domainHealthUpgradeURL() {
    var domainParameters = "";
    if (getParameterByName("domain") !== "") {
        domainParameters = "&domain:" + getParameterByName("domain") + "&actionstring=domain:" + getParameterByName("domain");
    }
    if (typeof _is_logged_in != 'undefined' && _is_logged_in) {
        if (typeof _is_paid != 'undefined' && _is_paid) {
            //paid - add
            return GetMxWebsite() + "/Public/Content/Products/DomainHealthInfo.aspx?" + domainParameters;
        } else {
            // free - upgrade
            return GetMxWebsite() + "/public/checkout/domain/v1.aspx?upgrade=bj-dh&so=MDM&blackjack=1&AG=&blackjack=1" + domainParameters;
        }
    } else {
        // anon - show registration modal
        return "javascript:ShowSignIn('Sign-Up for Domain Health Monitoring','Sign Up','bj-dh','" + GetMxWebsite() + "/public/checkout/domain/v1.aspx?page=pp-dh&upgrade=bj-dh&so=MDM&blackjack=1" + domainParameters + "');"
    }
}

function mailflowUpgradeURL() {
    if (typeof _is_logged_in != 'undefined' && _is_logged_in) {
        if (typeof _is_paid != 'undefined' && _is_paid) {
            //paid - add
            return GetMxWebsite() + "/User/Dashboard/Setup/MailFlowSetup.aspx";
        } else {
            //free - upgrade
            return GetMxWebsite() + "/public/checkout/mailflow/v1.aspx?page=bj-mf&upgrade=bj-mf&so=MFM";
        };
    } else {
        //anon - register + upgrade
        return "javascript:ShowSignIn('Sign-Up for Mail Flow Monitoring','Sign Up','bj-mf','" + GetMxWebsite() + "/public/checkout/mailflow/v1.aspx?page=bj-mf&upgrade=bj-mf&so=MFM&blackjack=1');";
    };
}

function blacklistUpgradeURL() {
    if (typeof _is_logged_in != 'undefined' && _is_logged_in) {
        if (typeof _is_paid != 'undefined' && _is_paid) {
            //paid - add
            //this doesn't show for paid users
        } else {
            //free - upgrade
            return GetMxWebsite() + "/public/UpgradeV2.aspx?page=prob_blacklistbj";
        };
    } else {
        //anon - register + upgrade
        return "javascript:ShowSignIn('Sign-Up for Blacklist Monitoring','Sign Up','bj-bl','" + GetMxWebsite() + "/public/UpgradeV2.aspx?page=prob_blacklistbj');";
    };
}


//should we show blackjack?
function showBlackJack() {
    var _BlackJack;
    if (window.location.pathname.indexOf("/domain/") != -1) {
        _BlackJack = new BlackJack('original', '#blackjack', bj_domainHealth_control());
        // Do not render
    };
    if (window.location.search.indexOf("page=health_") != -1) {
        _BlackJack = new BlackJack('original', '#blackjack', bj_domainHealth_control());
        //_BlackJack.render();
        // it will render with VWO AB Test
    };
    if (window.location.search.indexOf("page=prob_smtp") != -1) {
        _BlackJack = new BlackJack('original', '#blackjack', bj_mailFlow_variation1());
        _BlackJack.render();
    }
    //if (window.location.search.indexOf("page=prob_blacklist") != -1 && !_is_paid) {
    //    _BlackJack = new BlackJack('original', '#blackjack', bj_blacklist_variation1());
    //    _BlackJack.render();
    //}
    return _BlackJack;
};

var aBlackJack = showBlackJack(); //Calls the function every load to see if this page is eligable
