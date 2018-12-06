/*************************************************************************
 * COPYRIGHT NOTICE
 * 
 * These materials are confidential and proprietary to Polaris Software 
 * Lab Limited and no part of these materials should be reproduced, 
 * published, transmitted or distributed  in any form or by any means, 
 * electronic, mechanical, photocopying, recording or otherwise, or 
 * stored in any information storage or retrieval system of any nature 
 * nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express 
 * written authorization of Polaris Software Lab Limited.
 *
 * Copyright 2012. Polaris Software Lab Limited. All rights reserved.
 *************************************************************************/

package com.intellectdesign.canvas.report.action;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.intellectdesign.canvas.action.PortletAction;
import com.intellectdesign.canvas.common.ReplyObject;
import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.data.conversion.util.JSONObjectBuilderForExtJs;
import com.intellectdesign.canvas.exceptions.action.OrbiActionException;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.exportdata.IExportDataProvider;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.login.sessions.SessionInfo;
import com.intellectdesign.canvas.web.config.ActionMap;

public class ReportDefinitionAction extends PortletAction
{
	private static final Logger LOGGER = Logger.getLogger(ReportDefinitionAction.class);

	/**
	 * This is called from the base class to process a particular action
	 * 
	 * @see com.polaris.iportal.ws.framework.PortletAction#executePortletActionUsing(java.lang.String,
	 *      com.orbidirect.sessionmanager.SessionInfo, com.polaris.iportal.util.ActionMap, java.util.Map,
	 *      javax.servlet.http.HttpServletRequest)
	 */

	@Override
	public ReplyObject executePortletActionUsing(String action, SessionInfo sessionInfo, ActionMap actionMap,
			Map requestParams, HttpServletRequest request) throws OrbiActionException
	{
		LOGGER.ctinfo("CTREP00600");
		ReplyObject reply = null;
		try
		{
			LOGGER.ctdebug("CTREP00601", action, actionMap.getHostCode(), requestParams);			
			reply = executeHostRequest(sessionInfo, actionMap.getHostCode(), requestParams,request);
			LOGGER.ctdebug("CTREP00602", reply);
			JSONObjectBuilderForExtJs.buildFormResultMap(reply);
			
		} catch (ProcessingErrorException procExcep)
		{
			LOGGER.cterror("CTREP00603", procExcep, action);
			throw new OrbiActionException(FrameworkConstants.ERROR_SYSTEM_ERROR,
					"ProcessingErrorException occured while handling action - " + action + " in ReportDefinitionAction",
					procExcep);
		}
		LOGGER.ctinfo("CTREP00604");
		return reply;
	}

}
