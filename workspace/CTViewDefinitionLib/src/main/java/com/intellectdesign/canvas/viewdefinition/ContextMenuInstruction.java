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

package com.intellectdesign.canvas.viewdefinition;

import java.util.List;

import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;
import com.intellectdesign.canvas.entitlement.CanvasViewEntlVO;
import com.intellectdesign.canvas.entitlement.EntitlementException;
import com.intellectdesign.canvas.entitlement.EntitlementsHelper;
import com.intellectdesign.canvas.entitlement.ProductFunctionVO;
import com.intellectdesign.canvas.logger.Logger;

/**
 * This class is for context menu instruction
 * 
 * @version 1.0
 */
public class ContextMenuInstruction
{
	/**
	 * ref to GetDB ContextMenu INstr
	 * 
	 * @param widgetId
	 * @return list
	 * @throws ViewDefinitionException
	 */
	public List getContextMenus(String widgetId) throws ViewDefinitionException
	{

		List returnList = null;
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		logger.ctinfo("CTVDF00343");
		try
		{
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey("GET_WIDGET_CONTEXT");
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setOperationExtension("MENU_DATA");
			dbRequest.addFilter("WIDGET_ID", widgetId);
			dbResult = dbRequest.execute();
			returnList = dbResult.getReturnedList();
			logger.ctdebug("CTVDF00344", returnList);
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00345", dbExp);
			throw new ViewDefinitionException(dbExp);

		}

		return returnList;

	}

	/***
	 * This method returns the Product-Function List based on entitlements.
	 * 
	 * @param gcifNo GCIF
	 * @param userNo User No
	 * @return List
	 * 
	 */
	public List<ProductFunctionVO> getproductFunctionVOList(final String gcifNo, final String userNo, final String sChannelId, final String sUserRole) throws ViewDefinitionException 
	{
		logger.ctinfo( "CTVDF00346");
		
		logger.ctdebug("CTVDF00347", gcifNo,userNo,sUserRole);

		if (gcifNo == null || userNo == null)
		{
			logger.cterror("CTVDF00348");
			return null;
		}

		CanvasViewEntlVO userEntilements;
		try
		{
			EntitlementsHelper entlHelper = new EntitlementsHelper();
			userEntilements = entlHelper.getUserAccessEntitlements(gcifNo, userNo, sUserRole);
		} catch (EntitlementException e)
		{
			throw new ViewDefinitionException(e);
		}
		
		return userEntilements.getEntitlementsAsProductFunction();
	}

	private static Logger logger = Logger.getLogger(ViewManager.class);
}
