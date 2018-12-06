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
 * @class iportal.treeview.TreeLoader
 * @extends Ext.tree.TreeLoader
 */
iportal.treeview.TreeLoader = Ext.extend(Ext.tree.TreeLoader, {
	constructor: function(config){
		  this.addEvents({
				"treeDataIndicator" : true
			});

			iportal.treeview.TreeLoader.superclass.constructor.call(this, config);
		},
	createNode : function(attr) {
        if (!attr.uiProvider) {
            attr.uiProvider = Ext.ux.tree.MultilineTreeNodeUI;
        }
        return Ext.tree.TreeLoader.prototype.createNode.call(this, attr);
    },
    preloadChildren : true,
    
    processResponse : function(response, node, callback, scope){
       
        var json = response.responseText;
        try {
            var o = response.responseData || Ext.decode(json);
            o = o.response;
            o = o.value;
            o = o.ALL_RECORDS;
            Ext.each(o,function(topNodes){
            	topNodes.topNode = true;           
            });
            o = this.insertDefaultDataConfig(o);
            node.beginUpdate();
            for(var i = 0, len = o.length; i < len; i++){
                var n = this.createNode(o[i]);
                if(n){
                    node.appendChild(n);
                }
            }
            node.endUpdate();
            this.runCallback(callback, scope || node, [node]);
          
        }catch(e){
            this.handleFailure(response);
        }
    },
    /**
    	Insert or alter some node attributes to make it fit for TreePanel. By default explorer view
    	will be recieving org chart response from server/ cached response from client , but this 
    	needs to be tailored accordingly to make it comfortable to work with explorer view.
    	@param _arr {Array} Array containing full response
    	@return result {Array} Array containing modified response
    */
    insertDefaultDataConfig : function(_arr){
    	
    	if(_arr==null){//for remove liqudity no data available refrence
    		
    		this.fireEvent("treeDataIndicator", true);
    	}
    	var node ;
    	var result = [];
    	for(var index = 0; index < _arr.length ; index++){
    		node = this.iterateNodes(_arr[index]);
    		result.push(node);
    	}
    	return result;
    },
    /*
    	This is a helper function used by insertDefaultDataConfig to iterate over all nodes to add or
    	modify node attributes
    	@param _node {Node} Node to modify
    	@return _node {Node} Modified node
    */
    iterateNodes : function(_node){
    	//iportal.liquidity.preferences.setNoStructure('false'); 
    	var textObj = _node.text;
    	var nodeText = '';
    	var nodeDetail = [];
    	if(_node){
    		nodeText = _node.NAME;
    		_node.id = _node.ID;

    	}
    	_node.textDetails = _node;
    	if( (_node.children == null) || (_node.children == 'null') ){
    		_node.leaf = true;
    	}else{
    		_node.expanded = true; 
    	}
    	_node.text = nodeText;
    	if(!_node.leaf){
    		_node.details = nodeDetail;
    		_node = Ext.apply(_node,this.defaultDataConfig);
    		if(_node.children && _node.children.length){
    			for(var jIndex = 0; jIndex < _node.children.length ; jIndex++){
    				_node.children[jIndex] = this.iterateNodes(_node.children[jIndex]);
    			}
    		}
    	}else{
    		_node.details = nodeDetail;
    	}
    	return _node;
    }
});