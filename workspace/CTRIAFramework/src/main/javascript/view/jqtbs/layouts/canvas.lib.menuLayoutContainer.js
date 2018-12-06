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
 * @namespace 	cbx.ns("canvas.lib")
 * @class 		canvas.lib.LRMenuLayout
 * @extends	 	cbx.core.Component
 * @description This class contains the JQTBS specific Sub-Workspace Container component.This is responsibble for
 *              calling the required layout type to be rendered as per configuration in the database for the given
 *              subworkspace.
 */
canvas.lib.LRMenuLayout = Class(cbx.core.Component, {
    /**
     * @method 		initialize
     * @memberof 	canvas.lib.LRMenuLayout
     * @description Initializes the JS lib sub-workspace container component. Sub-Workspace container contains the
     *              layouts inside it.
     */
    initialize: function() {
        var me = this;
        cbx.core.ws.metadata.setCurrentLayoutObj(this);
        var treeConfig = {
            scope: this,
            parent: this.elem
        };
        this.createItems();
    },
    /**
     * @method 		createItems
     * @memberof 	canvas.lib.LRMenuLayout
     * @description This function creates the list of Layout containers that has to be displayed in the 
     * 				L-menu or R-menu.
     */
    createItems: function() {
        this.layArray = cbx.core.ws.metadata.getLayoutsForWS(this.WORKSPACE_ID); //Get the list of subworkspaces
        var treeData = [];
        var index = -1;
        for (var i = 0; i < this.layArray.length; i++) {
            if (this.layArray[i].PARENT_LAYOUT.length == 0) {
                var childArray = [];
                var obj = {};
                obj.ID = this.layArray[i].LAYOUT_ID;
                obj.NAME = this.layArray[i].LAYOUT_DISPLAY_NM;
                obj.text = this.layArray[i].LAYOUT_DISPLAY_NM;
                index++;
                obj.INDEX = index;
                obj.detail = "";
                obj.CHILDREN = [];
                obj.PARENT_ID = "";
                for (var j = 0; j < this.layArray.length; j++) {
                    if (this.layArray[i].LAYOUT_ID == this.layArray[j].PARENT_LAYOUT) {
                        var childObj = {};
                        childObj.ID = this.layArray[j].LAYOUT_ID;
                        childObj.NAME = this.layArray[j].LAYOUT_DISPLAY_NM;
                        childObj.text = this.layArray[j].LAYOUT_DISPLAY_NM;
                        index++;
                        childObj.INDEX = index;
                        childObj.detail = "";
                        childObj.PARENT_ID = this.layArray[i].LAYOUT_ID;
                        childObj.CHILDREN = [];
                        childArray.push(childObj);
                    }
                }
                obj.CHILDREN = childArray;
                treeData.push(obj);
            }
        }
        var tmpLayer = new ct.lib.tmplLayer('LRMenu.cttpl', {
            "data": treeData
        });
        tmpLayer.getTemplate(this.buildTree, this);
    },
    /**
     * @method 		buildTree
     * @memberof 	canvas.lib.LRMenuLayout
     * @description Renders the template and binds the handler events to the tree (layout container list).
     */
    buildTree: function(template) {
        $(this.elem).append(template);
        var that = this;
        $(this.elem).find("[data-item-id='ct-tree_name']").unbind("click").bind('click', function(e) {
            $(this).parents(".nav-list-main").children().find('.active').removeClass('active');
            $(this).children().addClass('active');
            var id = $(this).data("layout-id");
            var index = $(this).data("layout-index");
            that.resultHandler(id, index);
        });
        $(this.elem).find("[data-item-id='ct-tree_toggle']").unbind("click").bind('click', function(e) {
            if ($(this).parents("li").children().length < 1) return false;
            if ($(this).hasClass("flaticon-expand")) {
                $(this).removeClass("flaticon-expand").addClass("flaticon-collapse");
            } else {
                $(this).removeClass("flaticon-collapse").addClass("flaticon-expand");
            }
            $(this).parents("li").find('ul').toggle();
        });
        this.renderView();
    },
    /**
     * @method 		resultHandler
     * @memberof 	canvas.lib.LRMenuLayout
     * @description Renders the respective layout container in the sub-workspace container.
     */
    resultHandler: function(subWorkspaceId, index) {
        var scope = this;
        $("#subworkspaceContainer").empty();
        var lytMD = cbx.core.ws.metadata.getLayoutsForWS(this.WORKSPACE_ID)[index];
        var cClass = CLCR.getCmp({
            'COMP_TYPE': lytMD.LAYOUT_LAYOUT
        });
        cbx.core.ws.metadata.setCurrentLayoutId(subWorkspaceId);
        var config = {
            elem: $('#subworkspaceContainer'),
            parent: $('#subworkspaceContainer'),
            LAYOUT_ID: subWorkspaceId,
            WORKSPACE_ID: scope.WORKSPACE_ID,
            layout: lytMD.LAYOUT_LAYOUT,
            layoutProportion: lytMD.LAYOUT_PROPORTION
        };
        if (cClass) {
            this.layoutType = new cClass(config);
            config.layoutType = this.layoutType;
        }
        var widgetContainer = scope.layoutManager.widgetSelectionHandler(config);
    },
    /**
     * @method 		renderView
     * @memberof 	canvas.lib.LRMenuLayout
     * @description Renders the default layout for the sub-workspace container.
     * 				Also moves the R-menu to the right side of the container.
     */
    renderView: function() {
        var workspaceLayout = iportal.workspace.metadata.getWorkSpaceById(this.WORKSPACE_ID).WORKSPACE_LAYOUT;
        if ("R-MENU" == workspaceLayout) {
            $("#subworkspaeContainer").addClass("pull-left");
            $(this.elem).find("div[data-item-id='ct-treeView-menu']").addClass("pull-right");
            $(this.elem).find("div[id='subworkspaceContainer']").addClass("pull-left");
        }
        var attrFinder = '[data-layout-id=' + this.layArray[0].LAYOUT_ID + ']';
        $(this.elem).children().find(attrFinder).children().addClass('active');
        this.resultHandler(this.layArray[0].LAYOUT_ID, 0);
    },
    find: function(id, value) {
        var field = $(this.elem).find('div[data-widgetId="' + value + '"]')
        if (field.length > 0 && field[0].parentCt) {
            return [field[0].parentCt];
        }
        if (field.length > 0 && field[0]) {
            return $(field);
        } else {
            return null;
        }
    }
});
/*
 *	Registering the component. 
 */
CLCR.registerCmp({
    'COMP_TYPE': 'L-MENU_LAYOUT_CONTAINER'
}, canvas.lib.LRMenuLayout);
CLCR.registerCmp({
    'COMP_TYPE': 'R-MENU_LAYOUT_CONTAINER'
}, canvas.lib.LRMenuLayout);