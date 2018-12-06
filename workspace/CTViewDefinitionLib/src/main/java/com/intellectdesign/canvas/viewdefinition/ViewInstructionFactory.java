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
import java.util.Vector;

import com.intellectdesign.canvas.cache.handler.CacheManager;
import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.constants.util.TIConstants;
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
public class ViewInstructionFactory
{

	/**
	 * Just ensures the outside world cannot instantiate this class.
	 */
	private ViewInstructionFactory()
	{
	}

	/**
	 * Factory class for ViewInstructionFactory
	 * 
	 * @return An instance of the ViewInstructionFactory
	 */
	public static ViewInstructionFactory getInstance()
	{
		return viewInstructionFactory;
	}

	/**
	 * Picks the instruction class from the DB and returns it. If not present in cache makes a database hit to get the
	 * list of instruction classes and populates in cache and returns
	 * 
	 * @param sViewId
	 * @return IViewInstruction
	 * @throws ViewDefinitionException
	 */
	public IViewInstruction getViewInstruction(String sViewId, ViewDefinition viewDefinition)
			throws ViewDefinitionException
	{
		String sViewInstructionClassName = null;
		IViewInstruction viewInstruction = null;
		List listViewInstructions = null;

		logger.ctinfo("CTVDF00705");
		logger.ctdebug("CTVDF00706", sViewId);
		/**
		 * Gets the View instruction class for the view id present in the cache. The Database cache component is used.
		 * What is cached: A map with key as the View Id and the value as the Instruction class instance If yes then
		 * fetch the details of the view instruction from the cache and skip fetching from the DB. Else proceed to fetch
		 * the instruction class from DB. The first parameter expected in getDataFromCache is session object. Since the
		 * cache used is a DB cache and not a session cache the value is passed as null
		 */

		listViewInstructions = CacheManager.getFWInstance().getDataFromCache(null,
				ViewDefinitionConstants.VDF_INSTRUCTIONS);
		if (listViewInstructions != null && listViewInstructions.size() > 0)
		{
			HashMap instructionsMap = (HashMap) listViewInstructions.get(0);
			logger.ctdebug("CTVDF00707", instructionsMap);
			sViewInstructionClassName = (String) instructionsMap.get(sViewId);
			if (sViewInstructionClassName == null)
			{
				sViewInstructionClassName = getInstructionClassForViewId(sViewId);
			}
		}
		/**
		 * Now use this view Id, go to the DB and pick out all associated instruction classes if the list of instruction
		 * classes are not available in cache. Communicates with the DB framework to fetch the list of instruction
		 * classes from the DB.
		 */
		else
		{
			sViewInstructionClassName = getInstructionClassForViewId(sViewId);
		}
		logger.ctdebug("CTVDF00708", sViewInstructionClassName);
		if (sViewInstructionClassName != null)
		{
			try
			{
				if (ViewDefinitionConstants.DEFAULT.equals(sViewInstructionClassName))
				{
					if (ViewDefinitionConstants.VIEW_TYPE_CLASSIC_GRID.equals(viewDefinition.getViewType())
							|| ViewDefinitionConstants.VIEW_TYPE_LIST.equals(viewDefinition.getViewType())
							|| ViewDefinitionConstants.VIEW_TYPE_PAGING.equals(viewDefinition.getViewType())
							|| ViewDefinitionConstants.VIEW_TYPE_GROUP.equals(viewDefinition.getViewType())
							|| ViewDefinitionConstants.VIEW_TYPE_CALENDAR.equals(viewDefinition.getViewType()))
					{
						viewInstruction = (IViewInstruction) Class.forName(
								"com.intellectdesign.canvas.defaultviews.CanvasDefaultListViewInstruction").newInstance();
					} else if (ViewDefinitionConstants.VIEW_TYPE_CHART.equals(viewDefinition.getViewType()))
					{
						viewInstruction = (IViewInstruction) Class.forName(
								"com.intellectdesign.canvas.defaultviews.CanvasDefaultGraphViewInstruction").newInstance();
					} else if (ViewDefinitionConstants.VIEW_TYPE_TREE.equals(viewDefinition.getViewType()))
					{
						viewInstruction = (IViewInstruction) Class.forName(
								"com.intellectdesign.canvas.defaultviews.CanvasDefaultTreeViewInstruction").newInstance();
					} else if (ViewDefinitionConstants.VIEW_TYPE_ADVGROUP.equals(viewDefinition.getViewType()))
					{
						viewInstruction = (IViewInstruction) Class.forName(
								"com.intellectdesign.canvas.defaultviews.CanvasDefaultAdvGroupViewInstruction").newInstance();
					} else if (ViewDefinitionConstants.VIEW_TYPE_PROPERTY.equals(viewDefinition.getViewType()))
					{
						viewInstruction = (IViewInstruction) Class.forName(
								"com.intellectdesign.canvas.defaultviews.CanvasDefaultPropertyViewInstruction").newInstance();
					}
				} else
				{
					viewInstruction = (IViewInstruction) Class.forName(sViewInstructionClassName).newInstance();
				}
			} catch (IllegalAccessException illegalAccessException)
			{
				logger.cterror("CTVDF00709", illegalAccessException);
				throw new ViewDefinitionException(illegalAccessException);
			} catch (InstantiationException instantiationException)
			{
				logger.cterror("CTVDF00710", instantiationException);
				throw new ViewDefinitionException(instantiationException);
			} catch (ClassNotFoundException classNotFoundException)
			{
				logger.cterror("CTVDF00711", classNotFoundException);
				throw new ViewDefinitionException(classNotFoundException);
			}
		} else
		{
			logger.cterror("CTVDF00712");
			throw new ViewDefinitionException("No instruction class being returned for the given View id", sViewId);
		}

		logger.ctinfo("CTVDF00713");
		return viewInstruction;
	}

	/**
	 * This method gets the instruction class for a view id
	 * 
	 * @param sViewId
	 * @return String
	 */
	private String getInstructionClassForViewId(String sViewId) throws ViewDefinitionException
	{
		logger.ctinfo("CTVDF00714");
		DatabaseRequest databaseRequest = null;
		DatabaseResult databaseResult = null;
		List listViewInstruction = null;
		String sViewInstruction = null;
		try
		{
			// Go to the DB and fetch the view instruction for the view id
			databaseRequest = new CanvasDatabaseRequest();
			databaseRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
			databaseRequest.setOperation(DatabaseConstants.SELECT);
			databaseRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_GET_INSTRUCTION_CLASS);
			databaseRequest.addFilter(ViewDefinitionConstants.FLD_VIEW_ID, sViewId);
			databaseResult = databaseRequest.execute();
			listViewInstruction = databaseResult.getReturnedList();
		} catch (DatabaseException dbEx)
		{
			logger.cterror("CTVDF00715", dbEx, sViewId);
			throw new ViewDefinitionException(dbEx);
		}
		if (listViewInstruction != null)
			sViewInstruction = (String) listViewInstruction.get(0);
		else
		{
			logger.ctdebug("CTVDF00716", sViewId);
			throw new ViewDefinitionException("No instruction class returned for the view id : ", sViewId);
		}
		logger.ctdebug("CTVDF00717", sViewInstruction);
		logger.ctinfo("CTVDF00718");
		return sViewInstruction;
	}

	/**
	 * Returns true if user is in simulation mode else false based
	 * 
	 * @param inVector
	 * @return Returns true if user is in simulation mode else false based
	 */
	protected boolean isSimulationMode(Vector inVector)
	{
		// added below lines of code for Simulation user functionality starts
		logger.ctdebug("CTVDF00719");
		Object obj = inVector.get(inVector.size() + TIConstants.REL_CACHEDMAP_INDEX_IN_VECTOR);
		HashMap inputParams = null;
		boolean isSimulationMode = false;

		if (obj != null && obj instanceof HashMap)
		{
			inputParams = (HashMap) obj;
			if (inputParams.containsKey(FrameworkConstants.SIMULATION_MODE))
			{
				isSimulationMode = ((Boolean) inputParams.get(FrameworkConstants.SIMULATION_MODE)).booleanValue();
			}

		}
		return isSimulationMode;
	}

	// private instance of ViewDefinitionInstructionFactory Object
	private static ViewInstructionFactory viewInstructionFactory = new ViewInstructionFactory();

	private static Logger logger = Logger.getLogger(ViewInstructionFactory.class);

}