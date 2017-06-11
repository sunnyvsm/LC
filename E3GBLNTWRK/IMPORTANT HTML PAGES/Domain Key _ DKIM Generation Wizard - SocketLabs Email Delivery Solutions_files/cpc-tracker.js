function cpct_gup(name,url){if(!url)url=location.href;name=name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");var regexS="[\\?&]"+name+"=([^&#]*)";var regex=new RegExp(regexS);var results=regex.exec(url);return results==null?null:decodeURI(results[1]);}
function cpct_deleteCpcParamCookie(param){document.cookie='CPC_'+ param+'=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';}
function cpct_setCookie(cname,cvalue,exdays){var d=new Date();d.setTime(d.getTime()+(exdays*24*60*60*1000));var expires="expires="+d.toUTCString();document.cookie=cname+"="+ cvalue+"; "+ expires+"; path=/";}
function cpct_getCookie(cname){var name=cname+"=";var ca=document.cookie.split(';');for(var i=0;i<ca.length;i++){var c=ca[i];while(c.charAt(0)==' ')c=c.substring(1);if(c.indexOf(name)==0)return c.substring(name.length,c.length);}
return"";}
function cpct_listCookies(){var theCookies=document.cookie.split(';');var aString='';for(var i=1;i<=theCookies.length;i++){aString+=i+' '+ theCookies[i-1]+"\n";}
return aString;}
function cpct_putParamInCookie(param,days){var pValue=cpct_gup(param,document.url);if(pValue){cpct_setCookie('CPC_'+ param,pValue,days);}}
function cpct_deleteCpcParamCookies(){cpct_deleteCpcParamCookie('utm_source');cpct_deleteCpcParamCookie('utm_medium');cpct_deleteCpcParamCookie('utm_campaign');cpct_deleteCpcParamCookie('utm_adgroup');cpct_deleteCpcParamCookie('utm_term');cpct_deleteCpcParamCookie('matchtype');cpct_deleteCpcParamCookie('adid');cpct_deleteCpcParamCookie('network');cpct_deleteCpcParamCookie('ismobile');cpct_deleteCpcParamCookie('adposition');cpct_deleteCpcParamCookie('gclid');}
function cpct_deleteCpcParamCookiesExceptGclid(){cpct_deleteCpcParamCookie('utm_source');cpct_deleteCpcParamCookie('utm_medium');cpct_deleteCpcParamCookie('utm_campaign');cpct_deleteCpcParamCookie('utm_adgroup');cpct_deleteCpcParamCookie('utm_term');cpct_deleteCpcParamCookie('matchtype');cpct_deleteCpcParamCookie('adid');cpct_deleteCpcParamCookie('network');cpct_deleteCpcParamCookie('ismobile');cpct_deleteCpcParamCookie('adposition');}
function cpct_putCpcParamsInCookies(){var pGclid=cpct_gup('gclid',document.url);var pUtmSource=cpct_gup('utm_source',document.url);if(pGclid){cpct_putParamInCookie('gclid',90);}
else{}
if(pUtmSource){console.log('utm_source: '+ pUtmSource);cpct_deleteCpcParamCookiesExceptGclid();cpct_putParamInCookie('utm_source',90);cpct_putParamInCookie('utm_medium',90);cpct_putParamInCookie('utm_campaign',90);cpct_putParamInCookie('utm_adgroup',90);cpct_putParamInCookie('utm_term',90);cpct_putParamInCookie('matchtype',90);cpct_putParamInCookie('adid',90);cpct_putParamInCookie('network',90);cpct_putParamInCookie('ismobile',90);cpct_putParamInCookie('adposition',90);}}
cpct_putCpcParamsInCookies();