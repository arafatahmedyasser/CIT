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

/*
@class	cbx.appstore.Splitter


This class overrides the Panel component and provides a pre-formatted 2/3 Column invisible container.
The container will align all the components added to it by itself and also make them draggable. 
 */
cbx.appstore.Splitter = Ext.extend(Ext.Panel, {
	width:200,
	height:200,
	containerHeight:200,
	tpl:this.tpl,
	autoScroll:false,
	proportion:[33,33,34],
	totalColumns:1,
	initComponent:function() {
		this.addEvents({statechange:true});
		var that=this;
		var portalWrapper={
				xtype:'panel',
				width:this.width,
				height:this.height,
				framework:true,
				autoScroll:true,
				layout:'border', 
				defaults: {
					split: true,
					bodyStyle: 'padding:15px;border-right:solid 1px #c0c0c0;border-left:solid 1px #c0c0c0;',
					minWidth : 0.2*(this.width)
				},
				items:[this.getWrappers()]
		};


		var defaultConfig = {
				autoScroll:false,
				items:[portalWrapper]
		};

		Ext.apply(this, defaultConfig);
		this.doLayout();
		cbx.appstore.Splitter.superclass.initComponent.apply(this);
		this.createItems();

	} 
,getWrappers:function(){
	var layArr={};

	layArr[0]="east";
	layArr[1]="center";
	layArr[2]="west";


	var columnWrappers=[];
	for(var i=0; i<3; i++){
		columnWrappers[i]={itemId:('WRAPPER'+i), region:layArr[i],border:false, width:0.5*(this.width), padding:1, items:[],listeners :{"afterlayout": this.afterLayout,scope:this}};
		if(this.proportion){
			var prop= this.proportion[2-i];
			if(prop!=null){
				if(prop>1){
					columnWrappers[i].width= (prop/100)*(this.width);
				}
				else{
					columnWrappers[i].width = prop*(this.width);
				}
			}
		}
	}

	return columnWrappers;



},afterLayout: function(){

	if(this.boxReady){
		this.fireEvent('afterResize',this.getLayoutData()); 
	}
}
//method call to add item in the left column of the container
,addLeft: function(item){
	this.items.itemAt(0).items.itemAt(0).add({border:true,itemId:item.itemId+"_WGT",items:[item]});
	this.resetHeight();

}//method call to add item in the center column of the container
,addCenter: function(item){
	this.items.itemAt(0).items.itemAt(1).add({border:true,itemId:item.itemId+"_WGT",items:[item]});
	this.resetHeight();

}	

//Method call to add item in the right column of the container
,addRight: function(item){
	this.items.itemAt(0).items.itemAt(2).add({border:true,itemId:item.itemId+"_WGT",items:[item]});
	this.resetHeight();

}
//Method to add components in the to container in its default left -> right 
//and top -> bottom approach
,addItem: function(item, itemAttrs){

	if(itemAttrs!=null && itemAttrs.BLOCK_POSITION!=null){
		if(itemAttrs.BLOCK_POSITION=="LEFT"){
			this.addRight(item);
			return;
		}else if(itemAttrs.BLOCK_POSITION=="CENTER"){
			this.addCenter(item);
			return;
		}else if(itemAttrs.BLOCK_POSITION=="RIGHT"){
			this.addLeft(item);
			return;
		}
	}
	var lCount=this.getComponent(0).getComponent(0).items.length;
	var cCount=this.getComponent(0).getComponent(1).items.length;
	var rCount=this.getComponent(0).getComponent(2).items.length;

	var funArr={};
	var leastCount;

	if(this.totalColumns == 3){
		funArr[lCount]="addLeft";
		funArr[cCount]="addCenter";
		funArr[rCount]="addRight";

		leastCount= (lCount<=cCount)?lCount:cCount;
		leastCount= (leastCount<= rCount)?leastCount:rCount;
	};
	if(this.totalColumns == 2){
		funArr[cCount]="addCenter";
		funArr[rCount]="addRight";

		leastCount= (rCount<=cCount)?rCount:cCount;
	};
	if(this.totalColumns == 1){
		funArr[cCount]="addCenter";
		leastCount= cCount;	
	};


	this[funArr[leastCount]](item);

	if(this.ownerCt!=null){
		this.ownerCt.doLayout();
	}

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
		this.getComponent(0).setHeight(calculatedHeight);
		this.setHeight(calculatedHeight);
	}else {
		this.getComponent(0).setHeight(this.containerHeight);
		this.setHeight(this.containerHeight);
	}
	if((Ext.isIE6 || Ext.isIE7) && !Ext.isIE8){
		if((lContainer.columnWidth + rContainer.columnWidth)>=1){
			lContainer.columnWidth= (lContainer.columnWidth*100 -(0.5))/100;
			rContainer.columnWidth=(rContainer.columnWidth*100 -(0.5))/100;
		}
	}
	this.doLayout(); 

},getTotalCalculatedHeight:function(container){
	var totalHeight=0;
	for(var i=0; i<container.items.length; i++){
		totalHeight+=100;
	}
	totalHeight+=40;
	return totalHeight;
},
panelCreator:function(record){



	var selpnl = new Ext.DataView({
		tpl: this.tpl,
		data:record.json,
		autoHeight:true,
		multiSelect: false,
		itemSelector:'div.template-wrap',
		overClass :'template-wrap-over',
		singleSelect:true,
		emptyText: 'No Widgets to display'

	});


	var pnl = new Ext.Panel({
		items:[selpnl],
		autoWidth:true,
		height:100,
		layout:'fit',
		border:true,
		itemId:record.json.WIDGET_ID,
		categoryId:record.json.PRODUCT_CATEGORY,
		widgetIndx:record.json.WGT_INDEX
	});

	selpnl.on('click', this.onClick, this, {
		delay: 100
	});



	return pnl;

},
updateItem: function(rec){	

	var widgetproto;

	widgetproto= this.panelCreator(rec);

	this.addItem(widgetproto, rec.json);

}

/*Intended to start loading it child widgets in case the container has passed childWidgets array*/
,createItems:function(selWidgets){
	if(!Ext.isEmpty(selWidgets)){

		for(var index=0,len = selWidgets.length ; index < len; index++){
			var widgetproto;

			var rec = new Ext.data.Record([selWidgets[index]]);
			widgetproto= this.panelCreator(rec);

			this.addItem(widgetproto,rec.json);

		}
	}
}	

,getLayoutData:function(){
	var temp= {};
	temp.totalWidth= this.getWidth();
	temp.leftColumnWidth=this.items.itemAt(0).items.itemAt(0).getWidth();
	temp.centerColumnWidth=this.items.itemAt(0).items.itemAt(1).getWidth();
	temp.rightColumnWidth=this.items.itemAt(0).items.itemAt(2).getWidth();

	var ld= {};
	ld.PROPORTION=this.getPercentage(temp);
	ld.CHILD_WIDGETS = this.getItemInfo();
	ld.LAYOUT_CATAGORY = this.getLayoutCategory();
	return ld;
},getLayoutCategory:function(){

	if(this.totalColumns == 3){return "THREE-COLUMN";};
	if(this.totalColumns == 2){return "TWO-COLUMN";};
	if(this.totalColumns == 1){return "STACK";};

},
getPercentage:function(obj){

	var first = obj.rightColumnWidth/obj.totalWidth*100;
	var second= obj.centerColumnWidth/obj.totalWidth*100;
	var third = obj.leftColumnWidth/obj.totalWidth*100;

	if(this.totalColumns == 3 && first>second && first>third){
		return (100-Math.floor(third + second))+","+Math.floor(second)+","+Math.floor(third);
	}
	else if(this.totalColumns == 3 && second>first && second>third){
		return Math.floor(first)+","+(100-Math.floor(first + third))+","+Math.floor(third);
	}
	else if(this.totalColumns == 3 && third>second && third>first){
		return Math.floor(first)+","+Math.floor(second)+","+(100-Math.floor(first + second));
	}
	else if(this.totalColumns == 2 && first>second){
		return (100-Math.floor(second))+","+Math.floor(second);
	}
	else if(this.totalColumns == 2 && second>first){
		return Math.floor(first)+","+(100-Math.floor(first));
	}
	else if(this.totalColumns == 1){return Math.floor(second);};

},
getItemInfo:function(){


	var wgtInfo= {};
	var funArr={};

	if(this.totalColumns == 3){funArr[0]="RIGHT";funArr[1]="CENTER";funArr[2]="LEFT";};
	if(this.totalColumns == 2){funArr[0]="CENTER";funArr[1]="RIGHT";funArr[2]="LEFT";};
	if(this.totalColumns == 1){funArr[0]="RIGHT";funArr[1]="CENTER";funArr[2]="LEFT";};


	for(var i=2;i>=0;i--){

		var cmp = this.getComponent(0).getComponent(i);
		var WgtList = this.getWrapperItems(cmp);
		wgtInfo[funArr[i]]=WgtList;
	}


	return wgtInfo;

},getWrapperItems:function(wrapper){

	var list = [];

	for(var i=0; i<wrapper.items.length; i++){
		if(wrapper.items.items[i].getItemId()){
			list.push(wrapper.items.items[i].getItemId().substring(0,wrapper.items.items[i].getItemId().lastIndexOf("_WGT")));
		}
	}
	return list;
},convertTo1column: function(){
	
	this.resetWidth();

	this.totalColumns = 1;

	var lCount=this.getComponent(0).getComponent(0).items.length;
	var rCount=this.getComponent(0).getComponent(2).items.length;

	var itemArray =[];
	for(var i=0; i<rCount; i++){
		var item = this.getComponent(0).getComponent(2).items.items[i];
		itemArray.push(item);
	}
	for(var i=0; i<lCount; i++){
		var item = this.getComponent(0).getComponent(0).items.items[i];
		itemArray.push(item);
	}

	for(var i=0; i<itemArray.length; i++){
		this.items.itemAt(0).items.itemAt(1).add(itemArray[i]);
	}


	this.items.itemAt(0).items.itemAt(0).hide();
	this.items.itemAt(0).items.itemAt(2).hide();

	this.resetHeight();

	if(this.ownerCt!=null){
		this.ownerCt.doLayout();
	}



},convertTo2column: function(){
	
	this.resetWidth();

	this.totalColumns = 2;

	var itemArray =[];
	var lCount=this.getComponent(0).getComponent(0).items.length;

	for(var i=0; i<lCount; i++){
		var item = this.getComponent(0).getComponent(0).items.items[i];
		itemArray.push(item);
	}

	for(var i=0; i<itemArray.length; i++){
		this.items.itemAt(0).items.itemAt(1).add(itemArray[i]);
	}


	this.items.itemAt(0).items.itemAt(0).hide();
	this.items.itemAt(0).items.itemAt(2).show();

	this.resetHeight();


	if(this.ownerCt!=null){
		this.ownerCt.doLayout();
	}



},convertTo3column: function(){

	this.resetWidth();
	
	this.totalColumns = 3;

	this.items.itemAt(0).items.itemAt(0).show();
	this.items.itemAt(0).items.itemAt(2).show();

	this.resetHeight();

	if(this.ownerCt!=null){
		this.ownerCt.doLayout();
	}



},onClick : function(item,obj,divEle,brwserEvnt){

	if('x-tool x-tool-iportalMove' == brwserEvnt.target.className)
	{
		x = brwserEvnt.browserEvent.clientX;  
		y = brwserEvnt.browserEvent.clientY;

		var menu = new Ext.menu.Menu({
			plain: true,
			hideBorders :true,
			cls : 'x-tool-move-wrap',
			items: {
				xtype: 'buttongroup',
				border :false,
				bodyBorder :false,
				hideBorders :true, 
				columns: 2,
				defaults: {
					xtype: 'button',
					scale: 'small',
					iconAlign: 'center',
					cls :'noborder-icon-text',
					border :false
				},
				items: [{
					colspan: 2,
					iconCls: 'Up',
					overCls: 'Up-over',
					tooltip: 'Up',
					ctCls : 'x-btn-up',
					width:39,
					handler: function(){

						menu.hide();

						setTimeout(function(){
							try{
								var cmp = Ext.getCmp(item.ownerCt.ownerCt.id);
								var comp2 = cmp.cloneConfig();
								var cmpWrapper = cmp.ownerCt;
								var pos=0;



								for(var i=0; i<cmpWrapper.items.items.length; i++){
									if(cmp.getItemId()==cmpWrapper.items.items[i].getItemId()){
										pos = i-1;
										break;
									}
								}

								if(pos == -1){
									pos=0;
								}
								cmpWrapper.remove(cmp);
								cmpWrapper.insert(pos, comp2);
								cmpWrapper.doLayout();


							}catch(e){};
						}, 800);




						Ext.fly(item.ownerCt.ownerCt.id).fadeOut('t',{
							easing: 'easeOut',
							remove  : false,
							duration: 750,
							useDisplay: true
						});



					}
				},{
					colspan: 1,
					iconCls: 'Left',
					tooltip: 'Left',
					overCls: 'Left-over',
					ctCls : 'x-btn-left',
					handler: function(){


						menu.hide();

						setTimeout(function(){
							try{
								var cmp = Ext.getCmp(item.ownerCt.ownerCt.id);
								var comp2 = cmp.cloneConfig();
								var cmpWrapper = cmp.ownerCt;
								var pos=0;
								var insrtwrap = cmpWrapper;
								
								var that = cmpWrapper.ownerCt.ownerCt;


								for(var i=0; i<cmpWrapper.items.items.length; i++){
									if(cmp.getItemId()==cmpWrapper.items.items[i].getItemId()){
										pos = i;
										break;
									}
								}


								
								if((cmpWrapper.region=="east" && that.totalColumns == 3)  || (cmpWrapper.region=="west" && that.totalColumns == 2))
									insrtwrap = cmpWrapper.ownerCt.items.items[1];
								if(cmpWrapper.region=="center" && ( that.totalColumns == 3 || that.totalColumns == 2 ))
									insrtwrap = cmpWrapper.ownerCt.items.items[2];
								if(cmpWrapper.region=="west" && that.totalColumns == 3)
									insrtwrap = cmpWrapper.ownerCt.items.items[0];


								cmpWrapper.remove(cmp);
								insrtwrap.insert(pos, comp2);
								insrtwrap.doLayout();
								cmpWrapper.doLayout();


							}catch(e){};
						}, 800);




						Ext.fly(item.ownerCt.ownerCt.id).fadeOut('t',{
							easing: 'easeOut',
							remove  : false,
							duration: 750,
							useDisplay: true
						});





					}
				},{
					colspan: 1,
					iconCls: 'Right',
					tooltip: 'Right',
					overCls: 'Right-over',
					ctCls : 'x-btn-right',
					handler: function(){


						menu.hide();

						setTimeout(function(){
							try{
								var cmp = Ext.getCmp(item.ownerCt.ownerCt.id);
								var comp2 = cmp.cloneConfig();
								var cmpWrapper = cmp.ownerCt;
								var pos=0;
								var insrtwrap = cmpWrapper;

								var that = cmpWrapper.ownerCt.ownerCt;

								for(var i=0; i<cmpWrapper.items.items.length; i++){
									if(cmp.getItemId()==cmpWrapper.items.items[i].getItemId()){
										pos = i;
										break;
									}
								}


								
								if(cmpWrapper.region=="east" && that.totalColumns == 3 || (cmpWrapper.region=="center" && that.totalColumns == 2))
									insrtwrap = cmpWrapper.ownerCt.items.items[2];
								if(cmpWrapper.region=="center" && that.totalColumns == 3)
									insrtwrap = cmpWrapper.ownerCt.items.items[0];
								if(cmpWrapper.region=="west" && ( that.totalColumns == 3 || that.totalColumns == 2 ))
									insrtwrap = cmpWrapper.ownerCt.items.items[1];

								cmpWrapper.remove(cmp);
								insrtwrap.insert(pos, comp2);
								insrtwrap.doLayout();
								cmpWrapper.doLayout();



							}catch(e){};
						}, 800);




						Ext.fly(item.ownerCt.ownerCt.id).fadeOut('t',{
							easing: 'easeOut',
							remove  : false,
							duration: 750,
							useDisplay: true
						});





					}
				},{
					colspan: 2,
					iconCls: 'Down',
					tooltip: 'Down',
					overCls: 'Down-over',
					ctCls : 'x-btn-up',
					width:39,
					handler: function(){

						menu.hide();

						setTimeout(function(){
							try{
								var cmp = Ext.getCmp(item.ownerCt.ownerCt.id);
								var comp2 = cmp.cloneConfig();
								var cmpWrapper = cmp.ownerCt;
								var pos=0;



								for(var i=0; i<cmpWrapper.items.items.length; i++){
									if(cmp.getItemId()==cmpWrapper.items.items[i].getItemId()){
										pos = i+1;
										break;
									}
								}

								if(pos == cmpWrapper.items.items.length){
									pos=cmpWrapper.items.items.length-1;
								}
								cmpWrapper.remove(cmp);
								cmpWrapper.insert(pos, comp2);
								cmpWrapper.doLayout();

							}catch(e){};
						}, 800);




						Ext.fly(item.ownerCt.ownerCt.id).fadeOut('t',{
							easing: 'easeOut',
							remove  : false,
							duration: 750,
							useDisplay: true
						});



					}
				}]
			}
		});

		menu.showAt([x, y]); 

	}

	if('x-tool x-tool-iportalRemove' == brwserEvnt.target.className){

		var wgt =Ext.getCmp(item.ownerCt.id);

		var wgtid = wgt.widgetIndx;


		this.fireEvent('removewgt',parseInt(wgtid)); 

		setTimeout(function(){
			try{
				Ext.getCmp(item.ownerCt.ownerCt.id).destroy();
			}catch(e){};
		}, 800);


		Ext.fly(item.ownerCt.ownerCt.id).fadeOut('t',{
			easing: 'easeOut',
			remove  : false,
			duration: 750,
			useDisplay: true
		});



	}

	this.resetHeight();

},
resetWidth: function(){
	
	for(var i=0; i<3; i++){
		if(this.proportion){
			var prop= this.proportion[2-i];
			if(prop!=null){
				if(prop>1){
					this.items.itemAt(0).items.itemAt(i).setWidth((prop/100)*(this.width));
				}
				else{
					this.items.itemAt(0).items.itemAt(i).setWidth(prop*(this.width));
				}
			}
		}
	}
	
},

afterRender : function(){


	if(this.ownerCt!=null){
		this.ownerCt.doLayout();
	}

	cbx.appstore.Splitter.superclass.afterRender.apply(this, arguments);

	if(this.totalColumns == 3){this.convertTo3column();};
	if(this.totalColumns == 2){this.convertTo2column();};
	if(this.totalColumns == 1){this.convertTo1column();};
}

}); 

