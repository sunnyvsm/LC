<HTML>
<!--/////////////////////////////////////////////////////////////////////////
//
// Filename:    master.html
//
// Description: The "master" block page sets up a Websense block page that
//		needs frames.
//
/////////////////////////////////////////////////////////////////////////////
//
//                          PROPRIETARY MATERIALS
//
//   Websense, Inc. (Websense) has prepared this material for use by
//   Websense personnel, licensees, and customers.  The information
//   contained herein is the property of Websense and shall not be
//   reproduced in whole or part without the prior written consent of an
//   authorized representative of Websense, Inc.
//
//                          RESTRICTED RIGHTS LEGEND
//
//   Use, duplication  or disclosure  by the U.S. Government is subject
//   to restrictions as set forth in Technical Data and Computer Software
//   at 48 CFR 252.227-7015 and 48 CFR 227.27.  All other Government use,
//   duplication or disclosure shall be governed exclusively by the terms
//   of the Websense Subscription Agreement. The manufacturer is Websense,
//   Inc.
//
//
//                          Copyright (c) 1996 - 2006
//                             All Rights Reserved
//                               Websense, Inc.
//                          10240 Sorrento Valley Rd
//                            San Diego, CA 92121
//                              (858) 320-8000
//
/////////////////////////////////////////////////////////////////////////////
//
// The Websense Tokens contained in this page are the following:
//
// 1) *WS_TOPFRAMEURL*
//	- Outputs the target url for the upper frame.  The default is the
//	  block.html block page.
//
// 2) *WS_BOTTOMFRAMEURL*
//	- Outputs the target url for the lower frame.  This depends on the
//	  blocking option that is selected.
//
//
// 3) *WS_SESSIONID*
//	- This is a mandatory token that must follow Websense specified
//	  *WS_TOPFRAMEURL* and *WS_BOTTOMFRAMEURL* tokens.
//
//
///////////////////////////////////////////////////////////////////////////-->
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Blocked by Websense</title>
</head>
<div style="border: 1px solid #285EA6;width: 95%; max-width: 700px; overflow: hidden; margin-left: 10px; background-color: #FFFFFF;">
<frameset rows=450,* frameborder=0 border=0>
<frame src="http://10.102.3.218:15871/cgi-bin/block_message.cgi?ws-session=601038574" name=ws_block marginwidth=0 marginheight=0>
<frame src="http://10.102.3.218:15871/cgi-bin/blockOptions.cgi?ws-session=601038574" name=ws_blockoption marginwidth=0 marginheight=0>

<noframes>You have been blocked by Websense.<p>You must have a frames capable browser to view the remainder of this document correctly.</noframes>

</frameset>
</div>
</html>


