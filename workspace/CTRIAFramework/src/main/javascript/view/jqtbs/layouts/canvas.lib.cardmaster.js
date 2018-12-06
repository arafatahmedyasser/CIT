/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
cbx.ns('canvas.lib');
/**
 * @class "canvas.lib.cardmaster"
 * @extends "cbx.core.Component"
 * @description This component reads the config data passed to it and renders the workpsace list in card format. This is
 *              done by calling template in "cardmaster.cttpl". Also the click function for selecting a workspace is
 *              handled in the file.
 */
canvas.lib.cardmaster = Class(cbx.core.Component, {

    constructor: function(config) {
        var that = this;
        this.appContainerEle = config.elem;
        this.appContainer = config.appContainer;
        this.uData = config.uData;
        this.itemList = Array.prototype.slice.apply(config.wsArr);
        /**
         * This loop is to support multilingual. It gets the value of the String corresponding to the value of
         * WORKSPACE_DISPLAY_NM in the property file given in the BUNDLE_KEY.
         */
        for (var index = 0; index < this.itemList.length; index++) {
            this.itemList[index].ITEM_LABEL = cbx.isEmpty(CRB.getBundleValue(this.itemList[index].BUNDLE_KEY,
                    this.itemList[index].WORKSPACE_ID)) ? this.itemList[index].WORKSPACE_DISPLAY_NM : CRB
                .getBundleValue(this.itemList[index].BUNDLE_KEY, this.itemList[index].WORKSPACE_ID);
        }
        /**
         * The list of workspaces is passed to the template file (cardmaster.cttpl) and makes a callback to
         * applyTemplate.
         */
        var tmpLayer = new ct.lib.tmplLayer('cardmaster.cttpl', this.itemList);
        tmpLayer.getTemplate(this.applyTemplate, this);
    },
    /**
     * @method applyTemplate
     * @param template
     * @param tmpClass
     * @description This method gets the template, appends it to the parent element and adds click listener to switch
     *              workspaces.
     */
    applyTemplate: function(template, tmpClass) {

        if (!cbx.core.isEmpty(this.appContainerEle)) {
            $(this.appContainerEle).append(template);
        }

        var that = this;

        /**
         * When a workspace is clicked, the corresponding workspace is selected by binding a click event to each
         * workspace.
         */
        $(this.appContainerEle).find('[data-itemid=workspace]').unbind().bind('click', 'a[data-item=\'a-wslink\']',
            function(e) {
                e.preventDefault();
                var workspaceID = $(this).find('[data-itemtype=workspaceid]').data('itemid');
                var workspaceDN = iportal.workspace.metadata.getWorkSpaceById(workspaceID).WORKSPACE_DISPLAY_NM;
                var wsName = iportal.workspace.metadata.getWorkspaceManager().getContainer().workspaceDisplayName(workspaceID, workspaceDN);
                $("#HEADER_DIV").find('[data-item-id=ct-ws-title]').html(wsName);
                cbx.HashManager.setHash({'WORKSPACE_ID':workspaceID});
                //that.appContainer.switchWorkspace.apply(that.appContainer, [workspaceID, that.uData, true]);
                $("#HEADER_DIV").removeClass("ct-al-card__home-page").addClass("ct-al-card__ws-page");
            });

    }

});
CLCR.registerCmp({
    "COMP_TYPE": "CARDMASTER"
}, canvas.lib.cardmaster);
