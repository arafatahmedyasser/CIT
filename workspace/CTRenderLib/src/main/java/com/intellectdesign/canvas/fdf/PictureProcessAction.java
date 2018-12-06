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
 */
package com.intellectdesign.canvas.fdf;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.intellectdesign.canvas.action.PortletAction;
import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.common.ReplyObject;
import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.data.conversion.util.JSONObjectBuilderForExtJs;
import com.intellectdesign.canvas.deviceband.DeviceCategory;
import com.intellectdesign.canvas.exceptions.action.OrbiActionException;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.formdefinition.FormDefinitionConstants;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.login.sessions.SessionInfo;
import com.intellectdesign.canvas.web.config.ActionMap;

/**
 * Class for processing picture action which extends portlet action
 * 
 */
public class PictureProcessAction extends PortletAction
{
	private Logger LOGGER = Logger.getLogger(PictureProcessAction.class);

	/**
	 * This is called from the base class to process a particular action
	 * 
	 * @see com.intellectdesign.iportal.ws.framework.PortletAction#executePortletActionUsing(java.lang.String,
	 *      com.orbidirect.sessionmanager.SessionInfo, com.intellectdesign.canvas.actionmap.ActionMap, java.util.Map,
	 *      javax.servlet.http.HttpServletRequest)
	 */
	@Override
	public ReplyObject executePortletActionUsing(String action, SessionInfo sessionInfo, ActionMap actionMap,
			Map requestParams, HttpServletRequest request) throws OrbiActionException
	{
		ReplyObject reply = new ReplyObject();
		JSONObjectBuilderForExtJs builder = new JSONObjectBuilderForExtJs();
		String imageProcessAction = (String) request.getAttribute(FormDefinitionConstants.IMAGE_PROCESS_ACTION);
		try
		{
			LOGGER.ctdebug("CTRND00046", action);
			LOGGER.ctdebug("CTRND00047", requestParams);
			requestParams.put(FormDefinitionConstants.IMAGE_PROCESS_ACTION, imageProcessAction);

			if (FormDefinitionConstants.PICTURE_PROCESS_ACTION.equals(action))
			{
				if ("STORE_USER_IMAGE".equals(imageProcessAction))
				{
					requestParams.put("FILE_NAME", request.getAttribute("USER_PROVIDED_FILE_NAME"));
					requestParams.put("FILE_STREAM", request.getAttribute("FILE_STREAM"));
				}

				reply = executeHostRequest(sessionInfo, actionMap.getHostCode(), requestParams, request);

				ExtReplyObject actionReplyObject = (ExtReplyObject) reply;
				if (actionReplyObject.headerMap != null)
				{
					Map replyMap = actionReplyObject.headerMap;
					if (replyMap != null)
					{
						request.setAttribute("RESULT", replyMap.get("RESULT"));
						imageProcessAction = (String) requestParams.get(FormDefinitionConstants.IMAGE_PROCESS_ACTION);
						if ("GET_USER_IMAGE".equals(imageProcessAction))
						{
							if (replyMap.get("IMAGE_DATA") != null)
							{
								request.setAttribute("IMAGE_DATA", replyMap.get("IMAGE_DATA"));
								request.setAttribute("FILE_NAME", replyMap.get("FILE_NAME"));
								request.setAttribute("contentType", replyMap.get("contentType"));
								if (DeviceCategory.MOBILE.getCode().equals(sessionInfo.deviceType)
										|| DeviceCategory.TABLET.getCode().equals(sessionInfo.deviceType))
								{
									// Setting the LastModified and Status to the request.
									request.setAttribute("LAST_MODIFIED", replyMap.get("LAST_MODIFIED"));
									request.setAttribute("STATUS", replyMap.get("STATUS"));
									request.setAttribute("SERVER_SYNCTIME", replyMap.get("SERVER_SYNCTIME"));
								}
								replyMap.remove("IMAGE_DATA");
							}
						} else if ("STORE_USER_IMAGE".equals(imageProcessAction))
						{
							// Setting the valid extension to the request.
							request.setAttribute("VALID_EXTENSION", replyMap.get("VALID_EXTENSION"));
						}
					}
				}

				builder.buildPictureProcessHeaderMap(reply);
			}

		} catch (ProcessingErrorException procExcep)
		{
			LOGGER.cterror("CTRND00048", procExcep, action);
			throw new OrbiActionException(FrameworkConstants.ERROR_SYSTEM_ERROR,
					"Received processing error while handling action - '" + action + "in PictureProcessAction action",
					procExcep);
		}
		return reply;
	}
}
