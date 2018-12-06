/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.*/

package com.intellectdesign.canvas.vdf;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.intellectdesign.canvas.action.PortletAction;
import com.intellectdesign.canvas.common.ReplyObject;
import com.intellectdesign.canvas.data.conversion.util.JSONObjectBuilderForExtJs;
import com.intellectdesign.canvas.data.conversion.util.JSONToHashMapConverter;
import com.intellectdesign.canvas.data.conversion.util.OnlineJSONToHashmapConverter;
import com.intellectdesign.canvas.exceptions.action.OrbiActionException;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.exceptions.util.JSONConvertorException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.login.sessions.SessionInfo;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionConstants;
import com.intellectdesign.canvas.web.config.ActionMap;

/**
 * Widget Preference Action is created in order to handle the customization of widgets.
 * 
 * 
 * @version 1.0
 */
public class WidgetPreferenceAction extends PortletAction
{
	/**
	 * to execute portlet action
	 * 
	 * @param action
	 * @param sessionInfo
	 * @param actionMap
	 * @param requestParams
	 * @param request
	 * @return ReplyObject
	 * @throws OrbiActionException
	 * @see com.intellectdesign.canvas.action.PortletAction#executePortletActionUsing(java.lang.String,
	 *      com.intellectdesign.canvas.login.sessions.SessionInfo, com.intellectdesign.canvas.web.config.ActionMap, java.util.Map,
	 *      javax.servlet.http.HttpServletRequest)
	 */
	@Override
	public ReplyObject executePortletActionUsing(String action, SessionInfo sessionInfo, ActionMap actionMap,
			Map requestParams, HttpServletRequest request) throws OrbiActionException
	{
		ReplyObject reply = null;
		try
		{
			if (ViewDefinitionConstants.ACTION_PREF_SAVE.equals(action))
			{
				String formValue = request.getParameter(JSON_DATA);
				logger.ctdebug("CTRND00269", formValue);
				/**
				 * Passing the parameter which is in JSON format which is retrieved above to the constructor of
				 * framework class OnlineJSONToHashmapConverter so that object of converter class JSONToHashMapConverter
				 * is created for the purpose of converting JSON String to Hashmap
				 */

				JSONToHashMapConverter converter = new OnlineJSONToHashmapConverter(false, false);
				/**
				 * Getting the result after conversion to Hashmap
				 */
				Map resultMap = converter.convert(formValue);
				requestParams.put(FORM_VALUES, resultMap);
				reply = executeHostRequest(sessionInfo, actionMap.getHostCode(), requestParams, request);
			} else if (action != null && ViewDefinitionConstants.ACTION_PREF_DELETE.equals(action))
			{
				reply = executeHostRequest(sessionInfo, actionMap.getHostCode(), requestParams, request);
			}
			JSONObjectBuilderForExtJs.buildFormResultMap(reply);
			logger.ctdebug("CTRND00270", action, reply);
		} catch (ProcessingErrorException pex)
		{
			logger.cterror("CTRND00271", pex);
		} catch (JSONConvertorException jsonex)
		{
			logger.cterror("CTRND00271", jsonex);
		}
		return reply;
	}

	private static String JSON_DATA = "JSON_DATA";
	private static String FORM_VALUES = "FORM_VALUES";

	// Instance of Logger for this class
	private static final Logger logger = Logger.getLogger(WidgetPreferenceAction.class);
}
