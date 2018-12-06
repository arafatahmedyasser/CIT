/**
 * COPYRIGHT NOTICE Copyright 2011 Intellect Design Arena Limited. All rights
 * reserved. These materials are confidential and proprietary to Intellect Design Arena Limited
 * and no part of these materials should be reproduced,
 * published, transmitted or distributed in any form or by any means,
 * electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the
 * materials be disclosed to third parties or used in any other manner for which
 * this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
/**
 * The following function is responsible for Registering/Retrieving the Help files  related to the Form Containers.
 * 
 * @author shyamsundar.g
 */
cbx.formcontainer.HelpRegistry = function (){
	var _ob = null;
	return {
		getInstance : function (){

			if (_ob === null) {
				_ob = {
					/***********************************************************
					 * Intended to register a Help File.
					 * 
					 * @param actId -
					 *            Action Button ID (optional)
					 * @param contId -
					 *            Container ID
					 * @param formId - 
					 *  		  Form ID
					 * @param ob -
					 *            Help Filename getting registered
					 */
					registerHelpFile : function (contId,formId,actId,help){
						/***
						 * If the user registers only 3 params, then it is understood that the last param is always help file name.
						 */
						if(help){
							_ob[contId + "_" + formId + "_" + actId] = help;
						}else{
							_ob[contId + "_" + formId] = actId;
						}
					},
					/***********************************************************
					 * Intended to return the Help file Name if registered. If
					 * not, null is returned.
					 * 
					 * @param actId -
					 *            Action Button ID
					 * @param contId -
					 *            Container ID
					 */
					getHelpFile : function (contId,formId,actId){
						var helpFile=null;
						if(actId && _ob[contId + "_" + formId + "_" + actId]){
							helpFile=_ob[contId + "_" + formId + "_" + actId];
						}else if(_ob[contId + "_" + formId]){
							helpFile = _ob[contId + "_" + formId];
						}
						
						return helpFile;
					}
				};
			}
			return _ob;
		}
	};
}();
FCHR = cbx.formcontainer.HelpRegistry.getInstance();

/***
 * Sample Help File Registry
 * FCHR.registerHelpFile("CONTAINER_ID_1","FORM_ID_1","FIRST_ACTION_ID_1","HELP_FILE_NAME_1");
 * FCHR.registerHelpFile("CONTAINER_ID_2","FORM_ID_2","HELP_FILE_NAME_2");
 */

