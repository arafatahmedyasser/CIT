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
cbx.namespace('cbx.formcontainer');
/*******************************************************************************
 * This function returns the buttons bar for Form Containers based on the Form
 * Container Metadata.
 * 
 
 */
cbx.formcontainer.buttonBars = function (){
	
	return {
		containerId:null,
		formMgrObj:null,
		//entlFuncList stores the List of the Prod-suprod-funcs the user is entitled to, 
		//in order to perform client side validation for the Form Container Buttons.
		entlFuncList:null, 
		formData:null,
		btnActionEventRasiedTimeStamp : null,
		/***********************************************************************
		 * This function returns the button bar for form container based upon
		 * the Form Container's metadata
		 * 
		 * @param formContainerData
		 *            Form Container Metadata
		 * @param formObj
		 *            Form Object created using Form Manager
		 * @param containerConfig
		 *            Additional Config based on which Action buttons will be
		 *            added from a Button MAP provided by the developer
		 *            overriding the buttons configured in the database for the
		 *            Form Containers.
		 */
		getBbarMenu : function (formContainerData, formObj, containerConfig){
	
			
			/* Loads entlFuncList with the List of the Prod-suprod-funcs the user is entitled to.*/
			if(this.entlFuncList==null){
			this.entlFuncList=formContainerData.ACTIONS[0].ENTL_FUNCTIONS;
			}
			
			
			var that = cbx.formcontainer.buttonBars;
			var con = cbx.formcontainer.constants;
			var bbarMenu = [];
			this.exitAction=null;
			this.containerId=formContainerData.CONTAINER_ID;
			this.formMgrObj=formObj;
			
			
			
			if(containerConfig.EXIT_ACTION){
				formContainerData.EXIT_ACTION=containerConfig.EXIT_ACTION;
			}
			
			
			// In the presence of an Action Button Map provided
			// by the developer, the Button metadata from the DB
			// will be discarded
			if (containerConfig.ACTIONS) {
				
				containerConfig['BTN_POSN']=formContainerData.BTN_POSN || {};
				
				that.addCustomAction(containerConfig, bbarMenu, formObj);
			} else {
				formContainerData.appWidget = containerConfig.appWidget; 				
				formContainerData.formConRenderType = containerConfig.formConRenderType;
				
				formContainerData.additionalConfig = containerConfig.additionalConfig;
				if(Ext.isEmpty(containerConfig.contextMenuConfig)){
					formContainerData.contextMenuConfig = containerConfig;
				}else{
					formContainerData.contextMenuConfig = containerConfig.contextMenuConfig;
				}
				
				that.addCustomAction(formContainerData, bbarMenu, formObj);
			}
				
			return bbarMenu;

		},
		/***********************************************************************
		 * This Function adds the Close action button to the Button Bar.
		 * 
		 * @param formContainerData
		 *            Form Container Metadata
		 * @param bbarMenu
		 *            Button bar
		 */
		addCloseAction : function (formContainerData, bbarMenu){
			var that = cbx.formcontainer.buttonBars;
			var rb = CRB.getFWBundle();
			var closeAction = {
				text : rb.TFD_CLOSE,
				appWidget : formContainerData.appWidget,
				formConRenderType: formContainerData.formConRenderType,
				cls : 'portal_neg_btn',
				handler : that.actionCloseHandler
			};			
			bbarMenu.push(closeAction);
			
			return bbarMenu;

		},
		/***********************************************************************
		 * This Function adds the Cancel action button to the Button Bar.
		 * 
		 * @param formContainerData
		 *            Form Container Metadata
		 * @param bbarMenu
		 *            Button bar
		 */
		addCancelAction : function (formContainerData, bbarMenu){
			var that = cbx.formcontainer.buttonBars;
			var rb = CRB.getFWBundle();
			var cancelAction = {
				text : rb.TFD_CANCEL,
				cls : 'portal_neg_btn',
				scope : formContainerData, 
				appWidget : formContainerData.appWidget,
				formConRenderType: formContainerData.formConRenderType,
				handler : that.actionCancelHandler
			};

			bbarMenu.push(cancelAction);

			return bbarMenu;

		},
		/***********************************************************************
		 * This Function adds the Custom action buttons as defined by the
		 * developer to the Button Bar.
		 * 
		 * @param formContainerData
		 *            Form Container Metadata
		 * @param bbarMenu
		 *            Button bar
		 * @param formObj
		 *            Form Object created using Form Manager
		 */
		addCustomAction : function (formContainerData, bbarMenu, formObj){
			var that = cbx.formcontainer.buttonBars;
			var customActions;
			var con = cbx.formcontainer.constants; 
			var rb = CRB.getFWBundle();
			// The developer's custom action button is fetched
			// from the DB
			if (formContainerData.ACTIONS) {
				customActions = formContainerData.ACTIONS;
				
				var contId=this.containerId;
				cbx.formcontainer.manager.formContainerMetadataObj[contId][contId]["ACTIONS"]=customActions;
				
			} else {
				customActions = formContainerData;
			}
			// For assigning the proper resource bundle for that product
			if (formContainerData.BUNDLE_KEY != undefined && formContainerData.BUNDLE_KEY != null && formContainerData.BUNDLE_KEY != "") { 
				rb = CRB.getBundle(formContainerData.BUNDLE_KEY);
			}

			
			var rightbuttons = [];
			var leftbuttons = [];
			var tabSpace = {
				xtype : 'tbfill'
			};
			var btnClass;
			var blockPos = iportal.preferences.getPostiveBtnAlign();
			var negPosn = iportal.preferences.getNegativeBtnAlign();
			for ( var i = 0; i < customActions.length; i++) {
				
				if (cbx.isObject(customActions[i]) && !cbx.isEmpty(customActions[i].ACTION_ID)) {
					if (customActions[i].ACTION_TYPE == 'NEGATIVE') {
						btnClass = 'portal_neg_btn';
						blockPos=(formContainerData.BTN_POSN && formContainerData.BTN_POSN.NEG_BTN_ALIGN != "") ? formContainerData.BTN_POSN.NEG_BTN_ALIGN : "RIGHT";
						negPosn=(formContainerData.BTN_POSN && formContainerData.BTN_POSN.NEG_BTN_ALIGN != "") ? formContainerData.BTN_POSN.NEG_BTN_ALIGN : "RIGHT";
					} else {
						btnClass = 'portal_pos_btn';
						blockPos=(formContainerData.BTN_POSN && formContainerData.BTN_POSN.POS_BTN_ALIGN != "") ? formContainerData.BTN_POSN.POS_BTN_ALIGN : "LEFT";
					}
				
					var customActionBtn = {
						text : rb["LBL_" + customActions[i].ACTION_ID],
						cls : btnClass+' '+customActions[i].ACTION_ID,
						formObj : formObj,
						btnPosition : blockPos,
						/*Component id has been replaced by itemId inorder to get rid of errors arising due to DOM ids */
						itemId:customActions[i].ACTION_ID, 
						buttonId : customActions[i].ACTION_ID,
						containerId : customActions[i].CONTAINER_ID,
						formConRenderType:formContainerData.formConRenderType,
						IS_MULTIPLE_FORM_CONTAINER:formContainerData.IS_MULTIPLE_FORM_CONTAINER, 
						// property added for previous containers - applicable
						// for Pre-Confirmation 
						prevContainerId : (customActions[i].TXN_CONTAINER_ID) ? customActions[i].TXN_CONTAINER_ID : "",
						prevFormId : (customActions[i].TXN_FORM_ID) ? customActions[i].TXN_FORM_ID : "",
						// property added for previous containers - applicable
						
						eventId : customActions[i].EVENT_ID,
						productCode : customActions[i].PRODUCT_CODE,
						subProdCode : customActions[i].SUBPRODUCT_CODE,
						functionCode : customActions[i].FUNCTION_CODE,
						actionCode : customActions[i].ACTION_CODE,
						pageCode : customActions[i].PAGE_CODE,
						hostCode : customActions[i].HOST_CODE,
						appWidget : formContainerData.appWidget, 
						requestType:(customActions[i].REQUEST_TYPE) ? customActions[i].REQUEST_TYPE : "", 
						handler : that.actionButtonHandler
					};

					
					/*isBtnEntitled() checks if the Action button is entitled or not. Returns Y/N. If the value is Y, the button gets renderred.*/
					if(this.isBtnEntitled(customActionBtn) == "Y"){ 
						
						if (customActionBtn.btnPosition=="RIGHT" /*customActions[i].ACTION_TYPE == "NEGATIVE"*/) {
							rightbuttons.push(customActionBtn);
						} else {
							leftbuttons.push(customActionBtn);
						}
						
					}
				}
			}

			
			if(formContainerData.EXIT_ACTION){  
				this.exitAction=formContainerData.EXIT_ACTION;
				cbx.formcontainer.manager.formContainerMetadataObj[this.containerId][this.containerId]["EXIT_ACTION"]= formContainerData.EXIT_ACTION; 
				if(this.exitAction==con.CANCEL){
					if(negPosn=="LEFT"){
						bbarMenu=that.addCancelAction(formContainerData, bbarMenu);
					}else{
						rightbuttons=that.addCancelAction(formContainerData, rightbuttons);
					}
				}else if(this.exitAction==con.CLOSE){
					if(negPosn=="LEFT"){
						bbarMenu=that.addCloseAction(formContainerData, bbarMenu);
					}else{
						rightbuttons=that.addCloseAction(formContainerData, rightbuttons);	
					}
				}
			}else if (formObj.mode != undefined) {
				if (formObj.mode == con.EDIT) {
					if(negPosn=="LEFT"){
						bbarMenu=that.addCancelAction(formContainerData, bbarMenu);
					}else{
						rightbuttons=that.addCancelAction(formContainerData, rightbuttons);	
					}
					this.exitAction=con.CANCEL;
				} else if ((formObj.mode.global != undefined)
							&& (formObj.mode.global == con.INIT || formObj.mode.global == con.EDIT)) {
					if(negPosn=="LEFT"){
						bbarMenu=that.addCancelAction(formContainerData, bbarMenu);
					}else{
						rightbuttons=that.addCancelAction(formContainerData, rightbuttons);	
					}
					this.exitAction=con.CANCEL;
				} else {
					if(negPosn=="LEFT"){
						bbarMenu=that.addCloseAction(formContainerData, bbarMenu);
					}else{
						rightbuttons=that.addCloseAction(formContainerData, rightbuttons);	
					}
					this.exitAction=con.CLOSE;
				}
			}
			
			
			bbarMenu.push(leftbuttons);
			bbarMenu.push(tabSpace);

			if (rightbuttons.length != 0) {
				bbarMenu.push(rightbuttons);
			}

			return bbarMenu;

		},
		/***********************************************************************
		 * This Function attaches the handler to the Custom Action buttons.
		 * 
		 * @param btnObj
		 *            Button Config Object
		 */
		actionButtonHandler : function (btnObj){
			var that = cbx.formcontainer.buttonBars;
			
			var dt= new Date();
		    if(that.btnActionEventRasiedTimeStamp == null)
		    	that.btnActionEventRasiedTimeStamp = dt;
		    if(dt == that.btnActionEventRasiedTimeStamp || dt >= that.btnActionEventRasiedTimeStamp.add(Date.SECOND, 3)){
		    	that.btnActionEventRasiedTimeStamp = dt;
			if (btnObj.eventId != null && btnObj.eventId != undefined && btnObj.eventId != "") {
				// Checks if there is any Custom Handler assigned to the Action
				// Button if not Executes the Default Handler
				if ("function" == typeof (CABR.getHandler(btnObj.buttonId, btnObj.containerId))) {
					that.actionCustomHandler(btnObj);
				} else {
					that.actionDefaultHandler(btnObj);
				}

			} else {
				that.actionCustomHandler(btnObj);
			}
		    }
		  
		},
		/***********************************************************************
		 * This is the default handler that is called in the presence of Event
		 * Id attached to a button.
		 * 
		 * @param btnObj
		 *            Button Config Object
		 */
		
		actionDefaultHandler : function (btnObj){
			
			if(GABR.getHandler(btnObj.eventType)){
				GABR.executeHandler(btnObj.eventType, btnObj);
			}else{
				new cbx.formcontainer.defaultActionBtnHandler(btnObj);
			}

		},
		
		/***********************************************************************
		 * This is the Custom handler that is called in the absence of Event Id.
		 * Developer is expected to define his handlers for the buttons using
		 * the instance CABR.
		 * 
		 * @param btnObj
		 *            Button Config Object
		 */
		actionCustomHandler : function (btnObj){
			
			CABR.executeHandler(btnObj.buttonId, btnObj.containerId, {
				appWidget : btnObj.appWidget,
				productCode : btnObj.productCode,
				subProdCode : btnObj.subProdCode,
				functionCode : btnObj.functionCode,
				actionCode : btnObj.actionCode,
				pageCode : btnObj.pageCode,
				hostCode : btnObj.hostCode,
				eventType : btnObj.eventType,
				formObj : btnObj.formObj,
				buttonId : btnObj.buttonId,
				containerId : btnObj.containerId,
				prevContainerId:btnObj.prevContainerId,
				prevFormId:btnObj.prevFormId,
				eventId : btnObj.eventId,
				eventPreProcessors : btnObj.eventPreProcessors,
				requestType:btnObj.requestType, 
				txnStatus : btnObj.txnStatus,
				btnRef:btnObj,
				formConRenderType:btnObj.formConRenderType,
				contextMenuConfig : btnObj.contextMenuConfig,
				IS_MULTIPLE_FORM_CONTAINER:btnObj.IS_MULTIPLE_FORM_CONTAINER
			});
		},
		/***********************************************************************
		 * This is Cancel handler attached to the Cancel Action Button.
		 */
		actionCancelHandler : function (config){
			var rb = CRB.getFWBundle();

			var mainWin = CBXFORMCONTAINER.getActiveFormContainer();
			var that = this;
			
			var confirmCancel = new iportal.Dialog({
				dialogType : 'WARNING',
				scope : that,
				cancelHandler : function (){
					confirmCancel.close();
				},
				message : rb['LBL_CANCEL_CONFIRM'],
				okHandler : function (){
					confirmCancel.close();
					CBXFORMCONTAINER.exit(config);
				},
				title : rb['LBL_CONFIRMATION']
			});
			confirmCancel.show();
		},
		/***********************************************************************
		 * This is Close handler attached to the Cancel Action Button.
		 */
		
		actionCloseHandler : function (config){
		
			/*var activeWin = CBXFORMCONTAINER.getActiveFormContainer();
			activeWin?activeWin.close():iportal.jsutil.loadContextApp(config);*/
			CBXFORMCONTAINER.exit(config);
			
			
		}
		
		/*The following function checks if the Button has prod-subprod-func associated with it. If available checks for entitlement
		*/
		,isBtnEntitled:function(btnConfig){
			var entlFlag='Y';
			var prod=(btnConfig.productCode)?(btnConfig.productCode):"";
			var subProd=(btnConfig.subProdCode)?(btnConfig.subProdCode):"";
			var func=(btnConfig.functionCode)?(btnConfig.functionCode):"";
			
			if(prod!=="" && subProd!=="" && func!==""){
				entlFlag=this.isEntitled(prod,subProd,func);
			}
			
			return entlFlag;
		},
		/*The following function checks the entitlement for the button based on the prod-subprod-funct associated with it.
		*/
		isEntitled:function(prodCode,subProdCode,funcCode){
			var entlFlag='N';
			var entlFunc=this.entlFuncList;
			if(prodCode && subProdCode && entlFunc[prodCode] && entlFunc[prodCode][subProdCode]){
				var entlFunctions=entlFunc[prodCode][subProdCode];
				for(var i=0;i<entlFunctions.length;i++){
					if(entlFunctions[i]==funcCode){
						entlFlag='Y';
						break;						
					}
				}
			}
			return entlFlag;
		}
		
	};

}();