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

Ext.ns('cbx.appstore');

/**
 * @class cbx.appstore.AvailableWidgetPanel
 * @extends Ext.util.Observable
 * 
 * This class creates the panel which is added in the available widgets area in canvas layout.
 * It has header with title and filterbox with go button.
 * It holds all the widgets in the form of Ext dataviews.
 * Please note the component must load the all the widgets at initial component is rendered.
 * Please note that filtering in the store is done twice to produce animation effect. 
 * The class contains important methods they are 
 * 		1) constructor 					- The place where the components are initialized like template, Dataview, Filter Box , Title, Store and the Workarea.  
 * 		2) afterLoading 				- The 'afterrender' method of the workarea where the data is filtered at first when it is update workspace.  
 * 		3) getPanel				 		- This returns the reference of the workarea.
 * 		4) onAdd						- This 'click' method added on the dataview.
 * 		5) categoryLoader				- This loads the respective widgets by filtering the respective widgets. 
 * 		6) updateFilterItems			- This is called when widget is removed from selected widget to added to the available widget area.
 * 		7) dummyMethod					- This is used as empty method used for intializing any communication to avoid errors.
 * The Class contains important properties they are
 * 		1) workspaceId					- The WorkspaceId of updating workspace. 
 * 		2) dataModel					- The datamodel holds PreRequired Data of widgets and their category 
 * 											and also the data of selected workspace widgets while updating the workspace.
 * 		3) canvas						- The Reference of the canvas class.
 * 		4) filteredItems				- The Reference of the the filtering component.
 * 		5) widgetStore					- The Reference of the store which holds all the widgets.
 * 		6) filter						- The Reference of the filter (Textfield) component.
 * 		7) header						- The Reference of the header (Label) component.
 * 		8) availWidgetView				- The Reference of the dataview component.
 * 		9) workarea						- The panel where the components of availableWidget panel are put in.	
 * 
 */	



cbx.appstore.AvailableWidgetPanel = Ext.extend(Ext.util.Observable, {
	
	/**
	 * @param config - contains Worspaceid while updating the workspace , 
	 * 							PreRequired data, Canvas reference
	 * It takes the class reference for all the properties that has been send through config object.
	 */
	
	constructor : function(config) {

		this.dataModel	=  config.dataModel;
		
		this.rb = CRB.getFWBundle();
		
		this.canvas		 = config.canvas;

		this.filteredItems = [];

		this.tpl = new Ext.XTemplate(
				'<tpl for=".">',
				'<div class="template-wrap" title="{SHORT_DESC}">',
				'<div class="template-wrap-inner"><div class="template-left">',
				'<div class="template-right">',
				'<div class="x-template-header"><h1 class="widgetTitle">{WIDGET_NAME}</h1>',
				'<div class="x-tools-wrap"><div class="x-tool x-tool-iportalAdd" ext:qtip="Add" style="display: block;">&nbsp;',
				'</div>',
				'<div class="x-tool x-tool-iportalHelp" ext:qtip="Help" style="display: block;">&nbsp;</div></div></div>',
				'<div class="description-holder icon-default icon-WGT_DEFAULT">',
				'<p class="description-text">{SHORT_DESC}</p>',
				'</div>',
				'</div>',
				'</div></div>',
				'</div>',
				'</tpl>'
		);

		this.widgetStore = new Ext.data.JsonStore({
			fields: [{name:'WIDGET_NAME'},
			         {name:'WIDGET_ID'},
			         {name:'PRODUCT_CATEGORY'},
			         {name:'SHORT_DESC'},
			         {name:'WGT_INDEX'}],
			         idProperty: 'WGT_INDEX',
			         data:this.dataModel.getProductCategory()[0].WIDGETS
		});
		
		


		this.filter = new Ext.form.TextField({name:'filterValue'});

		this.header = new Ext.form.Label({text:this.rb.LBL_AVAIL_WIDGETS});

		this.availWidgetView = new Ext.DataView({
			tpl: this.tpl,
			store:this.widgetStore,
			autoHeight:true,
			width:this.dataModel.getProductCategory()[0].WIDGETS.length * 253,
			multiSelect: false,
			plugins : [
			           new cbx.appstore.DataViewTransition({
			        	   duration  : 550,
			        	   idProperty: 'WGT_INDEX'
			           })
			           ],

			           itemSelector:'div.template-wrap',
			           overClass :'template-wrap-over',
			           singleSelect:true,
			           emptyText: this.rb.LBL_NO_WIDGETS

		});
		
		var that = this;
		
		this.widgetStore.on('load', function(options){
			
			  var widget_width = 253;
			  that.availWidgetView.setWidth(this.data.items.length * widget_width) ;
		});
		
		this.widgetStore.on('datachanged', function(options){
			
			  var widget_width = 253;
			  that.availWidgetView.setWidth(this.data.items.length * widget_width) ;
		});

		
		

		this.availWidgetView.on('click', this.onAdd, that, {
			delay: 100
		});



		this.workarea = new Ext.Panel({
			height:config.height,
			autoScroll:true,
			padding:4, 
			items: [this.availWidgetView],
			tbar:[this.header,{xtype: 'tbfill'},
			      this.filter,
			      new Ext.Toolbar.Button( {
			    	  text: this.rb.LBL_GO,
			    	  tooltip: this.rb.LBL_GO,
			    	  handler: function(btn,e) {
			    		  var filterVal = that.filter.getValue();
			    		  if('' == filterVal){
			    			  that.widgetStore.filterBy(
			    					  function(record) { 
			    						  return !that.filteredItems.contains(parseInt(record.get('WGT_INDEX')));},that 

			    			  );
			    			  
			    			  that.widgetStore.filterBy(
				    					  function(record) { 
				    						  return !that.filteredItems.contains(parseInt(record.get('WGT_INDEX')));},that 

				    			  );

			    		  }else{
			    			  that.widgetStore.filterBy( 
			    					  function(record) {
			    						  var gh =((!that.filteredItems.contains(parseInt(record.get('WGT_INDEX')))) 
			    								  && ((record.get('WIDGET_NAME').toLowerCase()).indexOf(filterVal.toLowerCase())>=0));
			    						  return gh;
			    						  },that	
			    			  );
			    			  
			    			  
			    			  that.widgetStore.filterBy( 
				    					  function(record) {
				    						  var gh =((!that.filteredItems.contains(parseInt(record.get('WGT_INDEX')))) 
				    								  && ((record.get('WIDGET_NAME').toLowerCase()).indexOf(filterVal.toLowerCase())>=0));
				    						  return gh;
				    						  },that	
				    		 );
			    		  }

			    	  }
			      })

			],
			holder:this,
			listeners: 
	          { 'afterrender':this.afterLoading,scope:this}


		});
	},
	/**
	 * 
	 * This method is used to update the Available widget as well as communicate to the selected widget 
	 * panel regarding the widgets that all exist is existing custom workspace. 
	 * This method is used only while updating the workspace. 
	 * 
	 */
	
	afterLoading:function(){
		
		if(this.dataModel.isUpdate()){
			
			var widgets = this.dataModel.getSelectedWorkspaceLayoutwidget();
			
			for(var i = 0, len = widgets.length; i < len; i++) {
				
				this.filteredItems.push(parseInt(widgets[i].WGT_INDEX)); 

				var indx = this.widgetStore.find('WGT_INDEX',widgets[i].WGT_INDEX);

				var rec = this.widgetStore.getAt(indx) ;
				
				var pos = {"BLOCK_POSITION":widgets[i].BLOCK_POSITION};
				
				Ext.apply(rec.json,pos);
				
				var params=[];
				params.push(rec);
				params.push(this.filteredItems.length);
				
				this.canvas.communicate('selectedWidgetPanel','selWidgetLoader',params);
			
			
			}
			
			

			this.widgetStore.filterBy(

						function(record) {

							var res = !this.filteredItems.contains(parseInt(record.get('WGT_INDEX')));

							return res;

						},this 



				);

				

				this.widgetStore.filterBy(

						function(record) {

							var res = !this.filteredItems.contains(parseInt(record.get('WGT_INDEX')));

							return res;

						},this 



				);

				

				

		}
		
	},
	
	/**
	 * @return - the workarea of the selected widget
	 * 
	 */
	getPanel:function(){
	
		return this.workarea;
	},
	
	/**
	 * This method is called while you add a widget from available widget panel to the selected widget panel
	 * 
	 * This checks for the clicked classname to check what tool has been clicked.
	 * For Addition of widget , 
	 * 				Step 1: Gets the WGT_INDEX to get the widget that has been clicked.
	 * 				Step 2: Filter that widget from the available widget panel.
	 * 				Step 3: Communicate to the Selected widget to say which this widget has been selected. 
	 * 
	 * 
	 */
	
	onAdd : function(item,obj,divEle,brwserEvnt){

		if('x-tool x-tool-iportalAdd' == brwserEvnt.target.className)
		{
			var divEleId = divEle.id;
			var recindex = divEleId.substring(divEleId.lastIndexOf("-")+1,divEleId.length);
			
			var rec = this.widgetStore.getById(parseInt(recindex));

			this.filteredItems.push(parseInt(rec.get('WGT_INDEX')));
			
			var params=[];
			params.push(rec);
			params.push(this.filteredItems.length);
			
			this.canvas.communicate('selectedWidgetPanel','selWidgetLoader',params);
			
			var filtercount = 0;
			var that=this;
			this.widgetStore.filter([ 
			                         { fn : function(record) {
			                        	 var res = !this.filteredItems.contains(parseInt(record.get('WGT_INDEX')));
			                        	 if(res == true){filtercount++;}
			                        	 return res;}, scope: this } 
			                         ]);
			
			  var filterVal = that.filter.getValue();
			  if(filterVal!=''){
			  that.widgetStore.filterBy( 
    					  function(record) {
	    						  var gh =((!this.filteredItems.contains(parseInt(record.get('WGT_INDEX')))) 
	    								  && ((record.get('WIDGET_NAME').toLowerCase()).indexOf(filterVal.toLowerCase())>=0));
	    						  return gh;
    						  },this);				
			  }			


		}		

	},
	/**
	 * This method is called while you select a category from a category panel
	 * This is communicated from the Category panel which category is clicked.
	 * 
     *		Step 1: Clears the Filter Textbox
	 * 		Step 2: Load the Selected widget panel with corresponding Category Widgets 
	 * 
	 */
	
	
	categoryLoader:function(params){

		this.filter.setValue('');
		
		// written two times for animation effect

		this.widgetStore.loadData(this.dataModel.getProductCategory()[params[0].typeIndex].WIDGETS);

		this.widgetStore.loadData(this.dataModel.getProductCategory()[params[0].typeIndex].WIDGETS);

		this.widgetStore.filterBy(
				function(record) {
					var res = !this.filteredItems.contains(parseInt(record.get('WGT_INDEX')));

					return res;
				},this 

		);
	},
	
	/**
	 * This method is called while you remove a widget from selected widget panel.
	 * Which moves the widget back to the Available widget panel.
	 * 
	 * This is communicated from the selected widget panel
	 * 
	 */
	
	
	updateFilterItems:function(params){
		
		this.filteredItems.removeByValue(params[0]);
		var that=this;

		this.widgetStore.filterBy(
				function(record) {
					var res = !this.filteredItems.contains(parseInt(record.get('WGT_INDEX')));
					return res;
				},this 

		);
		
		this.widgetStore.filterBy(
				function(record) {
					var res = !this.filteredItems.contains(parseInt(record.get('WGT_INDEX')));
					return res;
				},this 

		);
		
		  var filterVal = that.filter.getValue();
		  if(filterVal!=''){
		  that.widgetStore.filterBy( 
					  function(record) {
    						  var gh =((!this.filteredItems.contains(parseInt(record.get('WGT_INDEX')))) 
    								  && ((record.get('WIDGET_NAME').toLowerCase()).indexOf(filterVal.toLowerCase())>=0));
    						  return gh;
						  },this);				
		  }			
	},
	
	/**
	 * empty method used for intializing any communication to avoid errors.
	 * 
	 */
	dummyMethod :function(){
		
	}
});