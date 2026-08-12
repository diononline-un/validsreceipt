"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const fs = require("fs");
const Database = require("better-sqlite3");
const postalMime = require("postal-mime");
const puppeteer = require("puppeteer-core");
const os = require("os");
const child_process = require("child_process");
function getArcteryxTemplate() {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en"><head><!--[if gte mso 9]>     <xml>       <o:OfficeDocumentSettings>         <o:AllowPNG/>         <o:PixelsPerInch>96</o:PixelsPerInch>       </o:OfficeDocumentSettings>     </xml>     <![endif]-->
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"><title>Arc'teryx</title>

<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0 ">
<meta name="format-detection" content="telephone=no">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<style type="text/css">
:root { color-scheme: light dark; supported-color-schemes: light dark; }
body { margin: 0; padding: 0; -webkit-text-size-adjust: 100% !important; -ms-text-size-adjust: 100% !important; -webkit-font-smoothing: antialiased !important; }
img { border: 0 !important; outline: none !important; }
h1, h2, h3, h4, h5, h6 { Margin: 0px !important; Padding: 0px !important; }
p { Margin: 0px !important; Padding: 0px !important; }
table { border-collapse: collapse; mso-table-lspace: 0px; mso-table-rspace: 0px; }
td, a, span { border-collapse: collapse; mso-line-height-rule: exactly; }
.ExternalClass * { line-height: 100%; }
.em_defaultlink a { color: inherit; text-decoration: none; }
.em_g_img + div { display: none; }
a[x-apple-data-detectors], u + .em_body a, #MessageViewBody a { color: inherit; text-decoration: none; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit; }
center table { width: 100% !important; }
 @media only screen and (max-width:599px) {
.em_main_table { width: 100%!important; }
.em_wrapper { width: 100%!important; }
.em_hide { display: none!important; }
.em_full_img img { width: 100%!important; height: auto!important; }
.em_side20 { width: 20px!important; }
.em_aside15 { padding: 0px 25px!important; }
.em_side1 { width: 30px!important; }
.em_ptop1 { padding-top: 4px!important; }
.em_h20 { height: 20px!important; font-size: 1px!important; line-height: 1px!important; }
.em_h30 { height: 30px!important; }
.em_h22 {height: 22px!important; }
.em_h29 {height: 29px!important;}
u+.em_body .em_full_wrap { width: 100%!important; width: 100vw!important; }
.em_f10 { font-size: 12px!important; line-height: 14px!important; }
.em_f9 { font-size: 9px!important; line-height: 12px!important; }
.em_wid49 { width: 49%!important; }
.em_wid1 { width: 1%!important; }
.em_hide_desktop { display: table!important; float: none!important; width: 100%!important; overflow: visible!important; height: auto!important; }
.em_ptop30 { padding-top: 30px!important; }
.em_clear { clear: both !important; width: 100% !important; display: block !important; }
.em_ptop { padding-top: 25px !important; }
.em_wrapper_50_1 { width: 48% !important; }
.em_tab { width: 100% !important; max-width: 481px !important; }
.em_spc { padding-left: 10px !important; padding-right: 5px !important; }
.em_img { width: 100% !important; height: auto !important; max-width: none !important; }
.em_font13 { font-size: 13px !important; line-height: 16px !important; }
.em_pt4 { padding-top: 4px!important; }
.em_side25 { width: 25px !important; }
.em_side15 { width: 15px !important; }           
.em_h1 { height: 1px !important; font-size: 0px !important; line-height: 0px !important; }
.em_h15 { height: 15px !important; font-size: 0px !important; line-height: 0px !important; }                       
.em_h65 { height: 65px!important; }
.em_h40 { height: 40px!important; }
.em_h25 { height: 25px!important; }
.em_h50 { height: 50px!important; }
.em_h35 { height: 35px!important; }
.em_center { text-align: center !important; }
.em_aside0 { padding: 0px 0px !important; }
.em_aside25 { padding: 0px 25px !important; }
.em_aside { padding: 0px 40px !important; }
.em_img1 img { width: 265px !important; height: auto !important; max-width: none !important; }
.em_h15 { height: 15px !important; font-size: 0px !important; line-height: 0px !important; }
.em_white { background-color: #ffffff !important; }
.em_ptop50 { padding-top: 50px !important; }
.em_ptop150 { padding-top: 150px !important; }
.em_ptop27 { padding-top: 27px !important; }
.em_hauto { height: auto !important; }
.em_h95 { height: 95px !important; }
.em_pad1 { padding: 20px 25px 60px !important; }
.em_padd { padding: 8px 5px 0px !important; }
.em_pbottom7 {padding-bottom:7px !important;}
}
 @media screen and (max-width:480px) {
.em_main_table { width: 100% !important; }
.em_wrapper_50_1 { width: 49% !important; }
.em_tab { width: 100% !important; max-width: 375px !important; }
.em_spc { padding-left: 10px !important; padding-right: 5px !important; }
.em_img { width: 100% !important; height: auto !important; max-width: none !important; }
.em_pbottom3 { padding-bottom: 3px!important; }
.em_side2 { width: 90px !important; }
.em_box_img img { width: 200px !important; height: auto !important; }
.show { display: block !important; margin: 0 !important; padding: 0 !important; overflow: visible !important; width: auto !important; max-height: inherit !important; }
.hide { display: none !important; }
.stack { display: block !important; width: 100% !important; }
.width-half { width: 50% !important; height: auto !important; }   
}
 @media screen and (max-width:374px) {
.em_main_table { width: 100% !important; }
.em_wrapper_50_1 { width: 49% !important; }
.em_tab { width: 100% !important; max-width: 320px !important; }
.em_spc { padding-left: 10px !important; padding-right: 5px !important; }
.em_img { width: 100% !important; height: auto !important; max-width: none !important; }
.em_font14 { font-size: 13px !important; line-height: 16px !important; }
.em_pbottom3 { padding-bottom: 3px!important; }
.em_font14_1 { font-size: 13px !important; line-height: 16px !important; padding-top: 10px !important; }
.em_font14_1 p { font-size: 13px !important; line-height: 16px !important; }
.em_side2 { width: 35px !important; }
.em_font14_2 { font-size: 13px !important; line-height: 16px !important; }
.em_aside { padding: 0px 30px !important; }
.em_f30 { font-size: 26px !important; line-height: 30px !important; }
}
@media screen and (prefers-color-scheme:dark) {
.em_text_color { color: #ffffff!important; }
.em_text_color a { color: #ffffff!important; }
.em_cta { background-color: #2e2e2e !important; border: 1px solid #ffffff !important; }
}
</style>
<style type="text/css">
  
@font-face {     
    font-family:"ElanITCPro";     
    font-display:auto;     
    font-style:normal;     
    font-weight:400;     
    mso-font-alt: 'Arial';     
    src:url("https://images.arcteryx.com/fonts/ElanITCPro-Book-Web.woff2") format("woff2")url("https://images.arcteryx.com/fonts/ElanITCPro-Book-Web.woff") format("woff"); 
}
@font-face {
    font-family:"HelveticaNowDisplayLight";
    font-display:auto;
    font-style:normal;
    font-weight:300;
    mso-font-alt: 'Arial';
    src:url("https://images.arcteryx.com/fonts/HelveticaNowDisplayLight_normal_normal.woff2") format("woff2")url("https://images.arcteryx.com/fonts/HelveticaNowDisplayLight_normal_normal.woff") format("woff");
}
@font-face {
    font-family:"HelveticaNowDisplayRegular";
    font-display:auto;
    font-style:normal;
    font-weight:400;
    mso-font-alt: 'Arial';
    src:url("https://images.arcteryx.com/fonts/HelveticaNowDisplayRegular_normal_normal.woff2") format("woff2")url("https://images.arcteryx.com/fonts/HelveticaNowDisplayRegular_normal_normal.woff") format("woff");
}
@font-face {
    font-family:"HelveticaNowDisplayItalic";
    font-display:auto;
    font-style:italic;
    font-weight:500;
    mso-font-alt: 'Arial';
    src:url("https://images.arcteryx.com/fonts/HelveticaNowDisplayItalic_italic_normal.woff2") format("woff2")url("https://images.arcteryx.com/fonts/HelveticaNowDisplayItalic_italic_normal.woff") format("woff");
}
@font-face {
    font-family:"HelvNeue65Medium";
    font-display:auto;
    font-style:normal;
    font-weight:500;
    mso-font-alt: 'Arial';
    src:url("https://images.arcteryx.com/fonts/HelveticaNeueLTW05-65Medium.woff") format("woff");
}
@font-face {
    font-family:"HelveticaNowDisplayBold";
    font-display:auto;
    font-style:normal;
    font-weight:700;
    mso-font-alt: 'Arial';
    src:url("https://images.arcteryx.com/fonts/HelveticaNowDisplayBold_normal_normal.woff2") format("woff2"),url("https://images.arcteryx.com/fonts/HelveticaNowDisplayBold_normal_normal.woff") format("woff");
}
@import url("https://cdn.fonts.net/t/1.css?apiType=css&projectid=5a16b68d-cceb-4e6d-b76a-61aef6e0f687");
             
#productnames {
    font-family: "HelvNeue65Medium", sans-serif;
    font-weight: 600;
    font-style: normal;
} 
#cta {
    font-family: "HelvNeue65Medium", sans-serif;
    font-weight: 500;
    font-style: normal;
}             
#copy {
    font-family: "HelveticaNowDisplayRegular", sans-serif;
    font-weight: 400;
    font-style: normal;
}
#subheadline {
    font-family: "HelvNeue65Medium", sans-serif;
    font-weight: 600;
    font-style: normal;
}
#headline {
    font-family: "HelveticaNowDisplayBold", sans-serif;
    font-weight: 700;
    font-style: normal;
}


</style>
  
</head>
<body bgcolor="#ffffff" class="em_dark_bg em_body" style="margin:0px auto; padding:0px; background-color:#ffffff;">
  <style type="text/css">
div.preheader 
{ display: none !important; } 
</style>
<div class="preheader" style="font-size: 1px; display: none !important;"></div><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="min-width: 100%; " class="stylingblock-content-wrapper"><tr><td class="stylingblock-content-wrapper camarker-inner">









</td></tr></table>


 
<!-- == Header Section == -->
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" class="em_full_wrap" style="table-layout:fixed;">
  <tr>
    <td align="center" valign="top"><table align="center" width="600" role="presentation" border="0" cellspacing="0" cellpadding="0" class="em_main_table" style="width:600px; table-layout:fixed;">
        <!--PRE-HEADER SECTION-->
        <tr><td><span class="preheader" style="font-size: 1px; display: none !important; width:0; height:0; overflow: hidden; mso-hide: all;">Vielen Dank, dass du dich für Arc’teryx entschieden hast.</span></td></tr>
        <tr>
          
<td align="left" valign="top" class=" em_blk em_center" style=" font-family:Arial, sans-serif; font-size:0px; line-height:0px;
 color:#ffffff;">&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌
&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;
‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌
&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;</td>
        </tr>
        <!--//PRE-HEADER SECTION-->
        <tr>
          <td align="center" valign="top">
          <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="min-width: 100%; " class="stylingblock-content-wrapper"><tr><td class="stylingblock-content-wrapper camarker-inner">




<!-- == Header Section == -->
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" class="em_full_wrap" style="table-layout:fixed;">
  <tr>
    <td align="center" valign="top"><table role="presentation" align="center" width="600" border="0" cellspacing="0" cellpadding="0" class="em_main_table" style="width:600px; table-layout:fixed;">
        
        
        <!--HEADER SECTION-->
        <tr>
          <td align="center" valign="top"><table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" align="center" style="width:600px;" class="em_wrapper">
              <tr>
                <td width="34" style="width:34px;" class="em_side26"><img src="images/spacer.gif" width="1" height="1" alt="" border="0" style="display:block;"></td>
                <td align="center" valign="top"><table role="presentation" width="532" border="0" cellspacing="0" cellpadding="0" align="center" style="width:532px;" class="em_wrapper">
                    <tr>
                      <td height="32" style="height:32px;" class="em_ht30"><img src="images/spacer.gif" width="1" height="1" alt="" border="0" style="display:block;"></td>
                    </tr>
                    <tr>
                      <td align="center" valign="top"><table role="presentation" width="532" border="0" cellspacing="0" cellpadding="0" align="center" style="width:532px;" class="em_wrapper">
                          <tr>
                            <td valign="bottom" align="center"><table role="presentation" width="112" style="width: 112px;" border="0" cellspacing="0" cellpadding="0" align="left">
                                <tr>
                                  <td align="left" valign="bottom" style="padding-bottom:2px;" class="em_pbottom3 em_dm_logo"><a href="#" target="_blank" style="text-decoration:none;"><img src="http://drm.arcteryx.com/Logo-Assets/arc-logo-stroke.png" width="110" alt="ARC'TERYX" style="font-family:Arial,sans-serif;font-size:14px;line-height:20px;max-width:110px;display:block;color:#1A1A1A;" border="0"></a></td>
                                </tr>
                              </table></td>
                            <td width="228" style="width:228px;" class="em_side2"><img src="images/spacer.gif" width="1" height="1" alt="" border="0" style="display:block;"></td>
                            <td class="em_text_color em_blk" align="right" valign="bottom" style=" font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px;line-height:18px;color:#1A1A1A; white-space: nowrap;"><p class="em_text_color em_blk" align="right" valign="bottom" style=" font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:15px;line-height:18px;color:#1A1A1A; white-space: nowrap;"><a href="#" target="_blank" style="text-decoration:none;color:#1A1A1A;">HERREN</a></p></td>
                            <td width="63" style="width:63px;" class="em_side1"><img src="images/spacer.gif" width="1" height="1" alt="" border="0" style="display:block;"></td>
                            <td class="em_text_color em_blk" align="right" valign="bottom" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px;line-height:18px;color:#1A1A1A; white-space: nowrap;"><p class="em_text_color em_blk" align="right" valign="bottom" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:15px;line-height:18px;color:#1A1A1A; white-space: nowrap;"><a href="#" target="_blank" style="text-decoration:none;color:#1A1A1A;">DAMEN</a></p></td>
                          </tr>
                        </table></td>
                    </tr>
                    <tr>
                      <td height="32" style="height:32px;" class="em_dh2"><img src="images/spacer.gif" width="1" height="1" alt="" border="0" style="display:block;"></td>
                    </tr>
                  </table></td>
                <td width="34" style="width:34px;" class="em_side25"><img src="images/spacer.gif" width="1" height="1" alt="" border="0" style="display:block;"></td>
              </tr>
            </table></td>
        </tr>
        <!--//HEADER SECTION-->
        
      </table></td>
  </tr>
</table>


</td></tr></table>
          </td>
        </tr>
      </table></td>
  </tr>
</table>
<!-- == //Header Section == --> 

<!-- == Body Section == -->

<table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="min-width: 100%; " class="stylingblock-content-wrapper"><tr><td class="stylingblock-content-wrapper camarker-inner"><!-- == Body Section == -->
<table role="presentation" class="em_full_wrap" style="table-layout:fixed;" width="100%" cellspacing="0" cellpadding="0" border="0">
  <tr>
    <td valign="top" align="center"><table role="presentation" class="em_main_table em_grey_bg" style="width:600px; table-layout:fixed;" width="600" cellspacing="0" cellpadding="0" border="0" align="center">
        <tr>
          <td style="padding:30px 50px;" class="em_aside15" valign="top" align="center"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
              <tr>
                <td class="em_defaultlink em_f30" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:30px; line-height:36px; color:#1A1A1A; font-weight: 500;" valign="top" align="center"><p class="em_defaultlink em_text_color em_f30" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:30px; line-height:36px; color:#1A1A1A; font-weight: 500;">Deine Arc'teryx Rechnung</p></td>
              </tr>
              <tr>
                <td style="height:30x; font-size:0px; line-height:0px;" class="em_h30" height="30"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" alt="spacer" style="display:block;" width="1" height="1" border="0"></td>
              </tr>
              <tr>
                <td class="em_defaultlink" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:24px; color:#1A1A1A;" valign="top" align="center"><p class="em_defaultlink em_text_color" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:24px; color:#1A1A1A;"> Hallo {{customer_name_first}},<br><br> Vielen Dank für deine Bestellung. Deine Rechnung <strong>#{{receipt_number}}</strong> findest du unten. <br>Wenn deine Bestellung in mehreren Sendungen versandt wird, erhältst du pro Sendung eine Rechnung.</p></td>
              </tr>
              <tr>
                
                <td style="height:10px; font-size:0px; line-height:0px;" class="em_h20" height="10"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" alt="spacer" style="display:block;" width="1" height="1" border="0"></td> 
              </tr>
     
             
            
            </table></td>
        </tr>
        <tr>
          <td valign="top" align="center"><table role="presentation" class="em_wrapper" style="width: 600px;" width="600" cellspacing="0" cellpadding="0" border="0" bgcolor="#F0F0F0" align="center">
              <tr>
                <td class="em_side25" style="width: 50px;" width="50"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" alt="spacer" style="display:block;" width="1" height="1" border="0"></td>
                <td valign="top" align="center"><table role="presentation" class="em_wrapper" style="width: 500px;" width="500" cellspacing="0" cellpadding="0" border="0" align="center">
                    <tr>
                      <td style="height: 25px; font-size: 0px; line-height: 0px;" height="25"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" alt="spacer" style="display:block;" width="1" height="1" border="0"></td>
                    </tr>
                    <tr>
                      <td valign="middle" align="center"><table role="presentation" class="em_wrapper" style="width: 500px;" width="500" cellspacing="0" cellpadding="0" border="0" align="center">
                          <tr>
                            <td valign="top" align="center"><table role="presentation" class="em_wrapper" style="width: 250px;" width="250" cellspacing="0" cellpadding="0" border="0" align="left">
                                <tr>
                                  <td class="em_defaultlink" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:24px; color:#1A1A1A;" valign="top" align="left"><p class="em_defaultlink" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:24px; color:#1A1A1A;"> <span style="font-weight: bold;">Rechnungsdaten:</span> </p></td>
                                </tr>
                                <tr>
                                  <td style="height: 12px; font-size: 0px; line-height: 0px;" height="12"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" alt="spacer" style="display:block;" width="1" height="1" border="0"></td>
                                </tr>
                                <tr>
                                  <td class="em_defaultlink" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:24px; color:#1A1A1A; padding-right: 10px;" valign="top" align="left"><p class="em_defaultlink" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:24px; color:#1A1A1A;"> 
            <strong>Rechnung Nr.:</strong> {{receipt_number}}<br>
<strong>Mehrwertsteuer Nr.:</strong> {{vat_id}}<br>
<strong>Bestellnummer:</strong> {{order_number}}<br>
<strong>Rechnungsdatum:<br></strong> {{date}} </p></td>
                                </tr>
                              </table>
                              
                              <!--[if gte mso 9]>                                 </td>                                 <td valign="top">                                   <![endif]-->
                              
                              <table role="presentation" class="em_wrapper" style="width: 250px;" width="250" cellspacing="0" cellpadding="0" border="0" align="right">
                                <tr>
                                  <td class="em_defaultlink em_ptop27" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:24px; color:#1A1A1A;" valign="top" align="left"><p class="em_defaultlink" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:24px; color:#1A1A1A;"> <span style="font-weight: bold;">Rechnung an:</span> </p></td>
                                </tr>
                                <tr>
                                  <td style="height: 12px; font-size: 0px; line-height: 0px;" height="12"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" alt="spacer" style="display:block;" width="1" height="1" border="0"></td>
                                </tr>
                                <tr>
                                  <td class="em_defaultlink" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:24px; color:#1A1A1A;" valign="top" align="left"><p class="em_defaultlink" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:24px; color:#1A1A1A;"> 
            {{customer_name}}<br>
                                    {{customer_address}}<br>
                                    
                                    {{customer_city}}, <br>
                                    {{customer_country}} {{customer_zip}}  </p></td>
                                </tr>
                              </table></td>
                          </tr>
                        </table></td>
                    </tr>
                    <tr>
                      <td style="height: 25px; font-size: 0px; line-height: 0px;" height="25"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" alt="spacer" style="display:block;" width="1" height="1" border="0"></td>
                    </tr>
                  </table></td>
                <td class="em_side25" style="width: 50px;" width="50"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" alt="spacer" style="display:block;" width="1" height="1" border="0"></td>
              </tr>
            </table></td>
        </tr>
        <tr>
          <td valign="top" align="center"><table role="presentation" class="em_wrapper" style="width: 600px;" width="600" cellspacing="0" cellpadding="0" border="0" align="center">
              <tr>
                <td class="em_side25" style="width: 50px;" width="50"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" alt="spacer" style="display:block;" width="1" height="1" border="0"></td>
                <td valign="top" align="center"><table role="presentation" class="em_wrapper" style="width: 500px;" width="500" cellspacing="0" cellpadding="0" border="0" align="center">
     <tr>
                      <td style="height: 40px; font-size: 0px; line-height: 0px;" height="40"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" alt="spacer" style="display:block;" width="1" height="1" border="0"></td>
                    </tr>
                    <tr>
                      <td class="em_defaultlink" style="font-family:'HelveticaNowDisplayBold', Arial, Helvetica, sans-serif; font-size:20px; line-height:28px; color:#1A1A1A; font-weight: bold;" valign="top" align="center"><p class="em_defaultlink em_text_color" style="font-family:'HelveticaNowDisplayBold', Arial, Helvetica, sans-serif; font-size:20px; line-height:28px; color:#1A1A1A; font-weight: bold;"> Artikel in deiner Bestellung: </p></td>
                    </tr>
     
      <!-- Start: Display products details -->
                    {{#products}}
<tr>
                      <td style="height: 20px; font-size: 0px; line-height: 0px;" height="20"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" alt="spacer" style="display:block;" width="1" height="1" border="0"></td>
                    </tr>
                    <tr>
                      <td style="height: 1px; font-size: 0px; line-height: 0px;" height="1" bgcolor="#878787"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" alt="spacer" style="display:block;" width="1" height="1" border="0"></td>
                    </tr>
                    <tr>
                      <td style="height: 14px; font-size: 0px; line-height: 0px;" height="14"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" alt="spacer" style="display:block;" width="1" height="1" border="0"></td>
                    </tr>
                    <tr>
                      <td valign="top" align="center"><table role="presentation" class="em_wrapper" style="width: 500px;" width="500" cellspacing="0" cellpadding="0" border="0" align="center">
                          <tr>
                            <td width="75" valign="middle" align="center"><table role="presentation" style="width: 75px;" width="75" cellspacing="0" cellpadding="0" border="0" align="left">
                                <tr>
                                  <td valign="top" align="center"><img src="{{image_url}}" alt="{{name}}" style="display: block; max-width: 66px;" width="66" border="0"></td>
                                </tr>
                              </table></td>
                            <td style="width: 12px; font-size: 0px; line-height: 0px;" width="12"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" alt="spacer" style="display:block;" width="1" height="1" border="0"></td>
                            <td valign="middle" align="center"><table role="presentation" class="em_wrapper" style="width: 413px;" width="413" cellspacing="0" cellpadding="0" border="0" align="center">
                                <tr>
                                  <td style="padding-right: 10px;" valign="top" align="center"><table role="presentation" class="em_wrapper" style="width: 200px;" width="200" cellspacing="0" cellpadding="0" border="0" align="left">
                                      <tr>
                                        <td class="em_defaultlink" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:24px; color:#1A1A1A;" valign="top" align="left"><p class="em_defaultlink em_text_color" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:24px; color:#1A1A1A;"> {{name}}</p></td>
                                      </tr>
                                      <tr>
                                        <td style="height: 12px; font-size: 0px; line-height: 0px;" height="12"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" alt="spacer" style="display:block;" width="1" height="1" border="0"></td>
                                      </tr>
                                      <tr>
                                        <td class="em_defaultlink" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:21px; color:#1A1A1A;" valign="top" align="left"><p class="em_defaultlink em_text_color" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:21px; color:#1A1A1A;">                                                         Farbe: {{color}}<br>
                                            Größe: {{size}} <br>
                                            Menge: {{quantity}}<br>
                                            Preis: {{price}}
                                             </p></td>
                                      </tr>
                                    </table></td>
                                  <td valign="top" align="center"><table role="presentation" cellspacing="0" cellpadding="0" border="0" align="right">
                                      <tr>
                                        <td class="em_defaultlink" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:21px; color:#1A1A1A;" valign="top" align="left"><p class="em_defaultlink em_text_color" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:21px; color:#1A1A1A;">
 {{line_total}}
                                                           </p></td>
                                      </tr>
                                    </table></td>
                                </tr>
                              </table></td>
                          </tr>
                        </table></td>
                    </tr>
 

                  
     
     
                    
                    {{/products}}
      
                    <tr>
                      <td style="height: 30px; font-size: 0px; line-height: 0px;" height="30"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" alt="spacer" style="display:block;" width="1" height="1" border="0"></td>
                    </tr>
                    <tr>
                      <td style="height: 1px; font-size: 0px; line-height: 0px;" height="1" bgcolor="#878787"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" alt="spacer" style="display:block;" width="1" height="1" border="0"></td>
                    </tr>
                    <tr>
                      <td style="height: 22px; font-size: 0px; line-height: 0px;" height="22"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" alt="spacer" style="display:block;" width="1" height="1" border="0"></td>
                    </tr>
                    <tr>
                      <td valign="top" align="center"><table role="presentation" class="em_wrapper" style="width: 500px;" width="500" cellspacing="0" cellpadding="0" border="0" align="center">
                          <tr>
       <td valign="top" align="center">
                                 
                             
                                  
                            <table role="presentation" class="em_wrapper" style="width: 500px;" width="500" cellspacing="0" cellpadding="0" border="0" align="right">
                                <tr>
                                  <td class="em_defaultlink" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:21px; color:#1A1A1A;" valign="middle" align="left"><p class="em_defaultlink em_text_color" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:21px; color:#1A1A1A;"> Zwischensumme </p></td>
                                  <td class="em_defaultlink" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:21px; color:#1A1A1A;" valign="middle" align="right"><p class="em_defaultlink em_text_color" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:21px; color:#1A1A1A;"> {{subtotal}}  </p></td>
                                </tr>
                                <tr>
                                  <td class="em_defaultlink" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:21px; color:#1A1A1A;" valign="middle" align="left"><p class="em_defaultlink em_text_color" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:21px; color:#1A1A1A;"> Versand </p></td>
                                    
                                    
                                  <td class="em_defaultlink" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:21px; color:#1A1A1A;" valign="middle" align="right"><p class="em_defaultlink em_text_color" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:21px; color:#1A1A1A;">  {{shipping}}   </p></td>
                                </tr>
        
        
                          <tr>
                                  <td class="em_defaultlink" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:21px; color:#1A1A1A;" valign="middle" align="left"><p class="em_defaultlink em_text_color" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:21px; color:#1A1A1A;"> MwSt:  {{tax_rate}} </p></td>
                                  <td class="em_defaultlink" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:21px; color:#1A1A1A;" valign="middle" align="right"><p class="em_defaultlink em_text_color" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:21px; color:#1A1A1A;">  {{tax_amount}}  </p></td>
                                </tr> 
 
                                  

         
         </table></td>
                          </tr>
                          <tr>
                            <td style="height: 13px; font-size: 0px; line-height: 0px;" height="13"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" alt="spacer" style="display:block;" width="1" height="1" border="0"></td>   
        </tr>             
                          <tr>
                            <td valign="top" align="center"><table role="presentation" class="em_wrapper" style="width: 500px;" width="500" cellspacing="0" cellpadding="0" border="0" align="center">
                                <tr>
                                  <td valign="top" align="center"><table role="presentation" class="em_wrapper" style="width: 500px;" width="500" cellspacing="0" cellpadding="0" border="0" align="left">
                                      <tr>
                                        <td class="em_defaultlink" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:21px; color:#1A1A1A; font-weight: bold;" valign="middle" align="left"><p class="em_defaultlink em_text_color" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:21px; color:#1A1A1A;font-weight: bold;"> Gesamtbetrag (inkl. MwSt.) </p></td>
                                        <td class="em_defaultlink" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:21px; color:#1A1A1A; font-weight: bold;" valign="middle" align="right"><p class="em_defaultlink em_text_color" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:21px; color:#1A1A1A; font-weight: bold;"> {{total}}  </p></td>
                                      </tr>
             <!--  --> 
                                    </table></td>
                                </tr>
                              </table></td>
                          </tr>
                         
  
     <!--                   -->

                        
        <tr>
                            <td style="height: 13px; font-size: 0px; line-height: 0px;" height="13"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" alt="spacer" style="display:block;" width="1" height="1" border="0"></td>
        </tr>                
        <tr>
                            <td valign="top" align="center"><table role="presentation" class="em_wrapper" style="width: 500px;" width="500" cellspacing="0" cellpadding="0" border="0" align="center">
                                <tr>
                                  <td valign="top" align="center">
                                   
                                    <table role="presentation" class="em_wrapper" style="width: 500px;" width="500" cellspacing="0" cellpadding="0" border="0" align="right">
                                      <tr>
                                        <td class="em_defaultlink em_text_color" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:21px; color:#1A1A1A; font-weight: bold;" valign="middle" align="left"><p class="em_defaultlink em_text_color" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:21px; color:#1A1A1A;font-weight: bold;">Bitte beachte, dass in den Preisen die Steuer bereits enthalten ist.</p></td>  
                                        
                                      </tr></table></td>
                                </tr>
                              </table></td>
                          </tr>
                       
        <!--                     -->
                        <tr>
                            <td style="height: 13px; font-size: 0px; line-height: 0px;" height="13"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" alt="spacer" style="display:block;" width="1" height="1" border="0"></td>
        </tr>                
        <tr>
                            <td valign="top" align="center"><table role="presentation" class="em_wrapper" style="width: 500px;" width="500" cellspacing="0" cellpadding="0" border="0" align="center">
                                <tr>
                                  <td valign="top" align="center"><table role="presentation" class="em_wrapper" style="width: 254px;" width="254" cellspacing="0" cellpadding="0" border="0" align="right">
                                      
                                    </table></td>
                                </tr>
                              </table></td>
                          </tr>
                        </table></td>
                    </tr>
                    
                  </table></td>
                <td class="em_side25" style="width: 50px;" width="50"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" alt="spacer" style="display:block;" width="1" height="1" border="0"></td>
              </tr>
            </table></td>
        </tr>
        <tr>
          <td valign="top" align="center"><table role="presentation" class="em_wrapper" style="width: 600px;" width="600" cellspacing="0" cellpadding="0" border="0" bgcolor="#F0F0F0" align="center">
              <tr>
                <td class="em_side25" style="width: 50px;" width="50"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" alt="spacer" style="display:block;" width="1" height="1" border="0"></td>
                <td valign="top" align="center"><table role="presentation" class="em_wrapper" style="width: 500px;" width="500" cellspacing="0" cellpadding="0" border="0" align="center">
                    <tr>
                      <td style="height: 20px; font-size: 0px; line-height: 0px;" height="20"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" alt="spacer" style="display:block;" width="1" height="1" border="0"></td>
                    </tr>
                    <tr>
                      <td class="em_defaultlink" style="font-family:'HelveticaNowDisplayBold', Arial, Helvetica, sans-serif; font-size:16px; line-height:28px; color:#1A1A1A; font-weight: bold;" valign="top" align="left"><p class="em_defaultlink" style="font-family:'HelveticaNowDisplayBold', Arial, Helvetica, sans-serif; font-size:16px; line-height:28px; color:#1A1A1A; font-weight: bold;"> Zahlungsmethode: </p></td>
                    </tr>
                    <tr>
                      <td style="height: 7px; font-size: 0px; line-height: 0px;" height="7"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" alt="spacer" style="display:block;" width="1" height="1" border="0"></td>
                    </tr>
     <!--            -->
       
                        <!--            -->
                  
                    <tr>
                      <td valign="middle" align="center"><table role="presentation" class="em_wrapper" style="width: 500px;" width="500" cellspacing="0" cellpadding="0" border="0" align="center">
                          <tr>
                            <td class="em_defaultlink" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:24px; color:#1A1A1A;" valign="middle" align="left"><p class="em_defaultlink" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:24px; color:#1A1A1A;"> {{payment_method}} </p></td>
                            
                     
                            
                          </tr>
                        </table></td>
                    </tr>
       
                    <tr>
                      <td style="height: 23px; font-size: 0px; line-height: 0px;" height="23"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" alt="spacer" style="display:block;" width="1" height="1" border="0"></td>
                    </tr>
                  </table></td>
                <td class="em_side25" style="width: 50px;" width="50"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" alt="spacer" style="display:block;" width="1" height="1" border="0"></td>
              </tr>
            </table></td>
        </tr>
      </table></td>
  </tr>
</table>
<table role="presentation" class="em_full_wrap" style="table-layout:fixed;" width="100%" cellspacing="0" cellpadding="0" border="0">
  <tr>
    <td valign="top" align="center"><table role="presentation" style="width:600px;" class="em_main_table" width="600" cellspacing="0" cellpadding="0" border="0" align="center">
        <tr>
          <td valign="top" align="center"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
              <tr>
                <td valign="top" align="center"><table role="presentation" class="em_wrapper" style="width: 600px;" width="600" cellspacing="0" cellpadding="0" border="0" align="center">
                    <tr>
                      <td style="height: 36px; font-size: 0px; line-height: 0px;" height="36"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" alt="spacer" style="display:block;" width="1" height="1" border="0"></td>
                    </tr>
                    <tr>
                      <td class="em_defaultlink" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:24px; color:#1A1A1A;" valign="top" align="center"><p class="em_defaultlink em_text_color" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:16px; line-height:24px; color:#1A1A1A;"> Vielen Dank, dass du dich für Arc’teryx entschieden hast!  </p></td>
                    </tr>
                    <tr>
                      <td style="height: 26px; font-size: 0px; line-height: 0px;" height="26"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" alt="spacer" style="display:block;" width="1" height="1" border="0"></td>
                    </tr>
                    <tr>
                      
                    </tr>
                  
                    
                  </table></td>
              </tr>
            </table></td>
        </tr>
      </table></td>
     </tr><tr>
                      
                    </tr>
  
</table>

<!-- == //Body Section == --> </td></tr></table>
<table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="min-width: 100%; " class="stylingblock-content-wrapper"><tr><td class="stylingblock-content-wrapper camarker-inner">
<table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="min-width: 100%; " class="stylingblock-content-wrapper"><tr><td class="stylingblock-content-wrapper camarker-inner">
<table width="599" border="0" cellspacing="0" cellpadding="0" align="center" role="presentation" class="em_wrapper" style="width: 600px;">
               <!-- <tr>                       <td class="em_h30" height="10" style="height: 10px; font-size: 0px; line-height: 0px;"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" width="1" height="1" alt="" border="0" style="display:block;"></td>                     </tr> -->        
                
          <tr>
      <td valign="top" align="center">
       <table role="presentation" align="center" width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="#F0F0F0" class="em_wrapper em_dark2" style="width:600px;">
        <tr>
         <td class="em_pad5" valign="top" align="center" style="padding: 22px 50px 22px;">
          <table role="presentation" align="center" width="100%" border="0" cellspacing="0" cellpadding="0">
           <tr>
            <td class="em_defaultlink em_dm_white" valign="top" align="center" style="font-family:'HelveticaNowDisplayBold', Arial, Helvetica, sans-serif; font-size:20px; line-height:26px; color:#1A1A1A; font-weight: bold;padding-bottom:5px;">
              Brauchst du Hilfe bei deiner Bestellung?
            </td>
           </tr>
           <tr>
            <td class="em_defaultlink em_dm_white" valign="top" align="center" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:1rem; line-height:24px; color:#1A1A1A;">
       Besuche unser <b><a alias="cust_support" href="https://www.arcteryx.com/help" target="_blank" style="color: #1A1A1A; text-decoration: underline;">Kundenservicezentrum</a></b>.
            </td>
           </tr>
          </table>
         </td>
        </tr>
       </table>
      </td>
     </tr>
     <tr>
      <td height="10" style="height: 10px; font-size: 0px; line-height: 0px;"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" width="1" height="1" alt="" border="0" style="display:block;"></td>
     </tr>
     <tr>
      <td valign="top" align="center">
       <table role="presentation" align="center" width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="#F0F0F0" class="em_wrapper em_dark2" style="width:600px;">
        <tr>
         <td class="em_pad5" valign="top" align="center" style="padding: 22px 50px 22px;">
          <table role="presentation" align="center" width="100%" border="0" cellspacing="0" cellpadding="0">
           <tr>
            <td class="em_defaultlink em_dm_white" valign="top" align="center" style="font-family:'HelveticaNowDisplayBold', Arial, Helvetica, sans-serif; font-size:20px; line-height:26px; color:#1A1A1A; font-weight: bold;padding-bottom:5px;">
               Umentschieden?
            </td>
           </tr>
           <tr>
            <td class="em_defaultlink em_dm_white" valign="top" align="center" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:1rem; line-height:24px; color:#1A1A1A;">
                Rückgaben sind innerhalb von 30 Tagen nach Erhalt der Bestellung möglich. Weitere Details findest du in unserer <b><a alias="cust_return" href="https://arcteryx.com/help/returns?intcmp=returns" target="_blank" style="color: #1A1A1A; text-decoration: underline;">Rückgabebedingungen</a></b>.
            </td>
           </tr>
          </table>
         </td>
        </tr>
       </table>
      </td>
     </tr>
     <tr>
      <td height="10" style="height: 10px; font-size: 0px; line-height: 0px;"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" width="1" height="1" alt="spacer" border="0" style="display:block;"></td>
     </tr>
     <tr>
      <td valign="top" align="center">
       <table role="presentation" align="center" width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="#F0F0F0" class="em_wrapper em_dark2" style="width:600px;">
        <tr>
         <td class="em_pad5" valign="top" align="center" style="padding: 22px 50px 22px;">
          <table role="presentation" align="center" width="100%" border="0" cellspacing="0" cellpadding="0">
           <tr>
            <td class="em_defaultlink em_dm_white" valign="top" align="center" style="font-family:'HelveticaNowDisplayBold', Arial, Helvetica, sans-serif; font-size:20px; line-height:26px; color:#1A1A1A; font-weight: bold;padding-bottom:5px;">
               Willst du zuerst informiert werden?
            </td>
           </tr>
           <tr>
            <td class="em_defaultlink em_dm_white" valign="top" align="center" style="font-family:'HelveticaNowDisplayRegular', Arial, Helvetica, sans-serif; font-size:1rem; line-height:24px; color:#1A1A1A;">
              <b><a alias="sign_up" href="https://www.arcteryx.com/email-signup/" target="_blank" style="color: #1A1A1A; text-decoration: underline;">Melde dich</a></b> an und erhalte Updates zu der neuesten Outdoor-Ausrüstung, lokalen Events, Sonderangeboten und mehr.
            </td>
           </tr>
            
          </table>
         </td>
        </tr>
       </table>
      </td></tr><tr>
      <td height="40" style="height: 40px; font-size: 0px; line-height: 0px;"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" width="1" height="1" alt="spacer" border="0" style="display:block;"></td>
     </tr> 
      
                        
                  </table></td></tr></table>




</td></tr></table><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="min-width: 100%; " class="stylingblock-content-wrapper"><tr><td class="stylingblock-content-wrapper camarker-inner"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="min-width: 100%; " class="stylingblock-content-wrapper"><tr><td class="stylingblock-content-wrapper camarker-inner">
<!-- == Footer Section == -->
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" class="em_dark_bg em_full_wrap" bgcolor="#ffffff" style="table-layout:fixed;">
  <tr>
    <td align="center" valign="top"><table role="presentation" align="center" width="600" border="0" cellspacing="0" cellpadding="0" class="em_main_table" style="width:600px;" bgcolor="#333333">
        <tr>
          <td align="center" valign="top"><table role="presentation" align="center" style="width:600px;" class="em_wrapper" width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="#333333">
              <tr>
                <td height="12" style="height:12px; font-size:0px; line-height:0px;"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" width="1" height="1" alt="" border="0" style="display:block;"></td>
              </tr>
              <tr>
                <td align="center" valign="top"><table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td class="em_fw15" width="48" style="width:48px;"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" width="1" height="1" alt="" border="0" style="display:block;"></td>
                      <td align="center" valign="top"><table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td align="center" valign="top"><table role="presentation" class="em_wrapper" align="center" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                  <th align="center" valign="top" class="em_clear"><table role="presentation" align="left" style="width:250px;" class="em_wrapper" width="250" border="0" cellspacing="0" cellpadding="0">
                                      <tr>
                                        <td align="center" valign="top"><table role="presentation" align="center" class="em_wrapper" width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                              <td align="center" valign="top" style="width:123px;" width="123" class="em_wid49"><table role="presentation" align="center" style="width:123px;" width="123" class="em_wrapper" border="0" cellspacing="0" cellpadding="0">
                                                  <tr>
                                                    <td align="center" valign="top"><table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                                                        <tr>
                                                          <td class="em_fbd" align="center" valign="middle" style="border: 2px solid #FFFFFF"><table role="presentation" align="center" width="100%" border="0" cellspacing="0" cellpadding="0">
                                                              
                                                                <tr>
                                                                  <td align="center" height="86" valign="middle" class="em_defaultlink em_cta_text_color" style="font-family:'helvetica-now-display', Arial, sans-serif; height: 86px; font-size:14px; color:#F9F9F6;font-weight: 700;"><h1 align="center" valign="middle" class="em_defaultlink em_cta_text_color" style="font-family:'helvetica-now-display', Arial, sans-serif;  font-size:14px; color:#F9F9F6; font-weight: 700;"><a href="#" target="_blank" style="text-decoration: none; color: #F9F9F6; display:block;line-height:21px;">Finde einen
<br>Store</a></h1></td>
                                                                </tr>
                                                              
                                                            </table></td>
                                                        </tr>
                                                      </table></td>
                                                  </tr>
                                                </table></td>
                                              <td width="4" style="width:4px;" class="em_wid1"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" width="1" height="1" alt="" border="0" style="display:block;"></td>
                                              <td align="center" valign="top" style="width:123px;" width="123" class="em_wid49"><table role="presentation" align="center" style="width:123px;" width="123" class="em_wrapper" border="0" cellspacing="0" cellpadding="0">
                                                  <tr>
                                                    <td align="center" valign="top"><table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                                                        <tr>
                                                          <td class="em_fbd" align="center" valign="middle" style="border: 2px solid #FFFFFF"><table role="presentation" align="center" width="100%" border="0" cellspacing="0" cellpadding="0">
<tr>
                                                                  <td align="center" height="86" valign="middle" class="em_defaultlink em_cta_text_color" style="font-family:'helvetica-now-display', Arial, sans-serif; height: 86px;   font-size:14px; color:#F9F9F6;font-weight: 700;"><p align="center" valign="middle" class="em_defaultlink em_cta_text_color" style="font-family:'helvetica-now-display', Arial, sans-serif;  font-size:14px; color:#F9F9F6; font-weight: 700;"><a href="#" target="_blank" style="text-decoration: none; color: #F9F9F6; display:block;line-height:21px;">Kunden-
<br>service-<br>zentrum</a></p></td>
                                                                </tr>
                                                              
                                                            </table></td>
                                                        </tr>
                                                      </table></td>
                                                  </tr>
                                                </table></td>
                                            </tr>
                                          </table></td>
                                      </tr>
                                    </table></th>
                                  <th width="4" style="width:4px;line-height: 0px; font-size: 0px;" class="em_clear em_h4"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" width="1" height="1" alt="" border="0" style="display:block;"></th>
                                  <th align="center" valign="top" class="em_clear"><table role="presentation" align="left" style="width:250px;" class="em_wrapper" width="250" border="0" cellspacing="0" cellpadding="0">
                                      <tr>
                                        <td align="center" valign="top"><table role="presentation" align="center" class="em_wrapper" width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                              <td align="center" valign="top" style="width:123px;" width="123" class="em_wid49"><table role="presentation" align="center" style="width:123px;" width="123" class="em_wrapper" border="0" cellspacing="0" cellpadding="0">
                                                  <tr>
                                                    <td align="center" valign="top"><table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                                                        <tr>
                                                          <td class="em_fbd" align="center" valign="middle" style="border: 2px solid #FFFFFF"><table role="presentation" align="center" width="100%" border="0" cellspacing="0" cellpadding="0">
                                                              
                                                                <tr>
                                                                  <td align="center" height="86" valign="middle" class="em_defaultlink em_cta_text_color" style="font-family:'helvetica-now-display', Arial, sans-serif; height: 86px; font-size:14px; color:#F9F9F6;font-weight: 700;"><p align="center" valign="middle" class="em_defaultlink em_cta_text_color" style="font-family:'helvetica-now-display', Arial, sans-serif;  font-size:14px; color:#F9F9F6; font-weight: 700;"><a href="#" target="_blank" style="text-decoration: none; color: #F9F9F6; display:block;line-height:21px;">Produktpflege</a>
</p></td>
                                                                </tr>
                                                              
                                                            </table></td>
                                                        </tr>
                                                      </table></td>
                                                  </tr>
                                                </table></td>
                                              <td width="4" style="width:4px;" class="em_wid1"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" width="1" height="1" alt="" border="0" style="display:block;"></td>
                                              <td align="center" valign="top" style="width:123px;" width="123" class="em_wid49"><table role="presentation" align="center" style="width:123px;" width="123" class="em_wrapper" border="0" cellspacing="0" cellpadding="0">
                                                  <tr>
                                                    <td align="center" valign="top"><table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                                                        <tr>
                                                          <td class="em_fbd" align="center" valign="middle" style="border: 2px solid #FFFFFF"><table role="presentation" align="center" width="100%" border="0" cellspacing="0" cellpadding="0">
                                                              
                                                                <tr>
                                                                  <td align="center" height="86" valign="middle" class="em_defaultlink em_cta_text_color" style="font-family:'helvetica-now-display', Arial, sans-serif; height: 86px;   font-size:14px; color:#F9F9F6;font-weight: 700;"><p align="center" valign="middle" class="em_defaultlink em_cta_text_color" style="font-family:'helvetica-now-display', Arial, sans-serif;  font-size:14px; color:#F9F9F6; font-weight: 700;"><a href="#" target="_blank" style="text-decoration: none; color: #F9F9F6; display:block;line-height:21px;">E-mails erhalten
</a></p></td>
                                                                </tr>
                                                              
                                                            </table></td>
                                                        </tr>
                                                      </table></td>
                                                  </tr>
                                                </table></td>
                                            </tr>
                                          </table></td>
                                      </tr>
                                    </table></th>
                                </tr>
                              </table></td>
                          </tr>
                          <tr>
                            <td height="40" style="height:40px;"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" width="1" height="1" alt="" border="0" style="display:block;"></td>
                          </tr>
                          <tr>
                            <td align="center" valign="top"><table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                  <td align="center" valign="top"><a href="#" target="_blank" style="text-decoration:none;color:#000000;"><img src="http://drm.arcteryx.com/Footers/android_app.png" width="105" alt="Android App" border="0" style="display:block;max-width:105px;font-family:'URW DIN', Arial, sans-serif; font-size:9px;line-height:13px;color:#000000;"></a></td>
                                  <td width="35" style="width:35px;"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" width="1" height="1" alt="" border="0" style="display:block;"></td>
                                  <td align="center" valign="top"><a href="#" target="_blank" style="text-decoration:none;color:#000000;"><img src="http://drm.arcteryx.com/Footers/ios_app.png" alt="iOS App" width="62" style="display:block;max-width:62px;font-family:'URW DIN', Arial, sans-serif; font-size:9px;line-height:13px;color:#000000;" border="0"></a></td>
                                </tr>
                              </table></td>
                          </tr>
                          <tr>
                            <td height="32" style="height:32px;"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" width="1" height="1" alt="" border="0" style="display:block;"></td>
                          </tr>
                          <tr>
                            <td align="center" valign="top"><table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                  <td align="center" valign="top"><a href="#" target="_blank" style="text-decoration:none;color:#000000;"><img src=" https://drm.arcteryx.com/Footers/insta_icon.png" alt="INSTA" width="16" style="display:block;max-width:16px;font-family:'URW DIN',Arial,sans-serif;font-size:9px;line-height:13px;color:#000000;" border="0"></a></td>
                                  <td width="32" style="width:32px;"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" width="1" height="1" alt="" border="0" style="display:block;"></td>
                                  <td align="center" valign="middle"><a href="#" target="_blank" style="text-decoration:none;color:#000000;"><img src="http://drm.arcteryx.com/Footers/yt_icon.png" alt="YT" width="17" style="display:block;max-width:17px;font-family:'URW DIN',Arial,sans-serif;font-size:9px;line-height:13px;color:#000000;" border="0"></a></td>
                                  <td width="32" style="width:32px;"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" width="1" height="1" alt="" border="0" style="display:block;"></td>
                                  <td align="center" valign="top"><a href="#" target="_blank" style="text-decoration:none;color:#000000;"><img src="http://drm.arcteryx.com/Footers/fb_icon.png" alt="FB" width="9" style="display:block;max-width:9px;font-family:'URW DIN',Arial,sans-serif;font-size:9px;line-height:13px;color:#000000;" border="0"></a></td>
                                  <td width="32" style="width:32px;"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" width="1" height="1" alt="" border="0" style="display:block;"></td>
                                  <td align="center" valign="top"><a href="#" target="_blank" style="text-decoration:none;color:#000000;"><img src="http://drm.arcteryx.com/Footers/tt_icon.png" alt="tt" width="14" style="display:block;max-width:14px;font-family:'URW DIN',Arial,sans-serif;font-size:9px;line-height:13px;color:#000000;" border="0"></a></td>
                                </tr>
                              </table></td>
                          </tr>
                        </table></td>
                      <td class="em_fw15" width="48" style="width:48px;"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" width="1" height="1" alt="" border="0" style="display:block;"></td>
                    </tr>
                  </table></td>
              </tr>
              <tr>
                <td height="31" style="height:31px;"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" width="1" height="1" alt="" border="0" style="display:block;"></td>
              </tr>
              <tr>
                <td height="2" style="height:2px;font-size:0px;line-height:0px;background-color: #f0f0f0" bgcolor="#f0f0f0"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" width="1" height="1" alt="" border="0" style="display:block;"></td>
              </tr>
              <tr>
                <td height="18" style="height:18px;font-size:0px;line-height:0px;"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" width="1" height="1" alt="" border="0" style="display:block;"></td>
              </tr>
              <tr>
                <td class="em_text_color em_aside15" align="center" valign="top" style="font-family:'helvetica-now-display',Arial,sans-serif;font-size:14px;line-height:20px;color:#FFFFFF;font-weight: 700;"><p class="em_text_color" align="center" valign="top" style="font-family:'helvetica-now-display', Arial, sans-serif; font-size:14px;line-height:20px;color:#FFFFFF;font-weight: 700;"><a href="#" target="_blank" style="text-decoration:underline;color:#FFFFFF;">Datenschutzrichtlinie</a></p></td>
              </tr>
              <tr>
                <td height="18" style="height:18px;font-size:0px;line-height:0px;"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" width="1" height="1" alt="" border="0" style="display:block;"></td>
              </tr>
              <tr>
                <td class="em_f9 em_defaultlink em_text_color" align="center" valign="top" style="font-family:'helvetica-now-display', Arial, sans-serif;font-size:12px;line-height:18px;color:#FFFFFF;padding:0px 90px;"><p class="em_f9" align="center" valign="top" style="font-family:'helvetica-now-display', Arial, sans-serif; font-size:12px;line-height:18px;color:#FFFFFF;">Diese Nachricht ist für: <a href="mailto:dionotto@outlook.de" style="text-decoration: none; color: #ffffff">dionotto@outlook.de</a> <br>
                    <br>
                    Damit du weiterhin auf dem Laufenden bleibst, nimm  <a href="mailto:email@news.arcteryx.com" style="text-decoration: none; color: #ffffff">email@news.arcteryx.com</a>  bitte in dein Adressbuch auf. <br>
                    <br>
                    ARC’TERYX Equipment, A Division Of Amer ‌Sports&nbsp;Canada&nbsp;Inc.‌ <br>
                    <span class="em_mob_block em_pf"></span> ‌110-2220‌ ‌Dollarton‌ Hwy, ‌North‌ ‌Vancouver‌, ‌BC‌, ‌V7H&nbsp;1A8,&nbsp;Canada‌</p></td>
              </tr>
              <tr>
                <td height="41" style="height:41px;"><img src="http://drm.arcteryx.com/2018/template/spacer.gif" width="1" height="1" alt="" border="0" style="display:block;"></td>
              </tr>
            </table></td>
        </tr>
        <tr>
          <td class="em_dark_bg em_hide" style="line-height:1px;min-width:600px;background-color:#333333;"><img alt="" src="http://drm.arcteryx.com/2018/template/spacer.gif" height="1" width="600" style="max-height:1px;min-height:1px;display:block;width:600px;min-width:600px;" border="0"></td>
        </tr>
      </table></td>
  </tr>
</table>
<!-- == //Footer Section == --></td></tr></table></td></tr></table>
<!-- == //Body Section == -->
  
<!-- == Footer Section == -->

<!-- == //Footer Section == -->
<img src="https://click.e.arcteryx.com/open.aspx?OXZAIWPH2UCULAIR4Q5NYESQ7E.60256&amp;d=60256&amp;bmt=0" width="1" height="1" alt="">
<table width="1" height="1" cellpadding="0" cellspacing="0" border="0">
 </table>
</body>
</html>

--IibtQaFCZ66L=_?:--`;
}
let db;
function getDbPath() {
  let dbDir;
  if (electron.app.isPackaged) {
    dbDir = electron.app.getPath("userData");
  } else {
    dbDir = path.join(electron.app.getAppPath(), "data");
  }
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  return path.join(dbDir, "validsreceipt.db");
}
function initDatabase() {
  const dbPath = getDbPath();
  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  runMigrations();
}
function runMigrations() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS brands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      logo_path TEXT,
      template_html TEXT DEFAULT '',
      template_css TEXT DEFAULT '',
      website_url TEXT DEFAULT '',
      vat_id TEXT DEFAULT '',
      tax_rate REAL DEFAULT 19.0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS brand_selectors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand_id INTEGER NOT NULL,
      url_pattern TEXT NOT NULL,
      product_name_sel TEXT DEFAULT '',
      product_price_sel TEXT DEFAULT '',
      product_image_sel TEXT DEFAULT '',
      product_options_sel TEXT DEFAULT '{}',
      last_validated TEXT,
      FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS receipts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand_id INTEGER NOT NULL,
      receipt_number TEXT NOT NULL,
      order_number TEXT NOT NULL,
      date TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_address TEXT NOT NULL,
      customer_city TEXT NOT NULL,
      customer_zip TEXT NOT NULL,
      customer_country TEXT DEFAULT 'DE',
      subtotal REAL NOT NULL,
      shipping REAL DEFAULT 0,
      tax_rate REAL DEFAULT 19.0,
      tax_amount REAL NOT NULL,
      total REAL NOT NULL,
      payment_method TEXT DEFAULT '',
      currency TEXT DEFAULT 'EUR',
      html_content TEXT DEFAULT '',
      screenshot_path TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS receipt_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      receipt_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      color TEXT,
      size TEXT,
      quantity INTEGER DEFAULT 1,
      unit_price REAL NOT NULL,
      line_total REAL NOT NULL,
      image_url TEXT,
      image_local_path TEXT,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (receipt_id) REFERENCES receipts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS receipt_numbers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand_id INTEGER NOT NULL UNIQUE,
      prefix TEXT NOT NULL DEFAULT '',
      next_number INTEGER DEFAULT 1000,
      FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS order_numbers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand_id INTEGER NOT NULL UNIQUE,
      prefix TEXT NOT NULL DEFAULT '',
      next_number INTEGER DEFAULT 1000000,
      FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
    );
  `);
}
function getAllBrands() {
  return db.prepare("SELECT * FROM brands ORDER BY name").all();
}
function getBrand(id) {
  return db.prepare("SELECT * FROM brands WHERE id = ?").get(id);
}
function createBrand(data) {
  const stmt = db.prepare(`
    INSERT INTO brands (name, logo_path, template_html, template_css, website_url, vat_id, tax_rate)
    VALUES (@name, @logo_path, @template_html, @template_css, @website_url, @vat_id, @tax_rate)
  `);
  const info = stmt.run({
    name: data.name,
    logo_path: data.logo_path || null,
    template_html: data.template_html || "",
    template_css: data.template_css || "",
    website_url: data.website_url || "",
    vat_id: data.vat_id || "",
    tax_rate: data.tax_rate ?? 19
  });
  return getBrand(info.lastInsertRowid);
}
function updateBrand(id, data) {
  const sets = [];
  const params = { id };
  const allowed = ["name", "logo_path", "template_html", "template_css", "website_url", "vat_id", "tax_rate"];
  for (const key of allowed) {
    if (key in data) {
      sets.push(`${key} = @${key}`);
      params[key] = data[key];
    }
  }
  if (sets.length > 0) {
    sets.push("updated_at = datetime('now')");
    db.prepare(`UPDATE brands SET ${sets.join(", ")} WHERE id = @id`).run(params);
  }
  return getBrand(id);
}
function deleteBrand(id) {
  db.prepare("DELETE FROM brands WHERE id = ?").run(id);
}
function getAllReceipts() {
  const receipts = db.prepare("SELECT * FROM receipts ORDER BY created_at DESC").all();
  return receipts.map((r) => ({
    ...r,
    items: db.prepare("SELECT * FROM receipt_items WHERE receipt_id = ? ORDER BY sort_order").all(r.id),
    brand: db.prepare("SELECT * FROM brands WHERE id = ?").get(r.brand_id)
  }));
}
function getReceipt(id) {
  const receipt = db.prepare("SELECT * FROM receipts WHERE id = ?").get(id);
  if (!receipt) return void 0;
  return {
    ...receipt,
    items: db.prepare("SELECT * FROM receipt_items WHERE receipt_id = ? ORDER BY sort_order").all(receipt.id),
    brand: db.prepare("SELECT * FROM brands WHERE id = ?").get(receipt.brand_id)
  };
}
function saveReceipt(data) {
  const insertReceipt = db.prepare(`
    INSERT INTO receipts (brand_id, receipt_number, order_number, date, customer_name, customer_address, customer_city, customer_zip, customer_country, subtotal, shipping, tax_rate, tax_amount, total, payment_method, currency)
    VALUES (@brand_id, @receipt_number, @order_number, @date, @customer_name, @customer_address, @customer_city, @customer_zip, @customer_country, @subtotal, @shipping, @tax_rate, @tax_amount, @total, @payment_method, @currency)
  `);
  const result = insertReceipt.run({
    brand_id: data.brand_id,
    receipt_number: data.receipt_number,
    order_number: data.order_number,
    date: data.date,
    customer_name: data.customer_name,
    customer_address: data.customer_address,
    customer_city: data.customer_city,
    customer_zip: data.customer_zip,
    customer_country: data.customer_country,
    subtotal: data.subtotal,
    shipping: data.shipping,
    tax_rate: data.tax_rate,
    tax_amount: data.tax_amount,
    total: data.total,
    payment_method: data.payment_method,
    currency: data.currency
  });
  const receiptId = result.lastInsertRowid;
  const insertItem = db.prepare(`
    INSERT INTO receipt_items (receipt_id, name, color, size, quantity, unit_price, line_total, image_url, image_local_path, sort_order)
    VALUES (@receipt_id, @name, @color, @size, @quantity, @unit_price, @line_total, @image_url, @image_local_path, @sort_order)
  `);
  for (let i = 0; i < data.items.length; i++) {
    const item = data.items[i];
    insertItem.run({
      receipt_id: receiptId,
      name: item.name,
      color: item.color || null,
      size: item.size || null,
      quantity: item.quantity,
      unit_price: item.unit_price,
      line_total: item.unit_price * item.quantity,
      image_url: item.image_url || null,
      image_local_path: item.image_local_path || null,
      sort_order: i
    });
  }
  return receiptId;
}
function deleteReceipt(id) {
  db.prepare("DELETE FROM receipts WHERE id = ?").run(id);
}
function getNextReceiptNumber(brandId) {
  let row = db.prepare("SELECT * FROM receipt_numbers WHERE brand_id = ?").get(brandId);
  if (!row) {
    db.prepare("INSERT INTO receipt_numbers (brand_id, prefix, next_number) VALUES (?, ?, ?)").run(brandId, "", 1e3);
    row = { prefix: "", next_number: 1e3 };
  }
  const num = row.next_number;
  db.prepare("UPDATE receipt_numbers SET next_number = ? WHERE brand_id = ?").run(num + 1, brandId);
  return row.prefix + String(num).padStart(6, "0");
}
function getNextOrderNumber(brandId) {
  let row = db.prepare("SELECT * FROM order_numbers WHERE brand_id = ?").get(brandId);
  if (!row) {
    db.prepare("INSERT INTO order_numbers (brand_id, prefix, next_number) VALUES (?, ?, ?)").run(brandId, "", 1e6);
    row = { prefix: "", next_number: 1e6 };
  }
  const num = row.next_number;
  db.prepare("UPDATE order_numbers SET next_number = ? WHERE brand_id = ?").run(num + 1, brandId);
  return row.prefix + String(num).padStart(10, "0");
}
function getBrandSelectors(brandId) {
  return db.prepare("SELECT * FROM brand_selectors WHERE brand_id = ?").all(brandId);
}
function saveBrandSelector(brandId, urlPattern, selectors) {
  const existing = db.prepare("SELECT id FROM brand_selectors WHERE brand_id = ? AND url_pattern = ?").get(brandId, urlPattern);
  if (existing) {
    db.prepare(`
      UPDATE brand_selectors SET product_name_sel = ?, product_price_sel = ?, product_image_sel = ?, product_options_sel = ?, last_validated = datetime('now')
      WHERE id = ?
    `).run(selectors.product_name_sel, selectors.product_price_sel, selectors.product_image_sel, selectors.product_options_sel, existing.id);
  } else {
    db.prepare(`
      INSERT INTO brand_selectors (brand_id, url_pattern, product_name_sel, product_price_sel, product_image_sel, product_options_sel, last_validated)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `).run(brandId, urlPattern, selectors.product_name_sel, selectors.product_price_sel, selectors.product_image_sel, selectors.product_options_sel);
  }
}
function seedArcteryx() {
  const existing = db.prepare("SELECT * FROM brands WHERE name = ?").get("Arc'teryx");
  if (existing) return existing;
  const brand = createBrand({
    name: "Arc'teryx",
    website_url: "https://www.arcteryx.com",
    vat_id: "DE298877565",
    tax_rate: 19,
    template_html: getArcteryxTemplate(),
    template_css: ""
  });
  db.prepare("INSERT INTO receipt_numbers (brand_id, prefix, next_number) VALUES (?, ?, ?)").run(brand.id, "55", 15521335);
  db.prepare("INSERT INTO order_numbers (brand_id, prefix, next_number) VALUES (?, ?, ?)").run(brand.id, "00", 44399093);
  saveBrandSelector(brand.id, "*.arcteryx.com/*", {
    product_name_sel: 'h1.product-name, .product-title, [data-testid="product-name"]',
    product_price_sel: '.product-price, [data-testid="product-price"], .price',
    product_image_sel: '.product-image img, [data-testid="product-image"] img, .gallery-image img',
    product_options_sel: JSON.stringify({ color: ".color-swatch.selected", size: ".size-option.selected" })
  });
  return brand;
}
function closeDatabase() {
  if (db) db.close();
}
async function parseEMLFile(filePath) {
  const buffer = fs.readFileSync(filePath);
  const parsed = await postalMime.parse(buffer);
  const htmlBody = parsed.html || "";
  const textBody = parsed.text || "";
  return {
    from: parsed.from?.address || "",
    subject: parsed.subject || "",
    htmlBody,
    textBody,
    date: parsed.date || ""
  };
}
function extractReceiptDataFromHtml(html) {
  const result = {
    receiptNumber: null,
    orderNumber: null,
    vatId: null,
    date: null,
    customerName: null,
    customerAddress: null,
    customerCity: null,
    customerZip: null,
    customerCountry: null,
    paymentMethod: null,
    products: [],
    subtotal: null,
    shipping: null,
    taxRate: null,
    taxAmount: null,
    total: null,
    currency: "EUR"
  };
  const rechnungNr = html.match(/Rechnung\s*(?:Nr\.:|#)\s*(\d[\d\s]*\d)/i);
  if (rechnungNr) result.receiptNumber = rechnungNr[1].replace(/\s/g, "");
  const bestellNr = html.match(/Bestellnummer:?\s*(\d[\d\s]*\d)/i);
  if (bestellNr) result.orderNumber = bestellNr[1].replace(/\s/g, "");
  const vatMatch = html.match(/Mehrwertsteuer\s*(?:Nr\.:|#|ID:?)\s*(DE\d+)/i);
  if (vatMatch) result.vatId = vatMatch[1];
  const dateMatch = html.match(/Rechnungsdatum:?\s*(?:<br>)?\s*(\d{1,2}\.\s*\w+\s*\d{4})/i);
  if (dateMatch) result.date = dateMatch[1];
  const nameMatch = html.match(/(?:Rechnung\s+an:?|Hallo)\s*(?:<br>)?\s*([A-ZÄÖÜ][a-zäöüß]+\s+[A-ZÄÖÜ][a-zäöüß]+)/i);
  if (nameMatch) result.customerName = nameMatch[1].trim();
  const addrMatch = html.match(/(?:Heinrich-Heine-Str\.|Straße|Str\.)\s*(\d+[a-z]?)/i);
  if (addrMatch) {
    const fullMatch = html.match(/([A-ZÄÖÜ][a-zäöüß-]+(?:[-.][A-ZÄÖÜa-zäöüß]+)?(?:-Str\.|-Straße|straße|str\.)?\s*\d+[a-z]?)/i);
    if (fullMatch) result.customerAddress = fullMatch[1].trim();
  }
  const cityMatch = html.match(/(?:Hannover|Berlin|München|Hamburg|Köln|Frankfurt|Stuttgart|Düsseldorf|Leipzig|Dresden)/i);
  if (cityMatch) result.customerCity = cityMatch[0];
  const zipMatch = html.match(/\b(\d{5})\b/);
  if (zipMatch) result.customerZip = zipMatch[1];
  const countryMatch = html.match(/\b(DE|AT|CH)\s+\d{4,5}\b/i);
  if (countryMatch) result.customerCountry = countryMatch[1];
  const payMatch = html.match(/(?:Zahlungsmethode|Bezahlung).*?(PAYPAL|Kreditkarte|Visa|Mastercard|Rechnung|Lastschrift|Klarna|Sofort)/i);
  if (payMatch) result.paymentMethod = payMatch[1];
  html.match(/<td[^>]*>(?:<p[^>]*>)?\s*([\w\s-]+)(?:<\/p>)?\s*<\/td>\s*<td[^>]*>(?:<p[^>]*>)?\s*(\d{1,6}(?:[,.]\d{2})?)\s*(?:€|EUR)/gi);
  const productNameMatches = html.match(/Nu\s+(?:Funktionswaschmittel|Daunenwaschmittel)/gi) || [];
  [...html.matchAll(/(\d{1,6}(?:[,.]\d{2}))\s*€/g)];
  for (let i = 0; i < productNameMatches.length; i++) {
    const name = productNameMatches[i];
    let price = 0;
    const productSection = html.substring(
      html.indexOf(name),
      i < productNameMatches.length - 1 ? html.indexOf(productNameMatches[i + 1]) : html.length
    );
    const priceMatch = productSection.match(/Preis:?\s*(\d{1,6}(?:[,.]\d{2}))\s*€/);
    if (priceMatch) {
      price = parseFloat(priceMatch[1].replace(",", "."));
    }
    const imageMatch = productSection.match(/<img\s+[^>]*src="([^"]*)"[^>]*>/i);
    result.products.push({
      name: name.trim(),
      price,
      color: productSection.match(/Farbe:?\s*(.+?)(?:<|$)/i)?.[1]?.trim() || null,
      size: productSection.match(/Größe:?\s*(.+?)(?:<|$)/i)?.[1]?.trim() || null,
      quantity: parseInt(productSection.match(/Menge:?\s*(\d+)/i)?.[1] || "1"),
      imageUrl: imageMatch?.[1] || null
    });
  }
  const subtotalMatch = html.match(/Zwischensumme.*?(\d{1,6}(?:[,.]\d{2}))\s*€/i);
  if (subtotalMatch) result.subtotal = parseFloat(subtotalMatch[1].replace(",", "."));
  const shippingMatch = html.match(/Versand.*?(\d{1,6}(?:[,.]\d{2}))\s*€/i);
  if (shippingMatch) result.shipping = parseFloat(shippingMatch[1].replace(",", "."));
  const taxMatch = html.match(/MwSt.*?(\d{1,2}(?:[,.]\d{1,2})?)%/i);
  if (taxMatch) result.taxRate = parseFloat(taxMatch[1].replace(",", "."));
  const taxAmountMatch = html.match(/MwSt.*?(\d{1,6}(?:[,.]\d{2}))\s*€/i);
  if (taxAmountMatch) result.taxAmount = parseFloat(taxAmountMatch[1].replace(",", "."));
  const totalMatch = html.match(/Gesamtbetrag.*?(\d{1,6}(?:[,.]\d{2}))\s*€/i);
  if (totalMatch) result.total = parseFloat(totalMatch[1].replace(",", "."));
  return result;
}
let browser = null;
function getChromiumPath() {
  const possiblePaths = [
    "/usr/bin/brave",
    "/usr/bin/brave-browser",
    "/usr/bin/chromium",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/google-chrome",
    "/opt/brave.com/brave/brave"
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error("Kein Browser gefunden. Installiere Brave oder Chromium.");
}
function getBraveProfilePath() {
  const home = os.homedir();
  const possiblePaths = [
    path.join(home, ".config", "BraveSoftware", "Brave-Browser", "Default"),
    path.join(home, ".config", "BraveSoftware", "Brave-Browser"),
    path.join(home, "AppData", "Local", "BraveSoftware", "Brave-Browser", "User Data", "Default"),
    path.join(home, ".config", "google-chrome", "Default"),
    path.join(home, ".config", "chromium", "Default")
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return "";
}
async function getBrowser() {
  if (browser && browser.isConnected()) return browser;
  const profilePath = getBraveProfilePath();
  const launchArgs = [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-accelerated-2d-canvas"
  ];
  browser = await puppeteer.launch({
    executablePath: getChromiumPath(),
    headless: true,
    userDataDir: profilePath || void 0,
    args: launchArgs
  });
  return browser;
}
function resolveImagePath(filename) {
  const baseDir = electron.app.isPackaged ? path.join(electron.app.getPath("userData"), "data") : path.join(electron.app.getAppPath(), "data");
  const dir = path.join(baseDir, "images");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, filename);
}
async function downloadImage(url, savePath) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download image: ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(savePath, buffer);
}
async function scrapeProductUrl(url) {
  const b = await getBrowser();
  const page = await b.newPage();
  try {
    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );
    await page.goto(url, { waitUntil: "networkidle2", timeout: 3e4 });
    await page.waitForSelector("body", { timeout: 5e3 }).catch(() => {
    });
    const result = {
      name: "",
      price: 0,
      image_url: ""
    };
    result.name = await page.$eval('meta[property="og:title"]', (el) => el.content).catch(() => "");
    if (!result.name) result.name = await page.$eval('meta[name="title"]', (el) => el.content).catch(() => "");
    if (!result.name) result.name = await page.title();
    result.name = result.name.split("|")[0].split("–")[0].split("-")[0].trim();
    for (const sel of ['meta[property="product:price:amount"]', '[data-testid="price"]', ".product-price", '[class*="price"]', '[itemprop="price"]']) {
      const el = await page.$(sel);
      if (el) {
        const tag = await el.evaluate((e) => e.tagName);
        const text = tag === "META" ? await el.evaluate((e) => e.content) : await el.evaluate((e) => e.innerText || "");
        const m = text.match(/(\d{1,6}(?:[,.]\d{2}))/);
        if (m) {
          result.price = parseFloat(m[1].replace(",", "."));
          break;
        }
      }
    }
    for (const sel of ['meta[property="og:image"]', '[data-testid="product-image"]', ".product-image img", ".gallery img:first-child", "main img", 'img[src*="product"]']) {
      const src = await page.$eval(sel, (el) => {
        if (el.tagName === "META") return el.content;
        return el.src || "";
      }).catch(() => "");
      if (src && src.startsWith("http")) {
        result.image_url = src;
        break;
      }
    }
    if (result.image_url?.startsWith("http")) {
      const fname = `product_${Date.now()}_${Math.random().toString(36).substr(2, 6)}.jpg`;
      const savePath = resolveImagePath(fname);
      try {
        await downloadImage(result.image_url, savePath);
        result.image_local_path = savePath;
      } catch {
      }
    }
    return result;
  } finally {
    await page.close();
  }
}
async function scrapeCart(cartUrl) {
  const b = await getBrowser();
  const page = await b.newPage();
  try {
    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );
    await page.goto(cartUrl, { waitUntil: "networkidle2", timeout: 45e3 });
    await page.waitForSelector("body", { timeout: 5e3 }).catch(() => {
    });
    await new Promise((r) => setTimeout(r, 2e3));
    const pageContent = await page.content();
    const pageUrl = page.url();
    const products = [];
    const arcItems = await page.$$eval(
      '[data-testid="cart-item"], .cart-item, [class*="cart-item"], [class*="CartItem"]',
      (items) => items.map((el) => {
        const name = el.querySelector('[data-testid*="title"], .product-title, h3, h4, [class*="name"]')?.innerText?.trim() || "";
        const priceText = el.querySelector('[data-testid*="price"], .price, [class*="price"]')?.innerText?.trim() || "0";
        const img = el.querySelector('img[src*="product"], img[src*="1350"], img');
        const imgSrc = img?.src || img?.getAttribute("data-src") || "";
        const colorEl = el.querySelector('[class*="color"], [class*="swatch"], [class*="variant"]');
        const color = colorEl?.innerText?.trim() || "";
        const sizeEl = el.querySelector('[class*="size"], select option:checked, [class*="Size"]');
        const size = sizeEl?.innerText?.trim() || "";
        const qtyEl = el.querySelector('select[class*="qty"], [class*="quantity"], input[type="number"]');
        const qty = parseInt(qtyEl?.value || "1") || 1;
        const priceMatch = priceText.match(/(\d{1,6}(?:[,.]\d{2}))/);
        const price = priceMatch ? parseFloat(priceMatch[1].replace(",", ".")) : 0;
        return { name, price, color, size, quantity: qty, imageSrc: imgSrc };
      })
    );
    for (const item of arcItems) {
      if (item.name && item.price > 0) {
        const p = {
          name: item.name,
          price: item.price,
          image_url: item.imageSrc || ""
        };
        if (item.color) p.options = { color: item.color };
        if (item.size) p.options = { ...p.options, size: item.size };
        if (p.image_url?.startsWith("http")) {
          const fname = `cart_${Date.now()}_${Math.random().toString(36).substr(2, 6)}.jpg`;
          const savePath = resolveImagePath(fname);
          try {
            await downloadImage(p.image_url, savePath);
            p.image_local_path = savePath;
          } catch {
          }
        }
        products.push(p);
      }
    }
    if (products.length === 0) {
      const allImgs = await page.$$eval(
        'img[src*="1350x1710"], img[src*="product"], img[src*="F2"]',
        (imgs) => imgs.map((img) => {
          const src = img.src || img.getAttribute("data-src") || "";
          const alt = img.alt || "";
          let name = alt;
          if (!name) {
            let el = img.parentElement;
            for (let i = 0; i < 5 && el; i++) {
              const textEl = el.querySelector('h3, h4, [class*="title"], [class*="name"]');
              if (textEl) {
                name = textEl.innerText?.trim() || "";
                break;
              }
              el = el.parentElement;
            }
          }
          return { src, name };
        }).filter((i) => i.src.startsWith("http"))
      );
      for (const img of allImgs) {
        if (!products.find((p) => p.image_url === img.src)) {
          products.push({ name: img.name || "Produkt", price: 0, image_url: img.src });
        }
      }
    }
    if (products.length === 0) {
      const jsonld = await page.$$eval(
        'script[type="application/ld+json"]',
        (scripts) => scripts.map((s) => {
          try {
            return JSON.parse(s.textContent || "{}");
          } catch {
            return {};
          }
        })
      );
      for (const ld of jsonld) {
        const items = ld["@graph"] || [ld];
        for (const item of items) {
          if (item["@type"] === "Product" || item.name) {
            const p = {
              name: item.name || "",
              price: parseFloat(item.offers?.price || "0") || 0,
              image_url: (Array.isArray(item.image) ? item.image[0] : item.image) || ""
            };
            if (p.name && !products.find((x) => x.name === p.name)) {
              if (p.image_url?.startsWith("http")) {
                const fname = `ld_${Date.now()}_${Math.random().toString(36).substr(2, 6)}.jpg`;
                const savePath = resolveImagePath(fname);
                try {
                  await downloadImage(p.image_url, savePath);
                  p.image_local_path = savePath;
                } catch {
                }
              }
              products.push(p);
            }
          }
        }
      }
    }
    if (products.length === 0) {
      return [{
        name: `Cart page: ${pageUrl.split("/").pop() || pageUrl}`,
        price: 0,
        image_url: ""
      }];
    }
    return products;
  } finally {
    await page.close();
  }
}
async function scrapeArcteryxCart() {
  return scrapeCart("https://arcteryx.com/de/de/cart");
}
async function captureReceiptScreenshot(html, receiptId, dataDir) {
  return new Promise((resolve, reject) => {
    const win = new electron.BrowserWindow({
      width: 640,
      height: 2e3,
      show: false,
      webPreferences: {
        offscreen: true,
        nodeIntegration: false,
        contextIsolation: true
      }
    });
    win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
    win.webContents.on("did-finish-load", async () => {
      try {
        await new Promise((r) => setTimeout(r, 2e3));
        const screenshotDir = path.join(dataDir, "screenshots");
        if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });
        const bodyHeight = await win.webContents.executeJavaScript("document.body.scrollHeight");
        const contentHeight = Math.min(Math.max(bodyHeight, 600), 8e3);
        win.setSize(640, contentHeight + 20);
        await new Promise((r) => setTimeout(r, 500));
        const image = await win.webContents.capturePage({ x: 0, y: 0, width: 640, height: contentHeight });
        const filename = `receipt_${receiptId}_${Date.now()}.png`;
        const filepath = path.join(screenshotDir, filename);
        fs.writeFileSync(filepath, image.toPNG());
        try {
          child_process.execSync(`convert "${filepath}" -strip "${filepath}"`, { stdio: "ignore" });
        } catch {
        }
        win.close();
        resolve(filepath);
      } catch (err) {
        win.close();
        reject(err);
      }
    });
    win.webContents.on("did-fail-load", (_e, _code, _desc, url) => {
      win.close();
      reject(new Error(`Failed to load receipt: ${url}`));
    });
  });
}
const API_KEY = "REDACTED-ROTATED";
const API_URL = "https://api.deepseek.com/v1/chat/completions";
const MODEL = "deepseek-chat";
async function chat(messages, temperature) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.1,
      max_tokens: 4096
    })
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DeepSeek API error ${res.status}: ${err}`);
  }
  const data = await res.json();
  return data.choices[0].message.content;
}
async function aiParseReceiptHtml(htmlBody) {
  const systemPrompt = `Du bist ein Spezialist fur Rechnungsverarbeitung. Extrahiere aus dem HTML-Code einer Bestellbestatigungs-E-Mail die Rechnungsdaten.

Antworte NUR mit einem gultigen JSON-Objekt (kein Markdown, kein Code-Block). Das JSON muss exakt diese Struktur haben:

{
  "receipt_number": "string oder null",
  "order_number": "string oder null",
  "vat_id": "string oder null",
  "date": "string oder null (DD.MM.YYYY)",
  "customer_name": "string oder null",
  "customer_address": "string oder null",
  "customer_city": "string oder null",
  "customer_zip": "string oder null",
  "customer_country": "string oder null (DE/AT/CH)",
  "payment_method": "string oder null",
  "currency": "string (EUR/USD/CHF)",
  "subtotal": "number oder null",
  "shipping": "number oder null",
  "tax_rate": "number oder null",
  "tax_amount": "number oder null",
  "total": "number oder null",
  "products": [
    {
      "name": "string",
      "price": "number",
      "color": "string oder null",
      "size": "string oder null",
      "quantity": "number",
      "image_url": "string oder null"
    }
  ]
}

Regeln:
- Preise als Zahlen OHNE Wahrungssymbol (z.B. 18.00 statt "18,00€")
- Datum als DD.MM.YYYY
- Wenn ein Feld nicht gefunden wird, null setzen
- Produkte aus dem Bereich "Artikel in deiner Bestellung" extrahieren
- Steuersatz aus "MwSt X%" parsen als Zahl (z.B. 19)`;
  const trimmedHtml = htmlBody.length > 8e4 ? htmlBody.substring(0, 8e4) + "\n... (truncated)" : htmlBody;
  try {
    const resp = await chat([
      { role: "system", content: systemPrompt },
      { role: "user", content: `Extrahiere die Rechnungsdaten aus diesem E-Mail-HTML:

${trimmedHtml}` }
    ]);
    const jsonMatch = resp.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error("[AI Receipt Parser] Failed:", err);
    return null;
  }
}
async function aiDetectSelectors(pageContent) {
  const systemPrompt = `Du bist ein Web-Scraping-Experte. Analysiere den HTML-Code einer Produktseite und finde die besten CSS-Selektoren fur:

1. Produktname
2. Preis
3. Produktbild-URL

Antworte NUR mit diesem JSON-Format (kein Markdown):
{
  "name_selector": "css-selector",
  "price_selector": "css-selector", 
  "image_selector": "css-selector",
  "confidence": 0.0-1.0
}

Regeln fur Selektoren:
- Bevorzuge spezifische Selektoren wie [data-testid="..."] oder meta[property="..."]
- Dann Klassen wie .product-title, .price
- Vermeide zu generische Selektoren
- Der Bild-Selector soll ein <img> oder meta[property="og:image"] treffen
- Der Preis-Selector soll das HTML-Element mit dem Preis treffen
- confidence: wie sicher bist du dass die Selektoren korrekt sind?`;
  const trimmedContent = pageContent.length > 6e4 ? pageContent.substring(0, 6e4) : pageContent;
  try {
    const resp = await chat([
      { role: "system", content: systemPrompt },
      { role: "user", content: `Analysiere diese Produktseite und finde CSS-Selektoren:

${trimmedContent}` }
    ]);
    const jsonMatch = resp.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error("[AI Selector Detector] Failed:", err);
    return null;
  }
}
async function aiEnhanceReceiptData(htmlBody, regexResult) {
  const keyFields = ["receipt_number", "products", "total", "customer_name", "date"];
  const hasAll = keyFields.every((f) => regexResult[f] != null && regexResult[f] !== void 0);
  if (hasAll && Array.isArray(regexResult.products) && regexResult.products.length > 0) {
    return regexResult;
  }
  const aiResult = await aiParseReceiptHtml(htmlBody);
  if (!aiResult) return regexResult;
  const merged = { ...aiResult };
  for (const [key, value] of Object.entries(regexResult)) {
    if (value !== null && value !== void 0 && value !== "" && value !== 0 && !(Array.isArray(value) && value.length === 0)) {
      merged[key] = value;
    }
  }
  return merged;
}
async function aiTrainTemplate(sampleHtml) {
  const systemPrompt = `Du bist ein Spezialist fur E-Mail-Template-Erstellung. Analysiere den HTML-Code einer Bestellbestatigungs-E-Mail und ersetze ALLE variablen Daten durch {{platzhalter}}.

REGELN:
1. Das komplette HTML-Layout, CSS und die Struktur MUSSEN exakt erhalten bleiben
2. Ersetze variable Daten durch aussagekraftige Platzhalter in {{doppelten_geschweiften_klammern}}
3. Produkt-Zeilen (die sich wiederholen) mit {{#products}}...{{/products}} umschliessen
4. Innerhalb der Produkt-Schleife: {{name}}, {{image_url}}, {{color}}, {{size}}, {{quantity}}, {{price}}, {{line_total}}
5. Ersetze KEINE URLs, Links, Bild-Pfade oder Style-Definitionen
6. Gib den Firmen-/Markennamen als brand_name zuruck
7. Gib alle gefundenen Platzhalter als Array zuruck

Antworte NUR mit diesem JSON (kein Markdown, kein Code-Block):
{
  "template_html": "das komplette HTML mit Platzhaltern",
  "placeholders": ["receipt_number", "customer_name", ...],
  "brand_name": "Markenname" 
}`;
  const trimmedHtml = sampleHtml.length > 12e4 ? sampleHtml.substring(0, 12e4) : sampleHtml;
  try {
    const resp = await chat([
      { role: "system", content: systemPrompt },
      { role: "user", content: `Konvertiere dieses E-Mail-HTML in ein Template mit Platzhaltern:

${trimmedHtml}` }
    ]);
    const jsonMatch = resp.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const result = JSON.parse(jsonMatch[0]);
    if (!result.template_html || !result.placeholders) return null;
    return {
      template_html: result.template_html,
      placeholders: result.placeholders,
      brand_name: result.brand_name || "Neue Marke"
    };
  } catch (err) {
    console.error("[AI Train Template] Failed:", err);
    return null;
  }
}
function parsePastedHtml(html) {
  const products = [];
  const arcCartItems = extractAll(html, /<div[^>]*class="[^"]*sc-f26689d9-0[^"]*"[^>]*>([\s\S]*?)<button[^>]*class="[^"]*qa-cart-item-remove[^"]*"/gi);
  if (arcCartItems.length > 0) {
    for (const block of arcCartItems) {
      const product = extractArcCartItem(block);
      if (product.name) products.push(product);
    }
    if (products.length > 0) return products;
  }
  const cartWraps = extractAll(html, /<div[^>]*class="[^"]*cart-wrap[^"]*"[^>]*>([\s\S]*?)<\/button>\s*<\/div>\s*<\/div>\s*<\/div>/gi);
  if (cartWraps.length > 0) {
    for (const block of cartWraps) {
      const product = extractArcCartItem(block);
      if (product.name) products.push(product);
    }
    if (products.length > 0) return products;
  }
  const ogTitle = extractMeta(html, "og:title");
  const ogImage = extractMeta(html, "og:image");
  const priceAmount = extractMeta(html, "product:price:amount");
  if (ogTitle) {
    products.push({
      name: ogTitle.split("|")[0].split("–")[0].trim(),
      price: parseFloat(priceAmount) || 0,
      color: "",
      size: "",
      quantity: 1,
      image_url: ogImage || ""
    });
    return products;
  }
  const imgMatches = html.match(/<img[^>]*src="(https:\/\/images\.arcteryx\.com\/[^"]*(?:1350x1710|F2\d)\/[^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi);
  if (imgMatches) {
    for (const imgTag of imgMatches) {
      const src = imgTag.match(/src="([^"]*)"/)?.[1] || "";
      const alt = imgTag.match(/alt="([^"]*)"/)?.[1] || "";
      if (src && !products.find((p) => p.image_url === src)) {
        products.push({
          name: alt || "Produkt",
          price: 0,
          color: "",
          size: "",
          quantity: 1,
          image_url: src
        });
      }
    }
    if (products.length > 0) return products;
  }
  const allImgs = html.match(/<img[^>]*src="(https:\/\/images\.arcteryx\.com\/[^"]*)"[^>]*>/gi);
  if (allImgs) {
    for (const imgTag of allImgs.slice(0, 3)) {
      const src = imgTag.match(/src="([^"]*)"/)?.[1] || "";
      if (src) {
        products.push({
          name: "Produkt",
          price: 0,
          color: "",
          size: "",
          quantity: 1,
          image_url: src
        });
      }
    }
  }
  return products;
}
function extractArcCartItem(html) {
  const name = extractByClass(html, "qa-cart-item-name") || extractByClass(html, "product-title") || "";
  const color = extractByClass(html, "qa-cart-item-colour")?.trim() || "";
  const size = extractByClass(html, "qa-cart-item-size")?.trim() || "";
  const qtyStr = extractByClass(html, "qa-cart-item-quantity");
  const quantity = qtyStr ? parseInt(qtyStr) || 1 : 1;
  let price = 0;
  const priceMatch = html.match(/qa-cart-item-price[^>]*>[\s\S]*?(\d{1,6}(?:[,.]\d{2})?)\s*(?:&nbsp;)?[€$EUR]/i);
  if (priceMatch) {
    price = parseFloat(priceMatch[1].replace(",", ".").replace(/\s/g, ""));
  } else {
    const lpMatch = html.match(/line-price[^>]*>[\s\S]*?(\d{1,6}(?:[,.]\d{2})?)\s*(?:&nbsp;)?[€$]/i);
    if (lpMatch) price = parseFloat(lpMatch[1].replace(",", ".").replace(/\s/g, ""));
  }
  const imgMatch = html.match(/<img[^>]*src="(https:\/\/images\.arcteryx\.com\/[^"]*(?:1350x1710|F2\d)\/[^"]*)"[^>]*/i);
  const imageUrl = imgMatch?.[1] || "";
  return { name, price, color, size, quantity, image_url: imageUrl };
}
function extractByClass(html, className) {
  const regex = new RegExp(`class="[^"]*${className}[^"]*"[^>]*>([^<]*(?:<[^>]*>[^<]*</[^>]*>)?[^<]*)<`, "i");
  const match = html.match(regex);
  if (!match) return null;
  return match[1].replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}
function extractMeta(html, property) {
  const regex = new RegExp(`<meta[^>]*property="${property}"[^>]*content="([^"]*)"`, "i");
  const match = html.match(regex);
  return match?.[1] || null;
}
function extractAll(html, regex) {
  const results = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    results.push(match[1] || match[0]);
  }
  return results;
}
function registerIpcHandlers() {
  initDatabase();
  seedArcteryx();
  electron.ipcMain.handle("db:get-brands", () => getAllBrands());
  electron.ipcMain.handle("db:get-brand", (_e, id) => getBrand(id));
  electron.ipcMain.handle("db:create-brand", (_e, data) => createBrand(data));
  electron.ipcMain.handle("db:update-brand", (_e, id, data) => updateBrand(id, data));
  electron.ipcMain.handle("db:delete-brand", (_e, id) => {
    deleteBrand(id);
    return { success: true };
  });
  electron.ipcMain.handle("db:get-receipts", () => getAllReceipts());
  electron.ipcMain.handle("db:get-receipt", (_e, id) => getReceipt(id));
  electron.ipcMain.handle("db:save-receipt", (_e, data) => {
    const id = saveReceipt(data);
    return { id };
  });
  electron.ipcMain.handle("db:delete-receipt", (_e, id) => {
    deleteReceipt(id);
    return { success: true };
  });
  electron.ipcMain.handle("db:get-next-receipt-number", (_e, brandId) => getNextReceiptNumber(brandId));
  electron.ipcMain.handle("db:get-next-order-number", (_e, brandId) => getNextOrderNumber(brandId));
  electron.ipcMain.handle("db:get-brand-selectors", (_e, brandId) => getBrandSelectors(brandId));
  electron.ipcMain.handle("db:save-brand-selectors", (_e, brandId, urlPattern, selectors) => {
    saveBrandSelector(brandId, urlPattern, selectors);
    return { success: true };
  });
  electron.ipcMain.handle("db:seed-arcteryx", () => seedArcteryx());
  electron.ipcMain.handle("parse:eml", async (_e, filePath) => {
    const data = await parseEMLFile(filePath);
    const receiptData = extractReceiptDataFromHtml(data.htmlBody);
    return { ...data, receiptData };
  });
  electron.ipcMain.handle("parse:eml:ai", async (_e, filePath) => {
    const data = await parseEMLFile(filePath);
    const regexResult = extractReceiptDataFromHtml(data.htmlBody);
    const enhanced = await aiEnhanceReceiptData(data.htmlBody, regexResult);
    return { ...data, receiptData: enhanced, aiEnhanced: true };
  });
  electron.ipcMain.handle("ai:parse-receipt-html", async (_e, html) => {
    return await aiParseReceiptHtml(html);
  });
  electron.ipcMain.handle("ai:detect-selectors", async (_e, pageContent) => {
    return await aiDetectSelectors(pageContent);
  });
  electron.ipcMain.handle("scrape:url", async (_e, url) => {
    return await scrapeProductUrl(url);
  });
  electron.ipcMain.handle("scrape:cart", async (_e, cartUrl) => {
    if (cartUrl && typeof cartUrl === "string" && cartUrl.length > 5) {
      return await scrapeCart(cartUrl);
    }
    return await scrapeArcteryxCart();
  });
  electron.ipcMain.handle("screenshot:receipt", async (_e, html, receiptId) => {
    const win = electron.BrowserWindow.getFocusedWindow();
    const dataDir = win ? path.join(path.dirname(win.__dirname || ""), "..", "data") : path.join(process.cwd(), "data");
    return await captureReceiptScreenshot(html, receiptId, dataDir);
  });
  electron.ipcMain.handle("app:get-version", () => "1.0.0");
  electron.ipcMain.handle("dialog:open-file", async (_e, options) => {
    const win = electron.BrowserWindow.getFocusedWindow();
    const result = await electron.dialog.showOpenDialog(win, {
      properties: ["openFile"],
      filters: options.filters || [{ name: "Email Files", extensions: ["eml"] }]
    });
    if (result.canceled || result.filePaths.length === 0) return null;
    return result.filePaths[0];
  });
  electron.ipcMain.handle("dialog:save-file", async (_e, options) => {
    const win = electron.BrowserWindow.getFocusedWindow();
    const result = await electron.dialog.showSaveDialog(win, {
      defaultPath: options.defaultPath,
      filters: options.filters || [{ name: "PNG Image", extensions: ["png"] }]
    });
    if (result.canceled || !result.filePath) return null;
    return result.filePath;
  });
  electron.ipcMain.handle("file:read", async (_e, filePath) => {
    return fs.readFileSync(filePath, "utf-8");
  });
  electron.ipcMain.handle("file:write", async (_e, filePath, data) => {
    fs.writeFileSync(filePath, data);
    return { success: true };
  });
  electron.ipcMain.handle("ai:train-template", async (_e, sampleHtml) => {
    return await aiTrainTemplate(sampleHtml);
  });
  electron.ipcMain.handle("parse:html", (_e, html) => {
    return parsePastedHtml(html);
  });
}
function unregisterIpcHandlers() {
  closeDatabase();
}
electron.app.commandLine.appendSwitch("disable-gpu");
electron.app.commandLine.appendSwitch("disable-software-rasterizer");
electron.app.commandLine.appendSwitch("no-sandbox");
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 960,
    minHeight: 640,
    show: false,
    title: "ValidsReceipt",
    backgroundColor: "#0d1117",
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  mainWindow.webContents.on("did-fail-load", (_e, code, desc) => {
    console.error("Renderer failed to load:", code, desc);
    mainWindow.webContents.openDevTools();
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/app.html")).catch((err) => {
      console.error("Failed to load app.html:", err);
      mainWindow.webContents.openDevTools();
    });
  }
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.validsreceipt");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  registerIpcHandlers();
  createWindow();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  unregisterIpcHandlers();
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.app.on("before-quit", () => {
  unregisterIpcHandlers();
});
