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

cbx.ns('canvas.lib');
/**
 * @className	canvas.lib.listDataRenderer
 * @description	This class is responsible to generate the templates and render the list view on the screen
**/

canvas.lib.listDataRenderer= Class({
	
	/**
	 * 	Function to render header.
	 */
	renderListHeader: function(config){
		var templateUrl = "listHeader.cttpl";
		var tplLayer = new ct.lib.tmplLayer(templateUrl,config);
		this.fieldPosInGroup = config.fieldPosInGroup;
		tplLayer.getTemplate(this.applyHeaderTemplate, this);
	},
	
	/**
	 * 	Appends the template to Header container and binds its events.
	 */	
	applyHeaderTemplate: function(template){
		this.listHeaderCont.html(template);
		if(this.fieldPosInGroup){
			/* Adjust the header spacing */
			/*for(var i=0; i<this.fieldPosInGroup.length; i++){
				this.listHeaderCont.find('[data-item-header]').prepend("<th class='spacer' data-group-index ="+(i+1)+" colspan='1'></th>");
			}*/
		}
		this.handlerRegistryObj.bindListHeaderHandlers({headerDOM:this.listHeaderCont, scope:this.listview });	
	},
		
	/**
	 * 	Function to render Body.
	 */	
	renderListBody: function(config){
		var templateUrl = "listBody.cttpl";
		this.listview.listWrapperCont.find('[data-item-id=ct_empty_content]').addClass('hidden');
		this.parentGrpInd  = config.parentGrpInd;
		var tplLayer = new ct.lib.tmplLayer(templateUrl,config.listBodyData);
		tplLayer.getTemplate(this.applyBodyTemplate, this);
	},
	
	/**
	 * 	Appends the template to Body container and binds its events.
	 */	
	applyBodyTemplate: function(template){
		if(cbx.isEmpty(this.parentGrpInd)){
			this.listBodyCont.find("tr.load-more").before(template);
			this.handlerRegistryObj.bindListBodyHandlers({bodyDOM:this.listBodyCont, headerDOM:this.config.listHeaderCont, scope:this.listview});
			this.handlerRegistryObj.checkLoadMore(this.config);
		}else{
			if(this.listBodyCont.find('[data-grouped-header=true]').length > 0){
				var tmpl = $(template).filter('[data-grid-records]').attr('data-group-id',this.row_ind);
				if(tmpl.length == 0 ){
					tmpl = $(template).filter('.no-data').attr('data-group-id',this.row_ind);
				}
					this.listBodyCont.find('[data-grouped-header=true][data-group-index ='+this.parentGrpInd+'][data-row-index="'+this.row_ind+'"]').after(tmpl);
					this.handlerRegistryObj.bindListBodyHandlers({bodyDOM:this.listBodyCont, headerDOM:this.config.listHeaderCont, scope:this.listview, parentInd : this.row_ind});
			}else{
				this.listBodyCont.append(template);
			}
			
		}
		this.listview.viewConf.raiseEvent(CWEC.AFTER_TEMPLATE_LOAD,{elem:template});
		
	},
	renderGroupRows: function(config){
		var templateUrl = "listGroupRows.cttpl";
		this.listview.listWrapperCont.find('[data-item-id=ct_empty_content]').addClass('hidden');
		var tplLayer = new ct.lib.tmplLayer(templateUrl,config.groupedRows);
		this.grp_index = config.index;
		this.row_ind = config.parentRowInd;
		tplLayer.getTemplate(this.applyGroupRowsTemplate, this);
	},
	
	/**
	 * 	Appends the template to Body container and binds its events.
	 */	
	applyGroupRowsTemplate: function(template){
		if(this.grp_index==0)
			this.config.listBodyCont.append(template);
		else
			this.config.listBodyCont.find('tr[data-group-index ='+(this.grp_index-1)+'][data-row-index="'+this.row_ind+'"]').after(template);
		this.handlerRegistryObj.bindListGroupHandlers({bodyDOM:this.config.listBodyCont, headerDOM:this.config.listHeaderCont, scope:this.listview});
		
	},

	/**
	 * 	Function to render Filters.
	 */	
	renderFilters : function(config){
		var templateUrl = "listFilterCont.cttpl";
		if(this.config.viewType != 'ADVGROUP'){
			var tplLayer = new ct.lib.tmplLayer(templateUrl,config.listBodyData);
			tplLayer.getTemplate(this.applyFilterTemplate, this);
			this.renderListBody({
				listBodyData : config.listBodyData,
				parentGrpInd : config.parentGrpInd
			});
		}else{
			var tplLayer = new ct.lib.tmplLayer(templateUrl,config);
			tplLayer.getTemplate(this.applyFilterTemplate, this);
		}
		
	},

	/**
	 * 	Appends the template to Filters container.
	 */	
	applyFilterTemplate: function(template){
		this.config.listtbar.append(template);
		this.handlerRegistryObj.bindListFilterHandlers({scope:this.listview});
	},

	/**
	 * 	Function to render Footer.
	 */	
	renderListFooter : function(config){
		var templateUrl = "listFooter.cttpl";
		var tplLayer = new ct.lib.tmplLayer(templateUrl,config.listFooterData);
		tplLayer.getTemplate(this.applyFooterTemplate, this);
	},

	/**
	 * 	Appends the template to Footer container.
	 */		
	applyFooterTemplate : function(template){
		/**
		 * BO:Fixed as part Back Office integration
		 * If no footer throws an error, its causes IE issue
		 */
		if(!cbx.isEmpty(this.listFooterCont)){
			this.listFooterCont.append(template);
		}
	},
	
	/**
	 * 	Function to render LoadMore.
	 */	
	renderLoadMore : function(config){
		var templateUrl = "loadMore.cttpl";
		var tplLayer = new ct.lib.tmplLayer(templateUrl,config.loadMoreData);
		tplLayer.getTemplate(this.applyLoadMoreTemplate, this);
	},

	/**
	 * 	Appends the template to body container and binds its events.
	 */	
	applyLoadMoreTemplate: function(template){
		this.listBodyCont.append(template);
		this.config.renderBody();
		this.handlerRegistryObj.defaultEventHandler(this.config);
	},


	/**
	 * @method 		instantiateBindingHandlers
	 * @memberof 	"canvas.lib.listDataRenderer"
	 * @description listEventHandlerRegistry class is called here.
	 */	
	instantiateBindingHandlers : function(){
		this.handlerRegistryObj = new canvas.lib.listEventHandlerRegistry();
		this.handlerRegistryObj.listview = this.listview;
		this.handlerRegistryObj.listViewMD = this.listview.listViewMD;
		this.handlerRegistryObj.rendererData = this.listview.rendererData;
		this.handlerRegistryObj.contextMenuInitialiser();
	},
	
});