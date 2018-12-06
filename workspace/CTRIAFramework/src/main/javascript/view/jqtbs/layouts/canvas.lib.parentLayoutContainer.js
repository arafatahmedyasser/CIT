cbx.ns("canvas.lib");


canvas.lib.parentLayoutContainer  = Class(cbx.Observable,{
	
	constructor: function(config){
		var workspaceLayout = iportal.workspace.metadata.getWorkSpaceById(config.WORKSPACE_ID).WORKSPACE_LAYOUT;
		var cClass= CLCR.getCmp({'COMP_TYPE':workspaceLayout+'_LAYOUT_CONTAINER'});
		if(cClass){					
			this.specificlayoutContainer=new cClass(config);
		}
	},
	reload :function(){
		this.specificlayoutContainer.reload.apply(this.specificlayoutContainer,arguments);
	},
	resetUiData :function(){
		this.specificlayoutContainer.resetUiData.apply(this.specificlayoutContainer,arguments);
	},
	indexOfLayoutId :function(){
		this.specificlayoutContainer.indexOfLayoutId.apply(this.specificlayoutContainer,arguments);
	},
	switchLayout :function(){
		this.specificlayoutContainer.switchLayout.apply(this.specificlayoutContainer,arguments);
	},
	tabSelectionHandler :function(){
		this.specificlayoutContainer.tabSelectionHandler.apply(this.specificlayoutContainer,arguments);
	},
	tabDeSelectionHandler :function(){
		this.specificlayoutContainer.tabDeSelectionHandler.apply(this.specificlayoutContainer,arguments);
	}
});
/**
 * 
 */
CLCR.registerCmp({'COMP_TYPE':'PARENT_LAYOUT_CONTAINER'}, canvas.lib.parentLayoutContainer);