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
/*
@class	iportal.layout.threecolumn


This class overrides the Panel component and provides a pre-formatted 3 Column invisible container.
The container will align all the components added to it by itself and also make them draggable. 
*/
Ext.ns("iportal.layout");
iportal.layout.threecolumn = Ext.extend(iportal.layout.widgetcontainer, {
 
    border:false,
	autoWidth:true,
	autoScroll:false,
	containerHeight:0,
	totalColumns:3,//this field should not be overridden
	
	//method call to add item in the left column of the container
	addLeft: function(item){
		this.items.itemAt(0).items.itemAt(0).add({widgetContainer:this,border:true,itemId:item.itemId+"_PORTLET",items:[item]});
		if(this.appMVRegistry!=null){
			this.appMVRegistry.registerWidget(item.itemId, item);
		}
		this.resetHeight();
	}
	//method call to add item in the center column of the container
	,addCenter: function(item){
		this.items.itemAt(0).items.itemAt(1).add({widgetContainer:this,border:true,itemId:item.itemId+"_PORTLET",items:[item]});
		if(this.appMVRegistry!=null){
			this.appMVRegistry.registerWidget(item.itemId, item);
		}
		this.resetHeight();
	}	
	//Method call to add item in the right column of the container
	,addRight: function(item){
		this.items.itemAt(0).items.itemAt(2).add({widgetContainer:this,border:true,itemId:item.itemId+"_PORTLET",items:[item]});
		if(this.appMVRegistry!=null){
			this.appMVRegistry.registerWidget(item.itemId, item);
		}
		this.resetHeight();
	}
	// Method to add components in the to container in its default left -> right 
	// and top -> bottom approach
	,addItem: function(item, itemAttrs){
		item.isParentPortlet=true;
		if(itemAttrs!=null && itemAttrs.BLOCK_POSITION!=null){
			if(itemAttrs.BLOCK_POSITION=="LEFT"){
				this.addLeft(item);
				return;
			}else if(itemAttrs.BLOCK_POSITION=="CENTER"){
				this.addCenter(item);
				return;
			}else if(itemAttrs.BLOCK_POSITION=="RIGHT"){
				this.addRight(item);
				return;
			}
		}
		var lCount=this.getComponent(0).getComponent(0).items.length;
		var cCount=this.getComponent(0).getComponent(1).items.length;
		var rCount=this.getComponent(0).getComponent(2).items.length;
		var funArr={};
		funArr[lCount]="addLeft";
		funArr[cCount]="addCenter";
		funArr[rCount]="addRight";
		
		var leastCount= (lCount<=cCount)?lCount:cCount;
		leastCount= (leastCount<= rCount)?leastCount:rCount;
		
		this[funArr[leastCount]](item);
		
	},resetHeight:function(){
		var lContainer=this.getComponent(0).getComponent(0);
		var cContainer=this.getComponent(0).getComponent(1);
		var rContainer=this.getComponent(0).getComponent(2);
		var lHeight=this.getTotalCalculatedHeight(lContainer);
		var cHeight=this.getTotalCalculatedHeight(cContainer);
		var rHeight=this.getTotalCalculatedHeight(rContainer);
		var calculatedHeight=lHeight>rHeight?lHeight:rHeight;
		calculatedHeight= calculatedHeight>cHeight?calculatedHeight:cHeight;
					if(calculatedHeight>this.containerHeight){
				this.setHeight(calculatedHeight);
						}else {
				this.setHeight(this.containerHeight);
			}
			//getting rid of scrollbars getting clipped because of width calculation
			if((Ext.isIE6 || Ext.isIE7) && !Ext.isIE8){
				if((lContainer.columnWidth + rContainer.columnWidth)>=1){
					lContainer.columnWidth= (lContainer.columnWidth*100 -(0.5))/100;
					cContainer.columnWidth=(cContainer.columnWidth*100 -(0.5))/100;
					rContainer.columnWidth=(rContainer.columnWidth*100 -(0.5))/100;
				}
			}
		
		this.doLayout(); 
	}
	,getTotalCalculatedHeight:function(container){
		var totalHeight=0;
		for(var i=0; i<container.items.length; i++){
			if(container.getComponent(i).collapsed){
				totalHeight+=5;
			}else{
				totalHeight+=parseInt(container.getComponent(i).getComponent(0).height);
			}
		}
		totalHeight+=32*container.items.length;
		return totalHeight;
	}

,getLayoutData:function(){
	var ld= new iportal.layout.data();
	ld.layoutType=this.layoutType;
	ld.leftColumnWidth=this.leftColumnWidth;
	ld.centerColumnWidth=this.centerColumnWidth;
	ld.rightColumnWidth=this.rightColumnWidth;
	ld.leftColumns=this.getLeftColumns();
	ld.rightColumns=this.getRightColumns();

	return ld;
}
,afterRender : function(){
	if(this.ownerCt!=null){
		this.ownerCt.doLayout();
	}
	iportal.layout.threecolumn.superclass.afterRender.apply(this, arguments);
},
/*@@@ To calculate the widgets inside a container */
getWidgetPositions:function(){
		var container=this.getComponent(0);
		var totalColumns=container.items.length;
		var widPosition='RIGHT';
		var widPositionArr=new Array();
		var newWidgetStr;
		var newWidgetIDArr=new Array();
		var newWidgetArrObj=new Array();
		for(var ind=0; ind<totalColumns; ind++){
			var ddContainer=this.getComponent(0).getComponent(ind);
			var len=ddContainer.items.length;
			var col=this.getComponent(0).getComponent(ind).items.length;
				
				for(var i=0; i<len; i++){
					if(i==0){
						if(widPosition == 'RIGHT'){
							widPosition = 'LEFT';
						}else if(widPosition == 'LEFT'){
							widPosition = 'CENTER';
						}else{
							widPosition = 'RIGHT';
						}
						
					}
					var wid= ddContainer.items.itemAt(i);
					var wid_Id= wid.itemId.replace("_PORTLET","");
					var newWidgetArr={};
					newWidgetArr['WIDGET_ID']=wid_Id;
					newWidgetArr['BLOCK_POSITION']=widPosition;
					newWidgetArr['POSITION']=i;
					
					newWidgetArrObj.push(newWidgetArr);
					
					
				}
			
		}
	
		return newWidgetArrObj;
		  }

}); // eo extend
 
// register xtype
Ext.reg('iportal-3-column', iportal.layout.threecolumn); 


