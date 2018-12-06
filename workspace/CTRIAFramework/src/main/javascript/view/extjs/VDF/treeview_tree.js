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

Ext.namespace('iportal.treeview');

/**
 * constructor function which will be called by the clients of this components
 * with proper configurations. This is the entry point for this component.
 * @param {} config
 */
iportal.treeview.Tree = function(config){
    this.name = config.name || config.id;
    iportal.treeview.Tree.superclass.constructor.call(this, config);
};
/**
 * 
 * @class iportal.treeview.Tree
 * @extends Ext.tree.TreePanel
 */
Ext.extend(iportal.treeview.Tree, Ext.tree.TreePanel,  {
	 /**
     * @cfg {Boolean : lines} to specify disable tree lines 
     */
	lines :true,
	pathSeparator : ',',
	autoScroll: true,
	animate: true,
	border: false,
	selectedNode : null,
	isDataThere : false,
	
	/**
	 * 
	 * @returns
	 */
	
	initComponent:function(){
		
		this.selectedNode = null;
	
		var l = this.loader;
        if(!l){
            l = new iportal.treeview.TreeLoader({
                dataUrl: this.dataUrl,
                requestMethod: this.requestMethod,
                explorertree:this,
                baseParams : this.params ? this.params : {},
                defaultDataConfig : this.defaultDataConfig || null ,
                store: this.store
            });
        }else if(Ext.isObject(l) && !l.load){
            l = new iportal.treeview.TreeLoader(l);
        }
        else if(l) {
            l.createNode = function(attr) {
                if (!attr.uiProvider) {
                    attr.uiProvider = Ext.ux.tree.MultilineTreeNodeUI;
                }
                return Ext.tree.TreeLoader.prototype.createNode.call(this, attr);
            }
        }
        this.loader = l;
        
        this.loader.addListener('treeDataIndicator',this.datahandler,this);
     
        iportal.treeview.Tree.superclass.initComponent.apply(this);	
	},
	  
    afterRender : function(){
    	this.getRootNode().expand();
    	iportal.treeview.Tree.superclass.afterRender.apply(this, arguments);
    },
    
    datahandler:function(value){
    	
    	this.isDataThere = value; 
    
    },
    
    // change for removing liqudity refrence
    isDataAvailable:function(value){
    	
    	return this.isDataThere; 
    
    }


});

Ext.reg('iportal-tree', iportal.treeview.Tree);



