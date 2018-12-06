// This file is auto-generated and should be ignored from version control.
(function(){
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
  templates['al-app-footer'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.FOOTER_REQ : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12 navbar-fixed-bottom ct-al__footer ct-al-app__footer ct-al__footer-tm ct-al__footer-bs '>\r\n	<div class='ct-al-app__footer-container'>\r\n		<div class='ct-al-app__hscroll mCustomScrollbar' data-item-id=\"ct-al__app-ws-list\">\r\n			<ul class='ct-al__wslink-container'>\r\n				 ";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.WORKSPACES : depth0), {"name":"each","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + " \r\n			</ul>\r\n		</div>\r\n	</div>\r\n</div>\r\n";
},"2":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, lambda=this.lambda;
  return "\r\n				<li class='ct-al__app-each ct-al__app-each-js' data-selection-id='"
    + escapeExpression(((helper = (helper = helpers.WORKSPACE_ID || (depth0 != null ? depth0.WORKSPACE_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WORKSPACE_ID","hash":{},"data":data}) : helper)))
    + "'>\r\n					<div class='ct-al__wslink ct-al__wslink-tm ct-al-app__ws-"
    + escapeExpression(lambda((data && data.index), depth0))
    + "'>\r\n						<div class=\"ct-al__wslink-each ct-al__wslink-each-tm\">\r\n							<a class='col-md-12 col-sm-12 col-lg-12 col-xs-12 flaticon-default flaticon-"
    + escapeExpression(((helper = (helper = helpers.WORKSPACE_ID || (depth0 != null ? depth0.WORKSPACE_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WORKSPACE_ID","hash":{},"data":data}) : helper)))
    + " flaticon-appLayout-footer ct-al__wslink-icon-js' href='javascript:void(0)' data-item-id='"
    + escapeExpression(((helper = (helper = helpers.WORKSPACE_ID || (depth0 != null ? depth0.WORKSPACE_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WORKSPACE_ID","hash":{},"data":data}) : helper)))
    + "' data-toggle='tooltip' data-placement='top' data-original-title='"
    + escapeExpression(((helper = (helper = helpers.WORKSPACE_DISPLAY_NM || (depth0 != null ? depth0.WORKSPACE_DISPLAY_NM : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WORKSPACE_DISPLAY_NM","hash":{},"data":data}) : helper)))
    + "'></a> \r\n							<div class='clearfix'></div>\r\n						</div>\r\n					</div>\r\n				</li>\r\n				";
},"useData":true});
  templates['al-app-header'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.HEADER_REQ : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class='navbar navbar-default navbar-fixed-top ct-al__header ct-al-app__header ct-al__header-tm ct-al__header-bs ";
  stack1 = ((helper = (helper = helpers.CSS_CLASS || (depth0 != null ? depth0.CSS_CLASS : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"CSS_CLASS","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "' role='navigation' id='ct_nav' data-item-id='ct-al-app__header'>\r\n	<div class='ct-al__header-container'>\r\n		<div class='container-fluid'>\r\n			<div class='row'>\r\n				<div class='col-lg-2 col-md-2 col-sm-2 col-xs-12'>\r\n					<div type='button' class='flaticon-main-menu flaticon-app-main-menu visible-xs' data-toggle='collapse' data-target='#img1'></div>\r\n					 \r\n					<a class='ct-logo' data-item-id=\"ct_logo\" rel='home' href='javascript:void(0)'> \r\n						<img src='CTRIAFramework/UIArena/theme/system/jqtbs/images/CT-logo.png' title='CANVAS TECHNOLOGY' alt='CANVAS TECHNOLOGY' /> \r\n					</a>\r\n				</div>\r\n				<div class=\"visible-lg visible-md visible-sm col-lg-7 col-md-7  col-sm-7 ct-table-top-ws-header\">\r\n					<span class=\"ct-ws-title\" data-item-id=\"ct-ws-title\">CANVAS TECHNOLOGY</span>\r\n				</div>\r\n				<div class=\"col-lg-3 col-md-3 col-sm-3 col-xs-3\">\r\n					<div class=\"visible-lg visible-md visible-sm ct-al__app-desktop-cont\">\r\n						<span class=\"ct-app-desktop__ws-user-img\" data-item-id=\"ct-user-details\"> \r\n							<img data-item-id='ct-pic' src='"
    + escapeExpression(((helper = (helper = helpers.USR_IMG_PATH || (depth0 != null ? depth0.USR_IMG_PATH : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_IMG_PATH","hash":{},"data":data}) : helper)))
    + "' alt='user_image' class='media-object' data-toggle=\"tooltip\" data-placement=\"auto\" title=\""
    + escapeExpression(((helper = (helper = helpers.USR_INFO || (depth0 != null ? depth0.USR_INFO : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_INFO","hash":{},"data":data}) : helper)))
    + "\" />\r\n						</span>\r\n					</div>\r\n				</div>\r\n				<div class='collapse navbar-collapse app-collapse-mobile' id='img1'>\r\n					<div class=' visible-xs ct-user-snippet ct-app__ws-user-snippet'>\r\n						<div class=\"col-lg-4 col-md-4 col-sm-4 col-xs-4\">\r\n							<span class=\"ct-user-img ct-app-desktop__ws-user-img-big ct-al-app__ws-float_img\" data-item-id=\"ct-user-img\"> \r\n								<img data-item-id='ct_picedit' src='"
    + escapeExpression(((helper = (helper = helpers.USR_IMG_PATH || (depth0 != null ? depth0.USR_IMG_PATH : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_IMG_PATH","hash":{},"data":data}) : helper)))
    + "' alt='user_image' class='media-object ct-al-app__ws-userimg_hldr' data-toggle='tooltip' data-placement='bottom' data-original-title='"
    + escapeExpression(((helper = (helper = helpers.PIC_TOOL_TIP || (depth0 != null ? depth0.PIC_TOOL_TIP : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"PIC_TOOL_TIP","hash":{},"data":data}) : helper)))
    + "' />\r\n							</span>\r\n						</div>\r\n						<div class=\"col-lg-8 col-md-8 col-xs-8\">\r\n							<span class=\"ct-user__name ct-app__ws-user-name\">"
    + escapeExpression(((helper = (helper = helpers.USR_INFO || (depth0 != null ? depth0.USR_INFO : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_INFO","hash":{},"data":data}) : helper)))
    + "</span>\r\n							<span class=\"ct-user__login-text ct-app__ws-login-text\">"
    + escapeExpression(((helper = (helper = helpers.LAST_LOGIN_TEXT || (depth0 != null ? depth0.LAST_LOGIN_TEXT : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"LAST_LOGIN_TEXT","hash":{},"data":data}) : helper)))
    + "\r\n								<br />\r\n								<span class=\"ct-user__login-time\">"
    + escapeExpression(((helper = (helper = helpers.USR_LOGIN || (depth0 != null ? depth0.USR_LOGIN : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_LOGIN","hash":{},"data":data}) : helper)))
    + "</span>\r\n							</span>\r\n						</div>\r\n						<div class=\"col-md-12 col-sm-12 col-xs-12 ct-al-app__ws-pref_logout_cont\">\r\n							<div class=\"col-lg-6 col-md-6 col-xs-6 pull-left\">\r\n								<span class=\"pull-left\"><a href=\"javascript:void(0)\" data-item-id='ct_pref' class=\"btn ct_btn flaticon-pref_settings\">&nbsp;"
    + escapeExpression(((helper = (helper = helpers.HEADER_PREF || (depth0 != null ? depth0.HEADER_PREF : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"HEADER_PREF","hash":{},"data":data}) : helper)))
    + "</a></span>\r\n							</div>\r\n							<div class=\"col-lg-6 col-md-6 col-xs-6 pull-right\">\r\n								<span class=\"pull-right\"><a href=\"javascript:void(0)\" data-item-id='ct_logout' class=\"btn ct_btn flaticon-logout\">&nbsp;"
    + escapeExpression(((helper = (helper = helpers.HEADER_LOGOUT || (depth0 != null ? depth0.HEADER_LOGOUT : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"HEADER_LOGOUT","hash":{},"data":data}) : helper)))
    + "</a></span>\r\n							</div>\r\n						</div>\r\n					</div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n	<div class=\"ct-user ct-app-desktop__ws-user-info ct-al-excard__ws-userinfo_hldr hidden-xs \" data-item-id=\"ct-menu-desktop__ws-user-info\">\r\n		<div class=\"ct-app-destop__ws-tooltip-arrow\"></div>\r\n		<div class='ct-user-snippet ct-app__ws-user-snippet'>\r\n			<div class=\"col-lg-4 col-md-4 col-sm-4\">\r\n				<span class=\"ct-user-img ct-app-desktop__ws-user-img-big ct-al-app__ws-float_img\" data-item-id=\"ct-user-img\"> \r\n					<img data-item-id='ct_picedit' src='"
    + escapeExpression(((helper = (helper = helpers.USR_IMG_PATH || (depth0 != null ? depth0.USR_IMG_PATH : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_IMG_PATH","hash":{},"data":data}) : helper)))
    + "' alt='user_image' class='media-object ct-al-app__ws-userimg_hldr' data-toggle='tooltip' data-placement='bottom' data-original-title='"
    + escapeExpression(((helper = (helper = helpers.PIC_TOOL_TIP || (depth0 != null ? depth0.PIC_TOOL_TIP : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"PIC_TOOL_TIP","hash":{},"data":data}) : helper)))
    + "' />\r\n				</span>\r\n			</div>\r\n			<div class=\"col-lg-8 col-md-8\">\r\n				<span class=\"ct-user__name ct-app__ws-user-name\">"
    + escapeExpression(((helper = (helper = helpers.USR_INFO || (depth0 != null ? depth0.USR_INFO : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_INFO","hash":{},"data":data}) : helper)))
    + "</span>\r\n				<span class=\"ct-user__login-text ct-app__ws-login-text\">"
    + escapeExpression(((helper = (helper = helpers.LAST_LOGIN_TEXT || (depth0 != null ? depth0.LAST_LOGIN_TEXT : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"LAST_LOGIN_TEXT","hash":{},"data":data}) : helper)))
    + "\r\n					<br />\r\n					<span class=\"ct-user__login-time\">"
    + escapeExpression(((helper = (helper = helpers.USR_LOGIN || (depth0 != null ? depth0.USR_LOGIN : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_LOGIN","hash":{},"data":data}) : helper)))
    + "</span>\r\n				</span>\r\n			</div>\r\n			<div class=\"col-md-12 col-sm-12 ct-al-app__ws-pref_logout_cont\">\r\n				<div class=\"col-lg-6 col-md-6 pull-left\">\r\n					<span class=\"pull-left\"><a href=\"javascript:void(0)\" data-item-id='ct_pref' class=\"btn ct_btn flaticon-pref_settings\">&nbsp;"
    + escapeExpression(((helper = (helper = helpers.HEADER_PREF || (depth0 != null ? depth0.HEADER_PREF : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"HEADER_PREF","hash":{},"data":data}) : helper)))
    + "</a></span>\r\n				</div>\r\n				<div class=\"col-lg-6 col-md-6 pull-right\">\r\n					<span class=\"pull-right\"><a href=\"javascript:void(0)\" data-item-id='ct_logout' class=\"btn ct_btn flaticon-logout\">&nbsp;"
    + escapeExpression(((helper = (helper = helpers.HEADER_LOGOUT || (depth0 != null ? depth0.HEADER_LOGOUT : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"HEADER_LOGOUT","hash":{},"data":data}) : helper)))
    + "</a></span>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n";
},"useData":true});
  templates['al-card-footer'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.FOOTER_REQ : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, buffer = "<div class=\"navbar-default navbar-fixed-bottom ct-al__footer ct-al__footer-tm ct-al__footer-bs\" data-item-toggle ='ct-show-hide-footer' data-item-id='ct-copyrights'>\r\n	<div class='copyright-content'>\r\n		<span>";
  stack1 = ((helper = (helper = helpers.footerCopyrights || (depth0 != null ? depth0.footerCopyrights : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"footerCopyrights","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n	</div>\r\n</div>\r\n";
},"useData":true});
  templates['al-card-header'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.HEADER_REQ : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class='navbar navbar-fixed-top ct-al__header ct-al-card__header ct-al__header-tm ct-al__header-bs ";
  stack1 = ((helper = (helper = helpers.CSS_CLASS || (depth0 != null ? depth0.CSS_CLASS : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"CSS_CLASS","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "' role='navigation' id='ct_nav' data-item-id='ct-al-card__header'>\r\n	<div class=\"ct-al-card__header-container\">\r\n		<div class='container-fluid'>\r\n			<div class='row'>\r\n				<div class=\"col-lg-4 col-md-4 col-sm-10 col-xs-9\">\r\n					<a class='ct-logo' data-item-id=\"ct_logo\" rel='home' href='javascript:void(0)'></a> \r\n				</div>\r\n				<div class=\"visible-lg visible-md col-lg-6 col-md-6\">\r\n					<span class=\"ct-ws-title\" data-item-id=\"ct-ws-title\">CANVAS TECHNOLOGY</span>\r\n				</div>\r\n				<div class=\"col-lg-2 col-md-2 col-sm-2 col-xs-3\">\r\n					<div class=\"ct-al__card-user_details-cont\" data-item-id=\"ct-al__card-user_details-cont\">\r\n						<span class=\"ct-card-desktop__ws-user-img\" data-item-id=\"ct-user-details\"> \r\n							<img data-item-id='ct-pic' src='"
    + escapeExpression(((helper = (helper = helpers.USR_IMG_PATH || (depth0 != null ? depth0.USR_IMG_PATH : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_IMG_PATH","hash":{},"data":data}) : helper)))
    + "' alt='user_image' class='media-object' data-toggle=\"tooltip\" data-placement=\"auto\" title=\""
    + escapeExpression(((helper = (helper = helpers.USR_INFO || (depth0 != null ? depth0.USR_INFO : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_INFO","hash":{},"data":data}) : helper)))
    + "\" />\r\n						</span>\r\n					</div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n<div class=\"ct-user ct-card-desktop__ws-user-info ct-al-card__ws-userinfo_hldr\" data-item-id=\"ct-card-desktop__ws-user-info\">\r\n	<div class=\"ct-card-destop__ws-tooltip-arrow\"></div>\r\n	<div class='ct-user-snippet ct-card__ws-user-snippet'>\r\n		<div class=\"col-lg-4 col-md-4 col-sm-4 col-xs-4\">\r\n			<span class=\"ct-user-img ct-card-desktop__ws-user-img-big ct-al-card__ws-float_img\" data-item-id=\"ct-user-img\"> \r\n				<img data-item-id='ct_picedit' src='"
    + escapeExpression(((helper = (helper = helpers.USR_IMG_PATH || (depth0 != null ? depth0.USR_IMG_PATH : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_IMG_PATH","hash":{},"data":data}) : helper)))
    + "' alt='user_image' class='media-object ct-al-card__ws-userimg_hldr' data-toggle='tooltip' data-placement='bottom' data-original-title='"
    + escapeExpression(((helper = (helper = helpers.PIC_TOOL_TIP || (depth0 != null ? depth0.PIC_TOOL_TIP : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"PIC_TOOL_TIP","hash":{},"data":data}) : helper)))
    + "' />\r\n			</span>\r\n		</div>\r\n		<div class=\"col-lg-8 col-md-8 col-sm-8 col-xs-8\">\r\n			<span class=\"ct-user__name ct-card__ws-user-name\">"
    + escapeExpression(((helper = (helper = helpers.USR_INFO || (depth0 != null ? depth0.USR_INFO : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_INFO","hash":{},"data":data}) : helper)))
    + "</span>\r\n			<span class=\"ct-user__login-text ct-card__ws-login-text\">"
    + escapeExpression(((helper = (helper = helpers.LAST_LOGIN_TEXT || (depth0 != null ? depth0.LAST_LOGIN_TEXT : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"LAST_LOGIN_TEXT","hash":{},"data":data}) : helper)))
    + "\r\n				<br />\r\n				<span class=\"ct-user__login-time\">"
    + escapeExpression(((helper = (helper = helpers.USR_LOGIN || (depth0 != null ? depth0.USR_LOGIN : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_LOGIN","hash":{},"data":data}) : helper)))
    + "</span>\r\n			</span>\r\n		</div>\r\n		<div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12 ct-al-card__ws-pref_logout_cont\">\r\n			<div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-6 pull-left\">\r\n				<span class=\"pull-left\"><a href=\"javascript:void(0)\" data-item-id='ct_pref' class=\"btn ct_btn flaticon-pref_settings\">&nbsp;"
    + escapeExpression(((helper = (helper = helpers.HEADER_PREF || (depth0 != null ? depth0.HEADER_PREF : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"HEADER_PREF","hash":{},"data":data}) : helper)))
    + "</a></span>\r\n			</div>\r\n			<div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-6 pull-right\">\r\n				<span class=\"pull-right\"><a href=\"javascript:void(0)\" data-item-id='ct_logout' class=\"btn ct_btn flaticon-logout\">&nbsp;"
    + escapeExpression(((helper = (helper = helpers.HEADER_LOGOUT || (depth0 != null ? depth0.HEADER_LOGOUT : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"HEADER_LOGOUT","hash":{},"data":data}) : helper)))
    + "</a></span>\r\n			</div>\r\n			<div></div>\r\n		</div>\r\n	</div>\r\n</div>\r\n";
},"useData":true});
  templates['al-excard-footer'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.FOOTER_REQ : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, buffer = "<div class=\"navbar-default navbar-fixed-bottom ct-al__footer ct-al__footer-tm ct-al__footer-bs\" data-item-id='ct-copyrights'  data-item-toggle ='ct-show-hide-footer'>\r\n	<div class='copyright-content'>\r\n		<span>";
  stack1 = ((helper = (helper = helpers.footerCopyrights || (depth0 != null ? depth0.footerCopyrights : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"footerCopyrights","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n	</div>\r\n</div>\r\n";
},"useData":true});
  templates['al-excard-header'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.HEADER_REQ : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class='navbar navbar-default navbar-fixed-top ct-al__header ct-al-excard__header ct-al__header-tm ct-al__header-bs ";
  stack1 = ((helper = (helper = helpers.CSS_CLASS || (depth0 != null ? depth0.CSS_CLASS : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"CSS_CLASS","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += "' role='navigation' id='ct_nav' data-item-id=\"ct-al-excard__header\">\r\n	<div class=\"ct-al-excard__header-container\">\r\n		<div class='container-fluid'>\r\n			<div class='row'>\r\n				<div class='col-lg-2 col-md-2 col-sm-3 col-xs-12'>\r\n					<div type='button' class='flaticon-main-menu flaticon-excard-main-menu visible-xs' data-toggle='collapse' data-target='#img1'></div>\r\n					<a class='ct-logo' data-item-id=\"ct_logo\" rel='home' href='javascript:void(0)'> \r\n						<img src='CTRIAFramework/UIArena/theme/system/jqtbs/images/CT-logo.png' title='CANVAS TECHNOLOGY' alt='CANVAS TECHNOLOGY' />\r\n					</a> \r\n				</div>\r\n				 \r\n				<div class='collapse navbar-collapse col-md-8 col-lg-8 col-sm-7 al-excard-nav' data-item-id='excard-nav' id='img1'>\r\n					<div class=\"ct-al__excard-cont\">\r\n						<div class='ct-al-excard__hscroll al-excard-tm mCustomScrollbar' data-item-id='ct-al__excard-ws-list'>\r\n							<ul class='ct-al__wslink-container'>\r\n								 ";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.EXCARD_WORKSPACES : depth0), {"name":"each","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + " \r\n							</ul>\r\n						</div>\r\n						<div class='visible-xs ct-user-snippet ct-excard__ws-user-snippet al-excard-mobile-usersnippet'>\r\n							<div class=\"col-lg-4 col-md-4 col-sm-4 col-xs-4\">\r\n								<span class=\"ct-user-img ct-excard-desktop__ws-user-img-big ct-al-excard__ws-float_img\" data-item-id=\"ct-user-img\"> \r\n									<img data-item-id='ct_picedit' src='"
    + escapeExpression(((helper = (helper = helpers.USR_IMG_PATH || (depth0 != null ? depth0.USR_IMG_PATH : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_IMG_PATH","hash":{},"data":data}) : helper)))
    + "' alt='user_image' class='media-object ct-al-excard__ws-userimg_hldr' data-toggle='tooltip' data-placement='bottom' data-original-title='"
    + escapeExpression(((helper = (helper = helpers.PIC_TOOL_TIP || (depth0 != null ? depth0.PIC_TOOL_TIP : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"PIC_TOOL_TIP","hash":{},"data":data}) : helper)))
    + "' />\r\n								</span>\r\n							</div>\r\n							<div class=\"col-lg-8 col-md-8 col-xs-8\">\r\n								<span class=\"ct-user__name ct-excard__ws-user-name\">"
    + escapeExpression(((helper = (helper = helpers.USR_INFO || (depth0 != null ? depth0.USR_INFO : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_INFO","hash":{},"data":data}) : helper)))
    + "</span>\r\n								<span class=\"ct-user__login-text ct-excard__ws-login-text\">"
    + escapeExpression(((helper = (helper = helpers.LAST_LOGIN_TEXT || (depth0 != null ? depth0.LAST_LOGIN_TEXT : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"LAST_LOGIN_TEXT","hash":{},"data":data}) : helper)))
    + "\r\n									<br />\r\n									<span class=\"ct-user__login-time\">"
    + escapeExpression(((helper = (helper = helpers.USR_LOGIN || (depth0 != null ? depth0.USR_LOGIN : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_LOGIN","hash":{},"data":data}) : helper)))
    + "</span>\r\n								</span>\r\n							</div>\r\n							<div class=\"col-md-12 col-xs-12 col-sm-4 ct-al-excard__ws-pref_logout_cont\">\r\n								<div class=\"col-lg-6 col-md-6 pull-left\">\r\n									<span class=\"pull-left\"><a href=\"javascript:void(0)\" data-item-id='ct_pref' class=\"btn ct_btn flaticon-pref_settings\">&nbsp;"
    + escapeExpression(((helper = (helper = helpers.HEADER_PREF || (depth0 != null ? depth0.HEADER_PREF : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"HEADER_PREF","hash":{},"data":data}) : helper)))
    + "</a></span>\r\n								</div>\r\n								<div class=\"col-lg-6 col-md-6 pull-right\">\r\n									<span class=\"pull-right\"><a href=\"javascript:void(0)\" data-item-id='ct_logout' class=\"btn ct_btn flaticon-logout\">&nbsp;"
    + escapeExpression(((helper = (helper = helpers.HEADER_LOGOUT || (depth0 != null ? depth0.HEADER_LOGOUT : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"HEADER_LOGOUT","hash":{},"data":data}) : helper)))
    + "</a></span>\r\n								</div>\r\n							</div>\r\n						</div>\r\n					</div>\r\n				</div>\r\n				<div class=\"col-lg-2 col-md-2 col-sm-2 col-xs-3\">\r\n					<div class=\"visible-lg visible-md visible-sm ct-al__excard-desktop-cont\">\r\n						<span class=\"ct-excard-desktop__ws-user-img\" data-item-id=\"ct-user-details\"> \r\n							<img data-item-id='ct-pic' src='"
    + escapeExpression(((helper = (helper = helpers.USR_IMG_PATH || (depth0 != null ? depth0.USR_IMG_PATH : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_IMG_PATH","hash":{},"data":data}) : helper)))
    + "' alt='user_image' class='media-object' data-toggle=\"tooltip\" data-placement=\"auto\" title=\""
    + escapeExpression(((helper = (helper = helpers.USR_INFO || (depth0 != null ? depth0.USR_INFO : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_INFO","hash":{},"data":data}) : helper)))
    + "\" />\r\n						</span>\r\n					</div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n	<div class=\"ct-user ct-excard-desktop__ws-user-info ct-al-excard__ws-userinfo_hldr hidden-xs\" data-item-id=\"ct-menu-desktop__ws-user-info\">\r\n		<div class=\"ct-excard-destop__ws-tooltip-arrow\"></div>\r\n		<div class='ct-user-snippet ct-excard__ws-user-snippet'>\r\n			<div class=\"col-lg-4 col-md-4 col-sm-4\">\r\n				<span class=\"ct-user-img ct-excard-desktop__ws-user-img-big ct-al-excard__ws-float_img\" data-item-id=\"ct-user-img\"> \r\n					<img data-item-id='ct_picedit' src='"
    + escapeExpression(((helper = (helper = helpers.USR_IMG_PATH || (depth0 != null ? depth0.USR_IMG_PATH : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_IMG_PATH","hash":{},"data":data}) : helper)))
    + "' alt='user_image' class='media-object ct-al-excard__ws-userimg_hldr' data-toggle='tooltip' data-placement='bottom' data-original-title='"
    + escapeExpression(((helper = (helper = helpers.PIC_TOOL_TIP || (depth0 != null ? depth0.PIC_TOOL_TIP : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"PIC_TOOL_TIP","hash":{},"data":data}) : helper)))
    + "' />\r\n				</span>\r\n			</div>\r\n			<div class=\"col-lg-8 col-md-8\">\r\n				<span class=\"ct-user__name ct-excard__ws-user-name\">"
    + escapeExpression(((helper = (helper = helpers.USR_INFO || (depth0 != null ? depth0.USR_INFO : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_INFO","hash":{},"data":data}) : helper)))
    + "</span>\r\n				<span class=\"ct-user__login-text ct-excard__ws-login-text\">"
    + escapeExpression(((helper = (helper = helpers.LAST_LOGIN_TEXT || (depth0 != null ? depth0.LAST_LOGIN_TEXT : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"LAST_LOGIN_TEXT","hash":{},"data":data}) : helper)))
    + "\r\n					<br />\r\n					<span class=\"ct-user__login-time\">"
    + escapeExpression(((helper = (helper = helpers.USR_LOGIN || (depth0 != null ? depth0.USR_LOGIN : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_LOGIN","hash":{},"data":data}) : helper)))
    + "</span>\r\n				</span>\r\n			</div>\r\n			<div class=\"col-md-12 col-sm-12 ct-al-excard__ws-pref_logout_cont\">\r\n				<div class=\"col-lg-6 col-md-6 pull-left\">\r\n					<span class=\"pull-left\"><a href=\"javascript:void(0)\" data-item-id='ct_pref' class=\"btn ct_btn flaticon-pref_settings\">&nbsp;"
    + escapeExpression(((helper = (helper = helpers.HEADER_PREF || (depth0 != null ? depth0.HEADER_PREF : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"HEADER_PREF","hash":{},"data":data}) : helper)))
    + "</a></span>\r\n				</div>\r\n				<div class=\"col-lg-6 col-md-6 pull-right\">\r\n					<span class=\"pull-right\"><a href=\"javascript:void(0)\" data-item-id='ct_logout' class=\"btn ct_btn flaticon-logout\">&nbsp;"
    + escapeExpression(((helper = (helper = helpers.HEADER_LOGOUT || (depth0 != null ? depth0.HEADER_LOGOUT : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"HEADER_LOGOUT","hash":{},"data":data}) : helper)))
    + "</a></span>\r\n				</div>\r\n				<div></div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n";
},"2":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, lambda=this.lambda;
  return "\r\n								<li class='ct-al__excard-each ct-al__excard-each-js' data-selection-id='"
    + escapeExpression(((helper = (helper = helpers.WORKSPACE_ID || (depth0 != null ? depth0.WORKSPACE_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WORKSPACE_ID","hash":{},"data":data}) : helper)))
    + "'>\r\n									<div class='ct-al__wslink ct-al__wslink-tm ct-excard__ws-"
    + escapeExpression(lambda((data && data.index), depth0))
    + "'>\r\n										<div class=\"ct-al__wslink-each ct-al__wslink-each-tm\">\r\n											<a class='col-md-12 col-sm-12 col-xs-12 flaticon-default flaticon-"
    + escapeExpression(((helper = (helper = helpers.WORKSPACE_ID || (depth0 != null ? depth0.WORKSPACE_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WORKSPACE_ID","hash":{},"data":data}) : helper)))
    + " f-excard ct-al__wslink-icon-js' href='javascript:void(0)' dat-item-id='"
    + escapeExpression(((helper = (helper = helpers.WORKSPACE_ID || (depth0 != null ? depth0.WORKSPACE_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WORKSPACE_ID","hash":{},"data":data}) : helper)))
    + "'></a>\r\n											<a class='col-md-12 col-sm-12 col-xs-12 ct-al__excard-wslink-txt' href='javascript:void(0)' dat-item-id='"
    + escapeExpression(((helper = (helper = helpers.WORKSPACE_ID || (depth0 != null ? depth0.WORKSPACE_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WORKSPACE_ID","hash":{},"data":data}) : helper)))
    + "'>"
    + escapeExpression(((helper = (helper = helpers.WORKSPACE_DISPLAY_NM || (depth0 != null ? depth0.WORKSPACE_DISPLAY_NM : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WORKSPACE_DISPLAY_NM","hash":{},"data":data}) : helper)))
    + "</a>\r\n											<div class='clearfix'></div>\r\n										</div>\r\n									</div> \r\n								</li> \r\n								";
},"useData":true});
  templates['al-landing-page'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class = \"container-fluid\">\r\n	<div class=\"row\">\r\n    	<div class=\"col-md-12\">\r\n			<img 	src=\"http://www.intellectdesign.com/img/experience-360-banner1.jpg\" \r\n					class=\"img-responsive\" style=\" margin-left: auto; margin-right: auto; margin-top: 8%; width: 100%\">\r\n    	</div>\r\n    </div>\r\n</div>";
  },"useData":true});
  templates['al-menu-footer'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.FOOTER_REQ : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, buffer = "<div class=\"navbar-default navbar-fixed-bottom ct-al__footer ct-al__footer-tm ct-al__footer-bs\" data-item-id=\"ct-copyrights\" data-item-toggle ='ct-show-hide-footer'>\r\n	<div class='copyright-content'>\r\n		<span>";
  stack1 = ((helper = (helper = helpers.footerCopyrights || (depth0 != null ? depth0.footerCopyrights : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"footerCopyrights","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n	</div>\r\n</div>\r\n";
},"useData":true});
  templates['al-menu-header'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.HEADER_REQ : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class='navbar navbar-fixed-top ct-al__header ct-al-menu__header ct-al__header-tm ct-al__header-bs ";
  stack1 = ((helper = (helper = helpers.CSS_CLASS || (depth0 != null ? depth0.CSS_CLASS : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"CSS_CLASS","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += "' role='navigation' id='ct_nav' data-item-id='ct-al-menu__header'>\r\n	<div class=\"ct-al-menu__header-container\">\r\n		<div class='container-fluid'>\r\n			<div class='row'>\r\n				<div class=\"col-lg-4 col-md-4 col-sm-10 col-xs-9\">\r\n					<span class=\"ct-al__menu-menu-toggler flaticon-main-menu\" data-item-id=\"ct_sidebar_menu_toggler\"></span> \r\n					<a class='ct-logo' data-item-id=\"ct_logo\" rel='home' href='javascript:void(0)'> </a> \r\n				</div>\r\n				<div class=\"visible-lg visible-md col-lg-6 col-md-6\">\r\n					<span class=\"ct-ws-title\" data-item-id=\"ct-ws-title\">CANVAS TECHNOLOGY</span>\r\n				</div>\r\n				<div class=\"col-lg-2 col-md-2 col-sm-2 col-xs-3\">\r\n					<div class=\"visible-lg visible-md ct-al__menu-desktop-cont\">\r\n						<span class=\"ct-menu-desktop__ws-user-img\" data-item-id=\"ct-user-details\"> \r\n							<img data-item-id='ct-pic' src='"
    + escapeExpression(((helper = (helper = helpers.USR_IMG_PATH || (depth0 != null ? depth0.USR_IMG_PATH : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_IMG_PATH","hash":{},"data":data}) : helper)))
    + "' alt='user_image' class='media-object' data-toggle=\"tooltip\" data-placement=\"auto\" title=\""
    + escapeExpression(((helper = (helper = helpers.USR_INFO || (depth0 != null ? depth0.USR_INFO : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_INFO","hash":{},"data":data}) : helper)))
    + "\" />\r\n						</span>\r\n					</div>\r\n					\r\n					<div class=\"visible-sm visible-xs ct-al__menu-mobile-cont ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.WORKSPACE_MENU : depth0), {"name":"if","hash":{},"fn":this.program(2, data),"inverse":this.program(4, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\" data-item-id=\"ct-menu__ws-ws-menu-toggler\">\r\n						<a><span class=\"flaticon-more-icon f_more\"></span></a>\r\n					</div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n<div class=\"ct-user ct-menu-desktop__ws-user-info ct-al-menu__ws-userinfo_hldr \" data-item-id=\"ct-menu-desktop__ws-user-info\">\r\n	<div class=\"ct-menu-destop__ws-tooltip-arrow\"></div>\r\n	<div class='ct-user-snippet ct-menu__ws-user-snippet'>\r\n		<div class=\"col-lg-4 col-md-4\">\r\n			<span class=\"ct-user-img ct-menu-desktop__ws-user-img-big ct-al-menu__ws-float_img\" data-item-id=\"ct-user-img\"> \r\n				<img data-item-id='ct_picedit' src='"
    + escapeExpression(((helper = (helper = helpers.USR_IMG_PATH || (depth0 != null ? depth0.USR_IMG_PATH : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_IMG_PATH","hash":{},"data":data}) : helper)))
    + "' alt='user_image' class='media-object ct-al-menu__ws-userimg_hldr' data-toggle='tooltip' data-placement='bottom' data-original-title='"
    + escapeExpression(((helper = (helper = helpers.PIC_TOOL_TIP || (depth0 != null ? depth0.PIC_TOOL_TIP : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"PIC_TOOL_TIP","hash":{},"data":data}) : helper)))
    + "' />\r\n			</span>\r\n		</div>\r\n		<div class=\"col-lg-8 col-md-8\">\r\n			<span class=\"ct-user__name ct-menu__ws-user-name\">"
    + escapeExpression(((helper = (helper = helpers.USR_INFO || (depth0 != null ? depth0.USR_INFO : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_INFO","hash":{},"data":data}) : helper)))
    + "</span>\r\n			<span class=\"ct-user__login-text ct-menu__ws-login-text\">"
    + escapeExpression(((helper = (helper = helpers.LAST_LOGIN_TEXT || (depth0 != null ? depth0.LAST_LOGIN_TEXT : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"LAST_LOGIN_TEXT","hash":{},"data":data}) : helper)))
    + "\r\n				<br />\r\n				<span class=\"ct-user__login-time\">"
    + escapeExpression(((helper = (helper = helpers.USR_LOGIN || (depth0 != null ? depth0.USR_LOGIN : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_LOGIN","hash":{},"data":data}) : helper)))
    + "</span>\r\n			</span>\r\n		</div>\r\n		<div class=\"col-md-12 ct-al-menu__ws-pref_logout_cont\">\r\n			<div class=\"col-lg-6 col-md-6 pull-left\">\r\n				<span class=\"pull-left\"><a href=\"javascript:void(0)\" data-item-id='ct_pref' class=\"btn ct_btn flaticon-pref_settings\">&nbsp;"
    + escapeExpression(((helper = (helper = helpers.HEADER_PREF || (depth0 != null ? depth0.HEADER_PREF : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"HEADER_PREF","hash":{},"data":data}) : helper)))
    + "</a></span>\r\n			</div>\r\n			<div class=\"col-lg-6 col-md-6 pull-right\">\r\n				<span class=\"pull-right\"><a href=\"javascript:void(0)\" data-item-id='ct_logout' class=\"btn ct_btn flaticon-logout\">&nbsp;"
    + escapeExpression(((helper = (helper = helpers.HEADER_LOGOUT || (depth0 != null ? depth0.HEADER_LOGOUT : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"HEADER_LOGOUT","hash":{},"data":data}) : helper)))
    + "</a></span>\r\n			</div>\r\n			<div></div>\r\n		</div>\r\n	</div>\r\n</div>\r\n";
},"2":function(depth0,helpers,partials,data) {
  return "";
},"4":function(depth0,helpers,partials,data) {
  return " hidden";
  },"useData":true});
  templates['al-menu-sidebar'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\"ct-al__menu-sidebar\" data-item-id=\"ct-al__menu-sidebar\">\r\n	<div class=\"visible-sm visible-xs ct-user ct-menu-mobile__ws-user-info\" data-item-id=\"ct-menu-mobile__ws-user-info\">\r\n		<span class=\"ct-user-img ct-menu-mobile__ws-user-img\"> \r\n			<img data-item-id='ct_picedit' src='"
    + escapeExpression(((helper = (helper = helpers.USR_IMG_PATH || (depth0 != null ? depth0.USR_IMG_PATH : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_IMG_PATH","hash":{},"data":data}) : helper)))
    + "' alt='user_image' class='media-object' data-toggle='tooltip' data-placement='bottom' data-original-title='"
    + escapeExpression(((helper = (helper = helpers.PIC_TOOL_TIP || (depth0 != null ? depth0.PIC_TOOL_TIP : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"PIC_TOOL_TIP","hash":{},"data":data}) : helper)))
    + "' />\r\n		</span> \r\n		<span class='ct-user-snippet ct-menu__ws-user-snippet ct-menu__ws-user-snippet-mobile'>\r\n			<span class=\"ct-user__name ct-menu__ws-user-name ct-menu__ws-user-name-mobile\">"
    + escapeExpression(((helper = (helper = helpers.USR_INFO || (depth0 != null ? depth0.USR_INFO : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_INFO","hash":{},"data":data}) : helper)))
    + "</span>\r\n			<span class=\"ct-user__login-text\">"
    + escapeExpression(((helper = (helper = helpers.LAST_LOGIN_TEXT || (depth0 != null ? depth0.LAST_LOGIN_TEXT : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"LAST_LOGIN_TEXT","hash":{},"data":data}) : helper)))
    + " \r\n				<span class=\"ct-user__login-time\">"
    + escapeExpression(((helper = (helper = helpers.USR_LOGIN || (depth0 != null ? depth0.USR_LOGIN : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_LOGIN","hash":{},"data":data}) : helper)))
    + "</span>\r\n			</span> \r\n			<span>\r\n				<a href=\"javascript:void(0)\" data-item-id='ct_pref' class=\"btn flaticon-pref_settings ct_pref\">&nbsp;"
    + escapeExpression(((helper = (helper = helpers.HEADER_PREF || (depth0 != null ? depth0.HEADER_PREF : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"HEADER_PREF","hash":{},"data":data}) : helper)))
    + "</a>\r\n			</span>\r\n			<span>\r\n				<a href=\"javascript:void(0)\" data-item-id='ct_logout' class=\"btn flaticon-logout ct_logout\">&nbsp;"
    + escapeExpression(((helper = (helper = helpers.HEADER_LOGOUT || (depth0 != null ? depth0.HEADER_LOGOUT : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"HEADER_LOGOUT","hash":{},"data":data}) : helper)))
    + "</a>\r\n			</span>\r\n		</span> \r\n	</div>\r\n	<div class=\"ct-al__menu-ws-list mCustomScrollbar\" data-item-id=\"ct-al__menu-ws-list\" data-mcs-theme=\"dark\">\r\n		<div class=\"ct-al__wslink-container ct-al__menu-wslink-container\" data-item-id='ct-al__menu-wslink-container'>\r\n			";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.MENU_WORKSPACES : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n		</div>\r\n	</div>\r\n</div>\r\n<div data-item-id=\"ct-al__menu-sidebar-overlay\" class=\"ct-al__menu-sidebar-overlay\"></div>";
},"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, lambda=this.lambda;
  return " \r\n			<div class=\"ct-al__menu-each ct-al__menu-each-js\" data-selection-id=\""
    + escapeExpression(((helper = (helper = helpers.WORKSPACE_ID || (depth0 != null ? depth0.WORKSPACE_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WORKSPACE_ID","hash":{},"data":data}) : helper)))
    + "\">\r\n				<div class=\"ct-al__wslink ct-al__wslink-tm ct-menu__ws-"
    + escapeExpression(lambda((data && data.index), depth0))
    + "\">\r\n					<div class=\"ct-al__wslink-each ct-al__wslink-each-tm\">\r\n						<a href=\"javascript:void(0)\" class=\"flaticon-default flaticon-"
    + escapeExpression(((helper = (helper = helpers.WORKSPACE_ID || (depth0 != null ? depth0.WORKSPACE_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WORKSPACE_ID","hash":{},"data":data}) : helper)))
    + " ct-al__wslink-txt ct-al-menu__wslink-txt ct-al-menu__wslink-txt-js\" data-item-id='"
    + escapeExpression(((helper = (helper = helpers.WORKSPACE_ID || (depth0 != null ? depth0.WORKSPACE_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WORKSPACE_ID","hash":{},"data":data}) : helper)))
    + "'>"
    + escapeExpression(((helper = (helper = helpers.WORKSPACE_DISPLAY_NM || (depth0 != null ? depth0.WORKSPACE_DISPLAY_NM : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WORKSPACE_DISPLAY_NM","hash":{},"data":data}) : helper)))
    + "</a>\r\n					</div>\r\n				</div>\r\n			</div>\r\n			 ";
},"useData":true});
  templates['al-menu-wsname'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div class=\"visible-sm visible-xs col-sm-12 col-xs-12 ct-al__menu-ws-mobile-wstitle\" data-item-id=\"ct-ws-title\">"
    + escapeExpression(((helper = (helper = helpers.WS_NAME || (depth0 != null ? depth0.WS_NAME : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WS_NAME","hash":{},"data":data}) : helper)))
    + "</div>\r\n<div class=\"clearfix\"></div>";
},"useData":true});
  templates['al-tab-footer'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.FOOTER_REQ : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, buffer = "<div class=\"navbar-default navbar-fixed-bottom ct-al__footer ct-al__footer-tm ct-al__footer-bs\" data-item-id='ct-copyrights' data-item-toggle ='ct-show-hide-footer'>\r\n	<div class='copyright-content'>\r\n		<span>";
  stack1 = ((helper = (helper = helpers.footerCopyrights || (depth0 != null ? depth0.footerCopyrights : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"footerCopyrights","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n	</div>\r\n</div>\r\n";
},"useData":true});
  templates['al-tab-header'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.HEADER_REQ : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class='navbar navbar-default navbar-fixed-top ct-al__header ct-al-tab__header ct-al__header-tm ct-al__header-bs ";
  stack1 = ((helper = (helper = helpers.CSS_CLASS || (depth0 != null ? depth0.CSS_CLASS : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"CSS_CLASS","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "' role='navigation' id='ct_nav' data-item-id='ct-al-tab__header'>\r\n	<div class='ct-al-tab__container'\r\n		\r\n			<div class='col-lg-12 col-md-12'>\r\n				\r\n				<div class='row'>\r\n					<div class='col-lg-2 col-md-2 col-sm-2 col-xs-12'>\r\n						<div type='button' class='pull-right flaticon-main-menu flaticon-tab-main-menu visible-xs' data-toggle='collapse' data-target='#img1'></div>\r\n						<a class='ct-logo' data-item-id=\"ct_logo\" rel='home' href='javascript:void(0)'> \r\n							<img data-item-id='ct-pic' src='CTRIAFramework/UIArena/theme/system/jqtbs/images/CT-logo.png' title='CANVAS TECHNOLOGY' alt='CANVAS TECHNOLOGY' />\r\n						</a>\r\n					</div>\r\n					<div class=\"visible-lg visible-md visible-sm col-lg-8 col-md-8  col-sm-8 ct-table-top-ws-header\">\r\n						<span class=\"ct-ws-title\" data-item-id=\"ct-ws-title\">CANVAS TECHNOLOGY</span>\r\n					</div>\r\n					<div class=\"col-lg-2 col-md-2 col-sm-2 col-xs-3\">\r\n						<div class=\"visible-lg visible-md visible-sm ct-al__tab-desktop-cont\">\r\n							<span class=\"ct-tab-desktop__ws-user-img\" data-item-id=\"ct-user-details\"> \r\n								<img src='"
    + escapeExpression(((helper = (helper = helpers.USR_IMG_PATH || (depth0 != null ? depth0.USR_IMG_PATH : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_IMG_PATH","hash":{},"data":data}) : helper)))
    + "' alt='user_image' class='media-object' data-toggle=\"tooltip\" data-placement=\"auto\" title=\""
    + escapeExpression(((helper = (helper = helpers.USR_INFO || (depth0 != null ? depth0.USR_INFO : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_INFO","hash":{},"data":data}) : helper)))
    + "\" />\r\n							</span>\r\n						</div>\r\n					</div>\r\n					<div class='collapse navbar-collapse tab-collapse-mobile' id='img1'>\r\n						<div class=' visible-xs ct-user-snippet ct-tab__ws-user-snippet'>\r\n							<div class=\"col-lg-4 col-md-4 col-sm-4 col-xs-4\">\r\n								<span class=\"ct-user-img ct-tab-desktop__ws-user-img-big ct-al-tab__ws-float_img\" data-item-id=\"ct-user-img\"> \r\n									<img data-item-id='ct_picedit' src='"
    + escapeExpression(((helper = (helper = helpers.USR_IMG_PATH || (depth0 != null ? depth0.USR_IMG_PATH : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_IMG_PATH","hash":{},"data":data}) : helper)))
    + "' alt='user_image' class='media-object ct-al-tab__ws-userimg_hldr' data-toggle='tooltip' data-placement='bottom' data-original-title='"
    + escapeExpression(((helper = (helper = helpers.PIC_TOOL_TIP || (depth0 != null ? depth0.PIC_TOOL_TIP : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"PIC_TOOL_TIP","hash":{},"data":data}) : helper)))
    + "' />\r\n								</span>\r\n							</div>\r\n							<div class=\"col-lg-8 col-md-8 col-xs-8\">\r\n								<span class=\"ct-user__name ct-tab__ws-user-name\">"
    + escapeExpression(((helper = (helper = helpers.USR_INFO || (depth0 != null ? depth0.USR_INFO : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_INFO","hash":{},"data":data}) : helper)))
    + "</span>\r\n								<span class=\"ct-user__login-text ct-tab__ws-login-text\">"
    + escapeExpression(((helper = (helper = helpers.LAST_LOGIN_TEXT || (depth0 != null ? depth0.LAST_LOGIN_TEXT : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"LAST_LOGIN_TEXT","hash":{},"data":data}) : helper)))
    + "\r\n									<br />\r\n									<span class=\"ct-user__login-time\">"
    + escapeExpression(((helper = (helper = helpers.USR_LOGIN || (depth0 != null ? depth0.USR_LOGIN : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_LOGIN","hash":{},"data":data}) : helper)))
    + "</span>\r\n								</span>\r\n							</div>\r\n							<div class=\"col-md-12 col-sm-12 col-xs-12 ct-al-tab__ws-pref_logout_cont\">\r\n								<div class=\"col-lg-6 col-md-6 col-xs-6 pull-left\">\r\n									<span class=\"pull-left\"><a href=\"javascript:void(0)\" data-item-id='ct_pref' class=\"btn ct_btn flaticon-pref_settings\">&nbsp;"
    + escapeExpression(((helper = (helper = helpers.HEADER_PREF || (depth0 != null ? depth0.HEADER_PREF : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"HEADER_PREF","hash":{},"data":data}) : helper)))
    + "</a></span>\r\n								</div>\r\n								<div class=\"col-lg-6 col-md-6 col-xs-6 pull-right\">\r\n									<span class=\"pull-right\"><a href=\"javascript:void(0)\" data-item-id='ct_logout' class=\"btn ct_btn flaticon-logout\">&nbsp;"
    + escapeExpression(((helper = (helper = helpers.HEADER_LOGOUT || (depth0 != null ? depth0.HEADER_LOGOUT : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"HEADER_LOGOUT","hash":{},"data":data}) : helper)))
    + "</a></span>\r\n								</div>\r\n							</div>\r\n						</div>\r\n						\r\n					</div>\r\n					\r\n				</div>\r\n		</div>\r\n		<div class=\"ct-user ct-tab-desktop__ws-user-info ct-al-excard__ws-userinfo_hldr hidden-xs \" data-item-id=\"ct-menu-desktop__ws-user-info\">\r\n			<div class=\"ct-tab-destop__ws-tooltip-arrow\"></div>\r\n			<div class='ct-user-snippet ct-tab__ws-user-snippet'>\r\n				<div class=\"col-lg-4 col-md-4 col-sm-4\">\r\n					<span class=\"ct-user-img ct-tab-desktop__ws-user-img-big ct-al-tab__ws-float_img\" data-item-id=\"ct-user-img\"> \r\n						<img data-item-id='ct_picedit' src='"
    + escapeExpression(((helper = (helper = helpers.USR_IMG_PATH || (depth0 != null ? depth0.USR_IMG_PATH : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_IMG_PATH","hash":{},"data":data}) : helper)))
    + "' alt='user_image' class='media-object ct-al-tab__ws-userimg_hldr' data-toggle='tooltip' data-placement='bottom' data-original-title='"
    + escapeExpression(((helper = (helper = helpers.PIC_TOOL_TIP || (depth0 != null ? depth0.PIC_TOOL_TIP : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"PIC_TOOL_TIP","hash":{},"data":data}) : helper)))
    + "' />\r\n					</span>\r\n				</div>\r\n				<div class=\"col-lg-8 col-md-8\">\r\n					<span class=\"ct-user__name ct-tab__ws-user-name\">"
    + escapeExpression(((helper = (helper = helpers.USR_INFO || (depth0 != null ? depth0.USR_INFO : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_INFO","hash":{},"data":data}) : helper)))
    + "</span>\r\n					<span class=\"ct-user__login-text ct-tab__ws-login-text\">"
    + escapeExpression(((helper = (helper = helpers.LAST_LOGIN_TEXT || (depth0 != null ? depth0.LAST_LOGIN_TEXT : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"LAST_LOGIN_TEXT","hash":{},"data":data}) : helper)))
    + "\r\n						<br />\r\n						<span class=\"ct-user__login-time\">"
    + escapeExpression(((helper = (helper = helpers.USR_LOGIN || (depth0 != null ? depth0.USR_LOGIN : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_LOGIN","hash":{},"data":data}) : helper)))
    + "</span>\r\n					</span>\r\n				</div>\r\n				<div class=\"col-md-12 col-sm-12 ct-al-tab__ws-pref_logout_cont\">\r\n					<div class=\"col-lg-6 col-md-6 pull-left\">\r\n						<span class=\"pull-left\"><a href=\"javascript:void(0)\" data-item-id='ct_pref' class=\"btn ct_btn flaticon-pref_settings\">&nbsp;"
    + escapeExpression(((helper = (helper = helpers.HEADER_PREF || (depth0 != null ? depth0.HEADER_PREF : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"HEADER_PREF","hash":{},"data":data}) : helper)))
    + "</a></span>\r\n					</div>\r\n					<div class=\"col-lg-6 col-md-6 pull-right\">\r\n						<span class=\"pull-right\"><a href=\"javascript:void(0)\" data-item-id='ct_logout' class=\"btn ct_btn flaticon-logout\">&nbsp;"
    + escapeExpression(((helper = (helper = helpers.HEADER_LOGOUT || (depth0 != null ? depth0.HEADER_LOGOUT : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"HEADER_LOGOUT","hash":{},"data":data}) : helper)))
    + "</a></span>\r\n					</div>\r\n					<div></div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n";
},"useData":true});
  templates['al-tabletop-footer'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.FOOTER_REQ : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12 navbar-fixed-bottom ct-al__footer ct-al-tabletop__footer ct-al__footer-tm ct-al__footer-bs '>\r\n	<div class='ct-al-tabletop__footer-container'>\r\n		<div class='ct-al-tabletop__hscroll mCustomScrollbar' data-item-id='ct-al__tabletop-ws-list'>\r\n			<ul class='ct-al__wslink-container'>\r\n				 ";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.WORKSPACES : depth0), {"name":"each","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + " \r\n		</div>\r\n	</div>\r\n</div>\r\n";
},"2":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, lambda=this.lambda;
  return "\r\n				<li class='ct-al__tabletop-each ct-al__tabletop-each-js' data-selection-id='"
    + escapeExpression(((helper = (helper = helpers.WORKSPACE_ID || (depth0 != null ? depth0.WORKSPACE_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WORKSPACE_ID","hash":{},"data":data}) : helper)))
    + "'>\r\n					<div class='ct-al__wslink ct-al__wslink-tm ct-al-tabletop__ws-"
    + escapeExpression(lambda((data && data.index), depth0))
    + "'>\r\n						<div class=\"ct-al__wslink-each ct-al__wslink-each-tm\">\r\n							<a class='col-md-12 col-sm-12 col-lg-12 col-xs-12 flaticon-default flaticon-"
    + escapeExpression(((helper = (helper = helpers.WORKSPACE_ID || (depth0 != null ? depth0.WORKSPACE_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WORKSPACE_ID","hash":{},"data":data}) : helper)))
    + " f-table-top ct-al__wslink-icon-js' href='javascript:void(0)' dat-item-id='"
    + escapeExpression(((helper = (helper = helpers.WORKSPACE_ID || (depth0 != null ? depth0.WORKSPACE_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WORKSPACE_ID","hash":{},"data":data}) : helper)))
    + "'></a> \r\n							<a class='col-md-12 col-sm-12 col-lg-12 col-xs-12 ct-al__tabletop-wslink-txt ' href='javascript:void(0)' dat-item-id='"
    + escapeExpression(((helper = (helper = helpers.WORKSPACE_ID || (depth0 != null ? depth0.WORKSPACE_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WORKSPACE_ID","hash":{},"data":data}) : helper)))
    + "'>"
    + escapeExpression(((helper = (helper = helpers.WORKSPACE_DISPLAY_NM || (depth0 != null ? depth0.WORKSPACE_DISPLAY_NM : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WORKSPACE_DISPLAY_NM","hash":{},"data":data}) : helper)))
    + "</a>\r\n							<div class='clearfix'></div>\r\n						</div>\r\n					</div>\r\n				</li>\r\n				";
},"useData":true});
  templates['al-tabletop-header'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.HEADER_REQ : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "				";
},"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class='navbar navbar-default navbar-fixed-top ct-al__header ct-al-tabletop__header ct-al__header-tm ct-al__header-bs ";
  stack1 = ((helper = (helper = helpers.CSS_CLASS || (depth0 != null ? depth0.CSS_CLASS : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"CSS_CLASS","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "' role='navigation' id='ct_nav' data-item-id='ct-al-tabletop__header'>\r\n	<div class='ct-header-container'>\r\n		<div class='container-fluid'>\r\n			<div class='row'>\r\n				<div class='col-lg-2 col-md-2 col-sm-2 col-xs-12'>\r\n					<div type='button' class='flaticon-main-menu flaticon-tabletop-main-menu visible-xs' data-toggle='collapse' data-target='#img1'></div>\r\n					  \r\n					<a class='ct-logo' data-item-id=\"ct_logo\" rel='home' href='javascript:void(0)'> \r\n						<img src='CTRIAFramework/UIArena/theme/system/jqtbs/images/CT-logo.png' title='CANVAS TECHNOLOGY' alt='CANVAS TECHNOLOGY' />\r\n					</a>\r\n				</div>\r\n				<div class=\"visible-lg visible-md visible-sm col-lg-7 col-md-7 col-sm-7 ct-table-top-ws-header\">\r\n					<span class=\"ct-ws-title\" data-item-id=\"ct-ws-title\">CANVAS TECHNOLOGY</span>\r\n				</div>\r\n				<div class=\"col-lg-3 col-md-3 col-sm-3 col-xs-3\">\r\n					<div class=\"visible-lg visible-md visible-sm ct-al__tabletop-desktop-cont\">\r\n						<span class=\"ct-tabletop-desktop__ws-user-img\" data-item-id=\"ct-user-details\"> \r\n							<img data-item-id='ct-pic' src='"
    + escapeExpression(((helper = (helper = helpers.USR_IMG_PATH || (depth0 != null ? depth0.USR_IMG_PATH : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_IMG_PATH","hash":{},"data":data}) : helper)))
    + "' alt='user_image' class='media-object' data-toggle=\"tooltip\" data-placement=\"auto\" title=\""
    + escapeExpression(((helper = (helper = helpers.USR_INFO || (depth0 != null ? depth0.USR_INFO : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_INFO","hash":{},"data":data}) : helper)))
    + "\" />\r\n						</span>\r\n					</div>\r\n				</div>\r\n				<div class='collapse navbar-collapse tabletop-collapse-mobile' id='img1'>\r\n					<div class='visible-xs ct-user-snippet ct-tabletop__ws-user-snippet'>\r\n						<div class=\"col-lg-4 col-md-4 col-sm-4 col-xs-4\">\r\n							<span class=\"ct-user-img ct-tabletop-desktop__ws-user-img-big ct-al-tabletop__ws-float_img\" data-item-id=\"ct-user-img\"> \r\n								<img data-item-id='ct_picedit' src='"
    + escapeExpression(((helper = (helper = helpers.USR_IMG_PATH || (depth0 != null ? depth0.USR_IMG_PATH : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_IMG_PATH","hash":{},"data":data}) : helper)))
    + "' alt='user_image' class='media-object ct-al-tabletop__ws-userimg_hldr' data-toggle='tooltip' data-placement='bottom' data-original-title='"
    + escapeExpression(((helper = (helper = helpers.PIC_TOOL_TIP || (depth0 != null ? depth0.PIC_TOOL_TIP : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"PIC_TOOL_TIP","hash":{},"data":data}) : helper)))
    + "' />\r\n							</span>\r\n						</div>\r\n						<div class=\"col-lg-8 col-md-8 col-xs-8\">\r\n							<span class=\"ct-user__name ct-tabletop__ws-user-name\">"
    + escapeExpression(((helper = (helper = helpers.USR_INFO || (depth0 != null ? depth0.USR_INFO : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_INFO","hash":{},"data":data}) : helper)))
    + "</span>\r\n							<span class=\"ct-user__login-text ct-tabletop__ws-login-text\">"
    + escapeExpression(((helper = (helper = helpers.LAST_LOGIN_TEXT || (depth0 != null ? depth0.LAST_LOGIN_TEXT : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"LAST_LOGIN_TEXT","hash":{},"data":data}) : helper)))
    + "\r\n								<br />\r\n								<span class=\"ct-user__login-time\">"
    + escapeExpression(((helper = (helper = helpers.USR_LOGIN || (depth0 != null ? depth0.USR_LOGIN : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_LOGIN","hash":{},"data":data}) : helper)))
    + "</span>\r\n							</span>\r\n						</div>\r\n						<div class=\"col-md-12 col-sm-12 col-xs-12 ct-al-tabletop__ws-pref_logout_cont\">\r\n							<div class=\"col-lg-6 col-md-6 col-xs-6 pull-left\">\r\n								<span class=\"pull-left\"><a href=\"javascript:void(0)\" data-item-id='ct_pref' class=\"btn ct_btn flaticon-pref_settings\">&nbsp;"
    + escapeExpression(((helper = (helper = helpers.HEADER_PREF || (depth0 != null ? depth0.HEADER_PREF : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"HEADER_PREF","hash":{},"data":data}) : helper)))
    + "</a></span>\r\n							</div>\r\n							<div class=\"col-lg-6 col-md-6 col-xs-6 pull-right\">\r\n								<span class=\"pull-right\"><a href=\"javascript:void(0)\" data-item-id='ct_logout' class=\"btn ct_btn flaticon-logout\">&nbsp;"
    + escapeExpression(((helper = (helper = helpers.HEADER_LOGOUT || (depth0 != null ? depth0.HEADER_LOGOUT : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"HEADER_LOGOUT","hash":{},"data":data}) : helper)))
    + "</a></span>\r\n							</div>\r\n						</div>\r\n					</div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n		<div class=\"ct-user ct-tabletop-desktop__ws-user-info ct-al-excard__ws-userinfo_hldr hidden-xs \" data-item-id=\"ct-menu-desktop__ws-user-info\">\r\n			<div class=\"ct-tabletop-destop__ws-tooltip-arrow\"></div>\r\n			<div class='ct-user-snippet ct-tabletop__ws-user-snippet'>\r\n				<div class=\"col-lg-4 col-md-4 col-sm-4\">\r\n					<span class=\"ct-user-img ct-tabletop-desktop__ws-user-img-big ct-al-tabletop__ws-float_img data-item-id=\"ct-user-img\"> \r\n						<img data-item-id='ct_picedit' src='"
    + escapeExpression(((helper = (helper = helpers.USR_IMG_PATH || (depth0 != null ? depth0.USR_IMG_PATH : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_IMG_PATH","hash":{},"data":data}) : helper)))
    + "' alt='user_image' class='media-object ct-al-tabletop__ws-userimg_hldr data-toggle='tooltip' data-placement='bottom' data-original-title='"
    + escapeExpression(((helper = (helper = helpers.PIC_TOOL_TIP || (depth0 != null ? depth0.PIC_TOOL_TIP : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"PIC_TOOL_TIP","hash":{},"data":data}) : helper)))
    + "' />\r\n					</span>\r\n				</div>\r\n				<div class=\"col-lg-8 col-md-8\">\r\n					<span class=\"ct-user__name ct-tabletop__ws-user-name\">"
    + escapeExpression(((helper = (helper = helpers.USR_INFO || (depth0 != null ? depth0.USR_INFO : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_INFO","hash":{},"data":data}) : helper)))
    + "</span>\r\n					<span class=\"ct-user__login-text ct-tabletop__ws-login-text\">"
    + escapeExpression(((helper = (helper = helpers.LAST_LOGIN_TEXT || (depth0 != null ? depth0.LAST_LOGIN_TEXT : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"LAST_LOGIN_TEXT","hash":{},"data":data}) : helper)))
    + "\r\n						<br />\r\n						<span class=\"ct-user__login-time\">"
    + escapeExpression(((helper = (helper = helpers.USR_LOGIN || (depth0 != null ? depth0.USR_LOGIN : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"USR_LOGIN","hash":{},"data":data}) : helper)))
    + "</span>\r\n					</span>\r\n				</div>\r\n				<div class=\"col-md-12 col-sm-12 ct-al-tabletop__ws-pref_logout_cont\">\r\n					<div class=\"col-lg-6 col-md-6 pull-left\">\r\n						<span class=\"pull-left\"><a href=\"javascript:void(0)\" data-item-id='ct_pref' class=\"btn ct_btn flaticon-pref_settings\">&nbsp;"
    + escapeExpression(((helper = (helper = helpers.HEADER_PREF || (depth0 != null ? depth0.HEADER_PREF : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"HEADER_PREF","hash":{},"data":data}) : helper)))
    + "</a></span>\r\n					</div>\r\n					<div class=\"col-lg-6 col-md-6 pull-right\">\r\n						<span class=\"pull-right\"><a href=\"javascript:void(0)\" data-item-id='ct_logout' class=\"btn ct_btn flaticon-logout\">&nbsp;"
    + escapeExpression(((helper = (helper = helpers.HEADER_LOGOUT || (depth0 != null ? depth0.HEADER_LOGOUT : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"HEADER_LOGOUT","hash":{},"data":data}) : helper)))
    + "</a></span>\r\n					</div>\r\n					<div></div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n";
},"useData":true});
  templates['appdock'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers.each.call(depth0, depth0, {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class='ct-app-dock__each ct-dock__each-tm  ct-dock__each-bs'>\r\n	<a class='ct-app-dock__each-item' href='javascript:void(0)' data-item-type='miniapp' data-item-id='"
    + escapeExpression(((helper = (helper = helpers.ITEM_ID || (depth0 != null ? depth0.ITEM_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"ITEM_ID","hash":{},"data":data}) : helper)))
    + "'> \r\n	<span class='ct-app-dock__app-img'>\r\n";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.ITEM_ID : depth0), "MasterLayout", {"name":"condchk","hash":{},"fn":this.program(2, data),"inverse":this.program(4, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "	</span> \r\n	<span class='ct-app-dock__app-name'>"
    + escapeExpression(((helper = (helper = helpers.ITEM_TITLE || (depth0 != null ? depth0.ITEM_TITLE : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"ITEM_TITLE","hash":{},"data":data}) : helper)))
    + " </span>\r\n	</a>\r\n</div>\r\n";
},"2":function(depth0,helpers,partials,data) {
  return "		<i class=\"flaticon-home-icon\"></i> \r\n";
  },"4":function(depth0,helpers,partials,data) {
  return "		<i class=\"flaticon-default_a\"></i> \r\n";
  },"useData":true});
  templates['appDockEmpty'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div id='ct-dock'>\r\n	<div data-item-id=\"clicker\" class=\"ct-app-dock\">\r\n		<span class=\"ct_menu_appdoc flaticon-stack flaticon-stackAppdock\">&nbsp;</span>\r\n		<div class='ct-app-dock__notification'>0</div>\r\n		<div class='ct-dock-title'></div>\r\n		<div class=\"ct-app-dock__container\">\r\n			<a href='javascript:void(0)' class=\"ct-app-dock__cancel pull-right\"><span class=\"flaticon-appdock-close flaticon-close2\"></span></a>\r\n			<div class=\"ct-app-dock__content\"></div>\r\n			<div class=\"notify\">\r\n				<div class=\"flaticon-warning3\"></div>\r\n				<span>"
    + escapeExpression(((helper = (helper = helpers.emptyMsg || (depth0 != null ? depth0.emptyMsg : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"emptyMsg","hash":{},"data":data}) : helper)))
    + "</span>\r\n			</div>\r\n		</div>\r\n	</div>\r\n	<div class=\"ct-app-dock__overlay\"></div>\r\n</div>";
},"useData":true});
  templates['calendarview'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"ct-datepicker\">\r\n	<div class=\"ct-datepicker__container\">\r\n		<div class=\"\" data-item-id=\"calendarcontainer\"></div>\r\n	</div>\r\n</div>\r\n";
  },"useData":true});
  templates['cardmaster'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "<div class='ct-al ct-al-card ct-al-tm ct-al-bs' data-itemid='wslinks'>\r\n	<div class='ct-al__container'>";
  stack1 = ((helpers.everyNth || (depth0 && depth0.everyNth) || helperMissing).call(depth0, depth0, 6, {"name":"everyNth","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n</div>\r\n";
},"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = " ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.isModZeroNotFirst : depth0), {"name":"if","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " \r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.isModZero : depth0), {"name":"if","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " \r\n		<div class='col-xs-12 col-sm-6 col-md-2 col-lg-2 ct-bufferbottom-md'>\r\n			<div class='ct-al__wslink-container'>\r\n				<div class='ct-al__wslink ct-al__wslink-tm ct-al-card__wslink'>\r\n					<div class='ct-al__wslink-each ct-al__wslink-each-tm' data-itemid='workspace'>\r\n						<a href='javascript:void(0)' data-item='wslink'> \r\n							<div class='col-md-12 flaticon-default flaticon-"
    + escapeExpression(((helper = (helper = helpers.WORKSPACE_ID || (depth0 != null ? depth0.WORKSPACE_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WORKSPACE_ID","hash":{},"data":data}) : helper)))
    + " ct-al__wslink-icon  ct-al-card__wslink-icon ct-al-card__wslink-icon-tm "
    + escapeExpression(((helper = (helper = helpers.WORKSPACE_ID || (depth0 != null ? depth0.WORKSPACE_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WORKSPACE_ID","hash":{},"data":data}) : helper)))
    + "-wslink-icon'></div>\r\n							<div class='col-md-12 ct-al__wslink-txt ct-al__wslink-txt-tm ct-al-card__wslink-txt ct-al-card__wslink-txt-tm' data-itemtype='workspaceid' data-itemid="
    + escapeExpression(((helper = (helper = helpers.WORKSPACE_ID || (depth0 != null ? depth0.WORKSPACE_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WORKSPACE_ID","hash":{},"data":data}) : helper)))
    + ">"
    + escapeExpression(((helper = (helper = helpers.ITEM_LABEL || (depth0 != null ? depth0.ITEM_LABEL : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"ITEM_LABEL","hash":{},"data":data}) : helper)))
    + "</div>\r\n						</a>\r\n						<div class='clearfix'></div>\r\n					</div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n		 ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.isLast : depth0), {"name":"if","hash":{},"fn":this.program(6, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"2":function(depth0,helpers,partials,data) {
  return "</div>\r\n	 ";
},"4":function(depth0,helpers,partials,data) {
  return "	\r\n	<div class=\"row\">\r\n		";
},"6":function(depth0,helpers,partials,data) {
  return "\r\n	</div>\r\n	 ";
},"useData":true});
  templates['charttolistswitchlist'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<table class=\"table  table-striped table-hover no-margin ct-listview ct-listview-tm\">\r\n	<thead>\r\n		<tr>\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.header : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "		</tr>\r\n	</thead>\r\n	<tbody>\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.rows : depth0), {"name":"each","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "	</tbody>\r\n</table>";
},"1":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "			<th>"
    + escapeExpression(lambda((depth0 != null ? depth0.col : depth0), depth0))
    + "</th> \r\n";
},"3":function(depth0,helpers,partials,data) {
  var stack1, buffer = "		<tr>\r\n";
  stack1 = helpers.each.call(depth0, depth0, {"name":"each","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "		</tr>\r\n";
},"4":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "			<td>"
    + escapeExpression(lambda((depth0 != null ? depth0.rowValue : depth0), depth0))
    + "</td> \r\n";
},"useData":true});
  templates['dragDropModalConfig'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "<div id=\"dragDropModelContainer\">\r\n	<div class=\"panel-heading ct-app__header ct-app__header-tm\">\r\n		<h3 data-item-id=\"formCont-title\" class=\"panel-title ct-app__title ct-app__title-tm\">Re Arrange Widgets</h3>\r\n	</div>\r\n\r\n";
  stack1 = ((helpers.if_eq || (depth0 && depth0.if_eq) || helperMissing).call(depth0, (depth0 != null ? depth0.currentSWLayout : depth0), "STACK", {"name":"if_eq","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n";
  stack1 = ((helpers.if_eq || (depth0 && depth0.if_eq) || helperMissing).call(depth0, (depth0 != null ? depth0.currentSWLayout : depth0), "TWO-COLUMN", {"name":"if_eq","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n";
  stack1 = ((helpers.if_eq || (depth0 && depth0.if_eq) || helperMissing).call(depth0, (depth0 != null ? depth0.currentSWLayout : depth0), "THREE-COLUMN", {"name":"if_eq","hash":{},"fn":this.program(6, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "	<div class=\"panel-footer ct-model__panel-footer\">\r\n		<div class=\"row\">\r\n			<div class='pull-left'>\r\n				<button class=\"btn ct_btn btn-save-cancel\" data-button-id=\"save\">Save</button>\r\n			</div>\r\n			<div class='pull-right'>\r\n				<button class=\"btn ct_btn btn-save-cancel\" data-button-id=\"cancel\">Cancel</button>\r\n			</div>\r\n		</div>	\r\n	</div>\r\n</div>";
},"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "	<div data-item-id=\"dragDrop-model-container\" class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\">\r\n	    <div data-item-id=\"leftWidgets\" class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\">\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.leftWidgets : depth0), {"name":"each","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "	    </div>\r\n    </div>\r\n";
},"2":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "		    	<div data-widget-id=\""
    + escapeExpression(lambda((depth0 != null ? depth0.widgetId : depth0), depth0))
    + "\" data-layout-id=\""
    + escapeExpression(lambda((depth0 != null ? depth0.layoutId : depth0), depth0))
    + "\" class=\"ct-app__header-tm dragableModelWidget\">"
    + escapeExpression(lambda((depth0 != null ? depth0.widgetTitle : depth0), depth0))
    + "</div>\r\n";
},"4":function(depth0,helpers,partials,data) {
  var stack1, buffer = "	<div data-item-id=\"dragDrop-model-container\" class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\">\r\n		<div data-item-id=\"leftWidgets\" class=\"canvas-dragableGroup col-lg-6 col-md-6 col-sm-6 col-xs-6\">\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.leftWidgets : depth0), {"name":"each","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "	    </div>\r\n	    <div data-item-id=\"rightWidgets\" class=\"canvas-dragableGroup col-lg-6 col-md-6 col-sm-6\">\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.rightWidgets : depth0), {"name":"each","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "	    </div>\r\n	</div>\r\n";
},"6":function(depth0,helpers,partials,data) {
  var stack1, buffer = "	<div data-item-id=\"dragDrop-model-container\" class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\">\r\n		<div data-item-id=\"leftWidgets\" class=\"canvas-dragableGroup  col-lg-4 col-md-4 col-sm-4 col-xs-4\">\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.leftWidgets : depth0), {"name":"each","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "		</div>\r\n		<div data-item-id=\"centerWidgets\" class=\"canvas-dragableGroup col-lg-4 col-md-4 col-sm-4 col-xs-4\">\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.centerWidgets : depth0), {"name":"each","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "		</div>\r\n		<div data-item-id=\"rightWidgets\" class=\"canvas-dragableGroup col-lg-4 col-md-4 col-sm-4 col-xs-4\">\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.rightWidgets : depth0), {"name":"each","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "		</div>\r\n	</div>\r\n";
},"useData":true});
  templates['dyc'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,depths) {
  var stack1;
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.obj : depth0), {"name":"each","hash":{},"fn":this.program(1, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { return stack1; }
  else { return ''; }
  },"1":function(depth0,helpers,partials,data,depths) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "<div class=\"dyc-splitter col-lg-"
    + escapeExpression(lambda((depths[1] != null ? depths[1].colWidth : depths[1]), depth0))
    + " no-pad\" style=\"border-right: 3px solid #333;\">\r\n	<div data-item-id=\"dyc-widgetcontainer-"
    + escapeExpression(lambda((data && data.index), depth0))
    + "\" class=\"dyc-widgetcontainer\">\r\n		<div class=\"dyc-addwidget flaticon-expand\"></div>\r\n	</div>\r\n	<div class=\"dyc-hsplitter\"></div>\r\n</div>\r\n";
},"useData":true,"useDepths":true});
  templates['dycmodal'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = " <div class=\"dyc-modal-container col-lg-12 col-md-12 col-sm-12 col-xs-12 no-pad\">\r\n            <div class=\" col-lg-12 col-md-12 col-sm-12 col-xs-12 dyc-model-panel \">\r\n            <div class='row'>\r\n           \r\n            </div>\r\n                \r\n                <div class='row'>\r\n                 <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12 dyc-search no-pad\">\r\n                 	<div class=\"col-lg-8 col-md-8 col-sm-10 col-xs-12 dyc-search-cont dyc-search-result-xs \">\r\n                 	<input type=\"text\" name=\"\" class=\"dyc-search-input dyc-search-box\" />\r\n                 	<div class=\"flaticon-close pull-right dyc-search-close\" data-item-id='dyc-search-close'></div>\r\n                 	</div>\r\n                  \r\n                        <div data-item-id=\"dyc-search-box\" class=\"dyc-search-result-xs\">\r\n                        \r\n                        </div> \r\n                </div>\r\n                 \r\n                <div class=\" col-lg-12 col-md-12 col-sm-12 col-xs-12 dyc-search-result\">\r\n                <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12 no-pad mCustomScrollbar\" data-item-id=\"ct-actScroll\">\r\n                <ul class=\"dyc-product-category \">\r\n";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 != null ? depth0.md : depth0)) != null ? stack1.PRODUCT_CATEGORY_WIDGETS_MAP : stack1), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "	            </ul>\r\n                </div>\r\n";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 != null ? depth0.md : depth0)) != null ? stack1.WIDGET_META_DATA : stack1), {"name":"each","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "                </div>\r\n                </div>\r\n                <div class=\"navbar-default navbar-fixed-bottom ct-al__footer ct-al__footer-tm ct-al__footer-bs ct-al__modalopen-footer dyc-bbar\">\r\n                	<input type=\"button\" class=\"dyc-save\" value=\"Save\"/>\r\n                	<input type=\"button\" class=\"dyc-cancel\" value=\"Cancel\"/>\r\n                </div>\r\n            </div>\r\n            \r\n        </div>";
},"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "	                <li data-product-id=\"product\"><a href=\"javascript:void(0)\"  data-item-id=\""
    + escapeExpression(((helper = (helper = helpers.PRODUCT_CATEGORY || (depth0 != null ? depth0.PRODUCT_CATEGORY : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"PRODUCT_CATEGORY","hash":{},"data":data}) : helper)))
    + "\">";
  stack1 = ((helpers.getFromBundle || (depth0 && depth0.getFromBundle) || helperMissing).call(depth0, (depth0 != null ? depth0.PRODUCT_CATEGORY_DISPLAY_NM : depth0), {"name":"getFromBundle","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</a></li>\r\n";
},"2":function(depth0,helpers,partials,data) {
  return "";
},"4":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "                    <div class=\" col-lg-4 col-md-6 col-sm-6 col-xs-12 dyc-app\" data-item-id='dyc-app' >\r\n                    	<!-- <div class=\"dyc-app-name\">\r\n	                  		<div class=\"dyc-app-name-txt\">"
    + escapeExpression(((helper = (helper = helpers.WGT_DISPLAY_NM || (depth0 != null ? depth0.WGT_DISPLAY_NM : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WGT_DISPLAY_NM","hash":{},"data":data}) : helper)))
    + "</div>\r\n			            </div> -->\r\n			            \r\n						<div class=\"dyc-ico col-lg-2 col-md-2 col-sm-2 col-xs-2\">\r\n							<div class=\"dyc-marked\" data-product-category=\""
    + escapeExpression(((helper = (helper = helpers.PRODUCT_CATEGORY || (depth0 != null ? depth0.PRODUCT_CATEGORY : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"PRODUCT_CATEGORY","hash":{},"data":data}) : helper)))
    + "\" data-widget-id=\""
    + escapeExpression(((helper = (helper = helpers.WIDGET_ID || (depth0 != null ? depth0.WIDGET_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WIDGET_ID","hash":{},"data":data}) : helper)))
    + "\"></div>\r\n							<i class=\"flaticon-default_a\"></i>\r\n						</div>\r\n						 <div class=\"dyc-app-name\">\r\n	                  		<div class=\"dyc-app-name-txt\">"
    + escapeExpression(((helper = (helper = helpers.WGT_DISPLAY_NM || (depth0 != null ? depth0.WGT_DISPLAY_NM : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WGT_DISPLAY_NM","hash":{},"data":data}) : helper)))
    + "</div>\r\n	                  		<div class=\"dyc-app-select\" data-app-select>Select</div>\r\n	                  		<div class=\"dyc-app-name-desc\">"
    + escapeExpression(((helper = (helper = helpers.PRODUCT_CATEGORY || (depth0 != null ? depth0.PRODUCT_CATEGORY : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"PRODUCT_CATEGORY","hash":{},"data":data}) : helper)))
    + "\r\n	                  		</div>\r\n			            </div>\r\n			            \r\n                    </div>\r\n";
},"useData":true});
  templates['emptyview'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return " \r\n<div id= \""
    + escapeExpression(((helper = (helper = helpers.VIEW_ID || (depth0 != null ? depth0.VIEW_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"VIEW_ID","hash":{},"data":data}) : helper)))
    + "\" data-item-id=\""
    + escapeExpression(((helper = (helper = helpers.VIEW_ID || (depth0 != null ? depth0.VIEW_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"VIEW_ID","hash":{},"data":data}) : helper)))
    + "\" class=\"\" data-content=\"empty_content\">"
    + escapeExpression(((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"content","hash":{},"data":data}) : helper)))
    + "</div>\r\n";
},"useData":true});
  templates['favouriteApps'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\"fav-app\" data-item-id=\""
    + escapeExpression(((helper = (helper = helpers.widgetID || (depth0 != null ? depth0.widgetID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"widgetID","hash":{},"data":data}) : helper)))
    + "-app-container\">\r\n 	<div class=\"ct-app-view-container\">\r\n 	<div class=\"ct-fav-apps-scroll mCustomScrollbar\" data-mcs-theme=\"dark-thin\">\r\n 	<ul class=\"ct-app-view-container-inner\">\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.childapps : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "	</ul>\r\n	</div>\r\n	</div>\r\n";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.favAppsReq : depth0), "Y", {"name":"condchk","hash":{},"fn":this.program(7, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "	\r\n</div>\r\n";
},"1":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.IS_FAV_APP : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"2":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "    	<li class=\"ct-apps\" data-app-id=\""
    + escapeExpression(((helper = (helper = helpers.APP_ID || (depth0 != null ? depth0.APP_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"APP_ID","hash":{},"data":data}) : helper)))
    + "\">\r\n      		<div class=\"ct-app-icon ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.RENDERER_TYPE : depth0), "WINDOW", {"name":"condchk","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.RENDERER_TYPE : depth0), "INLINE", {"name":"condchk","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" data-item-id=\"";
  stack1 = ((helper = (helper = helpers.WIDGET_ID || (depth0 != null ? depth0.WIDGET_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WIDGET_ID","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" data-element-id=\"ct-app-icon\">\r\n      			<div class=\"app-title\">";
  stack1 = ((helper = (helper = helpers.widgetTitle || (depth0 != null ? depth0.widgetTitle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"widgetTitle","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</div>\r\n      		</div>\r\n    	</li>\r\n";
},"3":function(depth0,helpers,partials,data) {
  return "ct-app-window";
  },"5":function(depth0,helpers,partials,data) {
  return "ct-app-inline";
  },"7":function(depth0,helpers,partials,data) {
  var stack1, buffer = "	<div class=\"ct-fav-app-container\">\r\n	<span class=\"fav-app-txt\">Favourite Apps</span>\r\n	<div class=\"ct-fav-apps-empty-txt\" data-item-id=\"ct-fav-apps-empty-txt\">No more apps to display ...</div>\r\n	<span class=\"add-apps flaticon-expand\" data-item-id=\"add-apps\"></span>\r\n	<div class=\"ct-fav-apps-scroll mCustomScrollbar\" data-mcs-theme=\"light-thin\">\r\n	<ul class=\"ct-fav-app-container-inner\">\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.childapps : depth0), {"name":"each","hash":{},"fn":this.program(8, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "	</ul>	\r\n	</div>\r\n	</div>\r\n";
},"8":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.IS_FAV_APP : depth0), "Y", {"name":"condchk","hash":{},"fn":this.program(9, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"9":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "   		<li class=\"ct-fav-apps\" data-app-id=\""
    + escapeExpression(((helper = (helper = helpers.APP_ID || (depth0 != null ? depth0.APP_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"APP_ID","hash":{},"data":data}) : helper)))
    + "\">\r\n      		<div class=\"ct-app-icon ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.RENDERER_TYPE : depth0), "WINDOW", {"name":"condchk","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.RENDERER_TYPE : depth0), "INLINE", {"name":"condchk","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" data-item-id=\"";
  stack1 = ((helper = (helper = helpers.WIDGET_ID || (depth0 != null ? depth0.WIDGET_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WIDGET_ID","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" data-element-id=\"ct-app-icon\">\r\n      			<div class=\"cross\" data-item-id=\"cross\"></div>\r\n      			<div class=\"app-title\">";
  stack1 = ((helper = (helper = helpers.widgetTitle || (depth0 != null ? depth0.widgetTitle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"widgetTitle","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</div>\r\n      		</div>\r\n    	</li>\r\n";
},"useData":true});
  templates['favouriteWindow'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class=\"fav-window col-lg-12 col-md-12 col-sm-12 col-xs-12\">\r\n	<div class=\"fav-window-container col-lg-10 col-md-10 col-sm-10 col-xs-10 mCustomScrollbar\" data-mcs-theme=\"rounded-dots\">\r\n		<ul class=\"fav-window-inner-container\">\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.winApps : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "		</ul>\r\n	</div>\r\n	<div class=\"fav-window-bbar col-lg-10 col-md-10 col-sm-10 col-xs-10\">\r\n		<div class=\"add-checked-fav-apps flaticon-save-file1\" data-item-id=\"add-checked-fav-apps\"></div>\r\n	</div>\r\n	<div class=\"fav-win-close flaticon-close2\" data-item-id=\"fav-win-close\"></div>\r\n</div>";
},"1":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "			<li class=\"ct-fav-apps-modal ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.RENDERER_TYPE : depth0), "WINDOW", {"name":"condchk","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.RENDERER_TYPE : depth0), "INLINE", {"name":"condchk","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\" data-app-id=\""
    + escapeExpression(((helper = (helper = helpers.APP_ID || (depth0 != null ? depth0.APP_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"APP_ID","hash":{},"data":data}) : helper)))
    + "\" data-item-id=\"ct-fav-apps-modal\">\r\n				<div class=\"ct-fav-app-selc\"></div>\r\n				<div class=\"ct-fav-app-title\">"
    + escapeExpression(((helper = (helper = helpers.widgetTitle || (depth0 != null ? depth0.widgetTitle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"widgetTitle","hash":{},"data":data}) : helper)))
    + "</div>\r\n			</li> \r\n";
},"2":function(depth0,helpers,partials,data) {
  return "_ct-app-window";
  },"4":function(depth0,helpers,partials,data) {
  return "_ct-app-inline";
  },"useData":true});
  templates['FDF/cbx-amountfield'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div class=\"form-group ct-form__group ct-form__group-tm ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.visibleInd : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "  ct-"
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "-bs "
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "-bs\">\r\n	";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.hideLabel : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.program(6, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " \r\n							<input type=\"text\" name="
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + " class=\"form-control ct-form__ip ct-form__ip-amt\" ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.editableInd : depth0), {"name":"unless","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "/> \r\n							<span type=\"error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container ct_err_position ct_err_default\">\r\n								<span type=\"error_Msg\" class=\"ct-form__err hidden\"> \r\n									<i class=\"flaticon-alert\"></i>\r\n								</span> \r\n							</span> \r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.helpInd : depth0), {"name":"if","hash":{},"fn":this.program(13, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "						</div>\r\n						 ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(15, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n					<div class='clearfix'></div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n				";
},"1":function(depth0,helpers,partials,data) {
  return "hidden";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = " ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n		<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n			 ";
},"4":function(depth0,helpers,partials,data) {
  return "\r\n	<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n		 ";
},"6":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.labelAlignType : depth0), "TOP", {"name":"condchk","hash":{},"fn":this.program(7, data),"inverse":this.program(9, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"7":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<label class=\"ct-form__label\"> \r\n					<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'>";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n				</label>\r\n			</div>\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n					 ";
},"9":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n					<div class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2\">\r\n						<label for=\"amount\" class=\"ct-form__label\"> \r\n							<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'>";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n						</label> \r\n					</div>\r\n					<div class=\"col-xs-10 col-sm-10 col-md-10 col-lg-10\">\r\n						<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n							 ";
},"11":function(depth0,helpers,partials,data) {
  return "disabled";
  },"13":function(depth0,helpers,partials,data) {
  return "							<span class=\"input-group-addon ct-form__addon\"> \r\n								<i class=\"flaticon-alert\"></i>\r\n							</span>\r\n";
  },"15":function(depth0,helpers,partials,data) {
  return "\r\n					</div>\r\n					  ";
},"useData":true});
  templates['FDF/cbx-autoSuggest'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div class=\"form-group ct-form__group ct-form__group-tm ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.visibleInd : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "  ct-"
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "-bs "
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "-bs\">\r\n	";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.hideLabel : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.program(6, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " \r\n							<input type=\"text\" name="
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + " class=\"form-control ct-form__ip ct-form__ip-autosuggest\" ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.editableInd : depth0), {"name":"unless","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "> \r\n							<span id=\"suggestions\" class=\"input-group-addon ct-form__ip-autosuggest-ico\" data-item-id=\"ct-autosuggest\">\r\n								<i class=\"flaticon-expand_down\"></i>\r\n							</span> \r\n							<span type=\"error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container ct_err_position ct_err_autosuggest\">\r\n								<span type=\"error_Msg\" class=\"ct-form__err hidden\"> \r\n									<i class=\"flaticon-alert\"></i>\r\n								</span> \r\n							</span> \r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.helpInd : depth0), {"name":"if","hash":{},"fn":this.program(13, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "						</div>\r\n						 ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(15, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n					<div class='clearfix'></div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n				";
},"1":function(depth0,helpers,partials,data) {
  return "hidden";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = " ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n		<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n			 ";
},"4":function(depth0,helpers,partials,data) {
  return "\r\n	<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n		 ";
},"6":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.labelAlignType : depth0), "TOP", {"name":"condchk","hash":{},"fn":this.program(7, data),"inverse":this.program(9, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"7":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n				<label class=\"ct-form__label\"> \r\n					<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'>";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n				</label>\r\n			</div>\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n					 ";
},"9":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n					<div class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2\">\r\n						<label for=\"text\" class=\"ct-form__label\">\r\n							<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'>";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n						</label> \r\n					</div>\r\n					<div class=\"col-xs-10 col-sm-10 col-md-10 col-lg-10\">\r\n						<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n							 ";
},"11":function(depth0,helpers,partials,data) {
  return "disabled";
  },"13":function(depth0,helpers,partials,data) {
  return "							<span class=\"input-group-addon ct-form__addon\">\r\n								<i class=\"flaticon-alert\"></i>\r\n							</span>\r\n";
  },"15":function(depth0,helpers,partials,data) {
  return "\r\n					</div>\r\n					  ";
},"useData":true});
  templates['FDF/cbx-button'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "<di class=\"form-group ct-form__group ct-form__group-tm ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.visibleInd : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "  ct-"
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "-bs "
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "-bs\">\r\n	";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.hideLabel : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.program(6, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n							<button type=\"button\" class=\"btn ct_btn ct-form__ip ct-form__ip-button "
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "_btn\" name="
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + " ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.editableInd : depth0), {"name":"unless","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += ">";
  stack1 = ((helper = (helper = helpers.elemLabel || (depth0 != null ? depth0.elemLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"elemLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += "</button>\r\n							 \r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.helpInd : depth0), {"name":"if","hash":{},"fn":this.program(13, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "						</div>\r\n						 ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(15, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n					<div class='clearfix'></div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</di>\r\n				";
},"1":function(depth0,helpers,partials,data) {
  return "hidden";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = " ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n		<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n			 ";
},"4":function(depth0,helpers,partials,data) {
  return "\r\n	<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n		 ";
},"6":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.labelAlignType : depth0), "TOP", {"name":"condchk","hash":{},"fn":this.program(7, data),"inverse":this.program(9, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"7":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n				<label class=\"ct-form__label\"> \r\n					<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'>";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n				</label>\r\n			</div>\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n					 ";
},"9":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n					<div class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2\">\r\n						<label for=\"text\" class=\"ct-form__label\">\r\n							<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'> ";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " </span>\r\n						</label> \r\n					</div>\r\n					<div class=\"col-xs-10 col-sm-10 col-md-10 col-lg-10\">\r\n						<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n							 ";
},"11":function(depth0,helpers,partials,data) {
  return "disabled";
  },"13":function(depth0,helpers,partials,data) {
  return "							<span class=\"input-group-addon ct-form__addon\">\r\n								<i class=\"flaticon-alert\"></i>\r\n							</span>\r\n";
  },"15":function(depth0,helpers,partials,data) {
  return "\r\n					</div>\r\n					  ";
},"useData":true});
  templates['FDF/cbx-checkbox'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "\r\n<div class=\"form-group ct-form__group ct-form__group-tm ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.visibleInd : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "  ct-"
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "-bs "
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "-bs\">\r\n	";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.hideLabel : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.program(6, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " \r\n							<label>\r\n								<input type=\"checkbox\" class=\"ct-form__ip ct-form__ip-checkbox\" name=\""
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "\" value=\""
    + escapeExpression(((helpers.getOf || (depth0 && depth0.getOf) || helperMissing).call(depth0, (depth0 != null ? depth0.keys : depth0), "0", {"name":"getOf","hash":{},"data":data})))
    + "\">\r\n								"
    + escapeExpression(((helpers.getOf || (depth0 && depth0.getOf) || helperMissing).call(depth0, (depth0 != null ? depth0.data : depth0), "0", {"name":"getOf","hash":{},"data":data})))
    + "\r\n							</label> \r\n							<span type=\"error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container\">\r\n								<span type=\"error_Msg\" class=\"ct-form__err hidden\"> \r\n									<i class=\"flaticon-warning11\"></i>\r\n								</span> \r\n							</span> \r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.helpInd : depth0), {"name":"if","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "						</div>\r\n						 ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(13, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n					<div class='clearfix'></div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n				";
},"1":function(depth0,helpers,partials,data) {
  return "hidden";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = " ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n		<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n			 ";
},"4":function(depth0,helpers,partials,data) {
  return "\r\n	<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n		 ";
},"6":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.labelAlignType : depth0), "TOP", {"name":"condchk","hash":{},"fn":this.program(7, data),"inverse":this.program(9, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"7":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n				<label class=\"ct-form__label\"> \r\n					<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'>";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n				</label>\r\n			</div>\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n					 ";
},"9":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n					<div class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2\">\r\n						<label for=\"text\" class=\"ct-form__label\">\r\n							<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'> ";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " </span>\r\n						</label> \r\n					</div>\r\n					<div class=\"col-xs-10 col-sm-10 col-md-10 col-lg-10\">\r\n						<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n							 ";
},"11":function(depth0,helpers,partials,data) {
  return "							<span class=\"input-group-addon ct-form__addon\">\r\n								<i class=\"flaticon-alert\"></i>\r\n							</span>\r\n";
  },"13":function(depth0,helpers,partials,data) {
  return "\r\n					</div>\r\n					  ";
},"useData":true});
  templates['FDF/cbx-checkboxgroup'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,depths) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div class=\"form-group ct-form__group ct-form__group-tm ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.visibleInd : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(1, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "  ct-"
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "-bs "
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "-bs\">\r\n	";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.hideLabel : depth0), {"name":"if","hash":{},"fn":this.program(3, data, depths),"inverse":this.program(6, data, depths),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n							<div data-item-id='ct-checkbox_items'>\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.data : depth0), {"name":"each","hash":{},"fn":this.program(11, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n							</div>\r\n							<span type=\"error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container\">\r\n								<span type=\"error_Msg\" class=\"ct-form__err hidden\"> \r\n									<i class=\"flaticon-warning11\"></i>\r\n								</span> \r\n							</span> \r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.helpInd : depth0), {"name":"if","hash":{},"fn":this.program(13, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "						</div>\r\n						 ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(15, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n					<div class='clearfix'></div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n				";
},"1":function(depth0,helpers,partials,data) {
  return "hidden";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = " ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n		<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n			 ";
},"4":function(depth0,helpers,partials,data) {
  return "\r\n	<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n		 ";
},"6":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.labelAlignType : depth0), "TOP", {"name":"condchk","hash":{},"fn":this.program(7, data),"inverse":this.program(9, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"7":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n				<label class=\"ct-form__label\" data-item-type='ct-fieldlabel'> \r\n					<span class=\"ct-form__label-val\">";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n				</label>\r\n			</div>\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n					 ";
},"9":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n					<div class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2\">\r\n						<label for=\"text\" class=\"ct-form__label\">\r\n							<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'> ";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " </span>\r\n						</label> \r\n					</div>\r\n					<div class=\"col-xs-10 col-sm-10 col-md-10 col-lg-10\">\r\n						<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n							 ";
},"11":function(depth0,helpers,partials,data,depths) {
  var helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, lambda=this.lambda;
  return "								<label class=\"checkbox-inline ct-form__label-checkboxgrp\"> \r\n									<input type=\"checkbox\" class=\"ct-form__ip ct-form__ip-checkboxgrp\" value=\""
    + escapeExpression(((helpers.getOf || (depth0 && depth0.getOf) || helperMissing).call(depth0, (depths[1] != null ? depths[1].keys : depths[1]), (data && data.index), {"name":"getOf","hash":{},"data":data})))
    + "\" name=\""
    + escapeExpression(lambda((depths[1] != null ? depths[1].itemId : depths[1]), depth0))
    + "\">"
    + escapeExpression(lambda(depth0, depth0))
    + "\r\n								</label> ";
},"13":function(depth0,helpers,partials,data) {
  return "							<span class=\"input-group-addon ct-form__addon\">\r\n								<i class=\"flaticon-alert\"></i>\r\n							</span>\r\n";
  },"15":function(depth0,helpers,partials,data) {
  return "\r\n					</div>\r\n					  ";
},"useData":true,"useDepths":true});
  templates['FDF/cbx-checkboxgroupstaticfield'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.hideLabel : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(4, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n						<div class=\""
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + " form-control\">\r\n							<span name=\""
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "\" class=\"ct-form__ip ct-form__ip-staticcheckbox ct-form__static\"></span>\r\n						</div>\r\n						<span type=\"error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container\">\r\n							<span type=\"error_Msg\" class=\"ct-form__err hidden\"> \r\n								<i class=\"flaticon-warning11\"></i>\r\n							</span> \r\n						</span> \r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.helpInd : depth0), {"name":"if","hash":{},"fn":this.program(9, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "					</div>\r\n					 ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n				<div class='clearfix'></div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n			";
},"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = " ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n	<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n		 ";
},"2":function(depth0,helpers,partials,data) {
  return "\r\n<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n	 ";
},"4":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.labelAlignType : depth0), "TOP", {"name":"condchk","hash":{},"fn":this.program(5, data),"inverse":this.program(7, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"5":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n		<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n			<label class=\"ct-form__label\"> \r\n				<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'>";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n			</label>\r\n		</div>\r\n		<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n			<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n				 ";
},"7":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n				<div class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2\">\r\n					<label for=\"text\" class=\"ct-form__label\">\r\n						<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'> ";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " </span>\r\n					</label> \r\n				</div>\r\n				<div class=\"col-xs-10 col-sm-10 col-md-10 col-lg-10\">\r\n					<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n						 ";
},"9":function(depth0,helpers,partials,data) {
  return "						<span class=\"input-group-addon ct-form__addon\">\r\n							<i class=\"flaticon-alert\"></i>\r\n						</span>\r\n";
  },"11":function(depth0,helpers,partials,data) {
  return "\r\n				</div>\r\n				  ";
},"useData":true});
  templates['FDF/cbx-colorPicker'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div class=\"form-group ct-form__group ct-form__group-tm ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.visibleInd : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "  ct-"
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "-bs "
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "-bs\">\r\n	";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.hideLabel : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.program(6, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " \r\n							<input type=\"text\" name="
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + " class=\"form-control ct-form__ip ct-form__ip-colorpicker\" ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.editableInd : depth0), {"name":"unless","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "/> \r\n							<span class=\"input-group-addon input-group-addon-colorpicker-js input-group-addon-colorpicker-tm\" data-item-id=\"ct-colorpicker\">\r\n								<i class=\"flaticon-colorpicker\"></i>\r\n							</span> \r\n							<span type=\"error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container ct_err_position ct_err_default\">\r\n								<span type=\"error_Msg\" class=\"ct-form__err hidden ct-form__err-colorpicker\">\r\n									<i class=\"flaticon-alert\"></i>\r\n								</span> \r\n							</span> \r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.helpInd : depth0), {"name":"if","hash":{},"fn":this.program(13, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "						</div>\r\n						 ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(15, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n					<div class='clearfix'></div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n				";
},"1":function(depth0,helpers,partials,data) {
  return "hidden";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = " ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n		<div class=\"input-group\" data-item-xtype=\""
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n			 ";
},"4":function(depth0,helpers,partials,data) {
  return "\r\n	<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n		 ";
},"6":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.labelAlignType : depth0), "TOP", {"name":"condchk","hash":{},"fn":this.program(7, data),"inverse":this.program(9, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"7":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<label class=\"ct-form__label\"> \r\n					<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'>";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n				</label>\r\n			</div>\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<div class=\"input-group\" data-item-xtype=\""
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n					 ";
},"9":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n					<div class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2\">\r\n						<label for=\"text\" class=\"ct-form__label\">\r\n							<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'> ";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " </span>\r\n						</label> \r\n					</div>\r\n					<div class=\"col-xs-10 col-sm-10 col-md-10 col-lg-10\">\r\n						<div class=\"input-group\" data-item-id=\""
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n							 ";
},"11":function(depth0,helpers,partials,data) {
  return "disabled";
  },"13":function(depth0,helpers,partials,data) {
  return "							<span class=\"input-group-addon ct-form__addon\">\r\n								<i class=\"flaticon-alert\"></i>\r\n							</span>\r\n";
  },"15":function(depth0,helpers,partials,data) {
  return "\r\n					</div>\r\n					  ";
},"useData":true});
  templates['FDF/cbx-combobox'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,depths) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div class=\"form-group ct-form__group ct-form__group-tm ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.visibleInd : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(1, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "  ct-"
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "-bs "
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "-bs\">\r\n	";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.hideLabel : depth0), {"name":"if","hash":{},"fn":this.program(3, data, depths),"inverse":this.program(6, data, depths),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " \r\n							<select class=\"selectpicker form-control ct-form__ip ct-form__ip-combo\" name="
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + " ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.editableInd : depth0), {"name":"unless","hash":{},"fn":this.program(11, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += ">\r\n";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.includeSelectInd : depth0), "Y", {"name":"condchk","hash":{},"fn":this.program(13, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.data : depth0), {"name":"each","hash":{},"fn":this.program(15, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "							</select> \r\n							<span type=\"error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container ct_err_position ct_err_autosuggest\">\r\n								<span type=\"error_Msg\" class=\"ct-form__err hidden\"> \r\n									<i class=\"flaticon-alert\"></i>\r\n								</span> \r\n							</span> \r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.helpInd : depth0), {"name":"if","hash":{},"fn":this.program(17, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "						</div>\r\n						 ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(19, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n					<div class=\"clearfix\"></div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n				";
},"1":function(depth0,helpers,partials,data) {
  return "hidden";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = " ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n		<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n			 ";
},"4":function(depth0,helpers,partials,data) {
  return "\r\n	<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n		 ";
},"6":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.labelAlignType : depth0), "TOP", {"name":"condchk","hash":{},"fn":this.program(7, data),"inverse":this.program(9, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"7":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n				<label class=\"ct-form__label\"> \r\n					<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'>";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n				</label>\r\n			</div>\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n					 ";
},"9":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n					<div class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2\">\r\n						<label for=\"text\" class=\"ct-form__label\">\r\n							<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'> ";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " </span>\r\n						</label> \r\n					</div>\r\n					<div class=\"col-xs-10 col-sm-10 col-md-10 col-lg-10\">\r\n						<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n							 ";
},"11":function(depth0,helpers,partials,data) {
  return "disabled";
  },"13":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "								<option value=\"-1\">"
    + escapeExpression(((helper = (helper = helpers.selectLbl || (depth0 != null ? depth0.selectLbl : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"selectLbl","hash":{},"data":data}) : helper)))
    + "</option> \r\n";
},"15":function(depth0,helpers,partials,data,depths) {
  var helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, lambda=this.lambda;
  return "								<option value=\""
    + escapeExpression(((helpers.getOf || (depth0 && depth0.getOf) || helperMissing).call(depth0, (depths[1] != null ? depths[1].keys : depths[1]), (data && data.index), {"name":"getOf","hash":{},"data":data})))
    + "\">"
    + escapeExpression(lambda(depth0, depth0))
    + "</option>\r\n";
},"17":function(depth0,helpers,partials,data) {
  return "							<span class=\"input-group-addon ct-form__addon\">\r\n								<i class=\"flaticon-alert\"></i>\r\n							</span>\r\n";
  },"19":function(depth0,helpers,partials,data) {
  return "\r\n					</div>\r\n					  ";
},"useData":true,"useDepths":true});
  templates['FDF/cbx-conditionalMandatoryText'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div class=\"form-group ct-form__group ct-form__group-tm ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.visibleInd : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "  ct-"
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "-bs "
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "-bs\">\r\n	<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n		<span class='ct-form__label-individual'>\r\n			";
  stack1 = ((helper = (helper = helpers.ConditionalMandatorySpan || (depth0 != null ? depth0.ConditionalMandatorySpan : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"ConditionalMandatorySpan","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " \r\n			<span class='conditional-mandatory conditionalInd'>"
    + escapeExpression(((helper = (helper = helpers.CondMandatoryText || (depth0 != null ? depth0.CondMandatoryText : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"CondMandatoryText","hash":{},"data":data}) : helper)))
    + "</span>\r\n		</span>\r\n	</div>\r\n	<div class='clearfix'></div>\r\n</div>";
},"1":function(depth0,helpers,partials,data) {
  return "hidden";
  },"useData":true});
  templates['FDF/cbx-datefield'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div class=\"form-group ct-form__group ct-form__group-tm ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.visibleInd : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "  ct-"
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "-bs "
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "-bs\">\r\n	";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.hideLabel : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.program(6, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " \r\n							<input type=\"text\" name="
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + " class=\"form-control ct-form__ip ct-form__ip-date-picker\" ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.editableInd : depth0), {"name":"unless","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "/> \r\n							<span class=\"input-group-addon input-calendar-addon btn ct-form__ip-date-picker-ico\" ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.editableInd : depth0), {"name":"unless","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " data-item-id='ct-caladdon'>\r\n								<i class=\"flaticon-calendar-new\"></i>\r\n							</span> \r\n							<span type=\"error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container ct_err_position ct_err_autosuggest\">\r\n								<span type=\"error_Msg\" class=\"ct-form__err hidden\"> \r\n									<i class=\"flaticon-alert\"></i>\r\n								</span> \r\n							</span> \r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.helpInd : depth0), {"name":"if","hash":{},"fn":this.program(13, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "						</div>\r\n						 ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(15, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n					<div class='clearfix'></div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n				";
},"1":function(depth0,helpers,partials,data) {
  return "hidden";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = " ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n		<div class=\"input-group date\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n			 ";
},"4":function(depth0,helpers,partials,data) {
  return "\r\n	<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n		 ";
},"6":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.labelAlignType : depth0), "TOP", {"name":"condchk","hash":{},"fn":this.program(7, data),"inverse":this.program(9, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"7":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<label class=\"ct-form__label\"> \r\n					<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'>";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n				</label>\r\n			</div>\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<div class=\"input-group date\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n					 ";
},"9":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n					<div class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2\">\r\n						<label for=\"date-picker\" class=\"ct-form__label\"> \r\n							<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'> ";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " </span>\r\n						</label> \r\n					</div>\r\n					<div class=\"col-xs-10 col-sm-10 col-md-10 col-lg-10\">\r\n						<div class=\"input-group date\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n							 ";
},"11":function(depth0,helpers,partials,data) {
  return "disabled";
  },"13":function(depth0,helpers,partials,data) {
  return "							<span class=\"input-group-addon ct-form__addon\">\r\n								<i class=\"flaticon-alert\"></i>\r\n							</span>\r\n";
  },"15":function(depth0,helpers,partials,data) {
  return "\r\n					</div>\r\n					  ";
},"useData":true});
  templates['FDF/cbx-displayfield'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div class=\"form-group ct-form__group ct-form__group-tm ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.visibleInd : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "  ct-"
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "-bs "
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "-bs\">\r\n	<div data-item-id=\"displayfield\" class=\"form-control ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.visibleInd : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n		<span name=\""
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + " ct-form__static\">";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n	</div>\r\n	<div class='clearfix'></div>\r\n</div>";
},"1":function(depth0,helpers,partials,data) {
  return "hidden";
  },"3":function(depth0,helpers,partials,data) {
  return " hidden";
  },"useData":true});
  templates['FDF/cbx-displayratefield'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div class=\"form-group ct-form__group ct-form__group-tm ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.visibleInd : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "  ct-"
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "-bs "
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "-bs\">\r\n	";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.hideLabel : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.program(6, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " \r\n							<span name="
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + " class=\"ct-form__ip ct-form__ip-rate ct-form__static\"></span> \r\n							<span type=\"error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container ct_err_position ct_err_default\">\r\n								<span type=\"error_Msg\" class=\"ct-form__err hidden\"> \r\n									<i class=\"flaticon-alert\"></i>\r\n								</span> \r\n							</span> \r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.helpInd : depth0), {"name":"if","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "						</div>\r\n						 ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(13, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n					<div class='clearfix'></div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n				";
},"1":function(depth0,helpers,partials,data) {
  return "hidden";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = " ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n		<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n			 ";
},"4":function(depth0,helpers,partials,data) {
  return "\r\n	<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n		 ";
},"6":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.labelAlignType : depth0), "TOP", {"name":"condchk","hash":{},"fn":this.program(7, data),"inverse":this.program(9, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"7":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<label class=\"ct-form__label\"> \r\n					<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'>";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n				</label>\r\n			</div>\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n					 ";
},"9":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n					<div class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2\">\r\n						<label for=\"rate\" class=\"ct-form__label\">\r\n							<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'> ";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " </span>\r\n						</label> \r\n					</div>\r\n					<div class=\"col-xs-10 col-sm-10 col-md-10 col-lg-10\">\r\n						<div class=\"input-group form-control \""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n							 ";
},"11":function(depth0,helpers,partials,data) {
  return "							<span class=\"input-group-addon ct-form__addon\">\r\n								<i class=\"flaticon-alert\"></i>\r\n							</span>\r\n";
  },"13":function(depth0,helpers,partials,data) {
  return "\r\n					</div>\r\n					  ";
},"useData":true});
  templates['FDF/cbx-editablelookup'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div class=\"form-group ct-form__group ct-form__group-tm ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.visibleInd : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "  ct-"
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "-bs "
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "-bs\">\r\n	";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.hideLabel : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.program(6, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " \r\n							<input type=\"text\" name="
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + " class=\"form-control ct-form__ip ct-form__ip-lookup\" ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.editableInd : depth0), {"name":"unless","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " \">\r\n							<span class=\"input-group-addon ct-editlkp\" data-item-id='ct-lookup-search'>\r\n								<i class=\"flaticon-magnifying-glass2\"></i>\r\n							</span> \r\n							<span type=\"error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container ct_err_position ct_err_autosuggest\">\r\n								<span type=\"error_Msg\" class=\"ct-form__err hidden\"> \r\n									<i class=\"flaticon-alert\"></i>\r\n								</span> \r\n							</span> \r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.helpInd : depth0), {"name":"if","hash":{},"fn":this.program(13, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "						</div>\r\n						 ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(15, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n					<div class='clearfix'></div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n				";
},"1":function(depth0,helpers,partials,data) {
  return "hidden";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = " ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n		<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n			 ";
},"4":function(depth0,helpers,partials,data) {
  return "\r\n	<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n		 ";
},"6":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.labelAlignType : depth0), "TOP", {"name":"condchk","hash":{},"fn":this.program(7, data),"inverse":this.program(9, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"7":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n				<label class=\"ct-form__label\"> \r\n					<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'>";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n				</label>\r\n			</div>\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n					 ";
},"9":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n					<div class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2\">\r\n						<label for=\"text\" class=\"ct-form__label\">\r\n							<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'> ";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " </span>\r\n						</label> \r\n					</div>\r\n					<div class=\"col-xs-10 col-sm-10 col-md-10 col-lg-10\">\r\n						<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n							 ";
},"11":function(depth0,helpers,partials,data) {
  return "disabled";
  },"13":function(depth0,helpers,partials,data) {
  return "							<span class=\"input-group-addon ct-form__addon\">\r\n								<i class=\"flaticon-alert\"></i>\r\n							</span>\r\n";
  },"15":function(depth0,helpers,partials,data) {
  return "\r\n					</div>\r\n					  ";
},"useData":true});
  templates['FDF/cbx-fileuploadpanel'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div\r\n	class=\"form-group  ct-form__group ct-form__group-tm ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.visibleInd : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "  ct-"
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "-bs "
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "-bs\">\r\n	";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.hideLabel : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.program(6, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n							<form data-item-id=\"ct-uploadForm\"></form>\r\n							<button type=\"button\" class=\"btn start\" data-item-id='ct-addFile'>\r\n								<i class=\"flaticon-expand f_up_ad\"></i> \r\n								<span>Add Files</span>\r\n							</button>\r\n							<button type=\"button\" class=\"btn start disabled\" data-item-id='ct-uploadFile'>\r\n								<i class=\"flaticon-upload_3\"></i> \r\n								<span>Upload</span>\r\n							</button>\r\n							<div class=\"filenames\" data-item-id='ct-fileList'></div>\r\n							<div class=\"fileupload-loading\"></div>\r\n							<div class=\"progress hidden\">\r\n								<div data-item-id=\"ctUpload-progress-bar\" class=\"progress-bar progress-bar-striped active\" role=\"progressbar\" aria-valuenow=\"0\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 0%;\"></div>\r\n							</div>\r\n							 \r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.helpInd : depth0), {"name":"if","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "						</div>\r\n						 ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(13, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n					<div class='clearfix'></div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n			";
},"1":function(depth0,helpers,partials,data) {
  return "hidden";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = " ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n		<div class=\"ct-fileUpload-panel\" "
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n			 ";
},"4":function(depth0,helpers,partials,data) {
  return "\r\n	<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n		 ";
},"6":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.labelAlignType : depth0), "TOP", {"name":"condchk","hash":{},"fn":this.program(7, data),"inverse":this.program(9, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"7":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<label class=\"ct-form__label\"> \r\n					<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'>";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n				</label>\r\n			</div>\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<div class=\"ct-fileUpload-panel\" "
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n					 ";
},"9":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n					<div class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2\">\r\n						<label for=\"file\" class=\"ct-form__label\">\r\n							<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'> ";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " </span>\r\n						</label> \r\n					</div>\r\n					<div class=\"col-xs-10 col-sm-10 col-md-10 col-lg-10\">\r\n						<div class=\"ct-fileUpload-panel\" "
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n							 ";
},"11":function(depth0,helpers,partials,data) {
  return "							<span class=\"input-group-addon ct-form__addon\">\r\n								<i class=\"flaticon-alert\"></i>\r\n							</span>\r\n";
  },"13":function(depth0,helpers,partials,data) {
  return "\r\n					</div>\r\n					  ";
},"useData":true});
  templates['FDF/cbx-hidden'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div class=\"form-group ct-form__group ct-form__group-tm ct-"
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "-bs "
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "-bs hidden\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n	<input type=\"hidden\" value=\""
    + escapeExpression(((helper = (helper = helpers.Value || (depth0 != null ? depth0.Value : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"Value","hash":{},"data":data}) : helper)))
    + "\" name="
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + ">\r\n</div>";
},"useData":true});
  templates['FDF/cbx-htmleditor'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, lambda=this.lambda, buffer = "<div class=\"form-group ct-form__group ct-form__group-tm ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.visibleInd : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "  ct-"
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "-bs "
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "-bs\">\r\n	";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.hideLabel : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.program(6, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n							<div id=\"main\">\r\n								<form class=\"formstyles\">\r\n";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.disableComp : depth0), {"name":"unless","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "									<p>\r\n										<div name=\"description\" id="
    + escapeExpression(lambda((depth0 != null ? depth0.itemId : depth0), depth0))
    + " class=\"html-editor\" ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.disableComp : depth0), {"name":"unless","hash":{},"fn":this.program(13, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "></div>\r\n									</p>\r\n								</form>\r\n							</div>\r\n						</div>\r\n					</div>\r\n					 \r\n					<div class='clearfix'></div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n				";
},"1":function(depth0,helpers,partials,data) {
  return "hidden";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = " ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n		<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n			 ";
},"4":function(depth0,helpers,partials,data) {
  return "\r\n	<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n		 ";
},"6":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.labelAlignType : depth0), "TOP", {"name":"condchk","hash":{},"fn":this.program(7, data),"inverse":this.program(9, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"7":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<label class=\"ct-form__label\"> \r\n					<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'>";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n				</label>\r\n			</div>\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n					 ";
},"9":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n					<div class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2\">\r\n						<label for=\"html-editor\" class=\"ct-form__label\"> \r\n							<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'>";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n						</label> \r\n					</div>\r\n					<div class=\"col-xs-10 col-sm-10 col-md-10 col-lg-10\">\r\n						<div"
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n							 ";
},"11":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "									<div class=\"btn-toolbar\" data-role=\"editor-toolbar\" data-target=\"#"
    + escapeExpression(lambda((depth0 != null ? depth0.itemId : depth0), depth0))
    + "\">\r\n										\r\n										<div class=\"btn-group htm_btn_padding\">\r\n									    	<a class=\"btn ct-form__html_btn dropdown-toggle\" data-toggle=\"dropdown\" title=\"\" data-original-title=\"Font Size\"><span class=\"\">Font Size</span></a>\r\n									    	<ul class=\"dropdown-menu\">\r\n									      		<li><a data-edit=\"fontSize 5\"><font size=\"5\">Huge</font></a></li>\r\n									      		<li><a data-edit=\"fontSize 3\"><font size=\"3\">Normal</font></a></li>\r\n									      		<li><a data-edit=\"fontSize 1\"><font size=\"1\">Small</font></a></li>\r\n									      	</ul>\r\n									    </div>	\r\n									    \r\n										<div class=\"btn-group htm_btn_padding\">\r\n											<a class=\"btn ct-form__html_btn bold\" data-edit=\"bold\" title=\"\" data-original-title=\"Bold (Ctrl/Cmd+B)\"><span class=\"flaticon-bold\"></span></a>\r\n											<a class=\"btn ct-form__html_btn italic\" data-edit=\"italic\" title=\"\" data-original-title=\"Italic (Ctrl/Cmd+I)\"><span class=\"flaticon-italics\"></span></a>\r\n											<a class=\"btn ct-form__html_btn underline\" data-edit=\"underline\" title=\"\" data-original-title=\"Underline (Ctrl/Cmd+U)\"><span class=\"flaticon-underlined\"></span></a>\r\n											<a class=\"btn ct-form__html_btn strikethrough\" data-edit=\"strikethrough\" title=\"\" data-original-title=\"Strikethrough\"><span class=\"flaticon-strikethrough\">S</span></a>\r\n										</div>\r\n										\r\n										<div class=\"btn-group htm_btn_padding\">\r\n											<a class=\"btn ct-form__html_btn unorderedlist\" data-edit=\"insertunorderedlist\" title=\"\" data-original-title=\"Bullet list\"><span class=\"flaticon-bullet_list2\"></span></a>\r\n									        <a class=\"btn ct-form__html_btn orderedlist\" data-edit=\"insertorderedlist\" title=\"\" data-original-title=\"Number list\"><span class=\"flaticon-number_list2\"></span></a>\r\n									        <a class=\"btn ct-form__html_btn\" data-edit=\"outdent\" title=\"\" data-original-title=\"Reduce indent (Shift+Tab)\"><span class=\"\"><<</span></a>\r\n									        <a class=\"btn ct-form__html_btn\" data-edit=\"indent\" title=\"\" data-original-title=\"Indent (Tab)\"><span class=\"\">>></span></a>\r\n										</div>\r\n										\r\n										<div class=\"btn-group htm_btn_padding\">\r\n											 <a class=\"btn ct-form__html_btn alignleft\" data-edit=\"justifyleft\" title=\"\" data-original-title=\"Align Left (Ctrl/Cmd+L)\"><span class=\"flaticon-indent-left\"></span></a>\r\n										     <a class=\"btn ct-form__html_btn aligncenter\" data-edit=\"justifycenter\" title=\"\" data-original-title=\"Center (Ctrl/Cmd+E)\"><span class=\"flaticon-center-alignment\"></span></a>\r\n										     <a class=\"btn ct-form__html_btn alignright\" data-edit=\"justifyright\" title=\"\" data-original-title=\"Align Right (Ctrl/Cmd+R)\"><span class=\"flaticon-indent-rght\"></span></a>\r\n										     <a class=\"btn ct-form__html_btn justifyfull\" data-edit=\"justifyfull\" title=\"\" data-original-title=\"Justify (Ctrl/Cmd+J)\"><span class=\"flaticon-justifyfull\">J</span></a>\r\n										</div>								\r\n									</div>									\r\n";
},"13":function(depth0,helpers,partials,data) {
  return " contenteditable=\"false\" ";
  },"useData":true});
  templates['FDF/cbx-hyperlink'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div class=\"form-group ct-form__group ct-form__group-tm ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.visibleInd : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "  ct-"
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "-bs "
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "-bs\">\r\n	";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.hideLabel : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.program(6, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " \r\n					<a href=\"javascript:void(0)\" name="
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + " ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.editableInd : depth0), {"name":"unless","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "> ";
  stack1 = ((helper = (helper = helpers.fieldName || (depth0 != null ? depth0.fieldName : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldName","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += " </a> \r\n";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(13, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n				<div class='clearfix'></div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n";
},"1":function(depth0,helpers,partials,data) {
  return "hidden";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = " ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n		<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n			 ";
},"4":function(depth0,helpers,partials,data) {
  return "\r\n	<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n		 ";
},"6":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.labelAlignType : depth0), "TOP", {"name":"condchk","hash":{},"fn":this.program(7, data),"inverse":this.program(9, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"7":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<label class=\"ct-form__label\"> \r\n					<span class=\"ct-form__label-val\">";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n				</label>\r\n			</div>\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n				 ";
},"9":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n				<div class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2\">\r\n					<label for=\"static-text\" class=\"ct-form__label\"> \r\n						<span class=\"ct-form__label-val\">";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n					</label> \r\n				</div>\r\n				<div class=\"col-xs-10 col-sm-10 col-md-10 col-lg-10\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n					 ";
},"11":function(depth0,helpers,partials,data) {
  return "disabled";
  },"13":function(depth0,helpers,partials,data) {
  return "				</div>\r\n				  ";
},"useData":true});
  templates['FDF/cbx-iconcombobox'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,depths) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div class=\"form-group ct-form__group ct-form__group-tm ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.visibleInd : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(1, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "  ct-"
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "-bs "
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "-bs\">\r\n	";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.hideLabel : depth0), {"name":"if","hash":{},"fn":this.program(3, data, depths),"inverse":this.program(6, data, depths),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n							<div class=\"btn-group select col-lg-12 no-pad\">\r\n								<button type=\"button\" name="
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + " id =\"select1\" class=\"btn ct_btn dropdown-toggle form-control ct-form__ip ct-form__ip-icon-combo\" data-toggle=\"dropdown\">\r\n									<a href=\"javascript:void(0)\" class=\"ct-form__static\">\r\n										<span class=\"ct-icon-combo__icon\"></span>\r\n										<span class=\"ct-icon-combo__val\" data-item-id=\"-1\">"
    + escapeExpression(((helper = (helper = helpers.selectLbl || (depth0 != null ? depth0.selectLbl : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"selectLbl","hash":{},"data":data}) : helper)))
    + "</span>\r\n									</a>\r\n									<span class=\"caret\"></span>\r\n								</button>\r\n								<ul class=\"dropdown-menu col-lg-12\" role=\"menu\">\r\n";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.includeSelectInd : depth0), "Y", {"name":"condchk","hash":{},"fn":this.program(11, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += " ";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.data : depth0), {"name":"each","hash":{},"fn":this.program(13, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "								</ul>\r\n							</div>\r\n							<span type=\"error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container\">\r\n								<span type=\"error_Msg\" class=\"ct-form__err hidden\"> \r\n									<i class=\"flaticon-warning11\"></i>\r\n								</span> \r\n							</span> \r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.helpInd : depth0), {"name":"if","hash":{},"fn":this.program(15, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "						</div>\r\n						 ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(17, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n					<div class='clearfix'></div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n				";
},"1":function(depth0,helpers,partials,data) {
  return "hidden";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = " ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n		<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n			 ";
},"4":function(depth0,helpers,partials,data) {
  return "\r\n	<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n		 ";
},"6":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.labelAlignType : depth0), "TOP", {"name":"condchk","hash":{},"fn":this.program(7, data),"inverse":this.program(9, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"7":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n				<label class=\"ct-form__label\"> \r\n					<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'>";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n				</label>\r\n			</div>\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n					 ";
},"9":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n					<div class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2\">\r\n						<label for=\"text\" class=\"ct-form__label\">\r\n							<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'> ";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " </span>\r\n						</label> \r\n					</div>\r\n					<div class=\"col-xs-10 col-sm-10 col-md-10 col-lg-10\">\r\n						<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n							 ";
},"11":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "									<li class=\"ct-icon-combo-each\" data-item-id=\"-1\">\r\n										<a href=\"javascript:void(0)\">\r\n											<span class=\"ct-icon-combo__icon\"></span>\r\n											<span class=\"ct-icon-combo__val\" data-item-id=\"-1\">"
    + escapeExpression(((helper = (helper = helpers.selectLbl || (depth0 != null ? depth0.selectLbl : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"selectLbl","hash":{},"data":data}) : helper)))
    + "</span>\r\n										</a>\r\n									</li>\r\n									";
},"13":function(depth0,helpers,partials,data,depths) {
  var helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, lambda=this.lambda;
  return "\r\n									<li class=\"ct-icon-combo-each\" data-item-id=\""
    + escapeExpression(((helpers.getOf || (depth0 && depth0.getOf) || helperMissing).call(depth0, (depths[1] != null ? depths[1].keys : depths[1]), (data && data.index), {"name":"getOf","hash":{},"data":data})))
    + "\">\r\n										<a href=\"javascript:void(0)\">\r\n											<span class=\"ct-icon-combo__icon comboIcon-"
    + escapeExpression(lambda((depths[1] != null ? depths[1].parentId : depths[1]), depth0))
    + "-"
    + escapeExpression(lambda((depths[1] != null ? depths[1].itemId : depths[1]), depth0))
    + "-"
    + escapeExpression(((helpers.getOf || (depth0 && depth0.getOf) || helperMissing).call(depth0, (depths[1] != null ? depths[1].keys : depths[1]), (data && data.index), {"name":"getOf","hash":{},"data":data})))
    + "\"></span>\r\n											<span class=\"ct-icon-combo__val\" data-item-id=\""
    + escapeExpression(((helpers.getOf || (depth0 && depth0.getOf) || helperMissing).call(depth0, (depths[1] != null ? depths[1].keys : depths[1]), (data && data.index), {"name":"getOf","hash":{},"data":data})))
    + "\">"
    + escapeExpression(lambda(depth0, depth0))
    + "</span>\r\n										</a>\r\n									</li>\r\n";
},"15":function(depth0,helpers,partials,data) {
  return "							<span class=\"input-group-addon ct-form__addon\">\r\n								<i class=\"flaticon-alert\"></i>\r\n							</span>\r\n";
  },"17":function(depth0,helpers,partials,data) {
  return "\r\n					</div>\r\n					  ";
},"useData":true,"useDepths":true});
  templates['FDF/cbx-imagepanel'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,depths) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div class=\"form-group ct-form__group ct-form__group-tm ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.visibleInd : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(1, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "  ct-"
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "-bs "
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "-bs\">\r\n	<div id=\"ct-Carousel\" class=\"carousel slide";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.addData : depth0), {"name":"if","hash":{},"fn":this.program(3, data, depths),"inverse":this.program(4, data, depths),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" data-ride=\"carousel\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n		<ol class=\"carousel-indicators\">\r\n			";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.addData : depth0), {"name":"each","hash":{},"fn":this.program(6, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n		</ol>\r\n		<div class=\"carousel-inner\" role=\"listbox\" name="
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + ">\r\n			";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.data : depth0), {"name":"each","hash":{},"fn":this.program(11, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n		</div>\r\n		<a class=\"left carousel-control\" href=\"#ct-Carousel\" role=\"button\" data-slide=\"prev\"> \r\n			<span class=\"flaticon-previous\" aria-hidden=\"true\"></span> \r\n			<span class=\"sr-only\">Previous</span>\r\n		</a> \r\n		<a class=\"right carousel-control\" href=\"#ct-Carousel\" role=\"button\" data-slide=\"next\"> \r\n			<span class=\"flaticon-next\" aria-hidden=\"true\"></span>\r\n			<span class=\"sr-only\">Next</span>\r\n		</a>\r\n	</div>\r\n	<div class='clearfix'></div>\r\n</div>";
},"1":function(depth0,helpers,partials,data) {
  return "hidden";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.visibleInd : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"4":function(depth0,helpers,partials,data) {
  return " hidden";
  },"6":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (data && data.index), 0, {"name":"condchk","hash":{},"fn":this.program(7, data),"inverse":this.program(9, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"7":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "\r\n			<li data-target=\"#ct-Carousel\" data-slide-to="
    + escapeExpression(lambda((data && data.index), depth0))
    + " class=\"active\"></li> \r\n";
},"9":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "			<li data-target=\"#ct-Carousel\" data-slide-to="
    + escapeExpression(lambda((data && data.index), depth0))
    + "></li>\r\n			";
},"11":function(depth0,helpers,partials,data,depths) {
  var stack1, helperMissing=helpers.helperMissing, buffer = " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (data && data.index), 0, {"name":"condchk","hash":{},"fn":this.program(12, data, depths),"inverse":this.program(14, data, depths),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"12":function(depth0,helpers,partials,data,depths) {
  var helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, lambda=this.lambda;
  return "\r\n			<div class=\"item active\">\r\n				<img id=\""
    + escapeExpression(((helpers.getOf || (depth0 && depth0.getOf) || helperMissing).call(depth0, (depths[1] != null ? depths[1].keys : depths[1]), (data && data.index), {"name":"getOf","hash":{},"data":data})))
    + "\" src=\""
    + escapeExpression(lambda(depth0, depth0))
    + "\" alt=\""
    + escapeExpression(lambda((depths[1] != null ? depths[1].altText : depths[1]), depth0))
    + "\">\r\n			</div>\r\n";
},"14":function(depth0,helpers,partials,data,depths) {
  var helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, lambda=this.lambda;
  return "			<div class=\"item\">\r\n				<img id=\""
    + escapeExpression(((helpers.getOf || (depth0 && depth0.getOf) || helperMissing).call(depth0, (depths[1] != null ? depths[1].keys : depths[1]), (data && data.index), {"name":"getOf","hash":{},"data":data})))
    + "\" src=\""
    + escapeExpression(lambda(depth0, depth0))
    + "\" alt=\""
    + escapeExpression(lambda((depths[1] != null ? depths[1].altText : depths[1]), depth0))
    + "\">\r\n			</div>\r\n			";
},"useData":true,"useDepths":true});
  templates['FDF/cbx-itemselector'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,depths) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div class=\"form-group selectpicker ct-form__group ct-form__group-tm ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.visibleInd : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(1, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "  ct-"
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "-bs "
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "-bs\">\r\n	";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.hideLabel : depth0), {"name":"if","hash":{},"fn":this.program(3, data, depths),"inverse":this.program(6, data, depths),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n							<ul>\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.rawKeys : depth0), {"name":"each","hash":{},"fn":this.program(12, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "							</ul>\r\n							<span type=\"error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container\">\r\n								<span type=\"error_Msg\" class=\"ct-form__err hidden\"> \r\n								<i class=\"flaticon-warning11\"></i>\r\n							</span> \r\n							</span> \r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.helpInd : depth0), {"name":"if","hash":{},"fn":this.program(14, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "						</div>\r\n						 ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(16, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n					<div class='clearfix'></div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n				";
},"1":function(depth0,helpers,partials,data) {
  return "hidden";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = " ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n		<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n			 ";
},"4":function(depth0,helpers,partials,data) {
  return "\r\n	<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n		 ";
},"6":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.labelAlignType : depth0), "TOP", {"name":"condchk","hash":{},"fn":this.program(7, data),"inverse":this.program(9, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"7":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<label class=\"ct-form__label\"> \r\n					<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'>";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n				</label>\r\n			</div>\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n					 ";
},"9":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n					<div class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2\">\r\n						<label for=\"password\" class=\"ct-form__label\"> \r\n							<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'> ";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += " </span>\r\n						</label> \r\n					</div>\r\n					<div class=\"col-xs-10 col-sm-10 col-md-10 col-lg-10\">\r\n						<div class=\"input-group\" "
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + " ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.editableInd : depth0), {"name":"if","hash":{},"fn":this.program(10, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + ">\r\n							 ";
},"10":function(depth0,helpers,partials,data) {
  return "disabled";
  },"12":function(depth0,helpers,partials,data,depths) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "								<li data-item-type=\"itemSelectorItemCont\" class=\"ct-form__item-sel\">\r\n									<span class=\"ct-form__item-sel-each\" data-item-type=\"itemSelectorItem\" class=\"\">\r\n										<span class=\"ct-form__item-sel-val\" data-item-id="
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + " data-item-type="
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + ">"
    + escapeExpression(((helpers.getOf || (depth0 && depth0.getOf) || helperMissing).call(depth0, (depths[1] != null ? depths[1].rawValues : depths[1]), (data && data.index), {"name":"getOf","hash":{},"data":data})))
    + "</span>\r\n										<span class=\"ct-form__item-sel-action\"> \r\n											<span class=\"ct-form__item-sel-up\" data-item-type=\"itemselector_up\">\r\n												<i class=\"glyphicon glyphicon-arrow-up\"></i>\r\n											</span> \r\n											<span class=\"ct-form__item-sel-down\" data-item-type=\"itemselector_down\">\r\n												<i class=\"glyphicon glyphicon-arrow-down\"></i>\r\n											</span>\r\n										</span>\r\n									</span> \r\n								<span class=\"clearfix\"></span>\r\n								</li> \r\n";
},"14":function(depth0,helpers,partials,data) {
  return "							<span class=\"input-group-addon ct-form__addon\">\r\n								<i class=\"glyphicon glyphicon-question-sign\"></i>\r\n							</span>\r\n";
  },"16":function(depth0,helpers,partials,data) {
  return "\r\n					</div>\r\n					  ";
},"useData":true,"useDepths":true});
  templates['FDF/cbx-label'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div class=\"form-group ct-form__group ct-form__group-tm ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.visibleInd : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "  ct-"
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "-bs "
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "-bs\">\r\n	";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.hideLabel : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.program(6, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " \r\n							<label for=\"text\" class=\"ct-form__label\"> \r\n								<span class=\"ct-form__label-val\" name=\""
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "\">";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += "</span>\r\n							</label>\r\n						</div>\r\n						 ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n					<div class='clearfix'></div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n				";
},"1":function(depth0,helpers,partials,data) {
  return "hidden";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = " ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n		<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n			 ";
},"4":function(depth0,helpers,partials,data) {
  return "\r\n	<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n		 ";
},"6":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.labelAlignType : depth0), "TOP", {"name":"condchk","hash":{},"fn":this.program(7, data),"inverse":this.program(9, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"7":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n				<label class=\"ct-form__label\"> \r\n					<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'></span>\r\n				</label>\r\n			</div>\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n					 ";
},"9":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "\r\n					<div class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2\">\r\n						<label for=\"text\" class=\"ct-form__label\">\r\n							<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'> </span>\r\n						</label> \r\n					</div>\r\n					<div class=\"col-xs-10 col-sm-10 col-md-10 col-lg-10\">\r\n						<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n							 ";
},"11":function(depth0,helpers,partials,data) {
  return "\r\n					</div>\r\n					  ";
},"useData":true});
  templates['FDF/cbx-lookup'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.hideLabel : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(4, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " \r\n						<span class=\"input-group-addon\" data-item-id='ct-lookup-search'>\r\n							<i class=\"flaticon-magnifying-glass2\"></i>\r\n						</span> \r\n						<span type=\"error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container\">\r\n							<span type=\"error_Msg\" class=\"ct-form__err hidden\"> \r\n							<i class=\"flaticon-warning11\"></i>\r\n						</span> \r\n						</span> \r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.helpInd : depth0), {"name":"if","hash":{},"fn":this.program(9, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "					</div>\r\n					 ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n				<div class='clearfix'></div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n			";
},"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = " ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n	<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n		 ";
},"2":function(depth0,helpers,partials,data) {
  return "\r\n<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n	 ";
},"4":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.labelAlignType : depth0), "TOP", {"name":"condchk","hash":{},"fn":this.program(5, data),"inverse":this.program(7, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"5":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n		<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n			<label class=\"ct-form__label\"> \r\n				<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'>";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n			</label>\r\n		</div>\r\n		<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n			<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n				 ";
},"7":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n				<div class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2\">\r\n					<label for=\"text\" class=\"ct-form__label\">\r\n						<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'> ";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " </span>\r\n					</label> \r\n				</div>\r\n				<div class=\"col-xs-10 col-sm-10 col-md-10 col-lg-10\">\r\n					<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n						 ";
},"9":function(depth0,helpers,partials,data) {
  return "						<span class=\"input-group-addon ct-form__addon\">\r\n							<i class=\"flaticon-alert\"></i>\r\n						</span>\r\n";
  },"11":function(depth0,helpers,partials,data) {
  return "\r\n				</div>\r\n				  ";
},"useData":true});
  templates['FDF/cbx-mandatoryText'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div class=\"form-group ct-form__group ct-form__group-tm ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.visibleInd : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "  ct-"
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "-bs "
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "-bs\">\r\n	<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n		<span class='ct-form__label-individual'>\r\n			";
  stack1 = ((helper = (helper = helpers.MandatorySpan || (depth0 != null ? depth0.MandatorySpan : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"MandatorySpan","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " \r\n			<span class='mandatory requiredInd'>"
    + escapeExpression(((helper = (helper = helpers.MandatoryText || (depth0 != null ? depth0.MandatoryText : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"MandatoryText","hash":{},"data":data}) : helper)))
    + "</span>\r\n		</span>\r\n	</div>\r\n	<div class='clearfix'></div>\r\n</div>";
},"1":function(depth0,helpers,partials,data) {
  return "hidden";
  },"useData":true});
  templates['FDF/cbx-panel'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div class=\"form-group ct-form__group ct-form__group-tm ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.visibleInd : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "  ct-"
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "-bs "
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "-bs\">\r\n	<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n		<section class=\"panel panel-default ct-form__fieldset  ct-form__fieldset-tm\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n			";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.isHideLabel : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.program(5, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "			<div class=\"panel-body form-control ct-form__ip ct-form__ip-panel\" name=\""
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "\">";
  stack1 = ((helper = (helper = helpers.html || (depth0 != null ? depth0.html : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"html","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</div>\r\n			<div class=\"panel-footer\"></div>\r\n		</section>\r\n	</div>\r\n	<div class='clearfix'></div>\r\n</div>";
},"1":function(depth0,helpers,partials,data) {
  return "hidden";
  },"3":function(depth0,helpers,partials,data) {
  return " ";
  },"5":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, buffer = "\r\n			<div class=\"panel-heading\">\r\n				<h3 class=\"panel-title\">\r\n					<span class=\"ct-form__panel-title-val\" data-item-type='ct-fieldlabel'>";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n				</h3>\r\n			</div>\r\n";
},"useData":true});
  templates['FDF/cbx-passwordfield'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div class=\"form-group ct-form__group ct-form__group-tm ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.visibleInd : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "  ct-"
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "-bs "
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "-bs\">\r\n	";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.hideLabel : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.program(6, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " \r\n							<input type=\"password\" name="
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + " class=\"form-control ct-form__ip ct-form__ip-password\" ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.editableInd : depth0), {"name":"unless","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "/>\r\n							<span type=\"error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container ct_err_position ct_err_default\">\r\n								<span type=\"error_Msg\" class=\"ct-form__err hidden\"> \r\n								<i class=\"flaticon-alert\"></i>\r\n								</span> \r\n							</span> \r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.helpInd : depth0), {"name":"if","hash":{},"fn":this.program(13, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "						</div>\r\n						 ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(15, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n					<div class='clearfix'></div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n				";
},"1":function(depth0,helpers,partials,data) {
  return "hidden";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = " ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n		<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n			 ";
},"4":function(depth0,helpers,partials,data) {
  return "\r\n	<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n		 ";
},"6":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.labelAlignType : depth0), "TOP", {"name":"condchk","hash":{},"fn":this.program(7, data),"inverse":this.program(9, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"7":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<label class=\"ct-form__label\"> \r\n					<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'>";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n				</label>\r\n			</div>\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n					 ";
},"9":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n					<div class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2\">\r\n						<label for=\"password\" class=\"ct-form__label\" data-item-type='ct-fieldlabel'>\r\n							<span class=\"ct-form__label-val\">";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n						</label> \r\n					</div>\r\n					<div class=\"col-xs-10 col-sm-10 col-md-10 col-lg-10\">\r\n						<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n							 ";
},"11":function(depth0,helpers,partials,data) {
  return "disabled";
  },"13":function(depth0,helpers,partials,data) {
  return "							<span class=\"input-group-addon ct-form__addon\">\r\n							<i class=\"flaticon-alert\"></i>\r\n							</span>\r\n";
  },"15":function(depth0,helpers,partials,data) {
  return "\r\n					</div>\r\n					  ";
},"useData":true});
  templates['FDF/cbx-radiogroup'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,depths) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div class=\"form-group ct-form__group ct-form__group-tm ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.visibleInd : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(1, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "  ct-"
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "-bs "
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "-bs\">\r\n	";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.hideLabel : depth0), {"name":"if","hash":{},"fn":this.program(3, data, depths),"inverse":this.program(6, data, depths),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " ";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.data : depth0), {"name":"each","hash":{},"fn":this.program(11, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "							<span type=\"error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container\">\r\n								<span type=\"error_Msg\" class=\"ct-form__err hidden\"> \r\n									<i class=\"flaticon-warning11\"></i>\r\n								</span> \r\n							</span> \r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.helpInd : depth0), {"name":"if","hash":{},"fn":this.program(13, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "						</div>\r\n						 ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(15, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n					<div class='clearfix'></div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n			";
},"1":function(depth0,helpers,partials,data) {
  return "hidden";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = " ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n		<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n			 ";
},"4":function(depth0,helpers,partials,data) {
  return "\r\n	<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n		 ";
},"6":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.labelAlignType : depth0), "TOP", {"name":"condchk","hash":{},"fn":this.program(7, data),"inverse":this.program(9, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"7":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n				<label class=\"ct-form__label\"> \r\n					<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'>";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n				</label>\r\n			</div>\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n					 ";
},"9":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n					<div class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2\">\r\n						<label for=\"text\" class=\"ct-form__label\">\r\n							<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'> ";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " </span>\r\n						</label> \r\n					</div>\r\n					<div class=\"col-xs-10 col-sm-10 col-md-10 col-lg-10\">\r\n						<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n							 ";
},"11":function(depth0,helpers,partials,data,depths) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;
  return " \r\n							<label class=\"radio-inline\"> \r\n								<input type=\"radio\" name=\""
    + escapeExpression(lambda((depths[1] != null ? depths[1].itemId : depths[1]), depth0))
    + "\" class=\"ct-form__ip ct-form__ip-radio\" value=\""
    + escapeExpression(((helpers.getOf || (depth0 && depth0.getOf) || helperMissing).call(depth0, (depths[1] != null ? depths[1].keys : depths[1]), (data && data.index), {"name":"getOf","hash":{},"data":data})))
    + "\"> \r\n								"
    + escapeExpression(lambda(depth0, depth0))
    + "\r\n							</label> \r\n";
},"13":function(depth0,helpers,partials,data) {
  return "							<span class=\"input-group-addon ct-form__addon\">\r\n								<i class=\"flaticon-alert\"></i>\r\n							</span>\r\n";
  },"15":function(depth0,helpers,partials,data) {
  return "\r\n					</div>\r\n					  ";
},"useData":true,"useDepths":true});
  templates['FDF/cbx-radiogroupstaticfield'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div class=\"form-group ct-form__group ct-form__group-tm ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.visibleInd : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "  ct-"
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "-bs "
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "-bs\">\r\n	";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.hideLabel : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.program(6, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n							<div class=\""
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + " form-control\">\r\n								<span name=\""
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "\" class=\"ct-form__ip ct-form__ip-radio ct-form__static\"> </span>\r\n							</div>\r\n							<span type=\"error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container\">\r\n								<span type=\"error_Msg\" class=\"ct-form__err hidden\"> \r\n									<i class=\"flaticon-warning11\"></i>\r\n								</span> \r\n							</span> \r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.helpInd : depth0), {"name":"if","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "						</div>\r\n						 ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(13, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n					<div class='clearfix'></div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n				";
},"1":function(depth0,helpers,partials,data) {
  return "hidden";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = " ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n		<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n			 ";
},"4":function(depth0,helpers,partials,data) {
  return "\r\n	<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n		 ";
},"6":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.labelAlignType : depth0), "TOP", {"name":"condchk","hash":{},"fn":this.program(7, data),"inverse":this.program(9, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"7":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n				<label class=\"ct-form__label\"> \r\n					<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'>";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n				</label>\r\n			</div>\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n					 ";
},"9":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n					<div class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2\">\r\n						<label for=\"text\" class=\"ct-form__label\">\r\n							<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'> ";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " </span>\r\n						</label> \r\n					</div>\r\n					<div class=\"col-xs-10 col-sm-10 col-md-10 col-lg-10\">\r\n						<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n							 ";
},"11":function(depth0,helpers,partials,data) {
  return "							<span class=\"input-group-addon ct-form__addon\">\r\n								<i class=\"flaticon-alert\"></i>\r\n							</span>\r\n";
  },"13":function(depth0,helpers,partials,data) {
  return "\r\n					</div>\r\n					  ";
},"useData":true});
  templates['FDF/cbx-ratefield'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div class=\"form-group ct-form__group ct-form__group-tm ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.visibleInd : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "  ct-"
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "-bs "
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "-bs\">\r\n	";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.hideLabel : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.program(6, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " \r\n							<input type=\"text\" name="
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + " class=\"form-control ct-form__ip ct-form__ip-rate\" ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.editableInd : depth0), {"name":"unless","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "/>\r\n							<span type=\"error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container ct_err_position ct_err_default\">\r\n								<span type=\"error_Msg\" class=\"ct-form__err hidden\"> \r\n								<i class=\"flaticon-alert\"></i>\r\n							</span> \r\n							</span> \r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.helpInd : depth0), {"name":"if","hash":{},"fn":this.program(13, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "						</div>\r\n						 ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(15, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n					<div class='clearfix'></div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n				";
},"1":function(depth0,helpers,partials,data) {
  return "hidden";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = " ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n		<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n			 ";
},"4":function(depth0,helpers,partials,data) {
  return "\r\n	<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n		 ";
},"6":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.labelAlignType : depth0), "TOP", {"name":"condchk","hash":{},"fn":this.program(7, data),"inverse":this.program(9, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"7":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<label class=\"ct-form__label\"> \r\n					<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'>";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n				</label>\r\n			</div>\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n					 ";
},"9":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n					<div class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2\">\r\n						<label for=\"rate\" class=\"ct-form__label\">\r\n							<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'> ";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " </span>\r\n						</label> \r\n					</div>\r\n					<div class=\"col-xs-10 col-sm-10 col-md-10 col-lg-10\">\r\n						<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n							 ";
},"11":function(depth0,helpers,partials,data) {
  return "disabled";
  },"13":function(depth0,helpers,partials,data) {
  return "							<span class=\"input-group-addon ct-form__addon\">\r\n								<i class=\"flaticon-alert\"></i>\r\n							</span>\r\n";
  },"15":function(depth0,helpers,partials,data) {
  return "\r\n					</div>\r\n					  ";
},"useData":true});
  templates['FDF/cbx-spinnerfield'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div class=\"form-group ct-form__group ct-form__group-tm ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.visibleInd : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "  ct-"
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "-bs "
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "-bs\">\r\n	";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.hideLabel : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.program(6, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " \r\n							<input type=\"text\" name="
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + " class=\"form-control  ct-form__ip ct-form__spinner-val ct-form__spinner-box\" ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.editableInd : depth0), {"name":"unless","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "/> \r\n							<span class=\"btn input-group-addon ct-form__spinner-up\" id=\"spin_up\">\r\n								<i class=\"flaticon-expand_up\"></i>\r\n							</span> \r\n							<span class=\"btn input-group-addon ct-form__spinner-down\" id=\"spin_down\">\r\n								<i class=\"flaticon-expand_down\"></i>\r\n							</span> \r\n							<span type=\"error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container ct_err_position ct_err_spinner\">\r\n								<span type=\"error_Msg\" class=\"ct-form__err hidden\"> \r\n									<i class=\"flaticon-alert\"></i>\r\n								</span> \r\n							</span> \r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.helpInd : depth0), {"name":"if","hash":{},"fn":this.program(13, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "						</div>\r\n						 ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(15, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n					<div class='clearfix'></div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n			";
},"1":function(depth0,helpers,partials,data) {
  return "hidden";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = " ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n		<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n			 ";
},"4":function(depth0,helpers,partials,data) {
  return "\r\n	<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n		 ";
},"6":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.labelAlignType : depth0), "TOP", {"name":"condchk","hash":{},"fn":this.program(7, data),"inverse":this.program(9, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"7":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<label class=\"ct-form__label\"> \r\n					<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'>";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n				</label>\r\n			</div>\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n					 ";
},"9":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n					<div class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2\">\r\n						<label for=\"spiner\" class=\"ct-form__label\"> \r\n							<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'> ";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " </span>\r\n						</label> \r\n					</div>\r\n					<div class=\"col-xs-10 col-sm-10 col-md-10 col-lg-10\">\r\n						<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n							 ";
},"11":function(depth0,helpers,partials,data) {
  return "disabled";
  },"13":function(depth0,helpers,partials,data) {
  return "							<span class=\"input-group-addon ct-form__addon\">\r\n								<i class=\"flaticon-alert\"></i>\r\n							</span>\r\n";
  },"15":function(depth0,helpers,partials,data) {
  return "\r\n					</div>\r\n					  ";
},"useData":true});
  templates['FDF/cbx-staticamountfield'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div class=\"form-group ct-form__group ct-form__group-tm ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.visibleInd : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "  ct-"
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "-bs "
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "-bs\">\r\n	";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.hideLabel : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.program(6, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " \r\n							<span name="
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + " class=\"ct-form__ip ct-form__ip-static-amt ct-form__static\"></span> \r\n							<span type=\"error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container ct_err_position ct_err_default\">\r\n								<span type=\"error_Msg\" class=\"ct-form__err hidden\"> \r\n									<i class=\"flaticon-alert\"></i>\r\n								</span> \r\n							</span> \r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.helpInd : depth0), {"name":"if","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "						</div>\r\n						 ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(13, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n					<div class='clearfix'></div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n				";
},"1":function(depth0,helpers,partials,data) {
  return "hidden";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = " ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n		<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n			 ";
},"4":function(depth0,helpers,partials,data) {
  return "\r\n	<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n		 ";
},"6":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.labelAlignType : depth0), "TOP", {"name":"condchk","hash":{},"fn":this.program(7, data),"inverse":this.program(9, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"7":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<label class=\"ct-form__label\"> \r\n					<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'>";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n				</label>\r\n			</div>\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n					 ";
},"9":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n					<div class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2\">\r\n						<label for=\"static-amount\" class=\"ct-form__label\"> \r\n							<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'>";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n						</label> \r\n					</div>\r\n					<div class=\"col-xs-10 col-sm-10 col-md-10 col-lg-10\">\r\n						<div class=\"input-group form-control\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n							 ";
},"11":function(depth0,helpers,partials,data) {
  return "							<span class=\"input-group-addon ct-form__addon\">\r\n								<i class=\"flaticon-alert\"></i>\r\n							</span>\r\n";
  },"13":function(depth0,helpers,partials,data) {
  return "\r\n					</div>\r\n					  ";
},"useData":true});
  templates['FDF/cbx-staticcombobox'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.hideLabel : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(4, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n						<div class=\""
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + " form-control \">\r\n							<span name=\""
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "\" class=\"ct-form__ip ct-form__ip-staticcombo ct-form__static\"></span>\r\n						</div>\r\n						<span type=\"error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container ct_err_position ct_err_autosuggest\">\r\n							<span type=\"error_Msg\" class=\"ct-form__err hidden\"> \r\n								<i class=\"flaticon-alert\"></i>\r\n							</span> \r\n						</span> \r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.helpInd : depth0), {"name":"if","hash":{},"fn":this.program(9, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "					</div>\r\n					 ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n				<div class='clearfix'></div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n			";
},"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = " ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n	<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n		 ";
},"2":function(depth0,helpers,partials,data) {
  return "\r\n<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n	 ";
},"4":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.labelAlignType : depth0), "TOP", {"name":"condchk","hash":{},"fn":this.program(5, data),"inverse":this.program(7, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"5":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n		<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n			<label class=\"ct-form__label\"> \r\n				<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'>";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n			</label>\r\n		</div>\r\n		<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n			<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n				 ";
},"7":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n				<div class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2\">\r\n					<label for=\"text\" class=\"ct-form__label\">\r\n						<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'> ";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " </span>\r\n					</label> \r\n				</div>\r\n				<div class=\"col-xs-10 col-sm-10 col-md-10 col-lg-10\">\r\n					<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n						 ";
},"9":function(depth0,helpers,partials,data) {
  return "						<span class=\"input-group-addon ct-form__addon\">\r\n							<i class=\"flaticon-alert\"></i>\r\n						</span>\r\n";
  },"11":function(depth0,helpers,partials,data) {
  return "\r\n				</div>\r\n				  ";
},"useData":true});
  templates['FDF/cbx-staticdatefield'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div class=\"form-group ct-form__group ct-form__group-tm ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.visibleInd : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "  ct-"
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "-bs "
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "-bs\">\r\n	";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.hideLabel : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.program(6, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " \r\n							<span name="
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + " class=\"ct-form__ip ct-form__ip-static-date-picker ct-form__static\"></span>\r\n							<span class=\"input-group-addon input-calendar-addon btn\">\r\n								<i class=\"flaticon-calendar-new\"></i>\r\n							</span> \r\n							<span type=\"error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container ct_err_position ct_err_autosuggest\">\r\n								<span type=\"error_Msg\" class=\"ct-form__err hidden\"> \r\n								<i class=\"flaticon-alert\"></i>\r\n								</span> \r\n							</span> \r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.helpInd : depth0), {"name":"if","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "						</div>\r\n						 ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(13, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n					<div class='clearfix'></div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n				";
},"1":function(depth0,helpers,partials,data) {
  return "hidden";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = " ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n		<div class=\"input-group date\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n			 ";
},"4":function(depth0,helpers,partials,data) {
  return "\r\n	<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n		 ";
},"6":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.labelAlignType : depth0), "TOP", {"name":"condchk","hash":{},"fn":this.program(7, data),"inverse":this.program(9, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"7":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n				<label class=\"ct-form__label\"> \r\n					<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'>";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n				</label>\r\n			</div>\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<div class=\"input-group date\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n					 ";
},"9":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n					<div class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2\">\r\n						<label for=\"static-date\" class=\"ct-form__label\"> \r\n							<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'>";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n						</label> \r\n					</div>\r\n					<div class=\"col-xs-10 col-sm-10 col-md-10 col-lg-10\">\r\n						<div class=\"input-group form-control\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n							 ";
},"11":function(depth0,helpers,partials,data) {
  return "							<span class=\"input-group-addon ct-form__addon\">\r\n								<i class=\"flaticon-alert\"></i>\r\n							</span>\r\n";
  },"13":function(depth0,helpers,partials,data) {
  return "\r\n					</div>\r\n					  ";
},"useData":true});
  templates['FDF/cbx-staticfield'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div class=\"form-group ct-form__group ct-form__group-tm ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.visibleInd : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "  ct-"
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "-bs "
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "-bs\">\r\n	";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.hideLabel : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.program(6, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " \r\n							<span name="
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + " class=\"ct-form__ip ct-form__ip-static-txt ct-form__static\">--</span> \r\n							<span type=\"error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container ct_err_position ct_err_default\">\r\n								<span type=\"error_Msg\" class=\"ct-form__err hidden\"> \r\n								<i class=\"flaticon-alert\"></i>\r\n								</span> \r\n							</span> \r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.helpInd : depth0), {"name":"if","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "						</div>\r\n						 ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(13, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n					<div class='clearfix'></div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n				";
},"1":function(depth0,helpers,partials,data) {
  return "hidden";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = " ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n		<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n			 ";
},"4":function(depth0,helpers,partials,data) {
  return "\r\n	<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n		 ";
},"6":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.labelAlignType : depth0), "TOP", {"name":"condchk","hash":{},"fn":this.program(7, data),"inverse":this.program(9, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"7":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<label class=\"ct-form__label\" data-item-type='ct-fieldlabel'> \r\n					<span class=\"ct-form__label-val\">";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n				</label>\r\n			</div>\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n					 ";
},"9":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n					<div class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2\">\r\n						<label for=\"static-text\" class=\"ct-form__label\"> \r\n							<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'> ";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " </span>\r\n						</label> \r\n					</div>\r\n					<div class=\"col-xs-10 col-sm-10 col-md-10 col-lg-10\">\r\n						<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n							 ";
},"11":function(depth0,helpers,partials,data) {
  return "							<span class=\"input-group-addon ct-form__addon\">\r\n								<i class=\"flaticon-alert\"></i>\r\n							</span>\r\n";
  },"13":function(depth0,helpers,partials,data) {
  return "\r\n					</div>\r\n					  ";
},"useData":true});
  templates['FDF/cbx-staticitemselector'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,depths) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "<div class=\"form-group selectpicker ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.visibleInd : depth0), {"name":"unless","hash":{},"fn":this.program(1, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\">\r\n";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.hideLabel : depth0), {"name":"unless","hash":{},"fn":this.program(3, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.labelAlignType : depth0), "TOP", {"name":"condchk","hash":{},"fn":this.program(8, data, depths),"inverse":this.program(10, data, depths),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += " ";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.rawKeys : depth0), {"name":"each","hash":{},"fn":this.program(12, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "			<span type=\"error_Msg_Container\" class=\"input-group-addon ct-input-group-addon\"> \r\n			<span type=\"error_Msg\" class=\"hidden\"> \r\n				<i class=\"flaticon-warning\"></i>\r\n			</span>\r\n			</span> \r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.helpInd : depth0), {"name":"if","hash":{},"fn":this.program(14, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "		</div>\r\n	</div>\r\n</div>\r\n	";
},"1":function(depth0,helpers,partials,data) {
  return "hidden";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", buffer = "	<div>\r\n		<label for=\"text\" ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.labelAlignType : depth0), "TOP", {"name":"condchk","hash":{},"fn":this.program(4, data),"inverse":this.program(6, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "> \r\n			<span class=\"form-ct-label\" data-item-type='ct-fieldlabel'> ";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " </span>\r\n		</label>\r\n	</div>\r\n	";
},"4":function(depth0,helpers,partials,data) {
  return "class=\"control-label\" ";
  },"6":function(depth0,helpers,partials,data) {
  return "class=\"col-sm-2 control-label\"";
  },"8":function(depth0,helpers,partials,data) {
  return "\r\n	<div class=\"input-group col-sm-12\">\r\n";
  },"10":function(depth0,helpers,partials,data) {
  return "		<div class=\"input-group col-sm-10\">\r\n			";
  },"12":function(depth0,helpers,partials,data,depths) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "\r\n			<div data-item-type=\"itemSelectorItemCont\" class=\"ct-form__itemselect-each\">\r\n				<span data-item-type=\"itemSelectorItem\" class=\"\">\r\n					<div class=\"col-sm-10\" data-item-id="
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + " data-item-type="
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + ">"
    + escapeExpression(((helpers.getOf || (depth0 && depth0.getOf) || helperMissing).call(depth0, (depths[1] != null ? depths[1].rawValues : depths[1]), (data && data.index), {"name":"getOf","hash":{},"data":data})))
    + "</div>\r\n				</span>\r\n			</div>\r\n";
},"14":function(depth0,helpers,partials,data) {
  return "			<span class=\"input-group-addon \">\r\n				<i class=\"flaticon-alert\"></i>\r\n			</span>\r\n";
  },"useData":true,"useDepths":true});
  templates['FDF/cbx-statictextarea'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div class=\"form-group ct-form__group ct-form__group-tm ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.visibleInd : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "  ct-"
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "-bs "
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "-bs\">\r\n	";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.hideLabel : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.program(6, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " \r\n							<span name="
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + " class=\"ct-form__ip ct-form__ip-static-textarea-val ct-form__static\" class=\"form-control\" rows="
    + escapeExpression(((helper = (helper = helpers.maxNumLines || (depth0 != null ? depth0.maxNumLines : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"maxNumLines","hash":{},"data":data}) : helper)))
    + " maxlength="
    + escapeExpression(((helper = (helper = helpers.maxLength || (depth0 != null ? depth0.maxLength : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"maxLength","hash":{},"data":data}) : helper)))
    + " maxcharperline="
    + escapeExpression(((helper = (helper = helpers.maxCharsPerLine || (depth0 != null ? depth0.maxCharsPerLine : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"maxCharsPerLine","hash":{},"data":data}) : helper)))
    + ">\r\n							</span> <span type=\"error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container ct_err_position ct_err_default\">\r\n								<span type=\"error_Msg\" class=\"ct-form__err hidden\"> \r\n									<i class=\"flaticon-alert\"></i>\r\n								</span> \r\n							</span> \r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.helpInd : depth0), {"name":"if","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "						</div>\r\n						 ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(13, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n					<div class='clearfix'></div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n				";
},"1":function(depth0,helpers,partials,data) {
  return "hidden";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = " ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n		<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n			 ";
},"4":function(depth0,helpers,partials,data) {
  return "\r\n	<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n		 ";
},"6":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.labelAlignType : depth0), "TOP", {"name":"condchk","hash":{},"fn":this.program(7, data),"inverse":this.program(9, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"7":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<label class=\"ct-form__label\"> \r\n					<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'>";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n				</label>\r\n			</div>\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n					 ";
},"9":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n					<div class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2\">\r\n						<label for=\"static-text-area\" class=\"ct-form__label\"> \r\n							<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'>";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n						</label> \r\n					</div>\r\n					<div class=\"col-xs-10 col-sm-10 col-md-10 col-lg-10\">\r\n						<div class=\"input-group form-control\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n							 ";
},"11":function(depth0,helpers,partials,data) {
  return "							<span class=\"input-group-addon ct-form__addon\">\r\n								<i class=\"flaticon-alert\"></i>\r\n							</span>\r\n";
  },"13":function(depth0,helpers,partials,data) {
  return "\r\n					</div>\r\n					  ";
},"useData":true});
  templates['FDF/cbx-textarea'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div class=\"form-group ct-form__group ct-form__group-tm ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.visibleInd : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "  ct-"
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "-bs "
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "-bs\">\r\n	";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.hideLabel : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.program(6, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n							<textarea name="
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + " class=\"form-control ct-form__ip ct-form__ip-textarea-val\" ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.editableInd : depth0), {"name":"unless","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "></textarea>\r\n							<span type=\"error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container ct_err_position ct_err_default\">\r\n								<span type=\"error_Msg\" class=\"ct-form__err hidden\"> \r\n									<i class=\"flaticon-alert\"></i>\r\n								</span> \r\n							</span> \r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.helpInd : depth0), {"name":"if","hash":{},"fn":this.program(13, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "						</div>\r\n						 ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(15, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n					<div class='clearfix'></div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n				";
},"1":function(depth0,helpers,partials,data) {
  return "hidden";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = " ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n		<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n			 ";
},"4":function(depth0,helpers,partials,data) {
  return "\r\n	<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n		 ";
},"6":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.labelAlignType : depth0), "TOP", {"name":"condchk","hash":{},"fn":this.program(7, data),"inverse":this.program(9, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"7":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<label class=\"ct-form__label\"> \r\n					<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'>";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n				</label>\r\n			</div>\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n					 ";
},"9":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n					<div class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2\">\r\n						<label for=\"text-area\" class=\"ct-form__label\"> \r\n							<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'>";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n						</label> \r\n					</div>\r\n					<div class=\"col-xs-10 col-sm-10 col-md-10 col-lg-10\">\r\n						<div"
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n							 ";
},"11":function(depth0,helpers,partials,data) {
  return "disabled";
  },"13":function(depth0,helpers,partials,data) {
  return "							<span class=\"input-group-addon ct-form__addon\">\r\n								<i class=\"flaticon-alert\"></i>\r\n							</span>\r\n";
  },"15":function(depth0,helpers,partials,data) {
  return "\r\n					</div>\r\n					  ";
},"useData":true});
  templates['FDF/cbx-textfield'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div class=\"form-group ct-form__group ct-form__group-tm ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.visibleInd : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "  ct-"
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "-bs "
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "-bs\">\r\n	";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.hideLabel : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.program(6, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " \r\n							<input type=\"text\" name="
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + " class=\"form-control ct-form__ip ct-form__ip-txt\" ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.editableInd : depth0), {"name":"unless","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "/> \r\n							<span type=\"error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container ct_err_position ct_err_default\">\r\n								<span type=\"error_Msg\" class=\"ct-form__err hidden\"> \r\n									<i class=\"flaticon-alert\"></i>\r\n								</span> \r\n							</span> \r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.helpInd : depth0), {"name":"if","hash":{},"fn":this.program(13, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "						</div>\r\n						 ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(15, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n					<div class='clearfix'></div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>";
},"1":function(depth0,helpers,partials,data) {
  return "hidden";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = " ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n		<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n			 ";
},"4":function(depth0,helpers,partials,data) {
  return "\r\n	<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n		 ";
},"6":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.labelAlignType : depth0), "TOP", {"name":"condchk","hash":{},"fn":this.program(7, data),"inverse":this.program(9, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"7":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<label class=\"ct-form__label\"> \r\n					<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'>";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n				</label>\r\n			</div>\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n					 ";
},"9":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n					<div class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2\">\r\n						<label for=\"text\" class=\"ct-form__label\">\r\n							<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'> ";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " </span>\r\n						</label> \r\n					</div>\r\n					<div class=\"col-xs-10 col-sm-10 col-md-10 col-lg-10\">\r\n						<div class=\"input-group\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n							 ";
},"11":function(depth0,helpers,partials,data) {
  return "disabled";
  },"13":function(depth0,helpers,partials,data) {
  return "							<span class=\"input-group-addon ct-form__addon\">\r\n								<i class=\"flaticon-alert\"></i>\r\n							</span>\r\n";
  },"15":function(depth0,helpers,partials,data) {
  return "\r\n					</div>\r\n					  ";
},"useData":true});
  templates['FDF/cbx-title'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div class=\"form-group ct-form__group ct-form__group-tm ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.visibleInd : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(1, data),"inverse":this.program(3, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "  ct-"
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "-bs "
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "-bs\">\r\n	<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n		<strong>\r\n			<h3>\r\n				<label class=\"form-ct-label\" data-item-type='ct-fieldlabel' name=\""
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "\""
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + "> ";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " </label>\r\n			</h3>\r\n		</strong>\r\n	</div>\r\n	<div class='clearfix'></div>\r\n</div>\r\n\r\n";
},"1":function(depth0,helpers,partials,data) {
  return "hidden";
  },"3":function(depth0,helpers,partials,data) {
  var stack1;
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.hideLabel : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { return stack1; }
  else { return ''; }
  },"useData":true});
  templates['FDF/cbx-widgetpanel'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "<div class=\"form-group ct-form__group ct-form__group-tm ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.visibleInd : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "  ct-"
    + escapeExpression(((helper = (helper = helpers.xtype || (depth0 != null ? depth0.xtype : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"xtype","hash":{},"data":data}) : helper)))
    + "-bs "
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + "-bs\">\r\n	";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.hideLabel : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.program(6, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n							<div name="
    + escapeExpression(((helper = (helper = helpers.itemId || (depth0 != null ? depth0.itemId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"itemId","hash":{},"data":data}) : helper)))
    + " class=\"ct-form__ip ct-form__widget-panel ct-form__widget-tools\"></div>\r\n						</div>\r\n						 ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n					<div class='clearfix'></div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n				";
},"1":function(depth0,helpers,partials,data) {
  return "hidden";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = " ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.onlyInput : depth0), {"name":"unless","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n		<div"
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n			";
},"4":function(depth0,helpers,partials,data) {
  return "\r\n	<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n		 ";
},"6":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.labelAlignType : depth0), "TOP", {"name":"condchk","hash":{},"fn":this.program(7, data),"inverse":this.program(9, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"7":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12 \">\r\n				<label class=\"ct-form__label\"> \r\n					<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'>";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n				</label>\r\n			</div>\r\n			<div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\r\n				<div"
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n";
},"9":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "					<div class=\"col-xs-2 col-sm-2 col-md-2 col-lg-2\">\r\n						<label for=\"widget-panel\" class=\"ct-form__label\"> \r\n							<span class=\"ct-form__label-val\" data-item-type='ct-fieldlabel'> ";
  stack1 = ((helper = (helper = helpers.fieldLabel || (depth0 != null ? depth0.fieldLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fieldLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " </span>\r\n						</label> \r\n					</div>\r\n					<div class=\"col-xs-10 col-sm-10 col-md-10 col-lg-10\">\r\n						<div"
    + escapeExpression(((helper = (helper = helpers.anchorStyle || (depth0 != null ? depth0.anchorStyle : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"anchorStyle","hash":{},"data":data}) : helper)))
    + ">\r\n							";
},"11":function(depth0,helpers,partials,data) {
  return "\r\n					</div>\r\n					  ";
},"useData":true});
  templates['FDF/popUpWindowTemplate'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,depths) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div data-item-id=\""
    + escapeExpression(((helper = (helper = helpers.windowId_subString || (depth0 != null ? depth0.windowId_subString : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"windowId_subString","hash":{},"data":data}) : helper)))
    + "_header\" class=\"panel-heading ct-app__header ct-app__header-tm\">\r\n	<div class=\"ct-app__header-container\">\r\n		<div class=\"pull-left\">\r\n			<h3 data-item-id=\""
    + escapeExpression(((helper = (helper = helpers.windowId_subString || (depth0 != null ? depth0.windowId_subString : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"windowId_subString","hash":{},"data":data}) : helper)))
    + "-title\" class=\"panel-title ct-app__title ct-app__title-tm\">"
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</h3>\r\n		</div>\r\n		<div class=\"pull-right\">\r\n			<div class=\"ct-dropdown\">\r\n				<ul class=\"list-inline ct-no-margin\">\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.helpReqd : depth0), {"name":"if","hash":{},"fn":this.program(1, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.exportReqd : depth0), {"name":"if","hash":{},"fn":this.program(3, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.printReqd : depth0), {"name":"if","hash":{},"fn":this.program(5, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "				</ul>\r\n			</div>\r\n		</div>\r\n	</div>\r\n	<div class=\"clearfix\"></div>\r\n</div>\r\n<div data-item-id=\""
    + escapeExpression(((helper = (helper = helpers.windowId_subString || (depth0 != null ? depth0.windowId_subString : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"windowId_subString","hash":{},"data":data}) : helper)))
    + "_body\" class=\"panel-body ct-model__panel-body ct-app__content\">\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.windowCont : depth0), {"name":"if","hash":{},"fn":this.program(7, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n</div>\r\n<div data-item-id=\""
    + escapeExpression(((helper = (helper = helpers.windowId_subString || (depth0 != null ? depth0.windowId_subString : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"windowId_subString","hash":{},"data":data}) : helper)))
    + "_footer\" class=\"panel-footer ct-model__panel-footer\">\r\n	<div class=\"row\">\r\n		<div data-item-id=\"leftActionBtnContainer\" class=\"col-md-6\">\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.LEFT_ACTION_BUTTONS : depth0), {"name":"each","hash":{},"fn":this.program(9, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "		</div>\r\n		<div data-item-id=\"rightActionBtnContainer\" class=\"col-md-6\">\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.RIGHT_ACTION_BUTTONS : depth0), {"name":"each","hash":{},"fn":this.program(11, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "		</div>\r\n	</div>\r\n</div>";
},"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "					<li class=\"ct-app__tools-help-con\">\r\n						<a data-item-id=\""
    + escapeExpression(((helper = (helper = helpers.windowId_subString || (depth0 != null ? depth0.windowId_subString : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"windowId_subString","hash":{},"data":data}) : helper)))
    + "_helpTool\" class=\"flaticon-info flaticon_widget_header\" href=\"javascript:void(0)\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.TOOL_TIPS_HELP || (depth0 != null ? depth0.TOOL_TIPS_HELP : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOL_TIPS_HELP","hash":{},"data":data}) : helper)))
    + "\"></a>\r\n					</li> \r\n";
},"3":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "					<li class=\"ct-app__tools-excel-con\">\r\n						<a data-item-id=\""
    + escapeExpression(((helper = (helper = helpers.windowId_subString || (depth0 != null ? depth0.windowId_subString : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"windowId_subString","hash":{},"data":data}) : helper)))
    + "_excelTool\" class=\"flaticon-pdf flaticon_widget_header\" href=\"javascript:void(0)\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.TOOL_TIPS_EXPORT || (depth0 != null ? depth0.TOOL_TIPS_EXPORT : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOL_TIPS_EXPORT","hash":{},"data":data}) : helper)))
    + "\"></a>\r\n					</li> \r\n";
},"5":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "					<li class=\"ct-app__tools-print-con\">\r\n						<a data-item-id=\""
    + escapeExpression(((helper = (helper = helpers.windowId_subString || (depth0 != null ? depth0.windowId_subString : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"windowId_subString","hash":{},"data":data}) : helper)))
    + "_printTool\" class=\"flaticon-print flaticon_widget_header\" href=\"javascript:void(0)\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.TOOL_TIPS_PRINT || (depth0 != null ? depth0.TOOL_TIPS_PRINT : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOL_TIPS_PRINT","hash":{},"data":data}) : helper)))
    + "\"></a>\r\n					</li> \r\n";
},"7":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, buffer = " ";
  stack1 = ((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"message","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"9":function(depth0,helpers,partials,data,depths) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, lambda=this.lambda;
  return "			<div class=\"ct-btnCont pull-left\" data-item-id=\""
    + escapeExpression(((helper = (helper = helpers.WINDOW_BTN_ID || (depth0 != null ? depth0.WINDOW_BTN_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WINDOW_BTN_ID","hash":{},"data":data}) : helper)))
    + "_outerCont\">\r\n				<div class=\"ct-btnCont\" data-item-id=\""
    + escapeExpression(((helper = (helper = helpers.WINDOW_BTN_ID || (depth0 != null ? depth0.WINDOW_BTN_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WINDOW_BTN_ID","hash":{},"data":data}) : helper)))
    + "_innerCont\">\r\n					<a data-item-id="
    + escapeExpression(((helper = (helper = helpers.WINDOW_BTN_ID || (depth0 != null ? depth0.WINDOW_BTN_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WINDOW_BTN_ID","hash":{},"data":data}) : helper)))
    + " data-item-type=\""
    + escapeExpression(lambda((depths[1] != null ? depths[1].windowId_subString : depths[1]), depth0))
    + "_button\" class=\"btn "
    + escapeExpression(lambda((depths[1] != null ? depths[1].btnClass : depths[1]), depth0))
    + " ct_btn ct-left-btn "
    + escapeExpression(((helper = (helper = helpers.WINDOW_BTN_ID || (depth0 != null ? depth0.WINDOW_BTN_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WINDOW_BTN_ID","hash":{},"data":data}) : helper)))
    + "\">"
    + escapeExpression(((helper = (helper = helpers.WINDOW_BTN_DISPLAY_NM || (depth0 != null ? depth0.WINDOW_BTN_DISPLAY_NM : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WINDOW_BTN_DISPLAY_NM","hash":{},"data":data}) : helper)))
    + "</a>\r\n				</div>\r\n			</div>\r\n";
},"11":function(depth0,helpers,partials,data,depths) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, lambda=this.lambda;
  return "			<div class=\"ct-btnCont pull-right\" data-item-id=\""
    + escapeExpression(((helper = (helper = helpers.WINDOW_BTN_ID || (depth0 != null ? depth0.WINDOW_BTN_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WINDOW_BTN_ID","hash":{},"data":data}) : helper)))
    + "_outerCont\">\r\n				<div class=\"ct-btnCont\" data-item-id=\""
    + escapeExpression(((helper = (helper = helpers.WINDOW_BTN_ID || (depth0 != null ? depth0.WINDOW_BTN_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WINDOW_BTN_ID","hash":{},"data":data}) : helper)))
    + "_innerCont\">\r\n					<a data-item-id="
    + escapeExpression(((helper = (helper = helpers.WINDOW_BTN_ID || (depth0 != null ? depth0.WINDOW_BTN_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WINDOW_BTN_ID","hash":{},"data":data}) : helper)))
    + " data-item-type=\""
    + escapeExpression(lambda((depths[1] != null ? depths[1].windowId_subString : depths[1]), depth0))
    + "_button\" class=\"btn "
    + escapeExpression(lambda((depths[1] != null ? depths[1].btnClass : depths[1]), depth0))
    + " ct_btn_neg ct-right-btn "
    + escapeExpression(((helper = (helper = helpers.WINDOW_BTN_ID || (depth0 != null ? depth0.WINDOW_BTN_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WINDOW_BTN_ID","hash":{},"data":data}) : helper)))
    + "\">"
    + escapeExpression(((helper = (helper = helpers.WINDOW_BTN_DISPLAY_NM || (depth0 != null ? depth0.WINDOW_BTN_DISPLAY_NM : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WINDOW_BTN_DISPLAY_NM","hash":{},"data":data}) : helper)))
    + "</a>\r\n				</div>\r\n			</div>\r\n";
},"useData":true,"useDepths":true});
  templates['iframeadsview'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div data-item-id=\"iframecontainer\" class=\"ct-"
    + escapeExpression(((helper = (helper = helpers.VIEW_TYPE || (depth0 != null ? depth0.VIEW_TYPE : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"VIEW_TYPE","hash":{},"data":data}) : helper)))
    + "\">\r\n	<div class=\"ct-iframe__container\">\r\n		<iframe src="
    + escapeExpression(((helper = (helper = helpers.FLD_DATA_SRC_ID || (depth0 != null ? depth0.FLD_DATA_SRC_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"FLD_DATA_SRC_ID","hash":{},"data":data}) : helper)))
    + " data-item-id=\"iframe-element\" class=\"ct-iframe-src\"> </iframe>\r\n	</div>\r\n</div>";
},"useData":true});
  templates['listAmountForm'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.greater : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(3, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "<button type=\"button\" data-action=\"submit\" class=\"btn ct_btn\">"
    + escapeExpression(((helper = (helper = helpers.btnSearch || (depth0 != null ? depth0.btnSearch : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"btnSearch","hash":{},"data":data}) : helper)))
    + "</button>\r\n<button type=\"button\" data-action=\"cancel\" class=\"btn ct_btn\">"
    + escapeExpression(((helper = (helper = helpers.btnCancel || (depth0 != null ? depth0.btnCancel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"btnCancel","hash":{},"data":data}) : helper)))
    + "</button>\r\n<span class=\"input-amount-error\"></span>";
},"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "	<span class=\"input-group-addon visible-xs\" id=\"submenu-greater\"><strong> "
    + escapeExpression(((helper = (helper = helpers.field_Name || (depth0 != null ? depth0.field_Name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"field_Name","hash":{},"data":data}) : helper)))
    + " &gt;</strong></span>\r\n	<div class=\"input-group input-submenu-error inputAmount\" data-item-id=\"submenuError\">\r\n	\r\n	  <span class=\"input-group-addon hidden-xs\" id=\"submenu-greater\"><strong> "
    + escapeExpression(((helper = (helper = helpers.field_Name || (depth0 != null ? depth0.field_Name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"field_Name","hash":{},"data":data}) : helper)))
    + " &gt;</strong></span>\r\n	  <input type=\"text\" class=\"form-control ct-mobile-filter-padd\" name=\"amount_greater\" vtype=\"numeric\" placeholder=\""
    + escapeExpression(((helper = (helper = helpers.GreaterThan || (depth0 != null ? depth0.GreaterThan : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"GreaterThan","hash":{},"data":data}) : helper)))
    + "\" aria-describedby=\"submenu-greater\">\r\n	   <span type=\"Error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container ct_err_position ct_err_default\">\r\n	  <span type=\"Error_Msg\" data-item-id=\"errorMsgListForm\" class=\"ct-form__err hidden\">  \r\n	   <i class=\"ct-app__tools ct-app__tools-exclamation\"></i>\r\n	  </span>\r\n	  </span>\r\n	</div>\r\n";
},"3":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.lesser : depth0), {"name":"if","hash":{},"fn":this.program(4, data),"inverse":this.program(6, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"4":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "		<span class=\"input-group-addon visible-xs\" id=\"submenu-lesser\"><strong>"
    + escapeExpression(((helper = (helper = helpers.field_Name || (depth0 != null ? depth0.field_Name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"field_Name","hash":{},"data":data}) : helper)))
    + " &lt;</strong></span>\r\n		<div class=\"input-group input-submenu-error inputAmount\" data-item-id=\"submenuError\">\r\n		\r\n		  <span class=\"input-group-addon hidden-xs\" id=\"submenu-lesser\"><strong>"
    + escapeExpression(((helper = (helper = helpers.field_Name || (depth0 != null ? depth0.field_Name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"field_Name","hash":{},"data":data}) : helper)))
    + " &lt;</strong></span>\r\n		  <input type=\"text\" class=\"form-control ct-mobile-filter-padd\" name=\"amount_lesser\" vtype=\"numeric\" placeholder=\""
    + escapeExpression(((helper = (helper = helpers.LessThan || (depth0 != null ? depth0.LessThan : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"LessThan","hash":{},"data":data}) : helper)))
    + "\" aria-describedby=\"submenu-lesser\">\r\n		   <span type=\"Error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container ct_err_position ct_err_default\">\r\n	  		<span type=\"Error_Msg\" data-item-id=\"errorMsgListForm\" class=\"ct-form__err hidden\">  \r\n	   		<i class=\"flaticon-alert\"></i>\r\n	  		</span>\r\n	  		</span>\r\n		</div>\r\n";
},"6":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.equals : depth0), {"name":"if","hash":{},"fn":this.program(7, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"7":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "			<span class=\"input-group-addon visible-xs\" id=\"submenu-equals\"><strong>"
    + escapeExpression(((helper = (helper = helpers.field_Name || (depth0 != null ? depth0.field_Name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"field_Name","hash":{},"data":data}) : helper)))
    + " =</strong></span>\r\n			<div class=\"input-group input-submenu-error inputAmount\" data-item-id=\"submenuError\">\r\n			\r\n			  <span class=\"input-group-addon hidden-xs\" id=\"submenu-equals\"><strong>"
    + escapeExpression(((helper = (helper = helpers.field_Name || (depth0 != null ? depth0.field_Name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"field_Name","hash":{},"data":data}) : helper)))
    + " =</strong></span>\r\n			  <input type=\"text\" class=\"form-control ct-mobile-filter-padd\" name=\"amount_equals\" vtype=\"numeric\" placeholder=\""
    + escapeExpression(((helper = (helper = helpers.equals || (depth0 != null ? depth0.equals : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"equals","hash":{},"data":data}) : helper)))
    + "\" aria-describedby=\"submenu-equals\">\r\n			   <span type=\"Error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container ct_err_position ct_err_default\">\r\n	  			<span type=\"Error_Msg\" data-item-id=\"errorMsgListForm\" class=\"ct-form__err hidden\">  \r\n	   			<i class=\"flaticon-alert\"></i>\r\n	 			</span>\r\n	 			</span>\r\n			</div>\r\n";
},"useData":true});
  templates['listBody'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,depths) {
  var stack1, buffer = "\r\n";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.NODATA : depth0), {"name":"unless","hash":{},"fn":this.program(1, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.NODATA : depth0), {"name":"if","hash":{},"fn":this.program(17, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"1":function(depth0,helpers,partials,data,depths) {
  var stack1, buffer = "";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.LIST_DATA : depth0), {"name":"each","hash":{},"fn":this.program(2, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "       \r\n		\r\n";
},"2":function(depth0,helpers,partials,data,depths) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "         <tr data-grid-records data-rowIndex=\""
    + escapeExpression(lambda((depth0 != null ? depth0.ROW_INDEX : depth0), depth0))
    + "\" data-row-id=\""
    + escapeExpression(lambda((depth0 != null ? depth0.ROW_INDEX : depth0), depth0))
    + "\"";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depths[1] != null ? depths[1].VIEW_TYPE : depths[1]), "ADVGROUP", {"name":"condchk","hash":{},"fn":this.program(3, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += ">\r\n";
  stack1 = helpers['if'].call(depth0, (depths[1] != null ? depths[1].colspace : depths[1]), {"name":"if","hash":{},"fn":this.program(5, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depths[1] != null ? depths[1].ROWSELECTION : depths[1]), {"name":"if","hash":{},"fn":this.program(7, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depths[1] != null ? depths[1].ACTION_COLUMN : depths[1]), {"name":"if","hash":{},"fn":this.program(9, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "         	<td class=\"text-center ct-rowexpand "
    + escapeExpression(lambda((depth0 != null ? depth0.rowExpand : depth0), depth0))
    + "\">\r\n			         		<div data-item-id=\"row-expander\" class=\"ct-row-expander ct-row-expand flaticon-add f_gr\" data-item-data=\""
    + escapeExpression(lambda((depth0 != null ? depth0.COL_ID : depth0), depth0))
    + "|"
    + escapeExpression(lambda((depth0 != null ? depth0.ROW_INDEX : depth0), depth0))
    + "\" data-rowIndex=\""
    + escapeExpression(lambda((depth0 != null ? depth0.ROW_INDEX : depth0), depth0))
    + "\"></div>\r\n			</td>\r\n		\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.rowData : depth0), {"name":"each","hash":{},"fn":this.program(11, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "         </tr>\r\n         \r\n";
},"3":function(depth0,helpers,partials,data) {
  return " data-group-id=\"\"";
  },"5":function(depth0,helpers,partials,data,depths) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "         		<td class='spacer' colspan=\""
    + escapeExpression(lambda((depths[2] != null ? depths[2].colspace : depths[2]), depth0))
    + "\"></td>\r\n";
},"7":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "         	<td class=\""
    + escapeExpression(lambda((depth0 != null ? depth0.cssClass : depth0), depth0))
    + " text-center ct-rowselection\" data-item-data=\""
    + escapeExpression(lambda((depth0 != null ? depth0.ROW_INDEX : depth0), depth0))
    + "\">\r\n         		<span><input data-item-id = \"ct_rowSelector\" type=\"checkbox\" data-item-checker=\"true\" /></span>\r\n         	</td>\r\n";
},"9":function(depth0,helpers,partials,data,depths) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "         		<td data-column=\"paging-action\" class=\""
    + escapeExpression(lambda((depth0 != null ? depth0.cssClass : depth0), depth0))
    + " ct-paging-action text-center "
    + escapeExpression(lambda((depths[2] != null ? depths[2].IS_LIST_VIEW_TYPE_CLASS : depths[2]), depth0))
    + "\" data-item-data=\""
    + escapeExpression(lambda((depth0 != null ? depth0.COL_ID : depth0), depth0))
    + "\">\r\n         			<div class=\"btn-group\" style=\"cursor:not-allowed;\">       			\r\n         			<span data-icon-action=\"detail\" data-toggle=\"tooltip\" class = \"btn "
    + escapeExpression(lambda((depths[2] != null ? depths[2].DETAIL_ACTION : depths[2]), depth0))
    + " ct-paging_action-column ct_paging_struc\" data-placement=\"right\" data-original-title=\"Detail_Click_Action\">\r\n					    <span class=\"ct-detailaction-fld flaticon-report_2\" aria-hidden=\"true\"></span>\r\n				    </span> \r\n				    \r\n					<span class=\"ct-listview__context-menu\" data-context-paging=\"true\">\r\n						<span data-icon-action=\"context\" class = \"btn "
    + escapeExpression(lambda((depths[2] != null ? depths[2].CONTEXT_ACTION : depths[2]), depth0))
    + " ct-paging_action-column\" data-placement=\"right\" data-toggle=\"tooltip\" data-original-title=\"Context_Action\">\r\n					  	<span class=\"ct-contextaction-fld flaticon-right_click\" aria-hidden=\"true\"></span>\r\n					</span>\r\n					</span> \r\n					</div>\r\n         		</td>\r\n";
},"11":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.enableContext : depth0), {"name":"if","hash":{},"fn":this.program(12, data),"inverse":this.program(15, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"12":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "					<td  data-grid-record class=\""
    + escapeExpression(lambda((depth0 != null ? depth0.cssClass : depth0), depth0))
    + " text-center\" data-item-data=\""
    + escapeExpression(lambda((depth0 != null ? depth0.COL_ID : depth0), depth0))
    + "|"
    + escapeExpression(lambda((data && data.index), depth0))
    + "\">";
  stack1 = ((helpers['canvas-context-icon'] || (depth0 && depth0['canvas-context-icon']) || helperMissing).call(depth0, "glyphicon-list-alt", (depth0 != null ? depth0.enableContext : depth0), {"name":"canvas-context-icon","hash":{},"fn":this.program(13, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</td>\r\n";
},"13":function(depth0,helpers,partials,data) {
  return "";
},"15":function(depth0,helpers,partials,data) {
  var stack1, helper, lambda=this.lambda, escapeExpression=this.escapeExpression, functionType="function", helperMissing=helpers.helperMissing, buffer = "            <td  data-grid-record class=\""
    + escapeExpression(lambda((depth0 != null ? depth0.cssClass : depth0), depth0))
    + "\" data-item-data=\""
    + escapeExpression(lambda((depth0 != null ? depth0.COL_ID : depth0), depth0))
    + "|"
    + escapeExpression(lambda((data && data.index), depth0))
    + "\" data-item-id=\""
    + escapeExpression(lambda((depth0 != null ? depth0.COL_ID : depth0), depth0))
    + "\">\r\n               <span>";
  stack1 = ((helper = (helper = helpers.VALUE || (depth0 != null ? depth0.VALUE : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"VALUE","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n            </td>\r\n";
},"17":function(depth0,helpers,partials,data,depths) {
  var stack1, helperMissing=helpers.helperMissing, lambda=this.lambda, escapeExpression=this.escapeExpression, buffer = "	  	<tr class=\"no-data\" ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depths[1] != null ? depths[1].VIEW_TYPE : depths[1]), "ADVGROUP", {"name":"condchk","hash":{},"fn":this.program(3, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += ">\r\n";
  stack1 = helpers['if'].call(depth0, (depths[1] != null ? depths[1].colspace : depths[1]), {"name":"if","hash":{},"fn":this.program(5, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "	  		<td colspan=\""
    + escapeExpression(lambda((depths[1] != null ? depths[1].colLen : depths[1]), depth0))
    + "\"><span class=\"text-info\">"
    + escapeExpression(lambda((depths[1] != null ? depths[1].NODATA_MSG : depths[1]), depth0))
    + "</span></td>\r\n	  	</tr>\r\n";
},"useData":true,"useDepths":true});
  templates['listContainer'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div data-item-id=\"ct_list_main_content\" class=\"col-md-12 yscroll-wrapper-container\">\r\n	<div data-item-id=\"list-toolbar\"></div>\r\n	<div data-item-id=\"ct_listWrapper\" class=\"col-sm-12 col-xs-12 col-lg-12 yscroll-wrapper-container\"></div>\r\n	<div data-item-id=\"ct_listFoot\"></div>\r\n</div>\r\n";
  },"useData":true});
  templates['listDateForm'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<span>"
    + escapeExpression(((helper = (helper = helpers.field_Name || (depth0 != null ? depth0.field_Name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"field_Name","hash":{},"data":data}) : helper)))
    + " </span>\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.between : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(3, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "<button type=\"button\" data-action=\"submit\" class=\"btn ct_btn\">"
    + escapeExpression(((helper = (helper = helpers.btnSearch || (depth0 != null ? depth0.btnSearch : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"btnSearch","hash":{},"data":data}) : helper)))
    + "</button>\r\n<button type=\"button\" data-action=\"cancel\" class=\"btn ct_btn\">"
    + escapeExpression(((helper = (helper = helpers.btnCancel || (depth0 != null ? depth0.btnCancel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"btnCancel","hash":{},"data":data}) : helper)))
    + "</button>\r\n<span class=\"input-datepicker-error\"></span>";
},"1":function(depth0,helpers,partials,data) {
  return "<div class=\"form-group ct-mobile-filter-padd\">\r\n	<div>\r\n		<div class=\"input-group date \" data-enableCalender=\"true\" data-item-id=\"datepicker\" id=\"datepicker\">\r\n			<span class=\"input-group-addon\">From</span>\r\n			<input type=\"text\" class=\"input-sm form-control\" name=\"date_from\" />\r\n			<span class=\"input-group-addon\"><i class=\"flaticon-table-grid\"></i></span>\r\n		</div>\r\n		<div class=\"input-group date\" data-enableCalender=\"true\" data-item-id=\"datepicker\" id=\"datepicker\">\r\n			<span class=\"input-group-addon\">To</span>\r\n			<input type=\"text\" class=\"input-sm form-control\" name=\"date_to\" />\r\n			<span class=\"input-group-addon\"><i class=\"flaticon-table-grid\"></i></span>\r\n		</div>\r\n		<span type=\"Error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container ct_err_default\">\r\n	  		<span type=\"Error_Msg\" class=\"ct-form__err hidden\" data-item-id=\"errorMsgListForm\">  \r\n	   		<i class=\"flaticon-alert\"></i>\r\n	  	</span>\r\n	  	</span>\r\n	</div>\r\n</div>\r\n";
},"3":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\"input-group date input-dateon-error\" data-item-id=\"dateOnError\" ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.calenderEnabled : depth0), {"name":"if","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += ">\r\n\r\n	<input type=\"text\" class=\"form-control ct-mobile-filter-padd\" name=\""
    + escapeExpression(((helper = (helper = helpers.inputName || (depth0 != null ? depth0.inputName : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"inputName","hash":{},"data":data}) : helper)))
    + "\"";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.calenderEnabled : depth0), {"name":"unless","hash":{},"fn":this.program(6, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " placeholder=\"\"/>\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.calenderEnabled : depth0), {"name":"if","hash":{},"fn":this.program(8, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "	<span type=\"Error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container ct_err_position ct_err_default\">\r\n	  		<span type=\"Error_Msg\" class=\"ct-form__err hidden\">  \r\n	   		<i class=\"flaticon-alert\"></i>\r\n	 </span>\r\n	 </span>\r\n</div>\r\n";
},"4":function(depth0,helpers,partials,data) {
  return "data-enableCalender=\"true\" ";
  },"6":function(depth0,helpers,partials,data) {
  return "vtype=\"numeric\"";
  },"8":function(depth0,helpers,partials,data) {
  return "		<span class=\"input-group-addon\"><i class=\"flaticon-table-grid\"></i></span>\r\n";
  },"useData":true});
  templates['listFilterCont'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,depths) {
  var stack1, helperMissing=helpers.helperMissing, buffer = " \r\n<div class=\"col-sm-12 col-xs-12 col-lg-12 ct-padding-filter-container\">\r\n\r\n      <div data-filterformcontainer style=\"display:none;\">\r\n               <form class=\"form-inline pull-left\" data-filter-form=\"true\" method=\"post\">\r\n               </form>\r\n       </div>\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.FILTER_IND : depth0), {"name":"if","hash":{},"fn":this.program(1, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "  </div>\r\n";
  stack1 = ((helpers.if_Or || (depth0 && depth0.if_Or) || helperMissing).call(depth0, (depth0 != null ? depth0.GROUPCOLS : depth0), (depth0 != null ? depth0.FILTERS : depth0), {"name":"if_Or","hash":{},"fn":this.program(15, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"1":function(depth0,helpers,partials,data,depths) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, buffer = "		<div class=\"ct-list-header-action-padding\">\r\n		\r\n		<div class=\"dropdown pull-right\">\r\n			<span class=\"";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.FILTERS : depth0), {"name":"unless","hash":{},"fn":this.program(2, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "ct-app__tools-filter-con\"><a data-item-id=\"list_clearFilterTool\" class=\"ct-app__tools flaticon-filter-o flaticon-fliter-align\" href=\"javascript:void(0)\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\""
    + escapeExpression(lambda((depth0 != null ? depth0.toolTipforClearFilter : depth0), depth0))
    + "\"><span class=\"flaticon_clearfilter\">x</span></a></span>\r\n		</div>\r\n		\r\n         <div class=\"dropdown pull-right\">\r\n             <a href=\"javascript:void(0);\" class=\"dropdown-toggle\" data-xtype=\""
    + escapeExpression(lambda((depth0 != null ? depth0.DATA_TYPE : depth0), depth0))
    + "\" data-toggle=\"dropdown\" id=\"filter-menu-"
    + escapeExpression(lambda((data && data.index), depth0))
    + "\">\r\n               	<span data-toggle=\"tooltip\" data-placement=\"auto\" data-original-title=\""
    + escapeExpression(lambda((depth0 != null ? depth0.toolTipforFilter : depth0), depth0))
    + "\" class=\"ct-app__tools flaticon-filter-o pull-right\"></span>\r\n              </a>\r\n           <ul class=\"dropdown-menu\" role=\"menu\" data-icn-action=\"filter\">\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.HEADER_COLS : depth0), {"name":"each","hash":{},"fn":this.program(4, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "			</ul>\r\n		</div>\r\n		</div>\r\n";
},"2":function(depth0,helpers,partials,data) {
  return "hidden ";
  },"4":function(depth0,helpers,partials,data,depths) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.FILTER_ENABLED : depth0), {"name":"if","hash":{},"fn":this.program(5, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"5":function(depth0,helpers,partials,data,depths) {
  var stack1, helper, lambda=this.lambda, escapeExpression=this.escapeExpression, functionType="function", helperMissing=helpers.helperMissing, buffer = "			<li ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.SUBMENU : depth0), {"name":"if","hash":{},"fn":this.program(6, data, depths),"inverse":this.program(8, data, depths),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "data-colId=\""
    + escapeExpression(lambda((depth0 != null ? depth0.COL_ID : depth0), depth0))
    + "\" data-column-id=\""
    + escapeExpression(lambda((depth0 != null ? depth0.TH_INDEX : depth0), depth0))
    + "\"  data-xtype=\""
    + escapeExpression(lambda((depth0 != null ? depth0.DATA_TYPE : depth0), depth0))
    + "\" class=\"";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.SUBMENU : depth0), {"name":"if","hash":{},"fn":this.program(10, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " pull-left\"><a href=\"javascript:void(0);\">"
    + escapeExpression(((helper = (helper = helpers.HEADER_VAL || (depth0 != null ? depth0.HEADER_VAL : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"HEADER_VAL","hash":{},"data":data}) : helper)))
    + "</a>\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.SUBMENU : depth0), {"name":"if","hash":{},"fn":this.program(12, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "			</li>\r\n";
},"6":function(depth0,helpers,partials,data) {
  return "data-menus ";
  },"8":function(depth0,helpers,partials,data) {
  return "data-menu  ";
  },"10":function(depth0,helpers,partials,data) {
  return "dropdown-submenu";
  },"12":function(depth0,helpers,partials,data,depths) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, buffer = "               			<ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"filter-menu-"
    + escapeExpression(lambda((data && data.index), depth0))
    + "\">\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.SUBMENU : depth0), {"name":"each","hash":{},"fn":this.program(13, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "               			</ul>\r\n";
},"13":function(depth0,helpers,partials,data,depths) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "               					<li data-submenu=\""
    + escapeExpression(lambda((depth0 != null ? depth0.key : depth0), depth0))
    + "\" data-colId=\""
    + escapeExpression(lambda((depths[1] != null ? depths[1].COL_ID : depths[1]), depth0))
    + "\" data-xtype=\""
    + escapeExpression(lambda((depths[1] != null ? depths[1].DATA_TYPE : depths[1]), depth0))
    + "\"><a role=\"menuitem\" href=\"javascript:void(0)\">"
    + escapeExpression(lambda((depth0 != null ? depth0.display_name : depth0), depth0))
    + "</a></li>\r\n";
},"15":function(depth0,helpers,partials,data) {
  var stack1, buffer = "         <div data-filterbadgecontainer class=\"col-sm-12 col-xs-12 col-lg-12 ct-badge__container ct-padding-filter-container\">\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.FILTERS : depth0), {"name":"if","hash":{},"fn":this.program(16, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.GROUPCOLS : depth0), {"name":"if","hash":{},"fn":this.program(19, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "         </div>\r\n";
},"16":function(depth0,helpers,partials,data) {
  var stack1, buffer = "         <span class=\"pull-left ct-filter-badge\"> Filter by  </span>\r\n         		<div class=\"ct-badge ct-badge-tm pull-left\">\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.FILTERS : depth0), {"name":"each","hash":{},"fn":this.program(17, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "         			<div class=\"clearfix\"></div>\r\n         		</div>\r\n";
},"17":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "         					<div class=\"ct-badge__each ct-badge__each-tm ct-filterbadge pull-left\">\r\n  								<a href=\"javascript:void(0)\" class=\"ct-badge__txt\" data-datatype=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.cfg : depth0)) != null ? stack1.xType : stack1), depth0))
    + "\" data-searchType=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.cfg : depth0)) != null ? stack1.searchType : stack1), depth0))
    + "\" data-column=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.cfg : depth0)) != null ? stack1.column : stack1), depth0))
    + "\"><strong>"
    + escapeExpression(lambda((depth0 != null ? depth0.label : depth0), depth0))
    + "</strong> "
    + escapeExpression(lambda((depth0 != null ? depth0.value : depth0), depth0))
    + "</a>\r\n  								<a href=\"javascript:void(0)\" data-filter-id=\""
    + escapeExpression(lambda((depth0 != null ? depth0.ID : depth0), depth0))
    + "\" class=\"ct-badge__action\">x</a>\r\n							</div>\r\n";
},"19":function(depth0,helpers,partials,data) {
  var stack1, buffer = "         <span class=\"pull-left ct-filter-badge\"> Group by  </span>\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.GROUPCOLS : depth0), {"name":"each","hash":{},"fn":this.program(20, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"20":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "			<div class=\"ct-badge__each ct-badge__each-tm ct-groupbadge\">\r\n			\r\n				<a href=\"javascript:void(0)\" class=\"ct-badge__txt\">"
    + escapeExpression(lambda((depth0 != null ? depth0.HEADER_VAL : depth0), depth0))
    + "</a>\r\n				<a href=\"javascript:void(0)\" data-group-id=\""
    + escapeExpression(lambda((depth0 != null ? depth0.COL_ID : depth0), depth0))
    + "\" class=\"ct-badge__action\">\r\n				  x\r\n				</a>\r\n			</div>\r\n";
},"useData":true,"useDepths":true});
  templates['listFilters'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.xType : depth0), "listFilters_amount", {"name":"condchk","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.xType : depth0), "listFilters_date", {"name":"condchk","hash":{},"fn":this.program(10, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += " ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.xType : depth0), "listFilters_string", {"name":"condchk","hash":{},"fn":this.program(20, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n<button type=\"button\" data-action=\"submit\" class=\"btn ct_btn\">"
    + escapeExpression(((helper = (helper = helpers.btnSearch || (depth0 != null ? depth0.btnSearch : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"btnSearch","hash":{},"data":data}) : helper)))
    + "</button>\r\n<button type=\"button\" data-action=\"cancel\" class=\"btn ct_btn\">"
    + escapeExpression(((helper = (helper = helpers.btnCancel || (depth0 != null ? depth0.btnCancel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"btnCancel","hash":{},"data":data}) : helper)))
    + "</button>\r\n<span class=\"input-string-error\"></span>\r\n";
},"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = " ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.greater : depth0), {"name":"if","hash":{},"fn":this.program(2, data),"inverse":this.program(4, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"2":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return " \r\n<span class=\"input-group-addon visible-xs\" id=\"submenu-greater\"><strong> "
    + escapeExpression(((helper = (helper = helpers.field_Name || (depth0 != null ? depth0.field_Name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"field_Name","hash":{},"data":data}) : helper)))
    + " &gt;</strong></span>\r\n<div class=\"input-group input-submenu-error\">\r\n	<span class=\"input-group-addon hidden-xs\" id=\"submenu-greater\"><strong> "
    + escapeExpression(((helper = (helper = helpers.field_Name || (depth0 != null ? depth0.field_Name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"field_Name","hash":{},"data":data}) : helper)))
    + " &gt;</strong></span>\r\n	<input type=\"text\" class=\"form-control ct-mobile-filter-padd\" name=\"amount_greater\" vtype=\"numeric\" placeholder=\""
    + escapeExpression(((helper = (helper = helpers.GreaterThan || (depth0 != null ? depth0.GreaterThan : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"GreaterThan","hash":{},"data":data}) : helper)))
    + "\" aria-describedby=\"submenu-greater\"> \r\n	<span type=\"error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container ct_err_position ct_err_default\">\r\n		<span type=\"error_Msg\" class=\"ct-form__err hidden\"> \r\n			<i class=\"ct-app__tools ct-app__tools-exclamation\"></i>\r\n		</span>\r\n	</span>\r\n</div>\r\n ";
},"4":function(depth0,helpers,partials,data) {
  var stack1, buffer = " ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.lesser : depth0), {"name":"if","hash":{},"fn":this.program(5, data),"inverse":this.program(7, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"5":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return " \r\n<span class=\"input-group-addon visible-xs\" id=\"submenu-lesser\"><strong>"
    + escapeExpression(((helper = (helper = helpers.field_Name || (depth0 != null ? depth0.field_Name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"field_Name","hash":{},"data":data}) : helper)))
    + " &lt;</strong></span>\r\n<div class=\"input-group input-submenu-error\">\r\n	<span class=\"input-group-addon hidden-xs\" id=\"submenu-lesser\"><strong>"
    + escapeExpression(((helper = (helper = helpers.field_Name || (depth0 != null ? depth0.field_Name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"field_Name","hash":{},"data":data}) : helper)))
    + " &lt;</strong></span>\r\n	<input type=\"text\" class=\"form-control ct-mobile-filter-padd\" name=\"amount_lesser\" vtype=\"numeric\" placeholder=\""
    + escapeExpression(((helper = (helper = helpers.LessThan || (depth0 != null ? depth0.LessThan : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"LessThan","hash":{},"data":data}) : helper)))
    + "\" aria-describedby=\"submenu-lesser\"> \r\n		<span type=\"error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container ct_err_position ct_err_default\">\r\n		<span type=\"error_Msg\" class=\"ct-form__err hidden\"> \r\n			<i class=\"flaticon-alert\"></i>\r\n		</span>\r\n	</span>\r\n</div>\r\n ";
},"7":function(depth0,helpers,partials,data) {
  var stack1, buffer = " ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.equals : depth0), {"name":"if","hash":{},"fn":this.program(8, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"8":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return " \r\n<span class=\"input-group-addon visible-xs\" id=\"submenu-equals\"><strong>"
    + escapeExpression(((helper = (helper = helpers.field_Name || (depth0 != null ? depth0.field_Name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"field_Name","hash":{},"data":data}) : helper)))
    + " =</strong></span>\r\n<div class=\"input-group input-submenu-error\">\r\n	 <span class=\"input-group-addon hidden-xs\" id=\"submenu-equals\"><strong>"
    + escapeExpression(((helper = (helper = helpers.field_Name || (depth0 != null ? depth0.field_Name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"field_Name","hash":{},"data":data}) : helper)))
    + " =</strong></span>\r\n	<input type=\"text\" class=\"form-control ct-mobile-filter-padd\" name=\"amount_equals\" vtype=\"numeric\" placeholder=\""
    + escapeExpression(((helper = (helper = helpers.equals || (depth0 != null ? depth0.equals : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"equals","hash":{},"data":data}) : helper)))
    + "\" aria-describedby=\"submenu-equals\"> \r\n	<span type=\"error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container ct_err_position ct_err_default\">\r\n		<span type=\"error_Msg\" class=\"ct-form__err hidden\"> \r\n		<i class=\"flaticon-alert\"></i>\r\n		</span>\r\n	</span>\r\n</div>\r\n ";
},"10":function(depth0,helpers,partials,data) {
  var stack1, buffer = " ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.between : depth0), {"name":"if","hash":{},"fn":this.program(11, data),"inverse":this.program(13, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + " ";
},"11":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return " \r\n<span><strong>"
    + escapeExpression(((helper = (helper = helpers.field_Name || (depth0 != null ? depth0.field_Name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"field_Name","hash":{},"data":data}) : helper)))
    + " </strong></span> \r\n<div class=\"form-group ct-mobile-filter-padd\">\r\n	<div>\r\n		<div class=\"input-group date \" data-enableCalender=\"true\" data-item-id=\"datepicker\" id=\"datepicker\">\r\n			<span class=\"input-group-addon\">From</span>\r\n			<input type=\"text\" class=\"input-sm form-control\" name=\"date_from\" />\r\n			<span class=\"input-group-addon\"><i class=\"flaticon-table-grid\"></i></span>\r\n		</div>\r\n		<div class=\"input-group date\" data-enableCalender=\"true\" data-item-id=\"datepicker\" id=\"datepicker\">\r\n			<span class=\"input-group-addon\">To</span>\r\n			<input type=\"text\" class=\"input-sm form-control\" name=\"date_to\" />\r\n			<span class=\"input-group-addon\"><i class=\"flaticon-table-grid\"></i></span>\r\n		</div>\r\n		<span type=\"Error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container\">\r\n	  		<span type=\"Error_Msg\" class=\"ct-form__err hidden\" data-item-id=\"errorMsgListForm\">  \r\n	   		<i class=\"flaticon-alert\"></i>\r\n	  	</span>\r\n	  	</span>\r\n	</div>\r\n	\r\n</div>\r\n ";
},"13":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = " \r\n<span><strong>"
    + escapeExpression(((helper = (helper = helpers.field_Name || (depth0 != null ? depth0.field_Name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"field_Name","hash":{},"data":data}) : helper)))
    + " </strong></span> \r\n<div class=\"input-group date input-dateon-error ct-mobile-filter-padd\" ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.calenderEnabled : depth0), {"name":"if","hash":{},"fn":this.program(14, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += ">\r\n	<input type=\"text\" class=\"form-control\" name=\""
    + escapeExpression(((helper = (helper = helpers.inputName || (depth0 != null ? depth0.inputName : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"inputName","hash":{},"data":data}) : helper)))
    + "\" ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.calenderEnabled : depth0), {"name":"unless","hash":{},"fn":this.program(16, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " placeholder=\"\" /> \r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.calenderEnabled : depth0), {"name":"if","hash":{},"fn":this.program(18, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "	<span type=\"error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container ct_err_position ct_err_default\">\r\n		<span type=\"error_Msg\" class=\"ct-form__err hidden\"> \r\n		<i class=\"flaticon-alert\"></i>\r\n	</span>\r\n	</span>\r\n</div>\r\n ";
},"14":function(depth0,helpers,partials,data) {
  return " data-enableCalender=\"true\" ";
  },"16":function(depth0,helpers,partials,data) {
  return "vtype=\"numeric\" ";
  },"18":function(depth0,helpers,partials,data) {
  return "	<span class=\"input-group-addon\">\r\n	<i class=\"flaticon-table-grid\"></i></span> \r\n";
  },"20":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return " \r\n<div class=\"form-group ct-mobile-filter-padd\">\r\n	<div class=\"input-group input-string-validate\">\r\n		<div class=\"input-group-addon ct-mobile-view-filer-form\">\r\n			<strong> "
    + escapeExpression(((helper = (helper = helpers.field_Name || (depth0 != null ? depth0.field_Name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"field_Name","hash":{},"data":data}) : helper)))
    + " "
    + escapeExpression(((helper = (helper = helpers.Contains || (depth0 != null ? depth0.Contains : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"Contains","hash":{},"data":data}) : helper)))
    + "</strong>\r\n		</div>\r\n		<input type=\"text\" class=\"form-control\" name=\"string_contains\" id=\"stringContains\" /> \r\n		<span type=\"error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container ct_err_position ct_err_default\">\r\n			<span type=\"error_Msg\" class=\"ct-form__err hidden\"> \r\n			<i class=\"flaticon-alert\"></i>\r\n		</span>\r\n		</span>\r\n	</div>\r\n</div>\r\n ";
},"useData":true});
  templates['listFooter'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.totalResultInd : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n\r\n\r\n";
},"1":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "<div class=\"col-sm-12 col-xs-12 col-lg-12 ct-footer__container\">\r\n		<div class=\"text-primary pull-right\">\r\n			"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.pagingRecords : depth0)) != null ? stack1.displaying : stack1), depth0))
    + " "
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.pagingRecords : depth0)) != null ? stack1.from : stack1), depth0))
    + " - <span data-item-id=\"ct_pagingFoot_to\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.pagingRecords : depth0)) != null ? stack1.to : stack1), depth0))
    + "</span>\r\n			"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.pagingRecords : depth0)) != null ? stack1.of : stack1), depth0))
    + " <span data-item-id=\"ct_pagingFoot_total\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.pagingRecords : depth0)) != null ? stack1.total : stack1), depth0))
    + "</span>\r\n		</div>\r\n</div>\r\n";
},"useData":true});
  templates['listGroupRows'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers.each.call(depth0, depth0, {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "	<tr class=\"group_collapsed";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.isLeaf : depth0), {"name":"if","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" data-grouped-header=\"true\"  data-group-index =\""
    + escapeExpression(((helper = (helper = helpers.index || (depth0 != null ? depth0.index : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"index","hash":{},"data":data}) : helper)))
    + "\" data-col-id=\""
    + escapeExpression(((helper = (helper = helpers.COLID || (depth0 != null ? depth0.COLID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"COLID","hash":{},"data":data}) : helper)))
    + "\" data-row-index=\""
    + escapeExpression(((helper = (helper = helpers.row_index || (depth0 != null ? depth0.row_index : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"row_index","hash":{},"data":data}) : helper)))
    + "\" data-type=\""
    + escapeExpression(((helper = (helper = helpers.data_type || (depth0 != null ? depth0.data_type : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"data_type","hash":{},"data":data}) : helper)))
    + "\">\r\n			\r\n			<td class=\"row_spacer\" colspan=\""
    + escapeExpression(((helper = (helper = helpers.colspace || (depth0 != null ? depth0.colspace : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"colspace","hash":{},"data":data}) : helper)))
    + "\"></td>\r\n	        <td data-header-data colspan=\""
    + escapeExpression(((helper = (helper = helpers.colLen || (depth0 != null ? depth0.colLen : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"colLen","hash":{},"data":data}) : helper)))
    + "\">\r\n	         		";
  stack1 = ((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"label","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n	         		<!-- <div class=\"group_Summary pull-right\">";
  stack1 = ((helper = (helper = helpers.summmarylbl || (depth0 != null ? depth0.summmarylbl : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"summmarylbl","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += "</div> -->\r\n	        </td>\r\n<!-- 	    ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.ROWSELECTION : depth0), {"name":"if","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.ACTION_COLUMN : depth0), {"name":"if","hash":{},"fn":this.program(6, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "         	<td class=\"rowsexpand-col_spacer\"></td> -->\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.HEADER_COLS : depth0), {"name":"each","hash":{},"fn":this.program(8, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    </tr>\r\n";
},"2":function(depth0,helpers,partials,data) {
  return " is_leaf";
  },"4":function(depth0,helpers,partials,data) {
  return "\r\n         	<td class=\"rowselection-col_spacer\"></dh>\r\n";
  },"6":function(depth0,helpers,partials,data) {
  return "			<td class=\"actionselection-col_spacer\"></td>\r\n";
  },"8":function(depth0,helpers,partials,data) {
  var helper, lambda=this.lambda, escapeExpression=this.escapeExpression, functionType="function", helperMissing=helpers.helperMissing;
  return "         	<td class=\""
    + escapeExpression(lambda((depth0 != null ? depth0.cssClass : depth0), depth0))
    + "\">\r\n         		<span data-lbl=\""
    + escapeExpression(((helper = (helper = helpers.COL_ID || (depth0 != null ? depth0.COL_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"COL_ID","hash":{},"data":data}) : helper)))
    + "\" class=\"ct-listview__summary-title\">"
    + escapeExpression(((helper = (helper = helpers.SUMMARY_LBL || (depth0 != null ? depth0.SUMMARY_LBL : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"SUMMARY_LBL","hash":{},"data":data}) : helper)))
    + " </span>\r\n         	</td>\r\n";
},"useData":true});
  templates['listHeader'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<tr data-item-header class =\"ct-padding-top-tr-paging\">\r\n			\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.IS_GROUPING_GRID : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.ROWSELECTION : depth0), {"name":"if","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.ACTION_COLUMN : depth0), {"name":"if","hash":{},"fn":this.program(6, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "         	<th class=\"rowsexpand-col "
    + escapeExpression(((helper = (helper = helpers.rowExpand || (depth0 != null ? depth0.rowExpand : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"rowExpand","hash":{},"data":data}) : helper)))
    + "\" data-column-id=\"rowExpand\"><div data-ct-input=\"rowexpand-All\" class=\"ct-row-expand flaticon-add\"></div></th>\r\n\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.HEADER_COLS : depth0), {"name":"each","hash":{},"fn":this.program(8, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</tr>\r\n";
},"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "			<th class=\"row_spacer\"></th>\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.fieldPosInGroup : depth0), {"name":"each","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"2":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "			<th class='spacer' data-group-index =\""
    + escapeExpression(lambda((data && data.index), depth0))
    + "\" colspan='1'></th>\r\n";
},"4":function(depth0,helpers,partials,data) {
  return "         	<th class=\"text-center rowselection-col\" data-ct-input=\"rowselection-col\"><span><input type=\"checkbox\" data-item-checker=\"true\" /></span></th>\r\n";
  },"6":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "			<th class=\"text-center actionselection-col "
    + escapeExpression(((helper = (helper = helpers.IS_LIST_VIEW_TYPE_CLASS || (depth0 != null ? depth0.IS_LIST_VIEW_TYPE_CLASS : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"IS_LIST_VIEW_TYPE_CLASS","hash":{},"data":data}) : helper)))
    + "\" data-column-id=\"actionColumn\"></th>\r\n";
},"8":function(depth0,helpers,partials,data) {
  var stack1, helper, lambda=this.lambda, escapeExpression=this.escapeExpression, functionType="function", helperMissing=helpers.helperMissing, buffer = "            <th class=\""
    + escapeExpression(lambda((depth0 != null ? depth0.cssClass : depth0), depth0))
    + "\" data-thindex=\""
    + escapeExpression(lambda((depth0 != null ? depth0.TH_INDEX : depth0), depth0))
    + "\" ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.COLUMNORDER : depth0), {"name":"if","hash":{},"fn":this.program(9, data),"inverse":this.program(11, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " data-column-linked=\""
    + escapeExpression(((helper = (helper = helpers.COL_ID || (depth0 != null ? depth0.COL_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"COL_ID","hash":{},"data":data}) : helper)))
    + "\">\r\n            	<span data-lbl=\""
    + escapeExpression(lambda((depth0 != null ? depth0.COL_ID : depth0), depth0))
    + "\" data-fieldName=\""
    + escapeExpression(lambda((depth0 != null ? depth0.HEADER_VAL : depth0), depth0))
    + "\"></span>\r\n            	<div data-attr=\"listColumns\" ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.GROUPABLE : depth0), {"name":"if","hash":{},"fn":this.program(14, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.COLUMNORDER : depth0), {"name":"if","hash":{},"fn":this.program(16, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " class=\"ct-grid-header pull-left\">\r\n            	<div class=\"_header_title\">\r\n               		<span data-lbl=\""
    + escapeExpression(((helper = (helper = helpers.COL_ID || (depth0 != null ? depth0.COL_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"COL_ID","hash":{},"data":data}) : helper)))
    + "\" class=\"ct-listview__header-title\">"
    + escapeExpression(lambda((depth0 != null ? depth0.HEADER_VAL : depth0), depth0))
    + " </span>\r\n               		</div>\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.SHOW_ICONS : depth0), {"name":"if","hash":{},"fn":this.program(18, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "               	</div>\r\n            </th>\r\n";
},"9":function(depth0,helpers,partials,data) {
  return " data-attr=\"listColumnsDrag\" data-colorder=\"true\" data-draggable";
  },"11":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing;
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.FLD_GROUPABLE_IND : depth0), "Y", {"name":"condchk","hash":{},"fn":this.program(12, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { return stack1; }
  else { return ''; }
  },"12":function(depth0,helpers,partials,data) {
  return " data-groupdrag=\"listGroupDrag\" data-groupable=\"true\"";
  },"14":function(depth0,helpers,partials,data) {
  return "data-groupable=\"true\" ";
  },"16":function(depth0,helpers,partials,data) {
  return "data-colorder=\"true\"";
  },"18":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.SORTABLE : depth0), {"name":"if","hash":{},"fn":this.program(19, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"19":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, lambda=this.lambda, buffer = "               			 <div class=\"_sort_icon\">\r\n               				<span data-action=\"column-sorter\" data-toggle=\"tooltip\" data-placement=\"auto\" data-column-linked=\""
    + escapeExpression(((helper = (helper = helpers.COL_ID || (depth0 != null ? depth0.COL_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"COL_ID","hash":{},"data":data}) : helper)))
    + "\" data-original-title=\""
    + escapeExpression(lambda((depth0 != null ? depth0.toolTipforSorting : depth0), depth0))
    + "\" class=\"sort-ind ct-app__tools ";
  stack1 = ((helpers['canvas-sorting'] || (depth0 && depth0['canvas-sorting']) || helperMissing).call(depth0, (depth0 != null ? depth0.COL_ID : depth0), {"name":"canvas-sorting","hash":{},"fn":this.program(20, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\"></span>\r\n               			</div>\r\n";
},"20":function(depth0,helpers,partials,data) {
  return "default-class";
  },"useData":true});
  templates['listStringForm'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "\r\n<div class=\"form-group ct-mobile-filter-padd\">\r\n	<div class=\"input-group input-string-validate\" data-item-id=\"listStringValidate\">\r\n		\r\n		<div class=\"input-group-addon ct-mobile-view-filer-form\"><strong> "
    + escapeExpression(((helper = (helper = helpers.field_Name || (depth0 != null ? depth0.field_Name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"field_Name","hash":{},"data":data}) : helper)))
    + " "
    + escapeExpression(((helper = (helper = helpers.Contains || (depth0 != null ? depth0.Contains : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"Contains","hash":{},"data":data}) : helper)))
    + "</strong></div>\r\n		<input type=\"text\" class=\"form-control\" name=\"string_contains\" id=\"stringContains\" />\r\n		<span type=\"Error_Msg_Container\" class=\"input-group-addon ct-form__addon ct-form__err-container ct_err_position ct_err_default\">\r\n	  		<span type=\"Error_Msg\" data-item-id=\"errorMsgListForm\" class=\"ct-form__err hidden\">  \r\n	   		<i class=\"flaticon-alert\"></i>\r\n		</span>\r\n	 	</span>\r\n	</div>\r\n</div>\r\n<button type=\"button\" data-action=\"submit\" class=\"btn ct_btn\">"
    + escapeExpression(((helper = (helper = helpers.btnSearch || (depth0 != null ? depth0.btnSearch : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"btnSearch","hash":{},"data":data}) : helper)))
    + "</button>\r\n<button type=\"button\" data-action=\"cancel\" class=\"btn ct_btn\">"
    + escapeExpression(((helper = (helper = helpers.btnCancel || (depth0 != null ? depth0.btnCancel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"btnCancel","hash":{},"data":data}) : helper)))
    + "</button>\r\n<span class=\"input-string-error\"></span>";
},"useData":true});
  templates['listTableWrapper'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div name = \""
    + escapeExpression(((helper = (helper = helpers.viewID || (depth0 != null ? depth0.viewID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"viewID","hash":{},"data":data}) : helper)))
    + "\" data-item-id=\"table-wrapper-container\" class=\"table-wrapper-container\">\r\n	<table data-item-id=\"tableref\" class=\"table table-striped table-hover no-margin ct-listview ct-listview-tm\">\r\n		<thead data-item-id=\"ct_listHead\" class=\"ct_pagingHead\"></thead>\r\n		<tbody data-item-id=\"ct_listBody\" class=\"ct_pagingBody\"></tbody>\r\n		<!-- <tfoot data-item-id=\"ct_listFoot\" class=\"ct_pagingFoot\"></tfoot>-->\r\n	</table>\r\n	<div data-item-id=\"ct_empty_content\" class=\"ct_empty_content hidden\">\r\n		<span class=\"ct-info_icon\"></span> <span class=\"ct-info_text\"></span>\r\n	</div>\r\n</div>\r\n<div data-item-id=\"ct_ListNavigation__"
    + escapeExpression(((helper = (helper = helpers.viewID || (depth0 != null ? depth0.viewID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"viewID","hash":{},"data":data}) : helper)))
    + "\" class=\"panner ct_panLeft flaticon-previous flaticon-Carousel hidden\" data-scroll-modifier='-1'></div>\r\n<div data-item-id=\"ct_ListNavigation__"
    + escapeExpression(((helper = (helper = helpers.viewID || (depth0 != null ? depth0.viewID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"viewID","hash":{},"data":data}) : helper)))
    + "\" class=\"panner ct_panRight flaticon-next flaticon-Carousel hidden\" data-scroll-modifier='1'></div>\r\n";
},"useData":true});
  templates['listViewMobile'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,depths) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\"ct-listview ct-listview-mobile ct-listview-tm\">\r\n	<div class=\"col-lg-12 col-xs-12 col-sm-12 col-md-12 ct-list-header-action-padding yscroll-wrapper-container\">\r\n		<div class=\"col-lg-10 ct-list-tool-padding\">\r\n			<div data-filterformcontainer style=\"display:none;\">\r\n               	<form class=\"form-inline pull-left\" data-filter-form=\"true\" method=\"post\">\r\n               	</form>\r\n      		 </div>\r\n      	</div>\r\n     	<div class=\"col-lg-2 ct-list-tool-padding\">\r\n 			<div class=\"dropdown pull-right ct-list-header-action-padding\">\r\n               	<a href=\"javascript:void(0);\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">\r\n               		<span data-toggle=\"tooltip\" data-placement=\"auto\" data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.toolTipforSorting || (depth0 != null ? depth0.toolTipforSorting : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"toolTipforSorting","hash":{},"data":data}) : helper)))
    + "\" class=\"sort-ind ct-app__tools ";
  stack1 = ((helpers['canvas-sorting'] || (depth0 && depth0['canvas-sorting']) || helperMissing).call(depth0, (depth0 != null ? depth0.COL_ID : depth0), {"name":"canvas-sorting","hash":{},"fn":this.program(1, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += " pull-right\"></span>\r\n               	</a>\r\n               	<ul class=\"dropdown-menu pull-right ct-dropdown-menu\" role=\"menu\">\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.headerCols : depth0), {"name":"each","hash":{},"fn":this.program(3, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "				</ul>\r\n			</div>\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.FILTER_IND : depth0), {"name":"if","hash":{},"fn":this.program(5, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "		</div>\r\n	</div>\r\n<div class=\"table-responsive col-lg-12 col-md-12 col-sm-12 col-xs-12 yscroll-wrapper-container\"><!-- JQTBS#COMPACT -->\r\n<table class=\"table table-striped table-condensed ct-listview-mobile__content\">\r\n<tbody>\r\n\r\n<!-- for mobile -->\r\n\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.FILTERS : depth0), {"name":"if","hash":{},"fn":this.program(19, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " \r\n\r\n <!-- for mobile ends -->\r\n ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.GROUPING_ENABLED : depth0), {"name":"if","hash":{},"fn":this.program(22, data, depths),"inverse":this.program(34, data, depths),"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.NODATA : depth0), {"name":"if","hash":{},"fn":this.program(37, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "</tbody>\r\n<tfoot>\r\n";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.NODATA : depth0), {"name":"unless","hash":{},"fn":this.program(39, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</tfoot>\r\n</table>\r\n</div><!-- JQTBS#COMPACT -->\r\n</div> <!-- ct-listview-mobile ends -->\r\n";
},"1":function(depth0,helpers,partials,data) {
  return "default-class";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "					<li data-action=\"sortformobile\" data-colId=\""
    + escapeExpression(lambda((depth0 != null ? depth0.COL_ID : depth0), depth0))
    + "\" data-column-id=\""
    + escapeExpression(lambda((depth0 != null ? depth0.TH_INDEX : depth0), depth0))
    + "\"><a href=\"javascript:void(0);\"><span class=\"sort-ind ct-app__tools ";
  stack1 = ((helpers['canvas-sorting'] || (depth0 && depth0['canvas-sorting']) || helperMissing).call(depth0, (depth0 != null ? depth0.COL_ID : depth0), {"name":"canvas-sorting","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\"></span><span class=\"ct-dropdown-menu-txt\">"
    + escapeExpression(lambda((depth0 != null ? depth0.LIST_DATA : depth0), depth0))
    + "</span></a></li>\r\n";
},"5":function(depth0,helpers,partials,data,depths) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "			<div class=\"ct-list-header-action-padding\">\r\n				<div class=\"dropdown pull-right\">\r\n					<span class=\"";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.FILTERS : depth0), {"name":"unless","hash":{},"fn":this.program(6, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "ct-app__tools-filter-con\"><a data-item-id=\"list_clearFilterTool\" class=\"ct-app__tools flaticon-filter-o flaticon-fliter-align\" href=\"javascript:void(0)\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.toolTipforClearFilter || (depth0 != null ? depth0.toolTipforClearFilter : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"toolTipforClearFilter","hash":{},"data":data}) : helper)))
    + "\"><span class=\"flaticon_clearfilter\">x</span></a></span>\r\n				</div>\r\n        		<div class=\"dropdown pull-right\">\r\n         			<a href=\"javascript:void(0);\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">\r\n           				<span data-toggle=\"tooltip\" data-placement=\"top\" title=\""
    + escapeExpression(((helper = (helper = helpers.toolTipforFilter || (depth0 != null ? depth0.toolTipforFilter : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"toolTipforFilter","hash":{},"data":data}) : helper)))
    + "\" class=\"ct-app__tools flaticon-filter-o pull-right\"></span>\r\n           			</a>\r\n           			<ul class=\"dropdown-menu\" role=\"menu\" data-icn-action=\"filter\">\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.headerCols : depth0), {"name":"each","hash":{},"fn":this.program(8, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "					</ul>\r\n				</div>\r\n			</div>\r\n";
},"6":function(depth0,helpers,partials,data) {
  return "hidden ";
  },"8":function(depth0,helpers,partials,data,depths) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.FILTER_ENABLED : depth0), {"name":"if","hash":{},"fn":this.program(9, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"9":function(depth0,helpers,partials,data,depths) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, buffer = "					<li ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.SUBMENU : depth0), {"name":"if","hash":{},"fn":this.program(10, data, depths),"inverse":this.program(12, data, depths),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "data-colId=\""
    + escapeExpression(lambda((depth0 != null ? depth0.COL_ID : depth0), depth0))
    + "\" data-column-id=\""
    + escapeExpression(lambda((depth0 != null ? depth0.TH_INDEX : depth0), depth0))
    + "\"  data-xtype=\""
    + escapeExpression(lambda((depth0 != null ? depth0.DATA_TYPE : depth0), depth0))
    + "\" class=\"";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.SUBMENU : depth0), {"name":"if","hash":{},"fn":this.program(14, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " pull-left\"><a href=\"javascript:void(0);\">"
    + escapeExpression(lambda((depth0 != null ? depth0.LIST_DATA : depth0), depth0))
    + "</a>\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.SUBMENU : depth0), {"name":"if","hash":{},"fn":this.program(16, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "					</li>\r\n";
},"10":function(depth0,helpers,partials,data) {
  return "data-menus ";
  },"12":function(depth0,helpers,partials,data) {
  return "data-menu  ";
  },"14":function(depth0,helpers,partials,data) {
  return "dropdown-submenu";
  },"16":function(depth0,helpers,partials,data,depths) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, buffer = "		               			<ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"filter-menu-"
    + escapeExpression(lambda((data && data.index), depth0))
    + "\">\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.SUBMENU : depth0), {"name":"each","hash":{},"fn":this.program(17, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "		               			</ul>\r\n";
},"17":function(depth0,helpers,partials,data,depths) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "		               					<li data-submenu=\""
    + escapeExpression(lambda((depth0 != null ? depth0.key : depth0), depth0))
    + "\" data-item-id=\"filter-submenu\" data-colId=\""
    + escapeExpression(lambda((depths[1] != null ? depths[1].COL_ID : depths[1]), depth0))
    + "\" data-xtype=\""
    + escapeExpression(lambda((depths[1] != null ? depths[1].DATA_TYPE : depths[1]), depth0))
    + "\"><a role=\"menuitem\" href=\"javascript:void(0)\">"
    + escapeExpression(lambda((depth0 != null ? depth0.display_name : depth0), depth0))
    + "</a></li>\r\n		               						\r\n";
},"19":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "         <tr>\r\n         	<td colspan=\""
    + escapeExpression(((helper = (helper = helpers.colLen || (depth0 != null ? depth0.colLen : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"colLen","hash":{},"data":data}) : helper)))
    + "\">\r\n         	<span class=\"pull-left ct-filter-badge\"> "
    + escapeExpression(((helper = (helper = helpers.labelFilterBy || (depth0 != null ? depth0.labelFilterBy : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"labelFilterBy","hash":{},"data":data}) : helper)))
    + "  </span>\r\n         		<div class=\"ct-badge ct-badge-tm\">\r\n         			<div class=\"ct-badge__container\">\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.FILTERS : depth0), {"name":"each","hash":{},"fn":this.program(20, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "         			</div>\r\n         			<div class=\"clearfix\"></div>\r\n         		</div>\r\n         	</td>\r\n         </tr>\r\n";
},"20":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "         				\r\n         					<div class=\"ct-badge__each ct-badge__each-tm\">\r\n  								<a href=\"javascript:void(0)\" class=\"ct-badge__txt\" data-item-id=\"ct-badge-txt\" data-datatype=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.cfg : depth0)) != null ? stack1.xType : stack1), depth0))
    + "\" data-searchType=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.cfg : depth0)) != null ? stack1.searchType : stack1), depth0))
    + "\" data-column=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.cfg : depth0)) != null ? stack1.column : stack1), depth0))
    + "\"><strong>"
    + escapeExpression(lambda((depth0 != null ? depth0.label : depth0), depth0))
    + "</strong> "
    + escapeExpression(lambda((depth0 != null ? depth0.value : depth0), depth0))
    + "</a>\r\n  								<a href=\"javascript:void(0)\" data-filter-id=\""
    + escapeExpression(lambda((depth0 != null ? depth0.ID : depth0), depth0))
    + "\" class=\"ct-badge__action\">x</a>\r\n							</div>\r\n";
},"22":function(depth0,helpers,partials,data,depths) {
  var stack1, buffer = "	  \r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.groupedRows : depth0), {"name":"each","hash":{},"fn":this.program(23, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"23":function(depth0,helpers,partials,data,depths) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "";
  stack1 = ((helpers.condObj || (depth0 && depth0.condObj) || helperMissing).call(depth0, depth0, {"name":"condObj","hash":{},"fn":this.program(24, data, depths),"inverse":this.program(32, data, depths),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"24":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers.each.call(depth0, depth0, {"name":"each","hash":{},"fn":this.program(25, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"25":function(depth0,helpers,partials,data) {
  var stack1, buffer = "         			<tr class=\"hidden\">\r\n         			<td>\r\n";
  stack1 = helpers.each.call(depth0, depth0, {"name":"each","hash":{},"fn":this.program(26, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "         			</td>\r\n		         	</tr>\r\n";
},"26":function(depth0,helpers,partials,data) {
  var stack1, buffer = "  	<span class='ct-tr'>\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.enableContext : depth0), {"name":"if","hash":{},"fn":this.program(27, data),"inverse":this.program(30, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "  	</span>\r\n  	\r\n  	\r\n";
},"27":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "  		<span class='ct-td ct-listview-key'>"
    + escapeExpression(lambda((depth0 != null ? depth0.colKey : depth0), depth0))
    + "</span> \r\n  		";
  stack1 = ((helpers['canvas-context-icon'] || (depth0 && depth0['canvas-context-icon']) || helperMissing).call(depth0, "flaticon-bullet_list1", (depth0 != null ? depth0.enableContext : depth0), {"name":"canvas-context-icon","hash":{},"fn":this.program(28, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n";
},"28":function(depth0,helpers,partials,data) {
  return "";
},"30":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, buffer = "  		<span class='ct-td ct-listview-key'>"
    + escapeExpression(lambda((depth0 != null ? depth0.colKey : depth0), depth0))
    + "</span> \r\n  		<span class='ct-td ct-listview-val' data-item-data ='"
    + escapeExpression(lambda((depth0 != null ? depth0.key : depth0), depth0))
    + "'>";
  stack1 = lambda((depth0 != null ? depth0.rowValue : depth0), depth0);
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n";
},"32":function(depth0,helpers,partials,data,depths) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, buffer = "					<tr data-grouped-header=\"true\">\r\n	         			<td colspan=\""
    + escapeExpression(lambda((depths[2] != null ? depths[2].colLen : depths[2]), depth0))
    + "\">\r\n	         				";
  stack1 = lambda(depth0, depth0);
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n	         			</td>\r\n         		</tr>\r\n";
},"34":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.rows : depth0), {"name":"each","hash":{},"fn":this.program(35, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"35":function(depth0,helpers,partials,data) {
  var stack1, buffer = "  <tr>\r\n  	<td>\r\n  	<span class=\"ct-table\">\r\n";
  stack1 = helpers.each.call(depth0, depth0, {"name":"each","hash":{},"fn":this.program(26, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "     </span>\r\n  	</td>\r\n  </tr>\r\n";
},"37":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "	  	<tr class=\"no-data\">\r\n	  	   <td>\r\n	  		<span class=\"text-info\">"
    + escapeExpression(((helper = (helper = helpers.NODATA || (depth0 != null ? depth0.NODATA : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"NODATA","hash":{},"data":data}) : helper)))
    + "</span>\r\n	  	</td>	\r\n	  	</tr>\r\n";
},"39":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.GROUPING_ENABLED : depth0), {"name":"unless","hash":{},"fn":this.program(40, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"40":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.pagination : depth0), {"name":"if","hash":{},"fn":this.program(41, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"41":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "	<tr>\r\n		<td>\r\n			 <ul class=\"pager\">\r\n			    <li class=\"previous ";
  stack1 = ((helpers['canvas-paging'] || (depth0 && depth0['canvas-paging']) || helperMissing).call(depth0, (depth0 != null ? depth0.currentPage : depth0), "previous", {"name":"canvas-paging","hash":{},"fn":this.program(28, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\">\r\n			    	<a data-paginate=\"previous\" href=\"javascript:void(0)\" aria-label=\"Previous\" data-page=\""
    + escapeExpression(((helper = (helper = helpers.previousPage || (depth0 != null ? depth0.previousPage : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"previousPage","hash":{},"data":data}) : helper)))
    + "\"><span aria-hidden=\"true\">&larr;</span> Older</a>\r\n			    </li>\r\n			    <li class=\"next ";
  stack1 = ((helpers['canvas-paging'] || (depth0 && depth0['canvas-paging']) || helperMissing).call(depth0, (depth0 != null ? depth0.currentPage : depth0), "next", {"name":"canvas-paging","hash":{},"fn":this.program(28, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\">\r\n			    	 <a data-paginate=\"next\" href=\"javascript:void(0)\" aria-label=\"Next\" data-page=\""
    + escapeExpression(((helper = (helper = helpers.nextPage || (depth0 != null ? depth0.nextPage : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"nextPage","hash":{},"data":data}) : helper)))
    + "\">Newer <span aria-hidden=\"true\">&rarr;</span></a>\r\n			    </li>\r\n			 </ul>\r\n		</td>\r\n	</tr>\r\n";
},"useData":true,"useDepths":true});
  templates['listViewTemplate'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,depths) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "\r\n		<div class=\"col-lg-12 col-xs-12 col-sm-12 col-md-12 ct-list-header-action-padding yscroll-wrapper-container\">\r\n			<div class=\"col-lg-10 ct-list-tool-padding\">\r\n			<div data-filterformcontainer style=\"display:none;\">\r\n               <form class=\"form-inline pull-left\" data-filter-form=\"true\" method=\"post\">\r\n               </form>\r\n      		 </div>\r\n      		</div>\r\n      		<div class=\"col-lg-2 ct-list-tool-padding\">\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.FILTER_IND : depth0), {"name":"if","hash":{},"fn":this.program(1, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.SHOWHIDE_IND : depth0), {"name":"if","hash":{},"fn":this.program(15, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "		</div>\r\n		</div>\r\n		\r\n		\r\n<div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12 table-responsive pull-left ct-list-table-action-padding yscroll-wrapper-container\">\r\n<table class=\"table  table-striped table-hover no-margin ct-listview ct-listview-tm\">\r\n\r\n      <thead>\r\n";
  stack1 = ((helpers.if_Or || (depth0 && depth0.if_Or) || helperMissing).call(depth0, (depth0 != null ? depth0.GROUPING_ENABLED : depth0), (depth0 != null ? depth0.FILTERS : depth0), {"name":"if_Or","hash":{},"fn":this.program(22, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += " 	\r\n         <tr data-item-header>\r\n        <!-- ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.CONTEXT_COLUMN : depth0), {"name":"if","hash":{},"fn":this.program(28, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " -->\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.ROWSELECTION : depth0), {"name":"if","hash":{},"fn":this.program(30, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.headerCols : depth0), {"name":"each","hash":{},"fn":this.program(32, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "         </tr>\r\n      </thead>\r\n      <tbody>\r\n      	 \r\n         \r\n";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.NODATA : depth0), {"name":"unless","hash":{},"fn":this.program(47, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.NODATA : depth0), {"name":"if","hash":{},"fn":this.program(73, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "      </tbody>\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.pagination : depth0), {"name":"if","hash":{},"fn":this.program(75, data, depths),"inverse":this.program(80, data, depths),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "   </table>\r\n</div>\r\n\r\n";
},"1":function(depth0,helpers,partials,data,depths) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "			<div class=\"dropdown pull-right\">\r\n				<span class=\"";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.FILTERS : depth0), {"name":"unless","hash":{},"fn":this.program(2, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "ct-app__tools-filter-con\"><a data-item-id=\"list_clearFilterTool\" class=\"ct-app__tools flaticon-filter-o flaticon-fliter-align pull-\" href=\"javascript:void(0)\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.toolTipforClearFilter || (depth0 != null ? depth0.toolTipforClearFilter : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"toolTipforClearFilter","hash":{},"data":data}) : helper)))
    + "\"><span class=\"flaticon_clearfilter\">x</span></a></span>\r\n			</div>\r\n          	<div class=\"dropdown pull-right\">\r\n           		<a href=\"javascript:void(0);\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">\r\n           			<span data-toggle=\"tooltip\" data-placement=\"top\" title=\""
    + escapeExpression(((helper = (helper = helpers.toolTipforFilter || (depth0 != null ? depth0.toolTipforFilter : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"toolTipforFilter","hash":{},"data":data}) : helper)))
    + "\" class=\"ct-app__tools flaticon-filter-o pull-right\"></span>\r\n           		</a>\r\n           		<ul class=\"dropdown-menu\" role=\"menu\" data-icn-action=\"filter\">\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.headerCols : depth0), {"name":"each","hash":{},"fn":this.program(4, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "			</ul>\r\n		</div>\r\n";
},"2":function(depth0,helpers,partials,data) {
  return "hidden ";
  },"4":function(depth0,helpers,partials,data,depths) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.FILTER_ENABLED : depth0), {"name":"if","hash":{},"fn":this.program(5, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"5":function(depth0,helpers,partials,data,depths) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, buffer = "			<li ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.SUBMENU : depth0), {"name":"if","hash":{},"fn":this.program(6, data, depths),"inverse":this.program(8, data, depths),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "data-colId=\""
    + escapeExpression(lambda((depth0 != null ? depth0.COL_ID : depth0), depth0))
    + "\" data-column-id=\""
    + escapeExpression(lambda((depth0 != null ? depth0.TH_INDEX : depth0), depth0))
    + "\"  data-xtype=\""
    + escapeExpression(lambda((depth0 != null ? depth0.DATA_TYPE : depth0), depth0))
    + "\" class=\"";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.SUBMENU : depth0), {"name":"if","hash":{},"fn":this.program(10, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " pull-left\"><a href=\"javascript:void(0);\">"
    + escapeExpression(lambda((depth0 != null ? depth0.LIST_DATA : depth0), depth0))
    + "</a>\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.SUBMENU : depth0), {"name":"if","hash":{},"fn":this.program(12, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "			</li>\r\n";
},"6":function(depth0,helpers,partials,data) {
  return "data-menus ";
  },"8":function(depth0,helpers,partials,data) {
  return "data-menu  ";
  },"10":function(depth0,helpers,partials,data) {
  return "dropdown-submenu";
  },"12":function(depth0,helpers,partials,data,depths) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, buffer = "               			<ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"filter-menu-"
    + escapeExpression(lambda((data && data.index), depth0))
    + "\">\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.SUBMENU : depth0), {"name":"each","hash":{},"fn":this.program(13, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "               			</ul>\r\n";
},"13":function(depth0,helpers,partials,data,depths) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "               						\r\n               					<li data-submenu=\""
    + escapeExpression(lambda((depth0 != null ? depth0.key : depth0), depth0))
    + "\" data-item-id=\"filter-submenu\" data-colId=\""
    + escapeExpression(lambda((depths[1] != null ? depths[1].COL_ID : depths[1]), depth0))
    + "\" data-xtype=\""
    + escapeExpression(lambda((depths[1] != null ? depths[1].DATA_TYPE : depths[1]), depth0))
    + "\"><a role=\"menuitem\" href=\"javascript:void(0)\">"
    + escapeExpression(lambda((depth0 != null ? depth0.display_name : depth0), depth0))
    + "</a></li>\r\n               						\r\n";
},"15":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, buffer = "         <div class=\"dropdown pull-right\" data-view=\"desktop\">\r\n               			<a href=\"javascript:void(0);\" data-icn-action=\"show-hide-columns\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">\r\n               				<span data-toggle=\"tooltip\" data-placement=\"auto\" data-original-title=\""
    + escapeExpression(lambda((depth0 != null ? depth0.toolTipforShowHide : depth0), depth0))
    + "\" class=\"ct-app__tools flaticon-levels pull-right\"></span>\r\n               			</a>\r\n               			<ul class=\"dropdown-menu\" role=\"menu\" data-action=\"show-hide-menu\">\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.headerCols : depth0), {"name":"each","hash":{},"fn":this.program(16, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "						</ul>\r\n          </div>\r\n";
},"16":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.contextHidden : depth0), {"name":"unless","hash":{},"fn":this.program(17, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"17":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, buffer = "					    		<li ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.MANDATORY : depth0), {"name":"if","hash":{},"fn":this.program(18, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "  data-colId=\""
    + escapeExpression(lambda((depth0 != null ? depth0.COL_ID : depth0), depth0))
    + "\" data-column-id=\""
    + escapeExpression(lambda((depth0 != null ? depth0.TH_INDEX : depth0), depth0))
    + "\"><a ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.HIDDEN : depth0), {"name":"unless","hash":{},"fn":this.program(20, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + " data-item-id=\"showHideCol\" href=\"javascript:void(0);\">"
    + escapeExpression(lambda((depth0 != null ? depth0.LIST_DATA : depth0), depth0))
    + "</a></li>\r\n";
},"18":function(depth0,helpers,partials,data) {
  return "hidden";
  },"20":function(depth0,helpers,partials,data) {
  return "class=\"flaticon-checked\"";
  },"22":function(depth0,helpers,partials,data,depths) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "         <tr>\r\n         	<td colspan=\""
    + escapeExpression(((helper = (helper = helpers.colLen || (depth0 != null ? depth0.colLen : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"colLen","hash":{},"data":data}) : helper)))
    + "\" class=\"group-column-container\">\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.FILTERS : depth0), {"name":"if","hash":{},"fn":this.program(23, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "         		\r\n         		<div class=\"pull-left\">\r\n         		\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.GROUPCOLS : depth0), {"name":"each","hash":{},"fn":this.program(26, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "		</div>\r\n         	</td>\r\n         </tr>\r\n";
},"23":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "         	<span class=\"pull-left ct-filter-badge\"> "
    + escapeExpression(((helper = (helper = helpers.labelFilterBy || (depth0 != null ? depth0.labelFilterBy : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"labelFilterBy","hash":{},"data":data}) : helper)))
    + "  </span>\r\n         		<div class=\"pull-left ct-badge ct-badge-tm\">\r\n         			<div class=\"ct-badge__container\">\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.FILTERS : depth0), {"name":"each","hash":{},"fn":this.program(24, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "         			</div>\r\n         			<div class=\"clearfix\"></div>\r\n         		\r\n         		</div>\r\n";
},"24":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "         					<div class=\"ct-badge__each ct-badge__each-tm\">\r\n  								<a href=\"javascript:void(0)\" class=\"ct-badge__txt\" data-item-id=\"ct-badge-txt\" data-datatype=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.cfg : depth0)) != null ? stack1.xType : stack1), depth0))
    + "\" data-searchType=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.cfg : depth0)) != null ? stack1.searchType : stack1), depth0))
    + "\" data-column=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.cfg : depth0)) != null ? stack1.column : stack1), depth0))
    + "\"><strong>"
    + escapeExpression(lambda((depth0 != null ? depth0.label : depth0), depth0))
    + "</strong> "
    + escapeExpression(lambda((depth0 != null ? depth0.value : depth0), depth0))
    + "</a>\r\n  								<a href=\"javascript:void(0)\" data-filter-id=\""
    + escapeExpression(lambda((depth0 != null ? depth0.ID : depth0), depth0))
    + "\" class=\"ct-badge__action\">x</a>\r\n							</div>\r\n";
},"26":function(depth0,helpers,partials,data,depths) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "		<span class=\"pull-left ct-filter-badge\"> "
    + escapeExpression(lambda((depths[1] != null ? depths[1].labelGroupBy : depths[1]), depth0))
    + "  </span>\r\n			<div class=\"ct-badge__each ct-badge__each-tm\">\r\n			\r\n				<a href=\"javascript:void(0)\" class=\"ct-badge__txt\" data-item-id=\"ct-badge-txt\">"
    + escapeExpression(lambda((depth0 != null ? depth0.LBL : depth0), depth0))
    + "</a>\r\n				<a href=\"javascript:void(0)\" data-group-id=\""
    + escapeExpression(lambda((depth0 != null ? depth0.COLID : depth0), depth0))
    + "\" class=\"ct-badge__action\">\r\n				  x\r\n				</a>\r\n			</div>\r\n";
},"28":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "\r\n         	<th class=\"action-col\">"
    + escapeExpression(((helper = (helper = helpers.CONTEXT_COLUMN || (depth0 != null ? depth0.CONTEXT_COLUMN : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"CONTEXT_COLUMN","hash":{},"data":data}) : helper)))
    + "</th>\r\n         ";
},"30":function(depth0,helpers,partials,data) {
  return "         	<th class=\"text-center rowselection-col\" data-ct-input=\"rowselection-col\"><span><input type=\"checkbox\" data-item-checker=\"true\"></span></th>\r\n";
  },"32":function(depth0,helpers,partials,data,depths) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, buffer = "      		\r\n            <th ";
  stack1 = helpers['if'].call(depth0, (depths[1] != null ? depths[1].GROUPING_ENABLED : depths[1]), {"name":"if","hash":{},"fn":this.program(33, data, depths),"inverse":this.program(35, data, depths),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " class=\""
    + escapeExpression(lambda((depth0 != null ? depth0.cssClass : depth0), depth0))
    + "\" data-thindex=\""
    + escapeExpression(lambda((depth0 != null ? depth0.TH_INDEX : depth0), depth0))
    + "\" data-column-linked=\""
    + escapeExpression(lambda((depth0 != null ? depth0.COL_ID : depth0), depth0))
    + "\" ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.PARENT_ID : depth0), {"name":"if","hash":{},"fn":this.program(38, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += ">\r\n            	<span data-lbl=\""
    + escapeExpression(lambda((depth0 != null ? depth0.COL_ID : depth0), depth0))
    + "\" data-fieldName=\""
    + escapeExpression(lambda((depth0 != null ? depth0.LIST_DATA : depth0), depth0))
    + "\"></span>\r\n            	<div data-attr=\"listColumns\" ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.GROUPABLE : depth0), {"name":"if","hash":{},"fn":this.program(40, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.COLUMNORDER : depth0), {"name":"if","hash":{},"fn":this.program(42, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " class=\"ct-grid-header pull-left\">\r\n               		<div class=\"_header_title\">\r\n               		<span data-lbl=\""
    + escapeExpression(lambda((depth0 != null ? depth0.COL_ID : depth0), depth0))
    + "\" class=\"ct-listview__header-title\">"
    + escapeExpression(lambda((depth0 != null ? depth0.LIST_DATA : depth0), depth0))
    + "</span>\r\n               		</div>\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.SORTABLE : depth0), {"name":"if","hash":{},"fn":this.program(44, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "               	</div>\r\n				<div class=\"ct-listview__header-action\">\r\n	         \r\n	              \r\n				\r\n               		\r\n            </th>\r\n      \r\n";
},"33":function(depth0,helpers,partials,data) {
  return " data-groupdrag=\"listGroupDrag\" data-groupable=\"true\" ";
  },"35":function(depth0,helpers,partials,data) {
  var stack1;
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.FLD_COL_ORDER_IND : depth0), {"name":"if","hash":{},"fn":this.program(36, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { return stack1; }
  else { return ''; }
  },"36":function(depth0,helpers,partials,data) {
  return "data-attr=\"listColumnsDrag\" data-colorder=\"true\" data-draggable ";
  },"38":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "data-parent-id=\""
    + escapeExpression(lambda((depth0 != null ? depth0.PARENT_ID : depth0), depth0))
    + "\" ";
},"40":function(depth0,helpers,partials,data) {
  return "data-groupable=\"true\" ";
  },"42":function(depth0,helpers,partials,data) {
  return "data-colorder=\"true\"";
  },"44":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "               		 <div class=\"_sort_icon\">\r\n               			<span data-action=\"column-sorter\" data-toggle=\"tooltip\" data-placement=\"auto\" data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.toolTipforSorting || (depth0 != null ? depth0.toolTipforSorting : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"toolTipforSorting","hash":{},"data":data}) : helper)))
    + "\" class=\"sort-ind ct-app__tools ";
  stack1 = ((helpers['canvas-sorting'] || (depth0 && depth0['canvas-sorting']) || helperMissing).call(depth0, (depth0 != null ? depth0.COL_ID : depth0), {"name":"canvas-sorting","hash":{},"fn":this.program(45, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\"></span>\r\n               		</div>\r\n";
},"45":function(depth0,helpers,partials,data) {
  return "default-class";
  },"47":function(depth0,helpers,partials,data,depths) {
  var stack1, buffer = "         ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.GROUPING_ENABLED : depth0), {"name":"if","hash":{},"fn":this.program(48, data, depths),"inverse":this.program(62, data, depths),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"48":function(depth0,helpers,partials,data,depths) {
  var stack1, buffer = "	  \r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.groupedRows : depth0), {"name":"each","hash":{},"fn":this.program(49, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "         ";
},"49":function(depth0,helpers,partials,data,depths) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "";
  stack1 = ((helpers.condObj || (depth0 && depth0.condObj) || helperMissing).call(depth0, depth0, {"name":"condObj","hash":{},"fn":this.program(50, data, depths),"inverse":this.program(60, data, depths),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"50":function(depth0,helpers,partials,data,depths) {
  var stack1, buffer = "";
  stack1 = helpers.each.call(depth0, depth0, {"name":"each","hash":{},"fn":this.program(51, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"51":function(depth0,helpers,partials,data,depths) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, buffer = "         			<tr class=\"hidden\" data-grid-records data-grid-rowIndex=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0['0'] : depth0)) != null ? stack1.rowIndex : stack1), depth0))
    + "\">\r\n";
  stack1 = helpers['if'].call(depth0, (depths[4] != null ? depths[4].ROWSELECTION : depths[4]), {"name":"if","hash":{},"fn":this.program(52, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers.each.call(depth0, depth0, {"name":"each","hash":{},"fn":this.program(54, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "		         		</tr>\r\n";
},"52":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "			         	<td class=\""
    + escapeExpression(lambda((depth0 != null ? depth0.cssClass : depth0), depth0))
    + " text-center ct-rowselection\" data-item-data=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0['0'] : depth0)) != null ? stack1.key : stack1), depth0))
    + " data-grid-record\">\r\n			         		<span><input type=\"checkbox\" data-item-checker=\"true\" /></span>\r\n			         	</td>\r\n";
},"54":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.enableContext : depth0), {"name":"if","hash":{},"fn":this.program(55, data),"inverse":this.program(58, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"55":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "							<td class=\""
    + escapeExpression(lambda((depth0 != null ? depth0.cssClass : depth0), depth0))
    + " text-center\" data-item-data=\""
    + escapeExpression(lambda((depth0 != null ? depth0.key : depth0), depth0))
    + "\">";
  stack1 = ((helpers['canvas-context-icon'] || (depth0 && depth0['canvas-context-icon']) || helperMissing).call(depth0, "flaticon-bullet_list1", (depth0 != null ? depth0.enableContext : depth0), {"name":"canvas-context-icon","hash":{},"fn":this.program(56, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</td>\r\n";
},"56":function(depth0,helpers,partials,data) {
  return "";
},"58":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, buffer = "						\r\n				            <td class=\""
    + escapeExpression(lambda((depth0 != null ? depth0.cssClass : depth0), depth0))
    + "\" data-item-data=\""
    + escapeExpression(lambda((depth0 != null ? depth0.key : depth0), depth0))
    + "\">\r\n				               <span>";
  stack1 = lambda((depth0 != null ? depth0.rowValue : depth0), depth0);
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n				            </td>\r\n";
},"60":function(depth0,helpers,partials,data,depths) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, buffer = "					<tr data-grouped-header=\"true\">\r\n	         			<td colspan=\""
    + escapeExpression(lambda((depths[2] != null ? depths[2].colLen : depths[2]), depth0))
    + "\">\r\n	         				";
  stack1 = lambda(depth0, depth0);
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n	         			</td>\r\n         		</tr>\r\n";
},"62":function(depth0,helpers,partials,data,depths) {
  var stack1, buffer = "	 \r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.rows : depth0), {"name":"each","hash":{},"fn":this.program(63, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"63":function(depth0,helpers,partials,data,depths) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, buffer = "         <tr data-grid-records data-grid-rowIndex=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0['0'] : depth0)) != null ? stack1.rowIndex : stack1), depth0))
    + "\">\r\n         <!-- ";
  stack1 = helpers['if'].call(depth0, (depths[1] != null ? depths[1].CONTEXT_COLUMN : depths[1]), {"name":"if","hash":{},"fn":this.program(64, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " -->\r\n";
  stack1 = helpers['if'].call(depth0, (depths[1] != null ? depths[1].ROWSELECTION : depths[1]), {"name":"if","hash":{},"fn":this.program(66, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers.each.call(depth0, depth0, {"name":"each","hash":{},"fn":this.program(68, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "         </tr>\r\n";
},"64":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "\r\n         		<td data-column=\"paging-action\" class=\""
    + escapeExpression(lambda((depth0 != null ? depth0.cssClass : depth0), depth0))
    + " text-center\" data-item-data=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0['0'] : depth0)) != null ? stack1.key : stack1), depth0))
    + "\">\r\n         			<div class=\"btn-group\">\r\n         			<span data-toggle=\"tooltip\" class=\"\" data-placement=\"right\" data-original-title=\"Double Click Action\">\r\n					    <span class=\"flaticon-tables-grid-new ct-detailaction-fld\" data-item-id=\"ct-detailaction-fld\" aria-hidden=\"true\"></span>\r\n				    </span> \r\n				    \r\n					<span class=\"ct-listview__context-menu\" data-context-paging=\"true\">\r\n						<span data-icn-action=\"context\" data-placement=\"right\" data-toggle=\"tooltip\" class=\"\" data-original-title=\"Context Actions\">\r\n					  	<span class=\"flaticon-bullet_list1 ct-contextaction-fld\" data-item-id=\"ct-contextaction-fld\" aria-hidden=\"true\"></span>\r\n					  	<div class=\"ct-dropdown\"></div>\r\n					</span>\r\n					</span> \r\n					</div>\r\n         		</td>\r\n         	";
},"66":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "         	<td class=\""
    + escapeExpression(lambda((depth0 != null ? depth0.cssClass : depth0), depth0))
    + " text-center ct-rowselection\" data-item-data=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0['0'] : depth0)) != null ? stack1.key : stack1), depth0))
    + "\">\r\n         		<span><input type=\"checkbox\" data-item-checker=\"true\" /></span>\r\n         	</td>\r\n";
},"68":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.enableContext : depth0), {"name":"if","hash":{},"fn":this.program(69, data),"inverse":this.program(71, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"69":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "					<td data-grid-record class=\""
    + escapeExpression(lambda((depth0 != null ? depth0.cssClass : depth0), depth0))
    + " text-center\" data-item-data=\""
    + escapeExpression(lambda((depth0 != null ? depth0.key : depth0), depth0))
    + "\">";
  stack1 = ((helpers['canvas-context-icon'] || (depth0 && depth0['canvas-context-icon']) || helperMissing).call(depth0, "flaticon-bullet_list1", (depth0 != null ? depth0.enableContext : depth0), {"name":"canvas-context-icon","hash":{},"fn":this.program(56, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</td>\r\n";
},"71":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, buffer = "            <td data-grid-record class=\""
    + escapeExpression(lambda((depth0 != null ? depth0.cssClass : depth0), depth0))
    + "\" data-item-data=\""
    + escapeExpression(lambda((depth0 != null ? depth0.key : depth0), depth0))
    + "\">\r\n               <span>";
  stack1 = lambda((depth0 != null ? depth0.rowValue : depth0), depth0);
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n            </td>\r\n";
},"73":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "	  	<tr class=\"no-data\">\r\n	  		<td colspan=\""
    + escapeExpression(((helper = (helper = helpers.colLen || (depth0 != null ? depth0.colLen : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"colLen","hash":{},"data":data}) : helper)))
    + "\"><span class=\"text-info\">"
    + escapeExpression(((helper = (helper = helpers.NODATA || (depth0 != null ? depth0.NODATA : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"NODATA","hash":{},"data":data}) : helper)))
    + "</span></td>\r\n	  	</tr>\r\n";
},"75":function(depth0,helpers,partials,data,depths) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "      <tfoot>\r\n      	<tr>\r\n      		<td colspan=\""
    + escapeExpression(((helper = (helper = helpers.colLen || (depth0 != null ? depth0.colLen : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"colLen","hash":{},"data":data}) : helper)))
    + "\">\r\n      			<div class=\"ct-pagination\">\r\n					<ul class=\"pagination\" data-pagination=\"true\">\r\n						<li class=\"";
  stack1 = ((helpers['canvas-paging'] || (depth0 && depth0['canvas-paging']) || helperMissing).call(depth0, (depth0 != null ? depth0.currentPage : depth0), "previous", {"name":"canvas-paging","hash":{},"fn":this.program(56, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\">\r\n					      <a data-paginate=\"previous\" href=\"javascript:void(0)\" aria-label=\"Previous\" data-page=\"1\">\r\n					        <span aria-hidden=\"true\">&lt;&lt;</span>\r\n					      </a>\r\n					    </li>\r\n					    <li class=\"";
  stack1 = ((helpers['canvas-paging'] || (depth0 && depth0['canvas-paging']) || helperMissing).call(depth0, (depth0 != null ? depth0.currentPage : depth0), "previous", {"name":"canvas-paging","hash":{},"fn":this.program(56, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\">\r\n					      <a data-paginate=\"previous\" href=\"javascript:void(0)\" aria-label=\"Previous\" data-page=\""
    + escapeExpression(((helper = (helper = helpers.previousPage || (depth0 != null ? depth0.previousPage : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"previousPage","hash":{},"data":data}) : helper)))
    + "\">\r\n					        <span aria-hidden=\"true\">&lt;</span>\r\n					      </a>\r\n					    </li>\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.pagination : depth0), {"name":"each","hash":{},"fn":this.program(76, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "					    <li class=\"";
  stack1 = ((helpers['canvas-paging'] || (depth0 && depth0['canvas-paging']) || helperMissing).call(depth0, (depth0 != null ? depth0.currentPage : depth0), "next", {"name":"canvas-paging","hash":{},"fn":this.program(56, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\">\r\n					      <a data-paginate=\"next\" href=\"javascript:void(0)\" aria-label=\"Next\" data-page=\""
    + escapeExpression(((helper = (helper = helpers.nextPage || (depth0 != null ? depth0.nextPage : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"nextPage","hash":{},"data":data}) : helper)))
    + "\">\r\n					        <span aria-hidden=\"true\">&gt;</span>\r\n					      </a>\r\n					    </li>\r\n					    <li class=\"";
  stack1 = ((helpers['canvas-paging'] || (depth0 && depth0['canvas-paging']) || helperMissing).call(depth0, (depth0 != null ? depth0.currentPage : depth0), "next", {"name":"canvas-paging","hash":{},"fn":this.program(56, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\">\r\n					      <a data-paginate=\"next\" href=\"javascript:void(0)\" aria-label=\"last\" data-page=\""
    + escapeExpression(((helper = (helper = helpers.totalPages || (depth0 != null ? depth0.totalPages : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"totalPages","hash":{},"data":data}) : helper)))
    + "\">\r\n					        <span aria-hidden=\"true\">&gt;&gt;</span>\r\n					      </a>\r\n					    </li>\r\n					  </ul>\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.pagingRecords : depth0), {"name":"if","hash":{},"fn":this.program(78, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "				</div>\r\n      		</td>\r\n      	</tr>\r\n      </tfoot>\r\n";
},"76":function(depth0,helpers,partials,data,depths) {
  var stack1, helperMissing=helpers.helperMissing, lambda=this.lambda, escapeExpression=this.escapeExpression, buffer = "					    	<li class=\"";
  stack1 = ((helpers['canvas-paging'] || (depth0 && depth0['canvas-paging']) || helperMissing).call(depth0, (depths[1] != null ? depths[1].currentPage : depths[1]), depth0, {"name":"canvas-paging","hash":{},"fn":this.program(56, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\"><a href=\"javascript:void(0);\" data-page=\""
    + escapeExpression(lambda(depth0, depth0))
    + "\">"
    + escapeExpression(lambda(depth0, depth0))
    + "</a></li>\r\n";
},"78":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "					 	<span class=\"text-primary pull-right\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.pagingRecords : depth0)) != null ? stack1.displaying : stack1), depth0))
    + " "
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.pagingRecords : depth0)) != null ? stack1.from : stack1), depth0))
    + " - "
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.pagingRecords : depth0)) != null ? stack1.to : stack1), depth0))
    + " "
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.pagingRecords : depth0)) != null ? stack1.of : stack1), depth0))
    + " "
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.pagingRecords : depth0)) != null ? stack1.total : stack1), depth0))
    + "</span>\r\n";
},"80":function(depth0,helpers,partials,data) {
  var stack1, buffer = "	     	      \r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.pagingRecords : depth0), {"name":"if","hash":{},"fn":this.program(81, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "	     \r\n";
},"81":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, lambda=this.lambda;
  return "		       <tfoot>\r\n		      	<tr>\r\n		      		<td colspan=\""
    + escapeExpression(((helper = (helper = helpers.colLen || (depth0 != null ? depth0.colLen : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"colLen","hash":{},"data":data}) : helper)))
    + "\">\r\n					<span class=\"text-primary pull-right\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.pagingRecords : depth0)) != null ? stack1.displaying : stack1), depth0))
    + " "
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.pagingRecords : depth0)) != null ? stack1.from : stack1), depth0))
    + " - "
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.pagingRecords : depth0)) != null ? stack1.total : stack1), depth0))
    + " "
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.pagingRecords : depth0)) != null ? stack1.of : stack1), depth0))
    + " "
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.pagingRecords : depth0)) != null ? stack1.total : stack1), depth0))
    + "</span>\r\n					</td>\r\n				</tr>\r\n				 </tfoot>\r\n";
},"useData":true,"useDepths":true});
  templates['listViewTmpl'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "\r\n<script id=\"listview_mobile_table\" type=\"text/x-handlebars-script\">\r\n\r\n<script id=\"listview_table\" type=\"text/x-handlebars-script\">\r\n\r\n</script><script id=\"listFilters_amount\" type=\"text/x-handlebars-script\">\r\n\r\n</script><script id=\"listFilters_date\" type=\"text/x-handlebars-script\">\r\n\r\n</script><script id=\"listFilters_string\" type=\"text/x-handlebars-script\">\r\n\r\n</script>";
  },"useData":true});
  templates['loadMore'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<tr class=\"load-more\" data-item-id=\"load-more\">\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.IS_PAGING : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(3, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</tr>";
},"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "	<td colspan=\""
    + escapeExpression(((helper = (helper = helpers.colLen || (depth0 != null ? depth0.colLen : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"colLen","hash":{},"data":data}) : helper)))
    + "\" class=\"text-center\" data-item-id=\"load_more\">\r\n		<span class=\"flaticon-more-icon2 flaticon-load\">Load More</span>\r\n	</td> \r\n";
},"3":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "	<td colspan=\""
    + escapeExpression(((helper = (helper = helpers.colLen || (depth0 != null ? depth0.colLen : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"colLen","hash":{},"data":data}) : helper)))
    + "\">\r\n		<ul class=\"pager ct-liveview_navigator\">\r\n			<li class=\"\" data-item-id=\"load_prev_parent\">\r\n				<a href=\"javascript:void(0);\" class=\"pull-left load_prev\" data-item-id=\"load_prev\">Previous</a>\r\n			</li>\r\n			<li data-item-id=\"load_next_parent\">\r\n				<a href=\"javascript:void(0);\" class=\"pull-right load_next\" data-item-id=\"load_next\">Next</a>\r\n			</li>\r\n		</ul>\r\n	</td> \r\n";
},"useData":true});
  templates['LRMenu'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class=\"ct-LRMenu\">\r\n	<div data-item-id=\"ct-treeView-menu\" class=\"col-md-2\">\r\n		<ul class='nav nav-list-main'>\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.data : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "		</ul>\r\n	</div>\r\n	<div id=\"subworkspaceContainer\" class=\"col-md-10\"></div>\r\n</div>";
},"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, lambda=this.lambda, buffer = "			<li>\r\n				<label class=\"nav-toggle nav-header\"> \r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.CHILDREN : depth0), {"name":"if","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "					<span data-item-id='ct-tree_name' data-item-value='"
    + escapeExpression(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"text","hash":{},"data":data}) : helper)))
    + "' data-layout-id=\""
    + escapeExpression(lambda((depth0 != null ? depth0.ID : depth0), depth0))
    + "\" data-layout-index=\""
    + escapeExpression(lambda((depth0 != null ? depth0.INDEX : depth0), depth0))
    + "\">\r\n						<a href=\"javascript:void(0)\">"
    + escapeExpression(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"text","hash":{},"data":data}) : helper)))
    + "</a>\r\n					</span>\r\n				</label>\r\n				<ul class=\"nav nav-list nav-left-ml\">\r\n";
  stack1 = ((helpers.recursive || (depth0 && depth0.recursive) || helperMissing).call(depth0, (depth0 != null ? depth0.CHILDREN : depth0), {"name":"recursive","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "				</ul>\r\n			</li> \r\n";
},"2":function(depth0,helpers,partials,data) {
  return "					<span data-item-id='ct-tree_toggle' class=\"flaticon-collapse flaticon-leftmenu-expclps\"></span> \r\n";
  },"4":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, lambda=this.lambda, buffer = "					<li class=''>\r\n						<label class=\"nav-toggle nav-header\">\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.CHILDREN : depth0), {"name":"if","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "							<span data-item-id='ct-tree_name' data-item-value='"
    + escapeExpression(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"text","hash":{},"data":data}) : helper)))
    + "' data-layout-id=\""
    + escapeExpression(lambda((depth0 != null ? depth0.ID : depth0), depth0))
    + "\" data-layout-index=\""
    + escapeExpression(lambda((depth0 != null ? depth0.INDEX : depth0), depth0))
    + "\">\r\n								<a href=\"javascript:void(0)\">"
    + escapeExpression(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"text","hash":{},"data":data}) : helper)))
    + "</a>\r\n							</span>\r\n						</label> \r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.CHILDREN : depth0), {"name":"if","hash":{},"fn":this.program(7, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "					</li> \r\n";
},"5":function(depth0,helpers,partials,data) {
  return "							<span data-item-id='ct-tree_toggle' class=\"nav-toggle-icon flaticon-collapse flaticon-leftmenu-expclps\"></span> \r\n";
  },"7":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "						<ul class='nav nav-list nav-left-ml'>";
  stack1 = ((helpers.recursive || (depth0 && depth0.recursive) || helperMissing).call(depth0, (depth0 != null ? depth0.CHILDREN : depth0), {"name":"recursive","hash":{},"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</ul> \r\n";
},"useData":true});
  templates['mapview'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div data-item-id=\"map_container\" class=\"embed-responsive containerCls embed-responsive-4by3\">\r\n	<div class=\"embed-responsive-item col-md-6 map-holderCls\"></div>\r\n</div>\r\n";
},"useData":true});
  templates['menuLayer'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,depths) {
  var stack1, buffer = "<div class='ct-global-menu' data-item-id='ct-menuBar'>\r\n	<div class=\"container-fluid\">\r\n		<div class=\"navbar-header\">\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.child_nodes : depth0), {"name":"each","hash":{},"fn":this.program(1, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "		</div>\r\n	</div>\r\n	<div class=\"clearfix\"></div>\r\n</div>";
},"1":function(depth0,helpers,partials,data,depths) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "			<div class='ct-global-menu__each ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.block_position : depth0), "LEFT", {"name":"condchk","hash":{},"fn":this.program(2, data, depths),"inverse":this.program(4, data, depths),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "'>\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.child_nodes : depth0), {"name":"if","hash":{},"fn":this.program(6, data, depths),"inverse":this.program(14, data, depths),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "			</div>\r\n";
},"2":function(depth0,helpers,partials,data) {
  return " pull-left ";
  },"4":function(depth0,helpers,partials,data) {
  return " pull-right ";
  },"6":function(depth0,helpers,partials,data,depths) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "				<div class='dropdown ct-dropdown'>\r\n					<a class='dropdown-toggle' data-item-id='"
    + escapeExpression(((helper = (helper = helpers.item_id || (depth0 != null ? depth0.item_id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"item_id","hash":{},"data":data}) : helper)))
    + "' data-target='#' href='javascript:void(0)' data-toggle='dropdown' aria-expanded='false'> \r\n						<span class=''> ";
  stack1 = ((helpers['display-name'] || (depth0 && depth0['display-name']) || helperMissing).call(depth0, ((stack1 = (data && data.root)) && stack1.bundle_key), (depth0 != null ? depth0.display_key_nm : depth0), {"name":"display-name","hash":{},"fn":this.program(7, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += " </span> \r\n						<span class='flaticon-down-arrow2'></span>\r\n					</a>\r\n					<ul class='dropdown-menu ";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.block_position : depth0), "LEFT", {"name":"condchk","hash":{},"fn":this.program(2, data, depths),"inverse":this.program(4, data, depths),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += " ct-dropdown-menu' data-toggle='dropdown' role='menu' aria-labelledby='"
    + escapeExpression(((helper = (helper = helpers.item_id || (depth0 != null ? depth0.item_id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"item_id","hash":{},"data":data}) : helper)))
    + "'>\r\n						";
  stack1 = ((helpers.recursive || (depth0 && depth0.recursive) || helperMissing).call(depth0, (depth0 != null ? depth0.child_nodes : depth0), {"name":"recursive","hash":{},"fn":this.program(9, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "					</ul>\r\n				</div>\r\n				";
},"7":function(depth0,helpers,partials,data) {
  return "";
},"9":function(depth0,helpers,partials,data,depths) {
  var stack1, helperMissing=helpers.helperMissing, buffer = " ";
  stack1 = ((helpers.updateObjValue || (depth0 && depth0.updateObjValue) || helperMissing).call(depth0, depth0, "block_position", (depths[1] != null ? depths[1].block_position : depths[1]), {"name":"updateObjValue","hash":{},"fn":this.program(7, data, depths),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += " ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.child_nodes : depth0), {"name":"if","hash":{},"fn":this.program(10, data, depths),"inverse":this.program(12, data, depths),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "						</li> \r\n";
},"10":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n						<li class='dropdown dropdown-submenu ct-dropdown'>\r\n						<a class='dropdown-toggle' data-item-id='"
    + escapeExpression(((helper = (helper = helpers.item_id || (depth0 != null ? depth0.item_id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"item_id","hash":{},"data":data}) : helper)))
    + "' data-target='#' href='javascript:void(0)' data-toggle='dropdown' aria-expanded='false'> \r\n							<span class=''> ";
  stack1 = ((helpers['display-name'] || (depth0 && depth0['display-name']) || helperMissing).call(depth0, ((stack1 = (data && data.root)) && stack1.bundle_key), (depth0 != null ? depth0.display_key_nm : depth0), {"name":"display-name","hash":{},"fn":this.program(7, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += " </span>\r\n						</a>\r\n							<ul class='dropdown-menu pull-right ct-dropdown-menu' role='menu' data-toggle='dropdown' aria-labelledby='"
    + escapeExpression(((helper = (helper = helpers.item_id || (depth0 != null ? depth0.item_id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"item_id","hash":{},"data":data}) : helper)))
    + "'>";
  stack1 = ((helpers.recursive || (depth0 && depth0.recursive) || helperMissing).call(depth0, (depth0 != null ? depth0.child_nodes : depth0), {"name":"recursive","hash":{},"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</ul> \r\n";
},"12":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = "							";
  stack1 = ((helpers.updateMenuData || (depth0 && depth0.updateMenuData) || helperMissing).call(depth0, depth0, {"name":"updateMenuData","hash":{},"fn":this.program(7, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n						<li class=''>\r\n							<a data-item-id='"
    + escapeExpression(((helper = (helper = helpers.item_id || (depth0 != null ? depth0.item_id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"item_id","hash":{},"data":data}) : helper)))
    + "'>\r\n								<span class=''>";
  stack1 = ((helpers['display-name'] || (depth0 && depth0['display-name']) || helperMissing).call(depth0, ((stack1 = (data && data.root)) && stack1.bundle_key), (depth0 != null ? depth0.display_key_nm : depth0), {"name":"display-name","hash":{},"fn":this.program(7, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n							</a> \r\n";
},"14":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression, buffer = " ";
  stack1 = ((helpers.updateMenuData || (depth0 && depth0.updateMenuData) || helperMissing).call(depth0, depth0, {"name":"updateMenuData","hash":{},"fn":this.program(7, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n				<div>\r\n					<a class='' data-item-id='"
    + escapeExpression(((helper = (helper = helpers.item_id || (depth0 != null ? depth0.item_id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"item_id","hash":{},"data":data}) : helper)))
    + "'> \r\n						<span class=''>";
  stack1 = ((helpers['display-name'] || (depth0 && depth0['display-name']) || helperMissing).call(depth0, ((stack1 = (data && data.root)) && stack1.bundle_key), (depth0 != null ? depth0.display_key_nm : depth0), {"name":"display-name","hash":{},"fn":this.program(7, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n					</a>\r\n				</div>\r\n";
},"useData":true,"useDepths":true});
  templates['modalWindow'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\"modal fade ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.fullscreenInd : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "  ct-modal "
    + escapeExpression(((helper = (helper = helpers.modalClass || (depth0 != null ? depth0.modalClass : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"modalClass","hash":{},"data":data}) : helper)))
    + "\" data-backdrop=\"static\" data-keyboard=\"false\" data-item-id=\"modal-"
    + escapeExpression(((helper = (helper = helpers.index || (depth0 != null ? depth0.index : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"index","hash":{},"data":data}) : helper)))
    + "\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\">\r\n	<div class=\"modal-dialog\">\r\n		<div class=\"modal-content\" data-item-id='ct-modal-content'>\r\n			<div class=\"modal-header\" data-item-id='ct-modal-header'></div>\r\n			<button type=\"button\" class=\"flaticon-close flaticon-modal-close\" data-dismiss=\"modal-"
    + escapeExpression(((helper = (helper = helpers.index || (depth0 != null ? depth0.index : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"index","hash":{},"data":data}) : helper)))
    + "\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\"Close\" aria-hidden=\"true\"></button>\r\n			<div data-content-id=\"modal-content-"
    + escapeExpression(((helper = (helper = helpers.index || (depth0 != null ? depth0.index : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"ct-modal-content__container\"></div>\r\n		</div>\r\n	</div>\r\n</div>\r\n";
},"1":function(depth0,helpers,partials,data) {
  return "modal-fullscreen force-fullscreen";
  },"useData":true});
  templates['portletContainerTemplate'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div data-item-id=\"portlet\" class=\""
    + escapeExpression(((helper = (helper = helpers.WIDGET_CLASS || (depth0 != null ? depth0.WIDGET_CLASS : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WIDGET_CLASS","hash":{},"data":data}) : helper)))
    + " ct-app ct-app-tm \">\r\n	";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.HEADER_REQ : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " \r\n	<div data-item-id=\"portlet-body\" data-item-type=";
  stack1 = ((helpers.condchk || (depth0 && depth0.condchk) || helperMissing).call(depth0, (depth0 != null ? depth0.CONTAINER_FLAG : depth0), "N", {"name":"condchk","hash":{},"fn":this.program(3, data),"inverse":this.program(5, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += " class=\"row "
    + escapeExpression(((helper = (helper = helpers.WIDGET_BODY_CLASS || (depth0 != null ? depth0.WIDGET_BODY_CLASS : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WIDGET_BODY_CLASS","hash":{},"data":data}) : helper)))
    + " ct-app__content\" ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.COLLAPSED_IND : depth0), {"name":"if","hash":{},"fn":this.program(7, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += ">\r\n		 ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.GLOBAL_DATE_FILTER : depth0), {"name":"if","hash":{},"fn":this.program(9, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "   ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.TBAR_REQD : depth0), {"name":"if","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "  \r\n		<div data-item-id=\"portlet-main-content\" name=\"content-panel\" class=\"col-md-12 "
    + escapeExpression(((helper = (helper = helpers.WIDGET_MAIN_CONTENT_CLASS || (depth0 != null ? depth0.WIDGET_MAIN_CONTENT_CLASS : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WIDGET_MAIN_CONTENT_CLASS","hash":{},"data":data}) : helper)))
    + " ct-app__content\"></div>\r\n	</div>\r\n	 ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.WGT_DETL_MSG_IND : depth0), {"name":"if","hash":{},"fn":this.program(13, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.WGT_FOOTER_IND : depth0), {"name":"if","hash":{},"fn":this.program(16, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n</div>\r\n";
},"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return " \r\n	<div data-item-id=\"portlet-header\" class=\""
    + escapeExpression(((helper = (helper = helpers.WIDGET_HEADER_CLASS || (depth0 != null ? depth0.WIDGET_HEADER_CLASS : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WIDGET_HEADER_CLASS","hash":{},"data":data}) : helper)))
    + " ct-app__header ct-app__header-tm ct-app__panel-header-bg\"></div>\r\n	 ";
},"3":function(depth0,helpers,partials,data) {
  return " \"SINGULAR\" ";
  },"5":function(depth0,helpers,partials,data) {
  return " \"MULTIAPP\" ";
  },"7":function(depth0,helpers,partials,data) {
  return " style=\"display: none;\"";
  },"9":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "\r\n		<div data-item-id=\"portlet-global-date\" class=\""
    + escapeExpression(((helper = (helper = helpers.WIDGET_GLOBAL_DATE_CLASS || (depth0 != null ? depth0.WIDGET_GLOBAL_DATE_CLASS : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WIDGET_GLOBAL_DATE_CLASS","hash":{},"data":data}) : helper)))
    + "\"></div>\r\n		";
},"11":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "\r\n		<div data-item-id=\"portlet-tbar\" class=\"col-md-3 "
    + escapeExpression(((helper = (helper = helpers.WIDGET_TBAR_CLASS || (depth0 != null ? depth0.WIDGET_TBAR_CLASS : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WIDGET_TBAR_CLASS","hash":{},"data":data}) : helper)))
    + "\"></div>\r\n		";
},"13":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = " \r\n	<div data-item-id=\"portlet-detail\" class=\""
    + escapeExpression(((helper = (helper = helpers.WIDGET_DETL_MSG_CLASS || (depth0 != null ? depth0.WIDGET_DETL_MSG_CLASS : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WIDGET_DETL_MSG_CLASS","hash":{},"data":data}) : helper)))
    + "\" ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.COLLAPSED_IND : depth0), {"name":"if","hash":{},"fn":this.program(14, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + ">\r\n		<div data-item-id=\"portlet-detail-message\" class=\"ct-detail-message\"></div>\r\n	</div>\r\n	 ";
},"14":function(depth0,helpers,partials,data) {
  return " hidden ";
  },"16":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = " \r\n	<div data-item-id=\"portlet-footer\" class=\""
    + escapeExpression(((helper = (helper = helpers.WIDGET_FOOTER_CLASS || (depth0 != null ? depth0.WIDGET_FOOTER_CLASS : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WIDGET_FOOTER_CLASS","hash":{},"data":data}) : helper)))
    + "\" ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.COLLAPSED_IND : depth0), {"name":"if","hash":{},"fn":this.program(7, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "></div>\r\n	 ";
},"useData":true});
  templates['portletFooterTemplate'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\r\n<div class=\"row\">\r\n	<div data-item-id=\"leftBBARContainer\" class=\"col-md-6 leftBBarBtnCont\">\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.LEFT_BBAR_BUTTONS : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "	</div>\r\n	 \r\n	<div data-item-id=\"rightBBARContainer\" class=\"col-md-6 rightBBarBtnCont\">\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.RIGHT_BBAR_BUTTONS : depth0), {"name":"each","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "	</div>\r\n</div>\r\n\r\n   <div class=\"row\">\r\n   \r\n	<div class=\"ct__btn_bbarCont pull-right\">\r\n	<div class=\"tool\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.TOOLTIP_PIN || (depth0 != null ? depth0.TOOLTIP_PIN : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOLTIP_PIN","hash":{},"data":data}) : helper)))
    + "\">\r\n		<div class=\"dropdown ct-dropdown\">\r\n			<a data-target=\"#\" href=\"javascript:void(0)\" data-toggle=\"dropdown\" role=\"button\" aria-expanded=\"true\"> \r\n								<span class=\"flaticon-more-icon flaticon-Bbar-moreBtn\"></span>\r\n			</a>\r\n			<ul class=\"dropdown-menu pull-right ct-dropdown-menu ct-portlet_icon_dropdown\">\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.LEFT_BBAR_BUTTONS : depth0), {"name":"each","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "			<li>\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.RIGHT_BBAR_BUTTONS : depth0), {"name":"each","hash":{},"fn":this.program(7, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "		</li>\r\n			</ul>\r\n		</div>\r\n	</div>	\r\n   </div>";
},"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "		<div class=\" ct-btnCont  pull-left "
    + escapeExpression(((helper = (helper = helpers.FLD_BBAR_BTN_ID || (depth0 != null ? depth0.FLD_BBAR_BTN_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"FLD_BBAR_BTN_ID","hash":{},"data":data}) : helper)))
    + "_outerCont\">\r\n			<div class=\" ct-btnCont "
    + escapeExpression(((helper = (helper = helpers.FLD_BBAR_BTN_ID || (depth0 != null ? depth0.FLD_BBAR_BTN_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"FLD_BBAR_BTN_ID","hash":{},"data":data}) : helper)))
    + "_innerCont\">\r\n				<a data-item-id="
    + escapeExpression(((helper = (helper = helpers.FLD_BBAR_BTN_ID || (depth0 != null ? depth0.FLD_BBAR_BTN_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"FLD_BBAR_BTN_ID","hash":{},"data":data}) : helper)))
    + " data-item-type=\"BBAR_left_button\" system_btn_ind=\""
    + escapeExpression(((helper = (helper = helpers.FLD_IS_SYS_BUTTON || (depth0 != null ? depth0.FLD_IS_SYS_BUTTON : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"FLD_IS_SYS_BUTTON","hash":{},"data":data}) : helper)))
    + "\" class=\""
    + escapeExpression(((helper = (helper = helpers.BBAR_CLASS || (depth0 != null ? depth0.BBAR_CLASS : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"BBAR_CLASS","hash":{},"data":data}) : helper)))
    + " ct_btn\">"
    + escapeExpression(((helper = (helper = helpers.FLD_BTN_DISPLAY_NM || (depth0 != null ? depth0.FLD_BTN_DISPLAY_NM : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"FLD_BTN_DISPLAY_NM","hash":{},"data":data}) : helper)))
    + "</a>\r\n			</div>\r\n		</div>\r\n";
},"3":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "		<div class=\" ct-btnCont  pull-right "
    + escapeExpression(((helper = (helper = helpers.FLD_BBAR_BTN_ID || (depth0 != null ? depth0.FLD_BBAR_BTN_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"FLD_BBAR_BTN_ID","hash":{},"data":data}) : helper)))
    + "_outerCont\">\r\n			<div class=\" ct-btnCont "
    + escapeExpression(((helper = (helper = helpers.FLD_BBAR_BTN_ID || (depth0 != null ? depth0.FLD_BBAR_BTN_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"FLD_BBAR_BTN_ID","hash":{},"data":data}) : helper)))
    + "_innerCont\">\r\n				<a data-item-id="
    + escapeExpression(((helper = (helper = helpers.FLD_BBAR_BTN_ID || (depth0 != null ? depth0.FLD_BBAR_BTN_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"FLD_BBAR_BTN_ID","hash":{},"data":data}) : helper)))
    + " data-item-type=\"BBAR_right_button\" system_btn_ind=\""
    + escapeExpression(((helper = (helper = helpers.FLD_IS_SYS_BUTTON || (depth0 != null ? depth0.FLD_IS_SYS_BUTTON : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"FLD_IS_SYS_BUTTON","hash":{},"data":data}) : helper)))
    + "\" class=\""
    + escapeExpression(((helper = (helper = helpers.BBAR_CLASS || (depth0 != null ? depth0.BBAR_CLASS : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"BBAR_CLASS","hash":{},"data":data}) : helper)))
    + " ct_btn_neg\">"
    + escapeExpression(((helper = (helper = helpers.FLD_BTN_DISPLAY_NM || (depth0 != null ? depth0.FLD_BTN_DISPLAY_NM : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"FLD_BTN_DISPLAY_NM","hash":{},"data":data}) : helper)))
    + "</a>\r\n			</div>\r\n		</div>\r\n";
},"5":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "			<li>\r\n		 <div class=\" ct-btnCont ct-mob-btn "
    + escapeExpression(((helper = (helper = helpers.FLD_BBAR_BTN_ID || (depth0 != null ? depth0.FLD_BBAR_BTN_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"FLD_BBAR_BTN_ID","hash":{},"data":data}) : helper)))
    + "_outerCont\">\r\n			<div class=\" ct-btnCont ct-mob-btn "
    + escapeExpression(((helper = (helper = helpers.FLD_BBAR_BTN_ID || (depth0 != null ? depth0.FLD_BBAR_BTN_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"FLD_BBAR_BTN_ID","hash":{},"data":data}) : helper)))
    + "_innerCont\">\r\n				<a data-item-id="
    + escapeExpression(((helper = (helper = helpers.FLD_BBAR_BTN_ID || (depth0 != null ? depth0.FLD_BBAR_BTN_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"FLD_BBAR_BTN_ID","hash":{},"data":data}) : helper)))
    + " data-item-type=\"BBAR_left_button\" system_btn_ind=\""
    + escapeExpression(((helper = (helper = helpers.FLD_IS_SYS_BUTTON || (depth0 != null ? depth0.FLD_IS_SYS_BUTTON : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"FLD_IS_SYS_BUTTON","hash":{},"data":data}) : helper)))
    + "\" class=\""
    + escapeExpression(((helper = (helper = helpers.BBAR_CLASS || (depth0 != null ? depth0.BBAR_CLASS : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"BBAR_CLASS","hash":{},"data":data}) : helper)))
    + " ct_btn\">"
    + escapeExpression(((helper = (helper = helpers.FLD_BTN_DISPLAY_NM || (depth0 != null ? depth0.FLD_BTN_DISPLAY_NM : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"FLD_BTN_DISPLAY_NM","hash":{},"data":data}) : helper)))
    + "</a>\r\n			</div>\r\n			</div>\r\n			</li>\r\n";
},"7":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "		<div class=\" ct-btnCont ct-mob-btn "
    + escapeExpression(((helper = (helper = helpers.FLD_BBAR_BTN_ID || (depth0 != null ? depth0.FLD_BBAR_BTN_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"FLD_BBAR_BTN_ID","hash":{},"data":data}) : helper)))
    + "_outerCont\">\r\n			<div class=\" ct-btnCont ct-mob-btn "
    + escapeExpression(((helper = (helper = helpers.FLD_BBAR_BTN_ID || (depth0 != null ? depth0.FLD_BBAR_BTN_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"FLD_BBAR_BTN_ID","hash":{},"data":data}) : helper)))
    + "_innerCont\">\r\n				<a data-item-id="
    + escapeExpression(((helper = (helper = helpers.FLD_BBAR_BTN_ID || (depth0 != null ? depth0.FLD_BBAR_BTN_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"FLD_BBAR_BTN_ID","hash":{},"data":data}) : helper)))
    + " data-item-type=\"BBAR_right_button\" system_btn_ind=\""
    + escapeExpression(((helper = (helper = helpers.FLD_IS_SYS_BUTTON || (depth0 != null ? depth0.FLD_IS_SYS_BUTTON : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"FLD_IS_SYS_BUTTON","hash":{},"data":data}) : helper)))
    + "\" class=\""
    + escapeExpression(((helper = (helper = helpers.BBAR_CLASS || (depth0 != null ? depth0.BBAR_CLASS : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"BBAR_CLASS","hash":{},"data":data}) : helper)))
    + " ct_btn_neg\">"
    + escapeExpression(((helper = (helper = helpers.FLD_BTN_DISPLAY_NM || (depth0 != null ? depth0.FLD_BTN_DISPLAY_NM : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"FLD_BTN_DISPLAY_NM","hash":{},"data":data}) : helper)))
    + "</a>\r\n			</div>\r\n		</div>\r\n";
},"useData":true});
  templates['portletHeaderTemplate'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\"ct-app__header-container\">\r\n	 \r\n	<div class=\"pull-left\" data-item-id=\"ct-portlet__title\">\r\n		<span class=\"flaticon-default_a ct-app__icon ct-app__icon-tm pull-left\"></span>\r\n		<h3 data-item-id=\"portlet-title\" class=\""
    + escapeExpression(((helper = (helper = helpers.WGT_HEADER_TITLE_CLASS || (depth0 != null ? depth0.WGT_HEADER_TITLE_CLASS : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WGT_HEADER_TITLE_CLASS","hash":{},"data":data}) : helper)))
    + " ct-app__title ct-app__title-tm pull-left\">"
    + escapeExpression(((helper = (helper = helpers.WGT_TITLE || (depth0 != null ? depth0.WGT_TITLE : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"WGT_TITLE","hash":{},"data":data}) : helper)))
    + "</h3>\r\n	</div>\r\n	 \r\n	 \r\n	<div class=\"pull-right\" data-item-id=\"ct-portlet__tools\">\r\n		<div class=\"ct-dropdown\">\r\n			<ul class=\"list-inline ct-no-margin\">\r\n				";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.COLLAPSED_IND : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(3, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " \r\n				<li class=\"hidden ct-app__tools-max-con\">\r\n					<a data-item-id=\"portlet_maxTool\" class=\"ct-app__tools flaticon-maximize_2 flaticon_widget_header\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.TOOLTIP_MAXIMIZE || (depth0 != null ? depth0.TOOLTIP_MAXIMIZE : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOLTIP_MAXIMIZE","hash":{},"data":data}) : helper)))
    + "\"> </a>\r\n				</li> \r\n				 \r\n				<li class=\"hidden ct-app__tools-edit-con\">\r\n					<a data-item-id=\"portlet_editTool\" class=\"ct-app__tools ct-app__tools-edit\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.TOOLTIP_EDIT || (depth0 != null ? depth0.TOOLTIP_EDIT : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOLTIP_EDIT","hash":{},"data":data}) : helper)))
    + "\"></a>\r\n				</li> \r\n				 \r\n				<li class=\"hidden ct-app__tools-chart-con\">\r\n					<div class=\"\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.TOOLTIP_SWITCHCHART || (depth0 != null ? depth0.TOOLTIP_SWITCHCHART : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOLTIP_SWITCHCHART","hash":{},"data":data}) : helper)))
    + "\">\r\n						<div class=\"dropdown ct-dropdown\">\r\n							<a id=\"chart_tool\" data-target=\"#\" href=\"javascript:void(0)\" data-toggle=\"dropdown\" role=\"button\"> \r\n								<span data-item-id=\"portlet_chartTool\" class=\"ct-app__tools ct-app__tools-chart flaticon-barsgraphic flaticon_widget_header\"></span>\r\n							</a>\r\n							<ul class=\"dropdown-menu pull-right ct-dropdown-menu ct-portlet_icon__dropdown\" role=\"menu\" aria-labelledby=\"chart_tool\">\r\n							</ul>\r\n						</div>\r\n					</div>\r\n				</li>  \r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.CUSTOM_TOOLS_LIST : depth0), {"name":"each","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "				<li class=\"hidden ct-app__tools-pref-con\">\r\n					<span id=\"preferences_tool\" class=\"\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.TOOLTIP_GEAR || (depth0 != null ? depth0.TOOLTIP_GEAR : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOLTIP_GEAR","hash":{},"data":data}) : helper)))
    + "\">\r\n						<div class=\"dropdown\">\r\n							<a data-item-id=\"portlet_preferencesTool\" class=\"ct-app__tools flaticon-pref_settings flaticon_widget_header\" data-target=\"#\" href=\"javascript:void(0)\" data-toggle=\"dropdown\" role=\"button\"> </a>\r\n							<ul class=\"dropdown-menu pull-right ct-portlet_icon__dropdown\" role=\"menu\" aria-labelledby=\"preferences_tool\">\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.PREFERENCES_GRID : depth0), {"name":"if","hash":{},"fn":this.program(7, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "								<li class=\"hidden\">\r\n									<a data-item-id=\"portlet_updateTool\" class=\"\" href=\"javascript:void(0)\">\r\n										<span class=\"ct-app__tools flaticon-default_grid flat ct-app__tools-switchview\"></span>"
    + escapeExpression(((helper = (helper = helpers.UPDATE_APP_TOOL || (depth0 != null ? depth0.UPDATE_APP_TOOL : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"UPDATE_APP_TOOL","hash":{},"data":data}) : helper)))
    + "\r\n									</a>\r\n								</li>\r\n								<li class=\"dropdown dropdown-submenu hidden\" data-action-id=\"switchViewDropdown\">\r\n									<a data-item-id=\"portlet_switchTool\" id=\"Switch-View\" href=\"javascript:void(0)\" class=\"\" dropdown-toggle\" data-toggle=\"dropdown\">\r\n										<span class=\"ct-app__tools flaticon-direction2 flat\"></span>"
    + escapeExpression(((helper = (helper = helpers.SWITCH_VIEW_APP_TOOL || (depth0 != null ? depth0.SWITCH_VIEW_APP_TOOL : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"SWITCH_VIEW_APP_TOOL","hash":{},"data":data}) : helper)))
    + "\r\n									</a>\r\n									<ul class=\"dropdown-menu pull-right\" role=\"menu\" aria-labelledby=\"Switch-View\">\r\n									</ul>\r\n								</li>\r\n								<li class=\"\" data-action-id=\"removeViewDropdown\">\r\n									<a data-item-id=\"portlet_removeTool\" class=\"ct-app__tools-remove dropdown-toggle\" data-toggle=\"dropdown\" href=\"javascript:void(0)\">\r\n										<span class=\"ct-app__tools flaticon-close2 flat\"></span>"
    + escapeExpression(((helper = (helper = helpers.REMOVE_APP_TOOL || (depth0 != null ? depth0.REMOVE_APP_TOOL : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"REMOVE_APP_TOOL","hash":{},"data":data}) : helper)))
    + "\r\n									</a>\r\n								</li>\r\n							</ul>\r\n						</div>\r\n				</span></li> \r\n				 ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.WGT_TOOLS_IS_LINEAR : depth0), {"name":"if","hash":{},"fn":this.program(9, data),"inverse":this.program(11, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n				<li class=\"hidden  ct-app__tools-close-con\">\r\n					<span data-item-id=\"portlet_closeTool\" class=\"flaticon-close flaticon_widget_header\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.TOOLTIP_CLOSE || (depth0 != null ? depth0.TOOLTIP_CLOSE : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOLTIP_CLOSE","hash":{},"data":data}) : helper)))
    + "\"></span>\r\n				</li>\r\n			</ul>\r\n		</div>\r\n	</div>\r\n	  \r\n	<div data-item-id=\"portlet_toolBar\" data-item-id=\"ct-portlet__tools\" class=\"ct-app__showas-menu row hidden\">\r\n		<div class=\"pull-left\">\r\n			<div class=\"ct-dropdown\">\r\n				<ul class=\"list-inline\">\r\n					<li class=\"hidden ct-app__tools-help-conf\">\r\n						<a data-item-id=\"portlet_helpTool\" class=\"ct-app__tools flaticon-info flaticon_showAsLinear\" href=\"javascript:void(0)\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.TOOLTIP_HELP || (depth0 != null ? depth0.TOOLTIP_HELP : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOLTIP_HELP","hash":{},"data":data}) : helper)))
    + "\"> </a>\r\n					</li>\r\n					<li class=\"hidden ct-app__tools-excel-conf\">\r\n						<a data-item-id=\"portlet_excelTool\" class=\"ct-app__tools flaticon-xlsx flaticon_showAsLinear\" href=\"javascript:void(0)\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.TOOLTIP_EXCEL || (depth0 != null ? depth0.TOOLTIP_EXCEL : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOLTIP_EXCEL","hash":{},"data":data}) : helper)))
    + "\"></a>\r\n					</li>\r\n					<li class=\"hidden ct-app__tools-pdf-conf\">\r\n						<a data-item-id=\"portlet_pdfTool\" class=\"ct-app__tools flaticon-pdf flaticon_showAsLinear\" href=\"javascript:void(0)\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.TOOLTIP_PDF || (depth0 != null ? depth0.TOOLTIP_PDF : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOLTIP_PDF","hash":{},"data":data}) : helper)))
    + "\"></a>\r\n					</li>\r\n					<li class=\"hidden ct-app__tools-csv-conf\">\r\n						<a data-item-id=\"portlet_csvTool\" class=\"ct-app__tools flaticon-csv flaticon_showAsLinear\" href=\"javascript:void(0)\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.TOOLTIP_CSV || (depth0 != null ? depth0.TOOLTIP_CSV : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOLTIP_CSV","hash":{},"data":data}) : helper)))
    + "\"></a>\r\n					</li>\r\n					<li class=\"hidden ct-app__tools-rtf-conf\">\r\n						<a data-item-id=\"portlet_rtfTool\" class=\"ct-app__tools flaticon-rtf flaticon_showAsLinear\" href=\"javascript:void(0)\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.TOOLTIP_RTF || (depth0 != null ? depth0.TOOLTIP_RTF : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOLTIP_RTF","hash":{},"data":data}) : helper)))
    + "\"></a>\r\n					</li>\r\n					<li class=\"hidden ct-app__tools-jpeg-conf\">\r\n						<a data-item-id=\"portlet_jpegTool\" class=\"ct-app__tools flaticon-jpg flaticon_showAsLinear\" href=\"javascript:void(0)\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.TOOLTIP_JPEGEXPORT || (depth0 != null ? depth0.TOOLTIP_JPEGEXPORT : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOLTIP_JPEGEXPORT","hash":{},"data":data}) : helper)))
    + "\"></a>\r\n					</li>\r\n					<li class=\"hidden ct-app__tools-nofilter-conf\">\r\n						<a\r\n						data-item-id=\"portlet_clearFilterTool\"\r\n						class=\"ct-app__tools flaticon-filter-o flaticon_showAsLinear\"\r\n						href=\"javascript:void(0)\" data-toggle=\"tooltip\"\r\n						data-placement=\"top\"\r\n						data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.TOOL_TIPS_CLEAR_FILTER || (depth0 != null ? depth0.TOOL_TIPS_CLEAR_FILTER : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOL_TIPS_CLEAR_FILTER","hash":{},"data":data}) : helper)))
    + "\"></a>\r\n					</li>\r\n					<li class=\"hidden ct-app__tools-refresh-conf\">\r\n						<a data-item-id=\"portlet_refreshTool\" class=\"ct-app__tools flaticon-refresh_3 flaticon_showAsLinear\" href=\"javascript:void(0)\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.TOOLTIP_REFRESH || (depth0 != null ? depth0.TOOLTIP_REFRESH : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOLTIP_REFRESH","hash":{},"data":data}) : helper)))
    + "\"></a>\r\n					</li>\r\n					<li class=\"hidden ct-app__tools-print-conf\">\r\n						<a data-item-id=\"portlet_printTool\" class=\"ct-app__tools flaticon-print flaticon_showAsLinear\" href=\"javascript:void(0)\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.TOOLTIP_PRINT || (depth0 != null ? depth0.TOOLTIP_PRINT : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOLTIP_PRINT","hash":{},"data":data}) : helper)))
    + "\"></a>\r\n					</li>\r\n					<li class=\" ct-app__tools-restore-conf\">\r\n						<span data-item-id=\"portlet_restoreTools\" class=\"ct-app__tools flaticon-undo2 flaticon_showAsLinear\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.TOOL_TIPS_REVERT_IN_MORE || (depth0 != null ? depth0.TOOL_TIPS_REVERT_IN_MORE : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOL_TIPS_REVERT_IN_MORE","hash":{},"data":data}) : helper)))
    + "\"></span>\r\n					</li>\r\n				</ul>\r\n			</div>\r\n		</div>\r\n	</div>\r\n	 \r\n	<div class=\"clearfix\"></div>\r\n</div>\r\n";
},"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return " \r\n				<li class=\"ct-app__tools-collapse-con\">\r\n					<span data-item-id=\"portlet_collapseTool\" class=\"panel-collapsed ct-app__tools flaticon-expand_down flaticon_widget_header\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.TOOLTIP_COLLAPSE || (depth0 != null ? depth0.TOOLTIP_COLLAPSE : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOLTIP_COLLAPSE","hash":{},"data":data}) : helper)))
    + "\"> </span>\r\n				</li> \r\n				 ";
},"3":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return " \r\n				<li class=\"hidden ct-app__tools-minus-con\">\r\n					<span data-item-id=\"portlet_collapseTool\" class=\"ct-app__tools flaticon-expand_up flaticon_widget_header\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.TOOLTIP_COLLAPSE || (depth0 != null ? depth0.TOOLTIP_COLLAPSE : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOLTIP_COLLAPSE","hash":{},"data":data}) : helper)))
    + "\"> </span>\r\n				</li> \r\n				 ";
},"5":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "				<li class=\"hidden ct-app__tools-custom-con\">\r\n					<span id=\"custom_tool\" data-item-id=\""
    + escapeExpression(((helper = (helper = helpers.CUSTOM_TOOLS_ID || (depth0 != null ? depth0.CUSTOM_TOOLS_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"CUSTOM_TOOLS_ID","hash":{},"data":data}) : helper)))
    + "\" class=\"\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.DISPLAY_NAME || (depth0 != null ? depth0.DISPLAY_NAME : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"DISPLAY_NAME","hash":{},"data":data}) : helper)))
    + "\">\r\n						<div class=\"dropdown\">\r\n							<a data-item-id=\""
    + escapeExpression(((helper = (helper = helpers.CUSTOM_TOOLS_ID || (depth0 != null ? depth0.CUSTOM_TOOLS_ID : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"CUSTOM_TOOLS_ID","hash":{},"data":data}) : helper)))
    + "\" name=\"portlet_customTool\" class=\"ct-app__tools flaticon-pref_settings flaticon_widget_header\" data-target=\"#\" href=\"javascript:void(0)\" data-toggle=\"dropdown\" role=\"button\">\r\n								<span class=\"ct-app__tools ct-app__tools-custom\"></span>\r\n							</a>\r\n							<ul class=\"dropdown-menu pull-right\" role=\"menu\" aria-labelledby=\"custom_tool\" data-item-id=\"portlet_customTool\">\r\n							</ul>\r\n						</div>\r\n				</span></li>  \r\n";
},"7":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "								<li class=\"\">\r\n									<a data-item-id=\"portlet_saveAsTool\" class=\"\" href=\"javascript:void(0)\">\r\n										<span class=\"ct-app__tools flaticon-save-file1 flat\"></span>"
    + escapeExpression(((helper = (helper = helpers.SAVE_AS_APP_TOOL || (depth0 != null ? depth0.SAVE_AS_APP_TOOL : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"SAVE_AS_APP_TOOL","hash":{},"data":data}) : helper)))
    + "\r\n									</a>\r\n								</li>\r\n								<li class=\"\">\r\n									<a data-item-id=\"portlet_revertTool\" class=\"\" href=\"javascript:void(0)\">\r\n										<span class=\"ct-app__tools flaticon-undo2 flat\"></span>"
    + escapeExpression(((helper = (helper = helpers.REVERT_APP_TOOL || (depth0 != null ? depth0.REVERT_APP_TOOL : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"REVERT_APP_TOOL","hash":{},"data":data}) : helper)))
    + "\r\n									</a>\r\n								</li>\r\n";
},"9":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return " \r\n				<li class=\"hidden ct-app__tools-help-con\">\r\n					<a data-item-id=\"portlet_helpTool\" class=\"ct-app__tools ct-app__tools-help\" href=\"javascript:void(0)\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.TOOLTIP_HELP || (depth0 != null ? depth0.TOOLTIP_HELP : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOLTIP_HELP","hash":{},"data":data}) : helper)))
    + "\"> </a>\r\n				</li> \r\n				 \r\n				<li class=\"hidden ct-app__tools-excel-con\">\r\n					<a data-item-id=\"portlet_excelTool\" class=\"ct-app__tools flaticon-xlsx flaticon_showAsLinear\" href=\"javascript:void(0)\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.TOOLTIP_EXCEL || (depth0 != null ? depth0.TOOLTIP_EXCEL : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOLTIP_EXCEL","hash":{},"data":data}) : helper)))
    + "\"></a>\r\n				</li>\r\n				 \r\n				<li class=\"hidden ct-app__tools-pdf-con\">\r\n					<a data-item-id=\"portlet_pdfTool\" class=\"ct-app__tools flaticon-pdf flaticon_showAsLinear\" href=\"javascript:void(0)\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.TOOLTIP_PDF || (depth0 != null ? depth0.TOOLTIP_PDF : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOLTIP_PDF","hash":{},"data":data}) : helper)))
    + "\"></a>\r\n				</li>\r\n				 \r\n				<li class=\"hidden ct-app__tools-csv-con\">\r\n					<a data-item-id=\"portlet_csvTool\" class=\"ct-app__tools flaticon-csv flaticon_showAsLinear\" href=\"javascript:void(0)\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.TOOLTIP_CSV || (depth0 != null ? depth0.TOOLTIP_CSV : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOLTIP_CSV","hash":{},"data":data}) : helper)))
    + "\"></a>\r\n				</li>\r\n				 \r\n				<li class=\"hidden ct-app__tools-rtf-con\">\r\n					<a data-item-id=\"portlet_rtfTool\" class=\"ct-app__tools flaticon-rtf flaticon_showAsLinear\" href=\"javascript:void(0)\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.TOOLTIP_RTF || (depth0 != null ? depth0.TOOLTIP_RTF : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOLTIP_RTF","hash":{},"data":data}) : helper)))
    + "\"></a>\r\n				</li>\r\n				 \r\n				<li class=\"hidden ct-app__tools-jpeg-con\">\r\n					<a data-item-id=\"portlet_jpegTool\" class=\"ct-app__tools flaticon-jpg flaticon_showAsLinear\" href=\"javascript:void(0)\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.TOOLTIP_JPGEXPORT || (depth0 != null ? depth0.TOOLTIP_JPGEXPORT : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOLTIP_JPGEXPORT","hash":{},"data":data}) : helper)))
    + "\"></a>\r\n				</li> \r\n				 \r\n				<li class=\"hidden ct-app__tools-filter-con\">\r\n					<a data-item-id=\"portlet_clearFilterTool\" class=\"ct-app__tools flaticon-filter flaticon_showAsLinear\" href=\"javascript:void(0)\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.TOOL_TIPS_CLEAR_FILTER || (depth0 != null ? depth0.TOOL_TIPS_CLEAR_FILTER : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOL_TIPS_CLEAR_FILTER","hash":{},"data":data}) : helper)))
    + "\"></a>\r\n				</li> \r\n				 \r\n				<li class=\"hidden ct-app__tools-refresh-con\">\r\n					<a data-item-id=\"portlet_refreshTool\" class=\"ct-app__tools flaticon-refresh_3 flaticon_showAsLinear\" href=\"javascript:void(0)\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.TOOLTIP_REFRESH || (depth0 != null ? depth0.TOOLTIP_REFRESH : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOLTIP_REFRESH","hash":{},"data":data}) : helper)))
    + "\"></a>\r\n				</li>\r\n				 \r\n				<li class=\"hidden ct-app__tools-print-con\">\r\n					<a data-item-id=\"portlet_printTool\" class=\"ct-app__tools flaticon-print flaticon_showAsLinear\" href=\"javascript:void(0)\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.TOOLTIP_PRINT || (depth0 != null ? depth0.TOOLTIP_PRINT : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOLTIP_PRINT","hash":{},"data":data}) : helper)))
    + "\"></a>\r\n				</li>\r\n				 ";
},"11":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return " \r\n				<li class=\"hidden  ct-app__tools-more-con\">\r\n					<div class=\"tool\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.TOOLTIP_PIN || (depth0 != null ? depth0.TOOLTIP_PIN : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOLTIP_PIN","hash":{},"data":data}) : helper)))
    + "\">\r\n						<div class=\"dropdown ct-dropdown\">\r\n							<a id=\"more_tool\" data-target=\"#\" href=\"javascript:void(0)\" data-toggle=\"dropdown\" role=\"button\"> \r\n								<span data-item-id=\"portlet_moreTool\" class=\"flaticon-more-icon flaticon_widget_header\"></span>\r\n							</a> \r\n							<ul class=\"dropdown-menu pull-right ct-dropdown-menu ct-portlet_icon__dropdown\" role=\"menu\" aria-labelledby=\"more_tool\">\r\n								<li class=\"hidden  ct-app__tools-help-con\">\r\n									<a data-item-id=\"portlet_helpTool\" class=\"\" href=\"javascript:void(0)\"> \r\n									<span class=\"flaticon-info flat\"></span>\r\n									<span class=\"ct-dropdown-menu-txt\">"
    + escapeExpression(((helper = (helper = helpers.TOOLTIP_HELP || (depth0 != null ? depth0.TOOLTIP_HELP : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOLTIP_HELP","hash":{},"data":data}) : helper)))
    + "</span>\r\n									</a>\r\n								</li> \r\n								 \r\n								<li class=\"dropdown dropdown-submenu hidden ct-dropdown  ct-app__tools-export-con\">\r\n									<a data-item-id=\"portlet_exportTool\" id=\"export-menu\" data-target=\"#\" href=\"javascript:void(0)\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\">\r\n										<span class=\"flaticon-export flat\"></span> \r\n										<span class=\"ct-dropdown-menu-txt\">"
    + escapeExpression(((helper = (helper = helpers.EXPORT_APP_TOOL || (depth0 != null ? depth0.EXPORT_APP_TOOL : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"EXPORT_APP_TOOL","hash":{},"data":data}) : helper)))
    + "</span>\r\n									</a> \r\n									<ul class=\"dropdown-menu pull-right ct-portlet_icon__dropdown\" role=\"menu\" aria-labelledby=\"export-menu\">\r\n										<li class=\"hidden  ct-app__tools-excel-con\">\r\n											<a data-item-id=\"portlet_excelTool\" class=\"\" href=\"javascript:void(0)\"> \r\n											<span class=\"flaticon-xlsx flat\"></span> \r\n											<span class=\"ct-dropdown-menu-txt\">"
    + escapeExpression(((helper = (helper = helpers.TOOLTIP_EXCEL || (depth0 != null ? depth0.TOOLTIP_EXCEL : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOLTIP_EXCEL","hash":{},"data":data}) : helper)))
    + "</span>\r\n											</a>\r\n										</li> \r\n										<li class=\"hidden ct-app__tools-pdf-con\">\r\n											<a data-item-id=\"portlet_pdfTool\" class=\"\" href=\"javascript:void(0)\"> \r\n												<span class=\"flaticon-pdf flat\"></span> \r\n												<span class=\"ct-dropdown-menu-txt\">"
    + escapeExpression(((helper = (helper = helpers.TOOLTIP_PDF || (depth0 != null ? depth0.TOOLTIP_PDF : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOLTIP_PDF","hash":{},"data":data}) : helper)))
    + "</span>\r\n											</a>\r\n										</li> \r\n										 \r\n										<li class=\"hidden  ct-app__tools-csv-con\">\r\n											<a data-item-id=\"portlet_csvTool\" class=\"\" href=\"javascript:void(0)\"> \r\n											<span class=\"flaticon-csv flat\"></span> \r\n											<span class=\"ct-dropdown-menu-txt\">"
    + escapeExpression(((helper = (helper = helpers.TOOLTIP_CSV || (depth0 != null ? depth0.TOOLTIP_CSV : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOLTIP_CSV","hash":{},"data":data}) : helper)))
    + "</span>\r\n											</a>\r\n										</li> \r\n										 \r\n										<li class=\"hidden  ct-app__tools-rtf-con\">\r\n											<a data-item-id=\"portlet_rtfTool\" class=\"\" href=\"javascript:void(0)\"> \r\n												<span class=\"flaticon-rtf flat\"></span> \r\n												<span class=\"ct-dropdown-menu-txt\">"
    + escapeExpression(((helper = (helper = helpers.TOOLTIP_RTF || (depth0 != null ? depth0.TOOLTIP_RTF : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOLTIP_RTF","hash":{},"data":data}) : helper)))
    + "</span>\r\n											</a>\r\n										</li> \r\n										 \r\n										<li class=\"hidden  ct-app__tools-jpeg-con\">\r\n											<a data-item-id=\"portlet_jpegTool\" class=\"\" href=\"javascript:void(0)\"> \r\n												<span class=\"flaticon-jpg flat\"></span> \r\n												<span class=\"ct-dropdown-menu-txt\">"
    + escapeExpression(((helper = (helper = helpers.TOOLTIP_JPEGEXPORT || (depth0 != null ? depth0.TOOLTIP_JPEGEXPORT : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOLTIP_JPEGEXPORT","hash":{},"data":data}) : helper)))
    + "</span>\r\n											</a>\r\n										</li> \r\n									</ul> \r\n								</li> \r\n								 \r\n								<li class=\"hidden  ct-app__tools-refresh-con\">\r\n									<a data-item-id=\"portlet_refreshTool\" class=\"\" href=\"javascript:void(0)\"> \r\n										<span class=\"flaticon-refresh_3 flat\"></span> \r\n										<span class=\"ct-dropdown-menu-txt\">"
    + escapeExpression(((helper = (helper = helpers.TOOLTIP_REFRESH || (depth0 != null ? depth0.TOOLTIP_REFRESH : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOLTIP_REFRESH","hash":{},"data":data}) : helper)))
    + "</span>\r\n									</a>\r\n								</li> \r\n								 \r\n								<li class=\"hidden  ct-app__tools-print-con\">\r\n									<a data-item-id=\"portlet_printTool\" class=\"\" href=\"javascript:void(0)\"> \r\n										<span class=\"flaticon-print flat\"></span> \r\n										<span class=\"ct-dropdown-menu-txt\">"
    + escapeExpression(((helper = (helper = helpers.TOOLTIP_PRINT || (depth0 != null ? depth0.TOOLTIP_PRINT : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOLTIP_PRINT","hash":{},"data":data}) : helper)))
    + "</span>\r\n									</a>\r\n								</li> \r\n								 \r\n								<li class=\"hidden  ct-app__tools-showas-menu-con\">\r\n									<a data-item-id=\"portlet_showAsToolBar\" class=\"\" href=\"javascript:void(0)\"> \r\n										<span class=\"flaticon-preview2 flat\"></span> \r\n										<span class=\"ct-dropdown-menu-txt\">"
    + escapeExpression(((helper = (helper = helpers.TOOLTIP_SHOWASTOOLBAR || (depth0 != null ? depth0.TOOLTIP_SHOWASTOOLBAR : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"TOOLTIP_SHOWASTOOLBAR","hash":{},"data":data}) : helper)))
    + "</span>\r\n									</a>\r\n								</li> \r\n							</ul>\r\n						</div>\r\n				</li>  ";
},"useData":true});
  templates['saveAsform'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"panel panel-default ct-app ct-app-tm\">\r\n\r\n<div class=\"panel-heading ct-app__header ct-app__header-tm\">\r\n<h3 data-item-id=\"formCont-title\" class=\"panel-title ct-app__title ct-app__title-tm\">Save By</h3>\r\n</div>\r\n<div class=\"panel-body ct-model__panel-body ct-app__content\">	\r\n	<input type=\"text\" data-input-id=\"saveas\" class=\"form-control\" placeholder=\"Save As\">\r\n</div>\r\n<div class=\"panel-footer ct-model__panel-footer\">\r\n	<div class=\"row\">\r\n		<div class='pull-left'>\r\n			<button class=\"btn ct_btn btn-save-cancel\" data-button-id=\"saveas\">Save</button>\r\n		</div>\r\n		<div class='pull-right'>\r\n			<button class=\"btn ct_btn btn-save-cancel\" data-button-id=\"cancel\">Cancel</button>\r\n		</div>\r\n	</div>	\r\n</div>\r\n</div>\r\n";
  },"useData":true});
  templates['TabLayoutTemplate'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, options, functionType="function", helperMissing=helpers.helperMissing, blockHelperMissing=helpers.blockHelperMissing, buffer = " \r\n<div class=\"tabbable ct-tab ct-tab-tm ct-tab-bs\">\r\n	";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.tabStripReq : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += " \r\n";
  stack1 = ((helper = (helper = helpers.tabContainerConf || (depth0 != null ? depth0.tabContainerConf : depth0)) != null ? helper : helperMissing),(options={"name":"tabContainerConf","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data}),(typeof helper === functionType ? helper.call(depth0, options) : helper));
  if (!helpers.tabContainerConf) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if (stack1 != null) { buffer += stack1; }
  return buffer + "  \r\n";
},"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = " \r\n	<ul class=\""
    + escapeExpression(((helper = (helper = helpers.tabStripClass || (depth0 != null ? depth0.tabStripClass : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"tabStripClass","hash":{},"data":data}) : helper)))
    + "\">\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.tabStrip : depth0), {"name":"each","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n	</ul>\r\n	 ";
},"2":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "		<li data-item-id=\""
    + escapeExpression(((helper = (helper = helpers.tabStripId || (depth0 != null ? depth0.tabStripId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"tabStripId","hash":{},"data":data}) : helper)))
    + "\" tabindex="
    + escapeExpression(((helper = (helper = helpers.tabStripIndex || (depth0 != null ? depth0.tabStripIndex : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"tabStripIndex","hash":{},"data":data}) : helper)))
    + " role=\"presentation\" class=\""
    + escapeExpression(((helper = (helper = helpers.tabStripCls || (depth0 != null ? depth0.tabStripCls : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"tabStripCls","hash":{},"data":data}) : helper)))
    + " ct-tab__each ct-tab_each-tm ct-tab__each-bs\">\r\n			<a class=\""
    + escapeExpression(((helper = (helper = helpers.tabStripAnchorClass || (depth0 != null ? depth0.tabStripAnchorClass : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"tabStripAnchorClass","hash":{},"data":data}) : helper)))
    + " ct-tab__txt ct-tab__txt-tm ct-tab__txt-bs\" data-toggle='tab' href=\"javascript:void(0)\"><span class=\"ct-tab__txtspan\">"
    + escapeExpression(((helper = (helper = helpers.tabStripLbl || (depth0 != null ? depth0.tabStripLbl : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"tabStripLbl","hash":{},"data":data}) : helper)))
    + "</span></a>\r\n		</li> ";
},"4":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "	<div data-item-id="
    + escapeExpression(((helper = (helper = helpers.contDivId || (depth0 != null ? depth0.contDivId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"contDivId","hash":{},"data":data}) : helper)))
    + " class=\""
    + escapeExpression(((helper = (helper = helpers.contDivClass || (depth0 != null ? depth0.contDivClass : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"contDivClass","hash":{},"data":data}) : helper)))
    + "\"></div>\r\n	";
},"useData":true});
  templates['treeView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class='ct-treeview' data-item-id=ct-treeView>\r\n	<div class='ct-treeview_header'>\r\n		<span class=''></span> <span class=''>"
    + escapeExpression(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"text","hash":{},"data":data}) : helper)))
    + "</span>\r\n	</div>\r\n	<div>\r\n		<ul class='ct-treeview_ul'>\r\n";
  stack1 = ((helpers.recursive || (depth0 && depth0.recursive) || helperMissing).call(depth0, (depth0 != null ? depth0.CHILDREN : depth0), {"name":"recursive","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "		</ul>\r\n	</div>\r\n</div>";
},"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "			<li class='ct-treeview_li'>\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.CHILDREN : depth0), {"name":"if","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "				<span data-item-id='ct-tree_name' data-item-value='"
    + escapeExpression(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"text","hash":{},"data":data}) : helper)))
    + "' class='ct-treeview_leaf'>"
    + escapeExpression(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"text","hash":{},"data":data}) : helper)))
    + "</span> \r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.CHILDREN : depth0), {"name":"if","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "			</li> \r\n";
},"2":function(depth0,helpers,partials,data) {
  return "				<span data-item-id='ct-tree_toggle' class='ct-treeview_toggle flaticon-collapse'></span>\r\n";
  },"4":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "				<ul class='ct-treeview_ul'>";
  stack1 = ((helpers.recursive || (depth0 && depth0.recursive) || helperMissing).call(depth0, (depth0 != null ? depth0.CHILDREN : depth0), {"name":"recursive","hash":{},"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + " </ul> \r\n";
},"useData":true});
}());