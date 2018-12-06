/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
cbx.ns('canvas.applnlayout.app');
/**
 * @namespace "canvas.applnlayout.app"
 * @description This component is currently responsible Jquery Framework to rendered app layout footer.
 */

canvas.applnlayout.app.footer = Class({
    /**
     * @class "canvas.applnlayout.app.footer"
     * @description The constructor gets the metadata and parent element (#FOOTER)
     */
    headerData: null,
    parentElem: null,
    constructor: function(config) {
        this.customJSON = config.config;
        this.footerData = config.md || {};
        this.parentElem = config.parentElem;
        $(this.parentElem).addClass("ct-margintop-sm");
        /**
         * Appdock construction
         * homeButton - true only for those layouts that have master screen to navigate (ex : card layout)
         */
        if (iportal.workspace.metadata.isWidgetCatalogRequired()) {
            var appContainerConfig = {
                parent: config.parentElem,
                homeButton: false
            };
            var appLayoutComp = CLCR.getCmp({
                "COMP_TYPE": "APPDOCK",
            });
            var appObj = new appLayoutComp(appContainerConfig);
            iportal.workspace.metadata.setAppDock(appObj);
        }

    },
    /**
     * @method getFooterDOM
     * @memberof "canvas.applnlayout.app.footer"
     * @description This method gets the list of workspaces and passes it to the template (appfooter.cttpl) and makes a
     *              callback to applyTemplate.
     */
    getFooterDOM: function() {
        var AppFooter = {};
        AppFooter['FOOTER_REQ'] = this.customJSON.isFooterEnabled();
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

        AppFooter['WORKSPACES'] = wsList;
        var tmpLayer = new ct.lib.tmplLayer('al-app-footer.cttpl', AppFooter);
        tmpLayer.getTemplate(this.applyTemplate, this);

    },
    /**
     * @method applyTemplate
     * @memberof "canvas.applnlayout.app.footer"
     * @description This method gets the template, appends it to the parent element and adds click listener to switch
     *              workspaces.
     */
    applyTemplate: function(template, tmpClass) {
        var that = this;
        if (!cbx.core.isEmpty(this.parentElem)) {
            $(this.parentElem).append(template);
            if (!cbx.core.isEmpty(that.customJSON) && that.customJSON.isLandingPageRequired() == false) {
                $(".ct-al__app-each:first").addClass("ct-al__app-is_selected");
            }
        }

        $('.ct-al__app-each-js').unbind('click').bind('click', function() {
            $(this).parent().children().removeClass('ct-al__app-is_selected');
            $(this).addClass('ct-al__app-is_selected');
            var element = this;
            var workspaceID = $(element).find('.ct-al__wslink-icon-js').attr('data-item-id');
           // iportal.workspace.metadata.getWorkspaceManager().getContainer().switchWorkspace(workspaceID, null, true);
           /* var workspaceDN = iportal.workspace.metadata.getWorkSpaceById(workspaceID).WORKSPACE_DISPLAY_NM;
            var wsName = iportal.workspace.metadata.getWorkspaceManager().getContainer().workspaceDisplayName(workspaceID, workspaceDN);
            $('[data-item-id=ct-ws-title]').html(wsName);*/
            cbx.HashManager.setHash({'WORKSPACE_ID':workspaceID});
        });

        $("[data-item-id=ct-al__app-ws-list]").mCustomScrollbar({
            axis: "x"
        });
        if (iportal.preferences.isLangDirectionRTL()) {
            canvas.applnlayout.app.rtl();
        }
        $('[data-toggle="tooltip"]').tooltip({
            container: '.ct-al-app__footer'
        });

        if (this.customJSON.isLandingPageRequired() == true && iportal.workspace.metadata.isWidgetCatalogRequired()) {
            iportal.workspace.metadata.getAppDock().hideAppDock();
        }
    }
});
CLCR.registerCmp({
    "COMPONENT": "appfooter",
    "APPLICATION_FW": "JQTBS"
}, canvas.applnlayout.app.footer);
