/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 *  
 */
/**
 * DEPLOY_MODULE_ID: FW 15
 */
Ext.namespace('cbx.layout');
/*
 * @class iportal.layout.menucontainerpanel class provides a container to load
 * all its child layout containers as a menu.
 */
cbx.layout.MenuContainerPanel = Ext.extend(
Ext.Panel, {
    rb: CRB.getFWBundle(),
    initComponent: function () {
    	/**
    	 * Added for RTL..L-MENU will render the menu pane on the right if RTL 
    	 * mode,otherwise on the left
    	 */
        var isRtlMode = iportal.preferences.isLangDirectionRTL();
        var region = null;
        if (isRtlMode == true) {
            region = (this.containerLayout == "R-MENU") ? 'west' : (this.containerLayout == "L-MENU") ? 'east' : 'west';
        } else {
            region = (this.containerLayout == "R-MENU") ? 'east' : (this.containerLayout == "L-MENU") ? 'west' : 'east';
        }
        var menuPanel = new Ext.Panel({
            layout: 'border',
            autoWidth: true,
            height: iportal.jsutil.getContainerResizeHeight(),
            items: [{
                region: 'center',
                border: true,
                items: this.createItems()
            }, {
                region: region,
                border: true,
                width: 200,
                title: this.rb['LBL_MENU_PANE'].toUpperCase() === 'NONE'?null:this.rb['LBL_MENU_PANE']
            	/**
            	 * Code to be uncommented if collapse feature is to be enabled
            	 */
            	/*,
                collapsible : true,
                collapsed : true,
                listeners: {
                    'collapse': function () {
                        this.ownerCt.getComponent(0).getLayout().activeItem.getComponent(0).setWidth(this.ownerCt.getComponent(0).getWidth());
                    },
                    'expand': function () {
                        this.ownerCt.getComponent(0).getLayout().activeItem.getComponent(0).setWidth(this.ownerCt.getWidth() - this.getWidth());
                    }
                }*/
            }]
        });
        /**
         * Getting the Component registered for the workspace from the registry.
         * Will be defaulted to TREE if component not registered for any workspace
         * whose Workspace Layout is L-LMENU or R-MENU
         */
        var menuType = MCR.getWsRenderer(iportal.workspace.metadata.getCurrentWorkspaceId());
        menuType = Ext.isEmpty(menuType) ? 'TREE' : menuType;
        var config = {
            menuType: menuType,
            menuPanel: menuPanel
        };
        /**
         * Calling the implementation class to render the registered component
         */
        var renderer = cbx.layout.MenuRenderer(config);
        menuPanel.getComponent(1).renderer = renderer;
        this.items = menuPanel;
        cbx.layout.MenuContainerPanel.superclass.initComponent.apply(this);
    },
    /**
     * The method which is reponsible for creating the layout definition in
     * the layout Pane.
     * Items will be created only if the metadata of a layout contains child 
     * widgets
     */
    createItems: function () {
        iportal.jsutil.reloadWidgetCatalog();
        var itemArr = new Array();
        for (var index = 0; index < this.childLayouts.length; index++) {
            if (this.childLayouts[index].CHILD_WIDGETS.length > 0) {
                itemArr[itemArr.length] = new iportal.layout.layoutcontainer({
                    itemId: this.childLayouts[index].LAYOUT_ID + "_LAYOUT_CONTAINER",
                    lytConf: this.childLayouts[index],
                    bundle: this.bundle,
                    header: false,
                    hidden: true,
                    listeners: {
                        "activate": iportal.jsutil.tabSelectionHandler,
                        scope: this,
                        "deactivate": iportal.jsutil.tabDeSelectionHandler
                    }
                });
            }
        }
        return [itemArr];
    },
    /**
     * Setting the first layout container as the active item
     * Highlighting the corresponding Tree node of the first
     * layout Container
     */
    afterRender: function () {
        var activeItem = this.getLayoutPane().getComponent(0);
        activeItem.initialHeight = activeItem.height;
        var layoutId = this.getLayoutId(activeItem.itemId);
        var activeNode = this.getComponent(0).getComponent(1).renderer.findTreeNode(layoutId);
        activeNode.fireEvent('click', activeNode);
        /**
         * Manually setting the selected Node as firing the 'click' event does
         * not update the TreeSelectionModel.
         */
        activeNode.ownerTree.getSelectionModel().selNode = activeNode;
        cbx.layout.MenuContainerPanel.superclass.afterRender.apply(this,arguments);
    },
    /**
     * substrings the layout id for the passed string and returns the result
     */
    getLayoutId: function (str) {
        var index = str.indexOf("_LAYOUT_CONTAINER");
        return str.substring(0, index);
    },
    /**
     * returns the Layout Pane i.e the first
     */
    getWidgetContainer: function () {
        return this.getLayoutPane().layout.activeItem.getComponent(0);
    },
    /**
     * Reponsible for removing the widgets in a layout
     */
    removeWidgets: function () {
        this.getLayoutPane().layout.activeItem.removeWidgets();
    },
    /**
     * Gets called when the User navigates to the master Screen from any workspace
     * and then re-enters the workspace. 
     * Activates a layout and does highlight operations accordingly.
     * 
     */
    renderWidgets: function () {
    	var activeItem = this.getLayoutPane().getComponent(0);//The item to be activated
    	//The node corresponding to the activeItem
    	var node = this.getComponent(0).getComponent(1).renderer.findTreeNode(this.getLayoutId(activeItem.itemId));
        var layoutId = null;
        var activeNode = null;
        if (!Ext.isEmpty(this.getLayoutPane().getLayout().activeItem)) {
            this.getLayoutPane().getLayout().activeItem.hide();
            this.getLayoutPane().getLayout().activeItem.setVisible(false);
            layoutId = this.getLayoutId(this.getLayoutPane()
                .getLayout().activeItem.itemId);
            activeNode = this.getComponent(0).getComponent(
            1).renderer.getHighlightedNode();
        }
        
        this.getLayoutPane().getLayout().activeItem = activeItem;
        this.getLayoutPane().getLayout().activeItem.show();
        activeItem.fireEvent('activate', activeItem);
        this.getLayoutPane().getLayout().activeItem.setVisible(true);
        node.ownerTree.getSelectionModel().selNode = node;
        layoutId = this.getLayoutId(activeItem.itemId);
        this.getComponent(0).getComponent(1).renderer.doHighlight(activeNode,node);

        /**
         * Collapsing all child nodes on re-render
         */
        for(var i=0;i<this.getMenuPane().items.length;i++){
        	this.getMenuPane().getComponent(i).collapseAll();
        	this.getMenuPane().getComponent(i).getRootNode().expand();
        }
    },
    /**
     * returns the layout definition panel
     */
    getLayoutPane: function () {
        return this.getComponent(0).getComponent(0);
    },
    /**
     * returns the menu pane
     */
    getMenuPane: function () {
        return this.getComponent(0).getComponent(1);
    }
});