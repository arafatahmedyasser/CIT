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

package com.intellectdesign.canvas.formcontainer.instruction;

import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;
import com.intellectdesign.canvas.formcontainer.FormContainerConstants;
import com.intellectdesign.canvas.formcontainer.FormContainerDefinitionException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.logging.PerformanceTimer;

/**
 * This class  fetches the form container configuration and tools applicable for the container from Database.
 * 
 * @version 1.0
 */
public class FormContainerDefinitionInstruction
{
	// An instance of Logger
	private static final Logger logger = Logger.getLogger(FormContainerDefinitionInstruction.class);

	/**
	 * This method returns a the list of all the form containers and their action buttons configured in 
	 * 
	 * @return List - List object containing the list of Form Container ID and their configuration 
	 * @throws DatabaseException DatabaseException
	 */
	public final List getFormContainerDefinition() throws FormContainerDefinitionException
	{
		String cname = "getFormContainerDefinition";
		logger.ctinfo("CTFDF00115", cname);

		List itemList = null;
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		try
		{
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey(FormContainerConstants.FORM_CONTAINER_MGR_FRMWK);
			dbRequest.setOperationExtension(FormContainerConstants.GET_FORM_CONTAINER_DEFN);
			dbResult = dbRequest.execute();
			itemList = dbResult.getReturnedList();

			logger.ctdebug("CTFDF00116", itemList);

		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTFDF00117", dbExp);
			throw new FormContainerDefinitionException(dbExp);

		}
		logger.ctinfo("CTFDF00118", cname);
		return itemList;
	}

	/**
	 * This method provides the list of Form Container Tools Help, Print, Export and Export available 
	 * for the device.
	 * 
	 * 
	 * @param deviceType - String value indicating the devicetype
	 * @return fcToolsList - List object containing the Tools applicable for the device
	 * 
	 * @throws FormContainerDefinitionException
	 */

	public List<Map> getToolsMapping(String deviceType) throws FormContainerDefinitionException
	{
		List<Map> fcToolsList = null;
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		logger.ctinfo("CTFDF00122");
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("FormContainerDefinitionInstruction.getToolsMapping");
		try
		{
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey(FormContainerConstants.FORM_CONTAINER_MGR_FRMWK);
			dbRequest.setOperationExtension(FormContainerConstants.GET_FC_TOOLS_MAP);
			dbRequest.addFilter(FormContainerConstants.CHANNEL_ID, deviceType);
			dbResult = dbRequest.execute();
			fcToolsList = dbResult.getReturnedList();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTFDF00123", dbExp);
			throw new FormContainerDefinitionException(dbExp);
		}
		logger.ctinfo("CTFDF00124");
		return fcToolsList;
	}
}
