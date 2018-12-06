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
package com.intellectdesign.canvas.fdf;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.intellectdesign.canvas.action.PortletAction;
import com.intellectdesign.canvas.common.ReplyObject;
import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.data.conversion.util.JSONObjectBuilderForExtJs;
import com.intellectdesign.canvas.exceptions.action.OrbiActionException;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.formdefinition.FormDefinitionConstants;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.login.sessions.SessionInfo;
import com.intellectdesign.canvas.web.config.ActionMap;

/**
 * Class used for file upload which extends portlet action
 * 
 * @version 1.0
 * 
 */
public class FileUploadAction extends PortletAction
{
	private static Logger LOGGER = Logger.getLogger(FileUploadAction.class);

	/**
	 * This is called from the base class to process a particular action
	 * 
	 * @see com.intellectdesign.iportal.ws.framework.PortletAction#executePortletActionUsing(java.lang.String,
	 *      com.orbidirect.sessionmanager.SessionInfo, com.intellectdesign.canvas.actionmap.ActionMap, java.util.Map,
	 *      javax.servlet.http.HttpServletRequest)
	 * @param action
	 * @param sessionInfo
	 * @param actionMap
	 * @param requestParams
	 * @param request
	 * @return
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
		JSONObjectBuilderForExtJs builder = new JSONObjectBuilderForExtJs();
		try
		{
			LOGGER.ctdebug("CTRND00034", action);
			LOGGER.ctdebug("CTRND00035", requestParams);

			if (FormDefinitionConstants.FILE_ATTACH_ACTION.equals(action))
			{
				requestParams.put(FormDefinitionConstants.FORM_ID,
						request.getAttribute(FormDefinitionConstants.FORM_ID));
				requestParams.put(FormDefinitionConstants.ITEM_ID,
						request.getAttribute(FormDefinitionConstants.ITEM_ID));
				requestParams.put(FormDefinitionConstants.FILE_DETAILS,
						request.getAttribute(FormDefinitionConstants.FILE_DETAILS));
				reply = executeHostRequest(sessionInfo, actionMap.getHostCode(), requestParams, request);

				LOGGER.ctdebug("CTRND00036", reply);
				// Convert the response as a View Header map.
				builder.buildFileUploadHeaderMap(reply);

			}

		} catch (ProcessingErrorException procExcep)
		{
			LOGGER.cterror("CTRND00037", procExcep, action);
			throw new OrbiActionException(FrameworkConstants.ERROR_SYSTEM_ERROR,
					"Received processing error while handling action - '" + action + "in FileUploadAction action",
					procExcep);
		}
		return reply;
	}
}
