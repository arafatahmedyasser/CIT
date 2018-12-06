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
 * DEPLOY_MODULE_ID: FW17
 */
/**
 * The Ads view panel which renders the Advertisement(HTML).
 * 
 * This creates a panel inside which the mif child sits.The Only compulsory
 * parameter which the mif needs is the defaultSrc.
 * 
 * The defaultSrc or the Advertisement source, in the current set up is the value of DEFAULT_SRC_ID of the 
 * VIEW_DEFINITION table.
 * 
 *  ------------------------------------------------------------------------------------------------------------------
 * | Value to be specified in the column DEFAULT_SRC_ID(SAMPLE):iportal/jsfiles/sample.html                           |
 * | Ensure a valid HTML file by the name sample.html is present in the path-> iportalweb/WebContent/iportal/jsfiles/ |
 *  ------------------------------------------------------------------------------------------------------------------
 *  
 * The Advertisement will be sized according to the height specified in WGT_HT_IN_PIXELS column of the 
 * WIDGET_DEFINITION table,or will use the default height of a widget.
 * 
 * Scrolling has been disabled for the Advertisements.
 * frameborder : 0,as it is not preferrable for the Advertisements to have border. 
 * 
 */



Ext.ns("iportal.view");
iportal.view.adsviewpanel = Ext.extend(Ext.Panel, {

	viewConf : null,
	conf : null,
	uri : null,
	headerAsText : false,
	autoScroll : null,
	
	
	
	getAdsUrl: function (adsList){
		var targetProd = null;
		var adsViewConfData = null; 
		var finalAdsList = [];
		var adsVwConfData = adsList['ADS_TARGET_MAP_DATA']; 
		var staticAdsInd = 'N';
		
		for(var k = 0; k<adsVwConfData.length; k++){
			var targetAds =  adsVwConfData[k];
			var priority = targetAds['PRIORITY'];
			if( priority== '1'){
				staticAdsInd = targetAds['STATIC_ADS_IND'];
				break;
			}	
		}
		
		if(staticAdsInd == 'Y') {
			
			var adUrl= null;
			var adpr = null;
			for(var i= 0;i<adsList.ADS_DATA.length;i++){
				var adsDtList = [];
				var adsMap = adsList.ADS_DATA[i];
				adUrl = adsMap['ADV_NAME'];
				adpr = adsMap['PRIORITY_VAL'];
				adsDtList.push(adUrl);
				adsDtList.push(adpr);
				
				if(adsDtList.length > 0){
					finalAdsList.push(adsDtList);
				}
			}
		}
		else {
			/*
		if (!Ext.isEmpty(adsList)){
			for(var i= 0;i<adsList.ADS_DATA.length;i++){
				var adsMap = adsList.ADS_DATA[i];
				
				var isQualifiedAds = true;
				var adsDataList = [];
				var ruleExp = adsMap['RULE_EXP']; 
				var arrRuleExp = this.getAllSubRules(ruleExp);
				var qualifierVal = null;
				var productVal;
				var profileVal;
				var screenVal;
				var appVal;
				var qualifier = null;
				if(isQualifiedAds){
				for(var j= 0; j< arrRuleExp.length; j++){
					var  exp = arrRuleExp[j];
					if(isQualifiedAds && exp.indexOf("Product")!= -1){
						if(exp.indexOf("ProductCode")!= -1){
							qualifierVal = 'ProductCode';
						}
						else if (exp.indexOf("ApplicationName")!= -1){
							qualifierVal = 'ApplicationName';
						}
						targetProd = this.getAdsTargetProductCode(adsList);
						productVal = this.getQualiferValue(exp);
						if(qualifierVal == 'ProductCode'){
							isQualifiedAds = this.isRuleQualified(targetProd,productVal);
							if(!isQualifiedAds){
								break;
							}	
						} 
						else if(qualifierVal == 'FunctionCode' && productVal != targetFunc){
							isQualifiedAds = this.isRuleQualified(targetFunc,productVal);
							if(!isQualifiedAds){
								break;
							}
						}
					}
					else if( isQualifiedAds && exp.indexOf("Profile")!= -1){
						var userData  = Ext.decode(cbx.ads.metadata.getuserProfileData());
						if(userData!= null && userData != undefined){
							var userDataMap = userData['USER_INFO'];
						}
						 	
						if(exp.indexOf("City")!= -1){
							qualifierVal = 'City';
						}
						if(exp.indexOf("CompanyID")!= -1){
							qualifierVal = 'CompanyID';
						}
						if(exp.indexOf("CompanyName")!= -1){
							qualifierVal = 'CompanyName';
						}
						if(exp.indexOf("DateOfBirth")!= -1){
							qualifierVal = 'DateOfBirth';
						}
						if(exp.indexOf("Region")!= -1){
							qualifierVal = 'Region';
						}
						if(exp.indexOf("Role")!= -1){
							qualifierVal = 'Role';
						}
						if(exp.indexOf("Segmentation")!= -1){
							qualifierVal = 'Segmentation';
						}
						profileVal = this.getQualiferValue(exp);
						if(qualifierVal == 'City'){
							isQualifiedAds = this.isRuleQualified(userDataMap['CITY'],profileVal);
							if(!isQualifiedAds){
								break;
							}
						}
						else if(qualifierVal == 'CompanyID'){
							isQualifiedAds = this.isRuleQualified(userDataMap['COMP_NAME'],profileVal);
							if(!isQualifiedAds){
								break;
							}
						}
						else if(qualifierVal == 'CompanyName'){
							isQualifiedAds = this.isRuleQualified(userDataMap['COMP_NAME'],profileVal);
							if(!isQualifiedAds){
								break;
							}
						}
						else if(qualifierVal == 'DateOfBirth'){
							
							
							isQualifiedAds = this.isRuleQualified_date(userDataMap['DOB'],profileVal);
						
							if(!isQualifiedAds){
								break;
							}
						}
						else if(qualifierVal == 'Region'){
							isQualifiedAds = this.isRuleQualified(userDataMap['REGION'],profileVal);
							if(!isQualifiedAds){
								break;
							}
						}
						else if(qualifierVal == 'Role'){
							isQualifiedAds = this.isRuleQualified(userDataMap['ROLE'],profileVal);
							if(!isQualifiedAds){
								break;
							}
						}
						else if(qualifierVal == 'Segmentation'){
							isQualifiedAds = this.isRuleQualified(userDataMap['SEGMENTS'],profileVal);
							if(!isQualifiedAds){
								break;
							}
						}
					}
					else {
						isQualifiedAds = false;
					}
				}
			}	
			if(isQualifiedAds){
				
				//adsUrl = adsMap['ADV_NAME'];
				adsUrl = adsMap['ADV_URL'];
				
				priority = adsMap['PRIORITY_VAL'];
				adsDataList.push(adsUrl);
				adsDataList.push(priority);
			}
			if(adsDataList.length > 0){
				finalAdsList.push(adsDataList);
			}
		}
	}
		*/}
		return finalAdsList;
	},
	/**
	 * Gets all the sub rules from the expressions.
	 */
	getAllSubRules: function(ruleExp){
		var ruleArr=[];
		if(ruleExp.indexOf('&')!= -1){
			ruleArr = ruleExp.split('&');
		}
		else if(ruleExp.indexOf('|')!= -1){
			ruleArr = ruleExp.split('|');
		}
		else {
			ruleArr.push(ruleExp);
		}
			return ruleArr;
	},
	/**
	 * private api to evaluate whethee the rule is a qualified one or not.
	 */
	isRuleQualified: function(actualVal ,expVal){
		var isQualified= false;
		
		if(expVal.indexOf('<=')!= -1){
			if(actualVal <= expVal.substring(expVal.indexOf('<=')+2)){
				isQualified = true;
			}
		}
		else if(expVal.indexOf('>=')!= -1){
			if(actualVal >= expVal.substring(expVal.indexOf('>=')+2)){
				isQualified = true;
			}
		}
		if(expVal.indexOf('=')!= -1){
			if(expVal.substring(expVal.indexOf('=')+1) == actualVal){
				isQualified = true;
			}
		}
		else if(expVal.indexOf('<>')!= -1){
			if(expVal.substring(expVal.indexOf('<>')+2) != actualVal){
				isQualified = true;
			}
		}
		
		else if(expVal.indexOf('<')!= -1){
			if(actualVal < expVal.substring(expVal.indexOf('<')+1)  ){
				isQualified = true;
			}
		}
		else if(expVal.indexOf('>')!= -1){
			if(actualVal > expVal.substring(expVal.indexOf('>')+1)){
				isQualified = true;
			}
		}
		
		return isQualified;	
	},
	
	
	isRuleQualified_date: function(actualVal ,expVal){
		var isQualified= false;
			
		if(expVal.indexOf('<=')!= -1){
			if(this.isLessOrEqual(expVal.substring(expVal.indexOf('<=')+2),actualVal)){
				isQualified = true;
			}
		}
		else if(expVal.indexOf('>=')!= -1){
			if(this.isGreaterOrEqual(expVal.substring(expVal.indexOf('>=')+2),actualVal)){
				isQualified = true;
			}
		}
		else if(expVal.indexOf('=')!= -1){
			if(this.isEqualdate(expVal.substring(expVal.indexOf('=')+1),actualVal)){
				isQualified = true;
			}
		}
		else if(expVal.indexOf('<>')!= -1){
			if(!this.isEqualdate(expVal.substring(expVal.indexOf('<>')+2),actualVal)){
				isQualified = true;
			}
		}
		else if(expVal.indexOf('<')!= -1){
			if(!this.isGreater( expVal.substring(expVal.indexOf('<')+1),actualVal) ) {
				isQualified = true;
			}
		}
		else if(expVal.indexOf('>')!= -1){
			if(this.isGreater( expVal.substring(expVal.indexOf('>')+1),actualVal)){
				isQualified = true;
			}
		}
		
		return isQualified;	
	},       
	// functions for comparing date 
	
	isEqualdate: function(firstdate,seconddate) {
		
		
		var firstAr=firstdate.split("/");
		var secAr=seconddate.split("/");
		 
		if(firstAr[1]== secAr[1] && firstAr[0] == secAr[0]){
			return true;
		}
		else
			return false;
		
	},
	
isGreater: function(firstdate,seconddate) {
		
		
		var firstAr=firstdate.split("/");
		var secAr=seconddate.split("/");
		
			if(firstAr[1]> secAr[1]){
				return true;
			}
			else if(firstAr[1]== secAr[1] && firstAr[0] > secAr[0]){
				return true;
			}
			else
				return false;
			
	},
	
isGreaterOrEqual: function(firstdate,seconddate) {
		
		
		var firstAr=firstdate.split("/");
		var secAr=seconddate.split("/");
		
		if(firstAr[1]> secAr[1]){
			return true;
		}
		else if(firstAr[1]== secAr[1] && firstAr[0] >= secAr[0]){
			return true;
		}
		else
			return false;
			
	},
	
	
	isLessOrEqual: function(firstdate,seconddate) {
		
		
		var firstAr=firstdate.split("/");
		var secAr=seconddate.split("/");
		
		if(firstAr[1]< secAr[1]){
			return true;
		}
		else if(firstAr[1]== secAr[1] && firstAr[0] <= secAr[0]){
			return true;
		}
		else
			return false;
			
	},
	
	
	/**
	 * Private api to get the targeted product code.
	 */
	getAdsTargetProductCode: function(adsData){
		
		var targetProd = null;
		var targetSubProd = null;
		var targetFunc = null;
		//getting the current ads view details
		var widget = this.ownerCt.ownerCt.ownerCt;
		var vw = IMM.getDefaultView(widget.itemId);
		var vwmdata = IMM.getView(vw).VIEW_MD;
		var currAdsViewId = vwmdata['VIEW_ID'];
		var adsViewConfData = adsData['ADS_TARGET_MAP_DATA']; 
		var adsTargetType = 'WSP'; // default. 
		var adsTargetId = null;
		for(var k =0; k<adsViewConfData.length; k++){
			var targetAds =  adsViewConfData[k];
			var adsViewId = targetAds['ADS_VIEW_ID'];
			var priority = targetAds['PRIORITY'];
			if(currAdsViewId==adsViewId && priority== '1'){
				adsTargetType = targetAds['ADS_TARGET_TYPE'];
				adsTargetId = targetAds['ADS_TARGET_ID'];
				break;
			}	
		}
		if(adsTargetType != null && adsTargetType == 'WSP'){
			var wsmdata = iportal.workspace.metadata.getUpdatedWS();
			targetProd = wsmdata['OD_PRODUCT'];
			targetSubProd = '';
		}
		// container type layout.
		else if(adsTargetType != null && adsTargetType == 'LAY'){
			var layoutmdata = iportal.workspace.metadata.getUpdatedLayoutDef(adsTargetId); 
			targetProd = layoutmdata['OD_PRODUCT'];
			targetSubProd = '';
		}
		// container type widgets.
		else if(adsTargetType != null && adsTargetType == 'WGT'){
			var vwdata = IMM.getDefaultView(adsTargetId);
			var vwdata = IMM.getView(vwdata).VIEW_MD;
			targetProd = vwdata['PRODUCT_CODE'];
			targetSubProd = vwdata['SUB_PRODUCT_CODE'];
		}
		return targetProd;
	},
	
	getQualiferValue: function(exp){
		var qualifierVal = null;
			if (exp.indexOf("<>")!= -1)
				qualifierVal = '<>'+ exp.substring(exp.indexOf("<>")+2,exp.indexOf(")")).trim();
			else if (exp.indexOf("<=")!= -1)
				qualifierVal = '<='+ exp.substring(exp.indexOf("<=")+2,exp.indexOf(")")).trim();
			else if (exp.indexOf(">=")!= -1)
				qualifierVal = '>='+ exp.substring(exp.indexOf(">=")+2,exp.indexOf(")")).trim();
			
			else if (exp.indexOf("<")!= -1)
				qualifierVal = '<'+ exp.substring(exp.indexOf("<")+1,exp.indexOf(")")).trim();
			else if (exp.indexOf(">")!= -1)
				qualifierVal = '>'+ exp.substring(exp.indexOf(">")+1,exp.indexOf(")")).trim();
			else if(exp.indexOf("=")!= -1)
				qualifierVal ='='+ exp.substring(exp.indexOf("=")+1,exp.indexOf(")")).trim();
				
			
		return qualifierVal;
	},
	

	
	initComponent : function (){
		// Ensure that we randomize the name of the iframe so that it is unique within this browser dom.
		this.iframeId = this.viewConf.VIEW_MD.VIEW_ID + '_' + cbx.id();
		var mif = new Ext.ux.ManagedIFrame.Panel({
			defaultSrc : this.uri,
			height : this.height,
			width : this.defaultWidth,
			scrolling : 'no',
			eventsFollowFrameLinks : true, 
			frameborder : 0,
			border : false,
			maskMessage : this.loadMask,
			name : this.iframeId,
			
			listeners : {
				afterRender : function (){
					var wgt = this.ownerCt.ownerCt.ownerCt.ownerCt;
					wgt.height = this.height;
					wgt.setHeight(this.height);
					if (wgt.updateHeight) {
						wgt.updateHeight(this.height);
					} else {
						wgt.mwc.updateHeight(this.height);
					}
					wgt.doLayout();
					if (wgt.ownerCt.ownerCt.ownerCt.ownerCt.resetHeight) {
						wgt.ownerCt.ownerCt.ownerCt.ownerCt.resetHeight();
					} else {
						wgt.ownerCt.ownerCt.ownerCt.ownerCt.doLayout();
					}
			
					
					var srcArr =[];
					srcArr = this.defaultSrc.split('?');
					
					if(srcArr[0]=='iportal/jsps/ads-default.html' || srcArr[0] == null || srcArr[0] == ''){
								
					Ext.Ajax.request({
					       params :{
							    "PAGE_CODE_TYPE":"ADS_ENGINE",
						       'INPUT_PRODUCT':'CUSER',
						       'INPUT_ACTION':'INIT_ACTION',
						       'INPUT_FUNCTION_CODE':'VSBLTY',
						       'INPUT_SUB_PRODUCT':'CUSER',
						       'PRODUCT_NAME':'CUSER'
	   						     },
	   						scope:this,     
							success: function(responseP,optionsP)
							{
								var responseData = Ext.decode(responseP.responseText);
								var adsList = responseData.ADS_DETAILS[0];
								var returnedAdsList = this.ownerCt.getAdsUrl(adsList);
								if(returnedAdsList.length == 0){
									var currwsmdata = iportal.workspace.metadata.getUpdatedWS();
									var defwsAds = this.ownerCt.getWorkspaceDefAdsUrl(currwsmdata['WORKSPACE_ID'],adsList);
									var wsdefads= [];
									wsdefads.push(defwsAds);
									wsdefads.push('1');
									returnedAdsList.push(wsdefads);
								}
								
								// if returnedAdsList is still empty, then send a dummy image name.
								// CxbAdsDisplay.jsp file will return the default ads image.
								if(returnedAdsList.length == 0){
									var dummyads=[];
									dummyads.push('dummy.jsp');
									dummyads.push('1');
									returnedAdsList.push(dummyads);
								}
								iportal.jsutil.loadDefaultAds(returnedAdsList,0,this);
							},
							failure : function(response) {}
								
						 }); 
					}
				}
			}
		});
		this.items = mif;
		iportal.view.adsviewpanel.superclass.initComponent.apply(this);

	},
	doLayout : function (){
		/*if (this.getWidth() < this.defaultWidth) {
			this.getComponent(0).setAutoScroll(true);
			this.getComponent(0).setWidth(this.getWidth());
		} else {*/
			this.getComponent(0).setAutoScroll(false);
			/*this.getComponent(0).setWidth(this.defaultWidth);
		}*/
	},

	formatDate : function(date){
		return Ext.isDate(date) ? Ext.util.Format.date(date, 'd/m/Y') : date;
	}
	
	/**
	 * Helper method to get the default ads for the workspace id passed as param.
	 */
	
	,getWorkspaceDefAdsUrl: function(wsid,adsdata){
		
		var wsdefadslist = adsdata['WS_DEF_ADS_MAP_DATA'];
		var defAds;
		if(wsdefadslist!=null && wsdefadslist!= undefined){
			for(var l = 0; l<wsdefadslist.length; l++){
				var data =  wsdefadslist[l];
				var wspid = data['WORKSPACE_ID'];
				if(wspid != null && wspid == wsid){
					defAds = data['ADS_IMAGE_NAME'];
					break;	
				}
			}
		}
		
		return defAds; 
	}
	


});

Ext.reg('iportal-adsviewpanel', iportal.view.adsviewpanel);