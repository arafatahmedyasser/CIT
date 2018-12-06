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
Ext.namespace('iportal.util.clone');
iportal.util.clone= function(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = obj.constructor(); 
	if(temp!=null){
    for(var key in obj)
        temp[key] = iportal.util.clone(obj[key]);
    return temp;
	}
	/*else{
		return obj;
	}*/
}


/*
@class		iportal.layout.data


Data definition for serializing the layout data to JSON

*/
Ext.namespace('iportal.layout.data');

iportal.layout.data= function(config){
	this.layoutType;
	this.leftColumnWidth;
	this.centerColumnWidth;
	this.rightColumnWidth;
	this.leftColumns;
	this.rightColumns;
};

iportal.layout.data.item= function(config){
	this.title;
	this.id;
	this.compId;
};

var generatedIds="";
iportal.layout.util= function(){
	this.getUniqueId=getUniqueId;
};

function getUniqueId(){
var check=false;
	while(!check){
		var randomNumber=Math.floor(Math.random()*10000)
		if(generatedIds.indexOf("["+randomNumber+"]")==-1)
		{
			generatedIds+="["+randomNumber+"]"
			check=true;
			return randomNumber;
		}
	}

}

/*
@class	 iportal.layout.LayoutManager


This class is used to create a Layout  and add component to it using the JSON string prepared by the layout class.
This will be usefull for re-initializing the user's workspace from the database.

 Currently it doesnot sends callback to its cotainer CustomTabPanel for updating the Widget Catalog icons
*/

Ext.namespace('iportal.layout.LayoutManager.prepare');
iportal.layout.LayoutManager= function(data){
	this.prepare=prepareLayout;
	this.constructComponent=constructComponent;
	this.constructComponents=constructComponents
	return this.prepare(data);
}

function prepareLayout(data)
{
	if(data!=null){
		var config= {
			xtype:data.layoutType,
			leftColumnWidth:data.leftColumnWidth,
			rightColumnWidth:data.rightColumnWidth
		}

		var container=Ext.create(config)
		if(data.layoutType.toUpperCase().indexOf("STACK")==-1){
	
			if(data.leftColumns!=null){
				container= this.constructComponents(data.leftColumns, container, "addLeft")
			}

			if(data.rightColumns!=null){
				container= this.constructComponents(data.rightColumns, container, "addRight")
			}

			if(data.centerColumns!=null){
				container= this.constructComponents(data.centerColumns, container, "addCenter")
			}
		}
		else{
			if(data.centerColumns!=null){
				container= this.constructComponents(data.centerColumns, container, "addItems")
			}
		}
		return container;
	}
}

function constructComponents(compList, parentContainer, methodCall){
	if(compList!=null){
		for(var i=0; i<compList.length;i++){
			if(compList[i]!=null)
			{
				try{
					parentContainer[methodCall](this.constructComponent(compList[i]))
				}
				catch(e){
					alert("error adding components: "+e)
				}
			}
		}
	}
	return parentContainer;
}

function constructComponent(componentData){
	if(componentData!=null){
		try{
			return iportal.layout.component.rendermap()[componentData.compId].getComponentInstance();
		}
		catch(e){
			return null;
		}
	}

}




