/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
cbx.ns('canvas.applnlayout.menu');
/**
 * @namespace "canvas.applnlayout.menu"
 * @description This component is currently responsible Jquery Framework to rendered menu layout header.
 */
canvas.applnlayout.menu.header = Class({
    /**
     * @class "canvas.applnlayout.menu.header"
     * @description The constructor gets the metadata and parent element (#HEADER)
     */
    headerData: null,
    parentElem: null,
    constructor: function(config) {
        this.customJSON = config.config;
        this.headerData = config.md || {};
        this.parentElem = config.parentElem;
        this.workspaceContainerElem = $('#CONTENT_DIV').addClass("ct-menu-headerbuffer");
    },
    /**
     * @method getHeaderDOM
     * @memberof "canvas.applnlayout.menu.header"
     * @description This method is responsible for loading the user picture, user info, last login time with the
     *              template (menuheader.cttpl)
     */
    getHeaderDOM: function() {
        var bundle = CRB.getFWBundle();
        var user_img_path = './PictureUploadServlet?imgHandle=GET_USER_IMAGE&INPUT_ACTION=PICTURE_PROCESS_ACTION&INPUT_FUNCTION_CODE=VSBLTY&INPUT_SUB_PRODUCT=CUSER&PAGE_CODE_TYPE=PICTURE_PROCESS&PRODUCT_NAME=CUSER&timeout=' + new Date();
        var user_info = iportal.preferences.getLoggedInUserName();
        var user_log_time = iportal.preferences.getLastLoginDateTime();
        var wsId = iportal.workspace.metadata.getCurrentWorkspaceId();
        this.menuItemID = eval(canvas.metadata.menu.getMenuMetaData());
        var headerComponentJSON = {};
        headerComponentJSON['HEADER_REQ'] = this.customJSON.isHeaderEnabled();
        headerComponentJSON['CSS_CLASS'] = this.customJSON.getHeaderCls();
        if (this.menuItemID.map(function(e) {
                return e.item_id
            }).indexOf(wsId) < 0) {
            headerComponentJSON['WORKSPACE_MENU'] = false;
        } else {
            headerComponentJSON['WORKSPACE_MENU'] = true;
        }

        headerComponentJSON['WS_MENU'] = bundle['LBL_WS_MENU'];
        headerComponentJSON['WS_NAME'] = iportal.workspace.metadata.getCurrentWorkspaceId();
        headerComponentJSON['USR_IMG_PATH'] = user_img_path;
        headerComponentJSON['USR_INFO'] = user_info;
        headerComponentJSON['USR_LOGIN'] = user_log_time;
        headerComponentJSON['LAST_LOGIN_TEXT'] = bundle['LBL_LAST_LOGIN'];
        headerComponentJSON['PIC_TOOL_TIP'] = bundle['LBL_CHANGE_PROF_PIC'];
        headerComponentJSON['HEADER_PREF'] = bundle['LBL_PREF'];
        headerComponentJSON['HEADER_LOGOUT'] = bundle['LBL_LOGOUT'];
        var tmpLayer = new ct.lib.tmplLayer('al-menu-header.cttpl', headerComponentJSON);
        tmpLayer.getTemplate(this.applyTemplate, this);

        var sidebarComponentJSON = {};
        sidebarComponentJSON['USR_IMG_PATH'] = user_img_path;
        sidebarComponentJSON['USR_INFO'] = user_info;
        sidebarComponentJSON['USR_LOGIN'] = user_log_time;
        sidebarComponentJSON['LAST_LOGIN_TEXT'] = bundle['LBL_LAST_LOGIN'];
        sidebarComponentJSON['PIC_TOOL_TIP'] = bundle['LBL_CHANGE_PROF_PIC'];
        sidebarComponentJSON['HEADER_PREF'] = bundle['LBL_PREF'];
        sidebarComponentJSON['HEADER_LOGOUT'] = bundle['LBL_LOGOUT'];

        var wsList = iportal.workspace.metadata.getWorkspaces();
        for (var i = 0; i < wsList.length; i++) {
            var displayName = CRB.getBundleValue(wsList[i].BUNDLE_KEY, wsList[i].WORKSPACE_ID);
            if (!cbx.isEmpty(displayName)) {
                wsList[i].WORKSPACE_DISPLAY_NM = displayName;
            }
            if (cbx.isEmpty(wsList[i].WORKSPACE_DISPLAY_NM)) {
                wsList[i].WORKSPACE_DISPLAY_NM = wsList[i].WORKSPACE_ID;
            }
        }
        sidebarComponentJSON['MENU_WORKSPACES'] = wsList;
        var tmpSidebarLayer = new ct.lib.tmplLayer('al-menu-sidebar.cttpl', sidebarComponentJSON);
        tmpSidebarLayer.getTemplate(this.applySideBarTemplate, this);

    },
    /**
     * @method applyTemplate
     * @memberof "canvas.applnlayout.menu.header"
     * @description This method gets the template, appends it to the parent element and adds click listener for user
     *              prefernces and logout.
     */
    applyTemplate: function(template, tmpClass) {
        var that = this;

        if (!cbx.core.isEmpty(this.parentElem)) {
            $(this.parentElem).append(template);
        }

        if (!cbx.core.isEmpty(that.customJSON) && that.customJSON.isLandingPageRequired() == false) {
            var homeWorkspaceId = iportal.workspace.metadata.getWorkspaces()[0].WORKSPACE_ID;
            var homeWorkspaceDN = iportal.workspace.metadata.getWorkspaces()[0].WORKSPACE_DISPLAY_NM;
            var wsName = iportal.workspace.metadata.getWorkspaceManager().getContainer().workspaceDisplayName(homeWorkspaceId, homeWorkspaceDN);
            $('[data-item-id=ct-ws-title]').html(wsName);
        }

        $('[data-toggle="tooltip"]').tooltip();

        $(this.parentElem).find('[data-item-id=ct-user-details]').on('click', function(event) {
            event.stopPropagation();
            $('[data-item-id=ct-menu-desktop__ws-user-info]').slideToggle('fast');
        });

        $(this.parentElem).find('[data-item-id=ct-menu__ws-ws-menu-toggler]').on('click', function(event) {
            event.stopPropagation();
            if ($('[data-item-id=ct-menuBar]').css('display') == 'none') {
                $('[data-item-id=ct-menuBar]').addClass('ct-mobile-ws-menu-display');
            } else {
                $('[data-item-id=ct-menuBar]').removeClass('ct-mobile-ws-menu-display');
            }
            $('[data-item-id=ct-menuBar]').is(':visible') == true ? $('#breadCrumb').animate({
                paddingTop: "10px"
            }, 500) : $('#breadCrumb').animate({
                paddingTop: "50px"
            }, 500);
            $('[data-item-id=ct-menuBar]').slideToggle('slow');
        });

        $(this.parentElem).find('[data-item-id=ct_pref]').on('click', function() {
            canvas.showPreferences();
        });
        $(this.parentElem).find('[data-item-id=ct_logout]').on('click', function() {
            iportal.logoutUser();
        });
        $(this.parentElem).find('[data-item-id=ct_picedit]').on('click', function() {
            canvas.editUploadPicture();
        });
    },

    applySideBarTemplate: function(template, tmpClass) {
        var that = this;

        if (!cbx.core.isEmpty(this.workspaceContainerElem)) {
            $(this.workspaceContainerElem).append(template);
            if (!cbx.core.isEmpty(that.customJSON) && that.customJSON.isLandingPageRequired() == false) {
                $(".ct-al__menu-each:first").addClass("ct-al__menu-is-selected");
            }
        }

        $('.ct-al__menu-each-js').unbind('click').bind('click', function(event) {
            event.stopPropagation();
            menuToggler();

            $(this).parent().children().removeClass('ct-al__menu-is-selected');
            $(this).addClass('ct-al__menu-is-selected');
            var element = this;
            var workspaceid = $(element).find('.ct-al-menu__wslink-txt-js').attr('data-item-id');
            if (that.menuItemID.map(function(e) {
                    return e.item_id
                }).indexOf(workspaceid) >= 0) {
                that.workspaceContainerElem.parent().find("[data-item-id=ct-menu__ws-ws-menu-toggler]").removeClass("hidden");
            } else {
                that.workspaceContainerElem.parent().find("[data-item-id=ct-menu__ws-ws-menu-toggler]").addClass("hidden");
            }
            //iportal.workspace.metadata.getWorkspaceManager().getContainer().switchWorkspace(workspaceid, null, true);
            cbx.HashManager.setHash({'WORKSPACE_ID':workspaceid});
            var workspaceDN = iportal.workspace.metadata.getWorkSpaceById(workspaceID).WORKSPACE_DISPLAY_NM;
            var wsName = iportal.workspace.metadata.getWorkspaceManager().getContainer().workspaceDisplayName(workspaceID, workspaceDN);
            $('[data-item-id=ct-ws-title]').html(wsName);
        });

        $(this.workspaceContainerElem).find('[data-item-id=ct-al__menu-top-arrow]').on('click', function(event) {
            event.stopPropagation();
        });

        $(this.workspaceContainerElem).find('[data-item-id=ct-al__menu-bottom-arrow]').on('click', function(event) {
            event.stopPropagation();
        });

        $(this.parentElem).find('[data-item-id=ct_logo]').on('click', function(event) {
            event.stopPropagation();
            if (iportal.preferences.isLangDirectionRTL()) {
                var sideBarRight = $('[data-item-id=ct-al__menu-sidebar]').offset().left;
                var windowWidth = $(window).width();
                var sidebarwidth = $('[data-item-id=ct-al__menu-sidebar]').width();
                if (sideBarRight != windowWidth) {
                    sidebarwidth = -sidebarwidth;
                    $('[data-item-id=ct-al__menu-sidebar]').animate({
                        right: sidebarwidth
                    }, 500);
                    $('[data-item-id=ct-al__menu-sidebar-overlay]').css("display", "none");
                    $('body').css("overflow-y", "auto");
                }
            } else {
                var sideBarLeft = $('[data-item-id=ct-al__menu-sidebar]').offset().left;
                var sidebarwidth = $('[data-item-id=ct-al__menu-sidebar]').width();
                if (sideBarLeft == 0) {
                    sidebarwidth = -sidebarwidth;
                    $('[data-item-id=ct-al__menu-sidebar]').animate({
                        left: sidebarwidth
                    }, 500);
                    $('[data-item-id=ct-al__menu-sidebar-overlay]').css("display", "none");
                    $('body').css("overflow-y", "auto");
                }
            }
            $(".ct-al__menu-each").removeClass('ct-al__menu-is-selected');
            if (!cbx.core.isEmpty(that.customJSON) && that.customJSON.isLandingPageRequired() == false) {
                $(".ct-al__menu-each:first").addClass("ct-al__menu-is-selected");
            } else {
                var wsName = iportal.workspace.metadata.getWorkspaceManager().getContainer().workspaceDisplayName();
                $('[data-item-id=ct-ws-title]').html(wsName);
            }
            var homeWorkspaceId = iportal.workspace.metadata.getWorkspaces()[0].WORKSPACE_ID;
            var homeWorkspaceDN = iportal.workspace.metadata.getWorkspaces()[0].WORKSPACE_DISPLAY_NM;
            if (iportal.workspace.metadata.isWidgetCatalogRequired()) {
                iportal.workspace.metadata.getAppDock().hideAppDock();
            }
            iportal.workspace.metadata.getWorkspaceManager().getContainer().logoHandler(that);

            var wsName = iportal.workspace.metadata.getWorkspaceManager().getContainer().workspaceDisplayName(homeWorkspaceId, homeWorkspaceDN);
            $('[data-item-id=ct-ws-title]').html(wsName);

        });

        $('.ct-al__menu-menu-toggler').on('click', function(event) {
            event.stopPropagation();
            menuToggler();
        });

        $("[data-item-id=ct-al__menu-sidebar-overlay]").on('click', function() {
            menuToggler();
            var userDetaiVisibility = $('[data-item-id=ct-menu-desktop__ws-user-info]').css('display');
            if (userDetaiVisibility != 'none') {
                $('[data-item-id=ct-menu-desktop__ws-user-info]').slideToggle('fast');
            }
        });

        $('body').on('swiperight', function(event, touch) {
            if (!iportal.preferences.isLangDirectionRTL()) {
                var sideBarLeft = $('[data-item-id=ct-al__menu-sidebar]').offset().left;
                if (sideBarLeft != 0 && touch.startEvnt.position.x < 16) {
                    $('[data-item-id=ct-al__menu-sidebar]').animate({
                        left: '0px'
                    }, 500);
                    $('[data-item-id=ct-al__menu-sidebar-overlay]').css("display", "block");
                    $('body').css("overflow-y", "hidden");
                }
            }
        });

        $('body').on('swipeleft', function(event, touch) {
            if (iportal.preferences.isLangDirectionRTL()) {
                var sideBarRight = $('[data-item-id=ct-al__menu-sidebar]').offset().left;
                var windowWidth = $(window).width();
                var sidebarwidth = $('[data-item-id=ct-al__menu-sidebar]').width();
                if (sideBarRight == windowWidth && ((windowWidth - touch.startEvnt.position.x) < 16)) {
                    $('[data-item-id=ct-al__menu-sidebar]').animate({
                        right: '0px'
                    }, 500);
                    $('[data-item-id=ct-al__menu-sidebar-overlay]').css("display", "block");
                    $('body').css("overflow-y", "hidden");
                }
            }
        });

        $(this.workspaceContainerElem).find('[data-item-id=ct_pref]').on('click', function() {
            canvas.showPreferences();
        });
        $(this.workspaceContainerElem).find('[data-item-id=ct_logout]').on('click', function() {
            iportal.logoutUser();
        });
        $(this.workspaceContainerElem).find('[data-item-id=ct_picedit]').on('click', function() {
            canvas.editUploadPicture();
        });

        $(".form-group #uploadPic").on('focus', function() {
            $("#uploadPic").parent().removeClass("has-error");
            $("#uploadPic").siblings('label.errorLabel').hide();
        });

        $(window).scroll(function() {
            if ($(this).scrollTop() > 75) {
                $('[data-item-id=ct-al-menu__header]').addClass("ct-sticky_header");
                $('[data-item-id=ct_sidebar_menu_toggler]').addClass("ct-sticky_header");
                $('[data-item-id=ct_logo]').addClass("ct-sticky_header");
                $('#HEADER_DIV ul').addClass("ct-sticky_header");
                $('[data-item-id=ct-ws-title]').addClass("ct-sticky_header");
                $('[data-item-id=ct-al__menu-sidebar]').addClass("ct-sticky_header");
                $('#CONTENT_DIV').addClass("ct-sticky_header");
                $('[data-item-id=ct-user-details]').addClass("ct-sticky_header");
                $('[data-item-id=ct-menu-desktop__ws-user-info]').addClass("ct-sticky_header");
                $('[data-item-id=ct-menu__ws-ws-menu-toggler]').addClass("ct-sticky_header");
                $('[data-item-id=clicker]').addClass("ct-sticky_header");
            } else {
                $('[data-item-id=ct-al-menu__header]').removeClass("ct-sticky_header");
                $('[data-item-id=ct_sidebar_menu_toggler]').removeClass("ct-sticky_header");
                $('[data-item-id=ct_logo]').removeClass("ct-sticky_header");
                $('#HEADER_DIV ul').removeClass("ct-sticky_header");
                $('[data-item-id=ct-ws-title]').removeClass("ct-sticky_header");
                $('[data-item-id=ct-al__menu-sidebar]').removeClass("ct-sticky_header");
                $('#CONTENT_DIV').removeClass("ct-sticky_header");
                $('[data-item-id=ct-user-details]').removeClass("ct-sticky_header");
                $('[data-item-id=ct-menu-desktop__ws-user-info]').removeClass("ct-sticky_header");
                $('[data-item-id=ct-menu__ws-ws-menu-toggler]').removeClass("ct-sticky_header");
                $('[data-item-id=clicker]').removeClass("ct-sticky_header");
            }
        });

        $('[data-item-id=ct-al__menu-top-icon]').on('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            scrollContent(1);
        }).on('mouseover', function(event) {
            event.stopPropagation();
            scrolling = true;
            scrollContent(1);
        }).on('mouseout', function(event) {
            event.stopPropagation();
            scrolling = false;
        });

        $('[data-item-id=ct-al__menu-bottom-icon]').on('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            scrollContent(-1);
        }).on('mouseover', function(event) {
            event.stopPropagation();
            scrolling = true;
            scrollContent(-1);
        }).on('mouseout', function(event) {
            event.stopPropagation();
            scrolling = false;
        });

        $('[data-item-id=ct-al__menu-ws-list]').bind('touchmove', function(e) {
            e.stopPropagation();
        });

        $("[data-item-id=ct-al__menu-ws-list]").mCustomScrollbar({
            axis: "y"
        });

        $("[data-item-id=ct-al__menu-ws-list]").on('click', function(e) {
            e.stopPropagation();
        });
        $("body").on('click', function(e) {
            $('[data-item-id=ct-menu-desktop__ws-user-info]').slideUp();
        })

        /*		$('[data-item-id=ct-al__menu-ws-list]').on('mousewheel', function(event) {
        			event.preventDefault();
        			if (event.originalEvent.wheelDelta >= 0) {
        				scrollContent(20);
        			}
        			else {
        				scrollContent(-20);
        			}
        		});	
        */
        function menuToggler() {
            if (iportal.preferences.isLangDirectionRTL()) {
                var sideBarRight = $('[data-item-id=ct-al__menu-sidebar]').offset().left;
                var windowWidth = $(window).width();
                var sidebarwidth = $('[data-item-id=ct-al__menu-sidebar]').width();
                if (sideBarRight == windowWidth) {
                    $('[data-item-id=ct-al__menu-sidebar]').animate({
                        right: '0px'
                    }, 500);
                    $('[data-item-id=ct-al__menu-sidebar-overlay]').css("display", "block");
                    $('body').css("overflow-y", "hidden");
                } else {
                    sidebarwidth = -sidebarwidth;
                    $('[data-item-id=ct-al__menu-sidebar]').animate({
                        right: sidebarwidth
                    }, 500);
                    $('[data-item-id=ct-al__menu-sidebar-overlay]').css("display", "none");
                    $('body').css("overflow-y", "auto");
                }
            } else {
                var sideBarLeft = $('[data-item-id=ct-al__menu-sidebar]').offset().left;
                var sidebarwidth = $('[data-item-id=ct-al__menu-sidebar]').width();
                if (sideBarLeft == 0) {
                    sidebarwidth = -sidebarwidth;
                    $('[data-item-id=ct-al__menu-sidebar]').animate({
                        left: sidebarwidth
                    }, 500);
                    $('[data-item-id=ct-al__menu-sidebar-overlay]').css("display", "none");
                    $('body').css("overflow-y", "auto");
                } else {
                    $('[data-item-id=ct-al__menu-sidebar]').animate({
                        left: '0px'
                    }, 500);
                    $('[data-item-id=ct-al__menu-sidebar-overlay]').css("display", "block");
                    $('body').css("overflow-y", "hidden");
                }
            }
        }

        function scrollContent(value) {
            var amount = value;
            var scroll = parseInt($('[data-item-id=ct-al__menu-wslink-container]').css('marginTop')) + amount;
            var listHeight = $('[data-item-id=ct-al__menu-wslink-container]').height();
            var scrollContHeight = $('[data-item-id=ct-al__menu-ws-list]').height();
            var listMarginTop = parseInt($('[data-item-id=ct-al__menu-wslink-container]').css('marginTop'));

            if (listMarginTop <= 0 && listHeight >= (scrollContHeight + (-listMarginTop)) && scroll < 0) {
                $('[data-item-id=ct-al__menu-wslink-container]').animate({
                    marginTop: scroll
                }, 1, function() {
                    if (scrolling) {
                        scrollContent(value);
                    }
                });
            } else if (listMarginTop < 0 && scroll > listMarginTop) {
                $('[data-item-id=ct-al__menu-wslink-container]').animate({
                    marginTop: scroll
                }, 1, function() {
                    if (scrolling) {
                        scrollContent(value);
                    }
                });
            }

            scrollVisibility();
        }

        function heightSetter() {
            var headerHeight = $('[data-item-id=ct-al-menu__header]').outerHeight();
            var userInfoHeight = $('[data-item-id=ct-menu-mobile__ws-user-info]').outerHeight();
            var WindowHeight = $(window).outerHeight();
            if ($('[data-item-id=ct-menu-mobile__ws-user-info]').is(':visible')) {
                var reqHeight = WindowHeight - (headerHeight + userInfoHeight);
            } else {
                var reqHeight = WindowHeight - headerHeight;
            }
            $('[data-item-id=ct-al__menu-ws-list]').css('height', reqHeight);
        }

        function scrollVisibility() {
            var listMarginTop = parseInt($('[data-item-id=ct-al__menu-wslink-container]').css('marginTop'));
            var listHeight = $('[data-item-id=ct-al__menu-wslink-container]').height();
            var scrollContHeight = $('[data-item-id=ct-al__menu-ws-list]').height();
            if (listMarginTop == 0) {
                $('[data-item-id=ct-al__menu-top-arrow]').addClass('hidden');
            } else {
                $('[data-item-id=ct-al__menu-top-arrow]').removeClass('hidden');
            }
            if (listHeight >= scrollContHeight + (-listMarginTop)) {
                $('[data-item-id=ct-al__menu-bottom-arrow]').removeClass('hidden');
            } else {
                $('[data-item-id=ct-al__menu-bottom-arrow]').addClass('hidden');
            }
        }

        heightSetter();
        scrollVisibility();
        $(window).on('resize', function() {
            heightSetter();
            scrollVisibility();
        });
        $(window).on('scroll', function() {
            heightSetter();
            scrollVisibility();
        });
        $(window).on('mousewheel', function() {
            heightSetter();
            scrollVisibility();
        });

    }
});

CLCR.registerCmp({
    "COMPONENT": "menuheader",
    "APPLICATION_FW": "JQTBS"
}, canvas.applnlayout.menu.header);
