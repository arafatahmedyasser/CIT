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

import java.util.HashMap;
import java.util.List;

import com.intellectdesign.canvas.cache.handler.CacheManager;
import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;
import com.intellectdesign.canvas.logger.Logger;

/**
 * This is a singleton. Presently is read from DB cache (list of a map) 1 instance of all known instruction classes.
 * 
 * @version 1.0
 */
public class ViewDefinitionInstructionFactory
{

	/**
	 * Just ensures the outside world cannot instantiate this class.
	 */
	private ViewDefinitionInstructionFactory()
	{
	}

	/**
	 * Factory class for MessageFormatterFactory
	 * 
	 * @return An instance of the MessageFormatterFactory
	 */
	public static ViewDefinitionInstructionFactory getInstance()
	{
		return vdfInstructionFactory;
	}

	/**
	 * Picks the message formatter class from the DB and returns it. If not present in cache makes a database hit to get
	 * the list of formatters and populates in cache and returns
	 * 
	 * @param sViewId
	 * @return MessageFormatter
	 * @throws AlertHandlerException
	 */
	public IViewDefinitionInstruction getViewDefinitionInstruction(String sViewId) throws ViewDefinitionException
	{
		String sVDFInstructionClassName = null;
		IViewDefinitionInstruction vdfInstruction = null;
		List listVDFInstructions = null;

		logger.ctinfo("CTVDF00691");
		logger.ctdebug("CTVDF00692", sViewId);
		/**
		 * Gets the View definition instruction class for the view id present in the cache. The Database cache component
		 * is used. What is cached: A map with key as the View Id and the value as the Instruction class instance If yes
		 * then fetch the details of the view definition instruction from the cache and skip fetching from the DB. Else
		 * proceed to fetch the instruction class from DB. The first parameter expected in getDataFromCache is session
		 * object. Since the cache used is a DB cache and not a session cache the value is passed as null
		 */

		listVDFInstructions = CacheManager.getFWInstance().getDataFromCache(null,
				ViewDefinitionConstants.VDF_INSTRUCTIONS);
		if (listVDFInstructions != null && listVDFInstructions.size() > 0)
		{
			HashMap instructionsMap = (HashMap) listVDFInstructions.get(0);
			logger.ctdebug("CTVDF00693", instructionsMap);
			sVDFInstructionClassName = (String) instructionsMap.get(sViewId);
		}
		/**
		 * Now use this view Id, go to the DB and pick out all associated instruction classes if the list of instruction
		 * classes are not available in cache. Communicates with the DB framework to fetch the list of instruction
		 * classes from the DB.
		 */
		else
		{
			sVDFInstructionClassName = getInstructionClassForViewId(sViewId);
		}
		logger.ctdebug("CTVDF00694", sVDFInstructionClassName);
		if (sVDFInstructionClassName != null)
		{
			try
			{
				vdfInstruction = (IViewDefinitionInstruction) Class.forName(sVDFInstructionClassName).newInstance();
			} catch (IllegalAccessException illegalAccessException)
			{
				logger.cterror("CTVDF00695", illegalAccessException);
				throw new ViewDefinitionException(illegalAccessException);
			} catch (InstantiationException instantiationException)
			{
				logger.cterror("CTVDF00696", instantiationException);
				throw new ViewDefinitionException(instantiationException);
			} catch (ClassNotFoundException classNotFoundException)
			{
				logger.cterror("CTVDF00697", classNotFoundException);
				throw new ViewDefinitionException(classNotFoundException);
			}
		} else
		{
			logger.cterror("CTVDF00698");
			throw new ViewDefinitionException("No instruction class being returned for the given View id", sViewId);
		}

		logger.ctinfo("CTVDF00699");
		return vdfInstruction;
	}

	/**
	 * This method gets the message formatter class for a channel
	 * 
	 * @param sViewId
	 * @return String
	 * @return ViewDefinitionException
	 */
	private String getInstructionClassForViewId(String sViewId) throws ViewDefinitionException
	{
		logger.ctinfo("CTVDF00700");
		DatabaseRequest databaseRequest = null;
		DatabaseResult databaseResult = null;
		List listVDFInstruction = null;
		String sVDFInstruction = null;
		try
		{
			// Go to the DB and fetch the view definition instruction for the view id
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
			databaseRequest.setOperation(DatabaseConstants.SELECT);
			databaseRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_GET_INSTRUCTION_CLASS);
			databaseRequest.addFilter(ViewDefinitionConstants.FLD_VIEW_ID, sViewId);
			databaseResult = databaseRequest.execute();
			listVDFInstruction = databaseResult.getReturnedList();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTVDF00704", dbEx, sViewId);
			throw new ViewDefinitionException(dbEx);
		}
		if (listVDFInstruction != null)
			sVDFInstruction = (String) listVDFInstruction.get(0);
		else
		{
			logger.cterror("CTVDF00701", sViewId);
			throw new ViewDefinitionException("No instruction class returned for the view id : ", sViewId);
		}
		logger.ctdebug("CTVDF00702", sVDFInstruction);
		logger.ctinfo("CTVDF00703");
		return sVDFInstruction;
	}

	// private instance of ViewDefinitionInstructionFactory Object
	private static ViewDefinitionInstructionFactory vdfInstructionFactory = new ViewDefinitionInstructionFactory();

	private static Logger logger = Logger.getLogger(ViewDefinitionInstructionFactory.class);

}