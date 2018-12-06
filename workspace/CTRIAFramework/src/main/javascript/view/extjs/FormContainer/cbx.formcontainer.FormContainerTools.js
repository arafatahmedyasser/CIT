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
 * This function returns the tools bar for Form Containers based on the Form
 * Container Metadata.
 * 
 
 */
 

cbx.formcontainer.tools = function (){
	
	var fmId="";

	return {
		/***********************************************************************
		 * This function returns the toolsbar for form container based upon the
		 * Form Container's metadata
		 * 
		 * @param formContainerData
		 *            Form Container Metadata
		 * @return toolsMenu Array Object
		 */
		
		getToolsMenu : function (formContainerData,formObj,config,title){
			var that=cbx.formcontainer.tools;
			var toolsmenu = [];

			if (formContainerData.HELP_IND == 'Y') {
				that.addHelpIcon(formContainerData, toolsmenu, formObj, config,title);
			}
			
			
			 if(formContainerData.EXPORT_IND=='Y'){
				that.addExportIcon(formContainerData,toolsmenu, formObj, config,title); 
			 }
			 if(formContainerData.PRINT_IND=='Y'){
				that.addPrintIcon(formContainerData,toolsmenu, formObj, config,title); 
			}

			 if(formContainerData.CLOSED_IND=='Y'){   
				 that.addCloseIcon(formContainerData, toolsmenu, formObj, config,title);

				 }
			return toolsmenu;

		},
	
		/***********************************************************************
		 * This function adds the Close icon to the toolsbar.
		 * 
		 * @param formContainerData
		 *            Form Container Metadata
		 * @param toolsmenu
		 *            Toolsbar
		 */
	
		addCloseIcon : function (formContainerData, toolsmenu, formObj, config, title){
			var that=cbx.formcontainer.tools;
			var close = {
				id : 'close',
				scope :config,
				qtip : CRB.getFWBundle()['TOOL_TIPS_CLOSE'], 
				handler : that.closeHandler
			
			};

			toolsmenu.push(close);

		},
		/***********************************************************************
		 * This function adds the Help icon to the toolsbar.
		 * 
		 * @param formContainerData
		 *            Form Container Metadata
		 * @param toolsmenu
		 *            Toolsbar
		 */
		addHelpIcon : function (formContainerData, toolsmenu, formObj, config, title){ 
			var that=cbx.formcontainer.tools;
			var help = {
				id : 'help',
				qtip : CRB.getFWBundle()['TOOL_TIPS_HELP'],  
				handler : function (){
					var fmId=that.getFmId();
					var actId=formContainerData.ACTIONS[0].ACTION_ID || "";
					var helpFileName=FCHR.getHelpFile(formContainerData.CONTAINER_ID,fmId,actId);
					if(!helpFileName){
						helpFileName=formContainerData.CONTAINER_ID + "_FORM_help.htm";
					}
					iportal.jsutil.helpHandler(helpFileName);
				}
			};

			toolsmenu.push(help);
		},
		/***********************************************************************
		 * This function adds the Print icon to the toolsbar.
		 * 
		 * @param formContainerData
		 *            Form Container Metadata
		 * @param toolsmenu
		 *            Toolsbar
		 */
		addPrintIcon : function (formContainerData, toolsmenu, formObj, config,title){
			var that=cbx.formcontainer.tools;
			var printIcon = {
				id : 'print',
				qtip : CRB.getFWBundle()['TOOL_TIPS_PRINT'],  
				handler : function (){
					//that.printHandler(formContainerData);
					formObj.exportForForms('HTML',CBXFORMCONTAINER.winTitle); // Testing purpose . please do not uncomment it.
					
				}
			};

			toolsmenu.push(printIcon);
		},
		/***********************************************************************
		 * This function adds the Export icon to the toolsbar.
		 * 
		 * @param formContainerData
		 *            Form Container Metadata
		 * @param toolsmenu
		 *            Toolsbar
		 */
		addExportIcon : function (formContainerData, toolsmenu, formObj, config, title){ 
			var that=cbx.formcontainer.tools;
			var exportIcon = {
				id : 'export',
				qtip : CRB.getFWBundle()['TOOL_TIPS_EXPORT'],  
				handler : function (){
					//that.pdfExport(formContainerData);
					formObj.exportForForms('PDF',title);
					//formObj.exportForForms('XLS',title);
				}
			};

			toolsmenu.push(exportIcon);

		},
		/***********************************************************************
		 * This function attaches the Print handler to the Print Icon.
		 * 
		 * @param formContainerData
		 *            Form Container Metadata
		 */
		printHandler : function (formContainerData){
			var that=cbx.formcontainer.tools;

			iportal.openNewWindow('/iportalweb/iportal/jsps/PrintConfirm.jsp' +

			'?elementIdForConfirmationMsg=' + formContainerData.FORM_ID, 'print',
						'toolbar=no,location=no,directories=no,status=no,' +

						'menubar=no,scrollbars=no,resizable=no,border=thin,top=60,left=100,width=750,height=650');

		},
		/***********************************************************************
		 * This function attaches the Export handler to the Export Icon.
		 * 
		 * @param formContainerData
		 *            Form Container Metadata
		 */
		pdfExport : function (formContainerData){

		},
		/***
		 *Executes the Close Action 
		 */
		closeHandler:function(){
			var con=cbx.formcontainer.constants;
			var containerMD=cbx.formcontainer.buttonBars;
			Ext.FormFieldFocused = false;
			if(containerMD.exitAction!=undefined && containerMD.exitAction==con.CANCEL){
				containerMD.actionCancelHandler(this);
			}else if(containerMD.exitAction!=undefined && containerMD.exitAction==con.CUSTOM){
				CABR.executeHandler(con.CLOSE, containerMD.containerId, {
					formObj:containerMD.formMgrObj,
					containerId:containerMD.containerId,
					formConRenderType:this.formConRenderType,
					appWidget:this.appWidget
				});
				
			}else{
				containerMD.actionCloseHandler(this);
			}
		}
		,setFmId:function(formId){
			fmId=formId;
		}
		,getFmId:function(){
			return fmId;
		}
	};

}();
