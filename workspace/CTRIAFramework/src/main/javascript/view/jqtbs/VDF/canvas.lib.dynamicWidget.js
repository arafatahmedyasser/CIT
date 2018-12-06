/**
 * @class canvas.lib.dynamicWidgetRenderer
 */
canvas.lib.dynamicWidgetAppRenderer = Class(cbx.core.Component, {
	initialize : function() {
		
		
		var that = this;
		//this.commManager = cbx.core.ws.metadata.getCurrentWorkspace().getWidgetContainer().commManager;
		//this.appMVRegistry = cbx.core.ws.metadata.getCurrentWorkspace().getWidgetContainer().appMVRegistry;
		var bundleKey= this.bundleKey && !cbx.isEmpty(this.bundleKey) ?this.bundleKey:CRB.getFWBundleKey()
		var widgetConfig = {
			WIDGET_ID : this.itemId,
			WGT_HEADER_IND : this.widgetHeaderInd ? "Y" : "N",
			WGT_TITLE : iportal.jsutil.getTextFromBundle(this.bundleKey,this.label),
			elem: $(this.container),			
			"CONTAINER_FLAG":this.isContainer,
			PORTLET_REQ: this.widgetHeaderInd = true ? true : false
		};
		
		if(cbx.isEmpty(widgetConfig.WGT_TITLE)){
			widgetConfig.WGT_HEADER_IND='N';
		}
		
		var widgetObj = new canvas.lib.app(widgetConfig);
		
	}
});
CLCR.registerCmp({
	"COMPONENT" : "DYNAMIC_WIDGET_RENDERER",
	"LAYOUT" : "CUSTOM"
}, canvas.lib.dynamicWidgetAppRenderer);