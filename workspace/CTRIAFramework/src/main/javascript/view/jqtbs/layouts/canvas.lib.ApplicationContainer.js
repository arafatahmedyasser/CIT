/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
cbx.ns("canvas.lib");
/**
 * @class "canvas.lib.AppContainer"
 * @extends "cbx.core.Component"
 * @description This is the application container which is rendered in the viewport and holds the items related to
 *              workspaces Currently in JQTBS it holds the workspace content and workspace menus.
 */
canvas.lib.AppContainer = Class(cbx.core.Component, {
    /**
     * @method initialize
     * @description Initializes the application container component. This method gets called whenever the
     *              class extends the component. It creates the container element where the application
     *              container and activated the workspace for rendering in it. In this method the worspace
     *              manager reference is got from the global varaible. The destroy method is also attached
     *              with remove event of the element.
     */
    initialize: function() {
        var me = this;
        this.wsManager = cbx.core.ws.metadata.getWorkspaceManager();
        var elem = $(this.elem).append('<div id="applicationContainer"></div>').find("div:first");
        this.setCmp(elem);
        elem.on("remove", function() {
            me.destroy();
        });
    },

    /**
     * @method indexOfWorkspaceId
     * @param workspaceID
     * @description This method is incharge of giving the index of workspace id for switching the workspace
     *              with the name of the workspace id.It iterates the complete list of workpsace to check
     *              the matching workspace id . When it finds it breaks the iteration and returns the index.
     */
    indexOfWorkspaceId: function(wsId) {
        var wsArr = cbx.core.ws.metadata.getWorkspaces();
        for (var index = 0; index < wsArr.length; index++) {
            if (wsArr[index].WORKSPACE_ID === wsId) {
                return index;
            }
        }
        return -1;
    },
    /**
     * @method switchWorkspace
     * @param workspaceId
     * @param initial data which the workpsace should be initialized.
     * @param ignoreMaster Application Layout Card specific param to ignore the card layout rendering.
     * @description This method switches the workpace with given workspace id by using the method
     *              indexOfWorkspaceId to find the index of the workspace. It also shows the application
     *              dock when it is required.It also empties the content before rendering the component.If
     *              it is Tab Application Layout, the switching of the workspace is stopped. Because it
     *              takes care of switching the workspaces. If it is Card Application Layout, then 
     *              all the workspaces are rendered in the Content Div. When there is only one workspace 
     *              in card layout, the worspace gets rendered.It also shows the apps dock when the 
     *              workspaces are activated.
     */
    switchWorkspace: function(wsId, uData, ignoreMaster) {
        var me = this;
        var wsArr = null;
        var index = me.indexOfWorkspaceId(wsId);
        var isDesignSet = iportal.systempreferences.getDesignCanvasInd();
        var layout = iportal.workspace.metadata.getApplicationLayout();
        wsArr = iportal.workspace.metadata.getWorkspaces();

        if ($(this.getCmp()).empty) {
            $(this.getCmp()).empty();
        }

        if (!cbx.isEmpty(wsArr[index].WORKSPACE_ACTIVATE_HANDLER)) {
            var result = CGH.getHandler(wsArr[index].WORKSPACE_ACTIVATE_HANDLER, wsId, me);
            if (!cbx.isPrimitive(result) || !result) {
                return;
            }
        }

        if (ignoreMaster != true && me.config.isLandingPageRequired() && (!cbx.isEmpty(me.config.getLandingPageComponentName())) && (((wsArr.length > 0 && isDesignSet) || (wsArr.length > 1 && !isDesignSet))) || wsArr.length == 0) {
            var landingPageComponentName = me.config.getLandingPageComponentName();
            var landingPageClass = CLCR.getCmp({
                'COMPONENT': landingPageComponentName,
                "APPLICATION_FW": "JQTBS"
            });
            if (landingPageClass) {
                this.landingPage = new landingPageClass({
                    parentElem: this.getCmp()
                }).getLandingDOM();
            }
            iportal.workspace.metadata.setCardMasterScreen(true);
            return;
        } else if ((canvas.isEmpty(uData) || uData.empty==true) && ignoreMaster != true && me.config.isLandingPageRequired() && (((wsArr.length > 0 && isDesignSet) || (wsArr.length > 1 && !isDesignSet))) || wsArr.length == 0) {
            var cardMasterConfig = {
                elem: this.getCmp(),
                appContainer: this,
                isDesignSet: isDesignSet,
                wsArr: wsArr,
                uData: uData
            };
            var cardMasterComp = CLCR.getCmp({
                "COMP_TYPE": "CARDMASTER",
            });
            var masterObj = new cardMasterComp(cardMasterConfig);
            iportal.workspace.metadata.setCardMasterScreen(true);
            return;
        } else {
            iportal.workspace.metadata.setCardMasterScreen(false);
        }

        if (iportal.workspace.metadata.isWidgetCatalogRequired()) {
            var appObj = iportal.workspace.metadata.getAppDock();
            appObj.showAppDock();
        }

        //					if (layout === 'TAB')
        //					{
        //						return;
        //					}

        if (index !== -1) {
            if ($(this.getCmp()).empty) {
                $(this.getCmp()).empty();
            }
            var config = {
                elem: this.getCmp(),
                appContainerConfig: this,
                WORKSPACE_ID: wsId,
                wsMD: wsArr[index],
                uData: uData,
                SYSTEM_WORKSPACE_IND: wsArr[index].SYSTEM_WORKSPACE_IND
            };
            this.wsManager.wsSelectionHandler(config);
        }
    },
    logoHandler: function(config) {
        var obj = CGH.getHandler('clickheaderlogo', config);

        var homeWorkspaceId = iportal.workspace.metadata.getWorkspaces()[0].WORKSPACE_ID;
        if (cbx.isEmpty(obj)) {
            this.switchWorkspace(homeWorkspaceId);
            return true;
        } else if (cbx.isObject(obj) || cbx.isFunction(obj)) {
            CGH.executeHandler('clickheaderlogo', config);
            return true;
        } else if (obj == false) {
            return false;
        }

    },
    workspaceDisplayName: function(currentWorkspaceId, currentWorkspaceDN) {
        var wsList = iportal.workspace.metadata.getWorkspaces();
        var bundle_key = null;
        for (var i = 0; i < wsList.length; i++) {
            if (wsList[i].WORKSPACE_ID == currentWorkspaceId)
                bundle_key = wsList[i].BUNDLE_KEY;
        }
        var wsName = CRB.getBundleValue(bundle_key, currentWorkspaceId);
        if (cbx.isEmpty(wsName) && !cbx.isEmpty(currentWorkspaceDN)) {
            wsName = currentWorkspaceDN;
        } else if (cbx.isEmpty(wsName) && (!cbx.isEmpty(currentWorkspaceId))) {
            wsName = currentWorkspaceId;
        } else if (cbx.isEmpty(wsName)) {
            wsName = "CANVAS TECHNOLOGY";
        }
        return wsName;
    }
});
/**
 * 
 */
CLCR.registerCmp({
    'COMP_TYPE': 'APPLICATION_CONTAINER'
}, canvas.lib.AppContainer);
