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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.cache.handler.CacheManager;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.constants.listviews.ListViewConstants;
import com.intellectdesign.canvas.database.PaginationModel;
import com.intellectdesign.canvas.entitlement.CanvasViewEntlVO;
import com.intellectdesign.canvas.entitlement.EntitlementException;
import com.intellectdesign.canvas.entitlement.EntitlementsHelper;
import com.intellectdesign.canvas.entitlement.ProductFunctionVO;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.logging.PerformanceTimer;
import com.intellectdesign.canvas.utils.StringUtils;
import com.intellectdesign.canvas.value.IUserValue;

/**
 * This is the entry point for all the applications to manage their views in the system.
 * 
 * @version 1.0
 */
public class ViewManager
{
	/**
	 * This method is a variant in that it returns only the View data and the view definition. Also this takes care of
	 * populating the additional data elements that are provided in the response from the View Definition instruction
	 * into the Reply object.
	 * 
	 * @param widgetId The Widget Id
	 * @param viewId The view id
	 * @param inputParams The input parameters
	 * @param userValue The User value
	 * @param pmModel The Pagination Model
	 * @return The VDF reply object
	 * @throws ViewDefinitionException thrown if any error occurs while processing this request.
	 */
	public final VDFReplyObject getViewData(final String widgetId, String viewId, HashMap inputParams,
			IUserValue userValue, PaginationModel pmModel) throws ViewDefinitionException
	{
		IViewInstruction viewInstruction = null;
		VDFReplyObject vdfReplyObject = null;
		ViewDefinition viewDefinition = null;
		HashMap returnData = null;
		LOGGER.ctinfo("CTVDF00720", widgetId, viewId, inputParams);
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewManager.getView" + viewId);

		// Step 1: Get the view definition
		viewDefinition = getViewDefinition(widgetId, viewId, inputParams);
		LOGGER.ctdebug("CTVDF00721", viewDefinition);
		if (viewDefinition != null)
		{
			// Step 2: Get the view definition instruction class. Now this can
			// be easily picked from the cache for the
			// system view.
			viewInstruction = createViewInstruction(viewDefinition);
			LOGGER.ctdebug("CTVDF00722", viewInstruction);

			// Step 2.1: Handle the paging model properly based on view type.
			if (viewDefinition.isPagingEnabledForView())
			{
				pmModel = null;
			} else
			{
				// Step 2.2: Ensure that the paging model has the right configuration. There can be cases where the
				// request may not have provided the proper paging parameters
				if (!PaginationModel.isPagingParamsAvailable(inputParams)
						&& !(ViewDefinitionConstants.ACTION_EXPORT.equals(inputParams.get("INPUT_ACTION")) || ViewDefinitionConstants.ACTION_PRINT
								.equals(inputParams.get("INPUT_ACTION"))))
				{
					// recreate the paging model based on the defaults from the view.
					if (viewDefinition.getRecordsPerPage() > 0)
					{
						pmModel = new PaginationModel(0, viewDefinition.getRecordsPerPage());
					} else
					{
						ConfigurationManager configMgr = ConfigurationManager.getInstance();
						int recordsByPage = "1".equals(inputParams.get(ListViewConstants.INPUT_CHANNEL_ID)) ? configMgr
								.getCompPrefDescriptor().getDefaultPageSizeForMobile() : Integer.parseInt(configMgr
								.getCompPrefDescriptor().getListViewPageSize());
						pmModel = new PaginationModel(0, recordsByPage);
					}
				}
			}

			// Step 3: Ask the viewInstruction to fetch the data.
			returnData = viewInstruction.getViewData(viewDefinition, inputParams, pmModel);
			LOGGER.ctdebug("CTVDF00723", returnData);

			// Step 4: Build the VDF Reply.
			vdfReplyObject = new VDFReplyObject();

			vdfReplyObject.setViewMetaData(viewDefinition);
			vdfReplyObject.setViewData((List) returnData.get(ViewDefinitionConstants.KEY_ALL_RECORDS));
			// Remove the all records key from the return data and set the same
			// as additional data.
			returnData.remove(ViewDefinitionConstants.KEY_ALL_RECORDS);
			vdfReplyObject.setAdditionalData(returnData);
			LOGGER.ctdebug("CTVDF00724", vdfReplyObject);
		} else
		{
			LOGGER.cterror("CTVDF00725", viewId);
			throw new ViewDefinitionException("SYSERR",
					"Request received for fetching data for a non-existent View id - '" + viewId + "'");
		}
		performanceTimer.endTimer();
		return vdfReplyObject;
	}

	/**
	 * Helper method to create a view instruction based on the view definition provided.
	 * 
	 * @param viewDefinition The View definition
	 * @return The Instruction class for this view
	 * @throws ViewDefinitionException Thrown if an error occurs while creating the instruction
	 */
	private IViewInstruction createViewInstruction(ViewDefinition viewDefinition) throws ViewDefinitionException
	{
		ViewInstructionFactory viewInstructionFactory = ViewInstructionFactory.getInstance();
		String systemViewId = viewDefinition.getSystemViewID();
		// If the system view id is empty, then this view is a system view. So
		// use the view Id itself
		if ((systemViewId == null) || ("".equals(systemViewId)))
			systemViewId = viewDefinition.getViewId();
		LOGGER.ctdebug("CTVDF00726", systemViewId);
		return viewInstructionFactory.getViewInstruction(systemViewId, viewDefinition);
	}

	/**
	 * THis method gets the view (definition + data) for the given view id
	 * 
	 * @param sViewID
	 * @param mapInputParams
	 * @param userValue
	 * @param pmModel
	 * @return VDFReplyObject
	 * @throws ViewDefinitionException
	 */
	public VDFReplyObject getView(String sViewID, HashMap mapInputParams, IUserValue userValue, PaginationModel pmModel)
			throws ViewDefinitionException
	{
		IViewInstruction viewInstruction = null;
		VDFReplyObject vdfReplyObject = null;
		ViewDefinition viewDefinition = null;
		List listViewData = null;
		LOGGER.ctinfo("CTVDF00727");
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewManager.getView" + sViewID);
		// Get the view definition
		viewDefinition = getViewDefinition(sViewID);
		LOGGER.ctdebug("CTVDF00728", viewDefinition);

		// Check if this view can be showed to the user
		if (viewDefinition != null)
		{
			viewInstruction = createViewInstruction(viewDefinition);
			LOGGER.ctdebug("CTVDF00729", viewInstruction);

			// Get the view data
			HashMap viewResponse = viewInstruction.getViewData(viewDefinition, mapInputParams, pmModel);
			listViewData = (List) viewResponse.get(ViewDefinitionConstants.KEY_ALL_RECORDS);
			LOGGER.ctdebug("CTVDF00730", listViewData);

			vdfReplyObject = new VDFReplyObject();
			vdfReplyObject.setViewMetaData(viewDefinition);
			vdfReplyObject.setViewData(listViewData);
			LOGGER.ctdebug("CTVDF00731", vdfReplyObject, System.currentTimeMillis());
		} else
		{
			LOGGER.cterror("CTVDF00732");
		}
		performanceTimer.endTimer();
		LOGGER.ctinfo("CTVDF00733");
		return vdfReplyObject;
	}

	/**
	 * This method is intended to check whether the View Name is Unique considering a User and for a particular Widget
	 * 
	 * @param userNo
	 * @param gcif
	 * @param viewName
	 * @param viewDefinition
	 * @return true if Unique else false
	 * @throws ViewDefinitionException
	 */
	public boolean isViewNameUnique(String userNo, String gcif, String viewName, String sProduct, String sSubProduct,
			String sysViewId) throws ViewDefinitionException
	{
		ViewDefinitionInstruction viewDefinitionInstruction = new ViewDefinitionInstruction();
		return viewDefinitionInstruction.viewNameCheck(userNo, gcif, sProduct, sSubProduct, viewName, sysViewId);
	}

	/**
	 * Retrieves a view definition identified by the viewId
	 * 
	 * @param viewId
	 * @return ViewDefinition
	 * @throws ViewDefinitionException
	 */
	public ViewDefinition getViewDefinition(String sViewId) throws ViewDefinitionException
	{
		LOGGER.ctinfo("CTVDF00734");
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewManager.getViewDefinition");
		ViewDefinition viewDefinition = null;
		ViewDefinition temp = null;
		CacheManager cacheManager = CacheManager.getFWInstance();

		// Step 1: First check it is already cached as a system view. If yes,
		// then return the same directly.
		List<ViewDefinition> systemViews = cacheManager.getDataFromCache(null,
				ViewDefinitionConstants.CACHE_KEY_ALL_SYSTEM_VIEWS);
		if (systemViews != null)
		{
			Iterator<ViewDefinition> systemViewsIterator = systemViews.iterator();
			while (systemViewsIterator.hasNext())
			{
				temp = systemViewsIterator.next();
				if (temp.getViewId().equals(sViewId))
				{
					viewDefinition = temp;
					break;
				}
			}
		}

		if (viewDefinition == null)
		{
			LOGGER.ctdebug("CTVDF00735", sViewId);
			ViewDefinitionInstruction viewDefinitionInstruction = new ViewDefinitionInstruction();
			viewDefinition = viewDefinitionInstruction.getViewDefinition(sViewId);
		}

		LOGGER.ctdebug("CTVDF00736", viewDefinition);

		performanceTimer.endTimer();
		LOGGER.ctinfo("CTVDF00737");
		return viewDefinition;
	}

	/**
	 * Gets the View definition for the given widget id and the view id. The widget id is used to evaluate the list of
	 * tools that are applicable for this view under this widget.
	 * 
	 * @param widgetId The widget Id
	 * @param viewId The view Id
	 * @return The View definition for the give view id
	 * @throws ViewDefinitionException Thrown if any error occurs while fetching the View Definition
	 */
	public ViewDefinition getViewDefinition(String widgetId, String viewId, HashMap paramsMap)
			throws ViewDefinitionException
	{
		CacheManager cacheManager = CacheManager.getFWInstance();
		List widgetViewToolsList = null;
		List customToolsList = null;
		HashMap<String, String> toolsMap = null;
		HashMap<String, String> customToolsMap = null;
		ViewDefinition aDefinition = null;
		String key = null;
		List cloneCacheList = null;
		ArrayList toolList = new ArrayList();
		List cacheToolsList = new ArrayList();
		List<Map> deviceTools = null;

		// Step 1. Get the view definition for the given view id
		aDefinition = getViewDefinition(viewId);

		if (aDefinition == null)
			return null;
		// Step 1.1: Wrap it into a Read-only Wrapper
		aDefinition = new ViewDefinitionWrapper(aDefinition);

		// The key for each element in the cache is the widget id + "-" + system
		// view id. So build the key appropriately
		if (aDefinition.getSystemViewID() == null || "".equals(aDefinition.getSystemViewID()))
		{
			key = widgetId + "-" + viewId;
		} else
		{
			key = widgetId + "-" + aDefinition.getSystemViewID();
		}

		// Step 2: Populate the tools for this view based on the Widget / view
		// id provided from the cache.
		toolList = (ArrayList) cacheManager.getDataFromCache(null,
				ViewDefinitionConstants.CACHE_KEY_SYSTEM_VIEWS_WIDGET_TOOLS_CONFIG);

		if (!toolList.contains(key))
		{
			List returnList = null;
			ViewDefinitionInstruction instruction = new ViewDefinitionInstruction();
			try
			{
				returnList = instruction.getWidgetViewToolsMapping();
				toolList = (ArrayList) processWidgetViewToolsMap(returnList);
			} catch (ViewDefinitionException vde)
			{
				LOGGER.cterror("CTVDF00738", vde);
			}
		}
		/**
		 * Deep Clonning of the Arraylist object since addAll just does the shallow clonning of the objects
		 */

		for (Object tools : toolList)
		{
			cacheToolsList.add(((HashMap) tools).clone());
		}

		// Populate the CUSTOM tools for this view based on the Widget / view
		customToolsList = cacheManager.getDataFromCache(null,
				ViewDefinitionConstants.CACHE_KEY_SYSTEM_CUSTOM_TOOLS_CONFIG);
		/**
		 * Cloning the cache Object and performing operations in the cloned object rather than the cache object directly
		 */
		cloneCacheList = new ArrayList();
		cloneCacheList.addAll(cacheToolsList);

		widgetViewToolsList = new ArrayList();

		// Populate the CUSTOM tools for this view based on the Widget / view
		// Filter the Tools loist based on the device cache for tools.
		if (paramsMap.containsKey(ViewDefinitionConstants.APPLICABLE_TOOLS))
		{
			deviceTools = (List<Map>) paramsMap.get(ViewDefinitionConstants.APPLICABLE_TOOLS);
			Map widgetViewToolsMap = (HashMap) cloneCacheList.get(0);
			LOGGER.ctdebug("CTVDF00738", widgetViewToolsMap);
			if (widgetViewToolsMap.containsKey(key))
			{
				LOGGER.ctdebug("CTVDF00739", (String) widgetViewToolsMap.get(key));
				/**
				 * Getting the tools for this widget
				 */
				String tools = (String) widgetViewToolsMap.get(key);
				List<String> toolsList = Arrays.asList(tools.split(","));
				/**
				 * Looping through the tools list
				 */
				for (String tool : toolsList)
				{
					if (deviceTools.size() > 0)
					{
						/**
						 * Looping through the tools applicable for this channel and checking if the tool hads been
						 * configured for this channel.
						 * 
						 * if yes -> will push the tool to the new array
						 */
						for (Map aTool : deviceTools)
						{
							if (tool.equals(aTool.get(ViewDefinitionConstants.TOOL_ID)))
							{
								widgetViewToolsList.add(tool);
								break;
							}
						}
					}
				}
				tools = StringUtils.join(widgetViewToolsList, ",");
				/**
				 * Replacing the vdf tools list with the new filtered sting.
				 */
				widgetViewToolsMap.put(key, tools);
			}
			LOGGER.ctdebug("CTVDF00740", cloneCacheList);
		}

		if (cloneCacheList.size() > 0)
		{
			toolsMap = (HashMap<String, String>) cloneCacheList.get(0);

			if (toolsMap.containsKey(key))
			{
				aDefinition.setAllTools(toolsMap.get(key));
				if (toolsMap.get(key) != null)
				{
					aDefinition.setAllTools(toolsMap.get(key));
					if (customToolsList != null && customToolsList.size() > 0)
					{
						customToolsMap = (HashMap) customToolsList.get(0);
						if (toolsMap.get(key + "-" + ViewDefinitionConstants.CUSTOM_TOOLS_ID) != null)
						{
							aDefinition.setCustomTools(customToolsMap.get(toolsMap.get(key + "-"
									+ ViewDefinitionConstants.CUSTOM_TOOLS_ID)));
						}
					}
				}
			}
		}

		// Step3a: Populate the Bottom Bar button definitions
		aDefinition.setBbarButtonsMap(getWidgetBottomBarButtons(widgetId));

		// Step3b: Populate the Top Bar button definitions
		aDefinition.setTbarButtonsMap(getWidgetTopBarButtons(widgetId));

		// Step 4: Check if there is a global date filter panel. If yes, then initialize the data for the same too.
		if (ViewDefinitionConstants.VAL_BOOL_YES.equals(aDefinition.getGlobalDateFitlerInd()))
		{
			// Initialize the date filter data. For this we need to fetch the max possible date from the instruction and
			// use that to initialize the
			// date filters.
			// Step 4.1: Retrieve the max date
			IViewInstruction instr = createViewInstruction(aDefinition);
			Date maxDate = instr.getMaximumDateForGlobalDateFilter(aDefinition, paramsMap);
			// Step 4.2: Initialize the filters
			aDefinition.resetDateFilters(maxDate);
		}

		return aDefinition;
	}

	/**
	 * This method will return a map of all the buttons configured for the widget with 2 keys "POSITIVE_BUTTONS",
	 * "NEGATIVE_BUTTONS"
	 * 
	 * @param widgetId
	 * @return ArrayList - ArrayList of Bottom Bar button definitions
	 * @throws ViewDefinitionException
	 */
	private Map getWidgetBottomBarButtons(String widgetId) throws ViewDefinitionException
	{
		ViewDefinitionInstruction viewDefinitionInstruction = new ViewDefinitionInstruction();
		return viewDefinitionInstruction.getWidgetBottomBarButtons(widgetId);

	}

	/**
	 * This method will return a map of all the buttons configured for the widget with key "TBAR_CONFIG",
	 * 
	 * @param widgetId
	 * @return Map of ArrayList value with key "TBAR_CONFIG" - ArrayList of Top Bar button definitions
	 * @throws ViewDefinitionException
	 */
	private Map getWidgetTopBarButtons(String widgetId) throws ViewDefinitionException
	{
		ViewDefinitionInstruction viewDefinitionInstruction = new ViewDefinitionInstruction();
		return viewDefinitionInstruction.getWidgetTopBarButtons(widgetId);

	}

	/**
	 * This method identifies the list of all the View definitions that are present for this user
	 * 
	 * @param UserValue - The user value object containing the details of the user
	 * @param product The product for which the list of views are required
	 * @param subProduct The sub product for which the list of views are required.
	 * @return The list of views defined for this user.
	 * @throws ViewDefinitionException Thrown if an error occurs while processing the given request
	 */
	public List getViewListForUser(IUserValue userValue) throws ViewDefinitionException
	{
		List listAllViews = null;
		LOGGER.ctinfo("CTVDF00741");
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewManager.getViewListForUser");
		LOGGER.ctdebug("CTVDF00742", userValue);
		String sUserNo = userValue.getUserNo();
		String sGcifID = userValue.getPrimaryGcif();
		LOGGER.ctdebug("CTVDF00743", sUserNo, sGcifID);
		ViewDefinitionInstruction viewDefinitionInstruction = new ViewDefinitionInstruction();
		listAllViews = viewDefinitionInstruction.getAllViewDefinitions(sUserNo, sGcifID);
		LOGGER.ctinfo("CTVDF00744", listAllViews);
		performanceTimer.endTimer();
		LOGGER.ctinfo("CTVDF00745");
		return listAllViews;
	}

	/**
	 * This method gets the list of child Widgets that are associated to the provided widget id for the given user /
	 * gcif. If there is no customization at the user level, then the default configuration is fetched.
	 * 
	 * @param widgetId The widget for which the list of child widgets needs to be fetched
	 * @param userNo The user who is trying to access the widget
	 * @param gcif The GCIF of the user
	 * @return The list of child widgets that are associated to the provided widget id for the given user
	 * @throws ViewDefinitionException Thrown if any error occurs while querying the database
	 */
	public List getChildWidgetsForUser(String widgetId, CanvasViewEntlVO entlvo) throws ViewDefinitionException
	{
		List listAllViews = null;
		LOGGER.ctinfo("CTVDF00746", widgetId);
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewManager.getChildWidgetsForUser(String widgetId, String userNo, String gcif)");

		ViewDefinitionInstruction instruction = new ViewDefinitionInstruction();
		listAllViews = instruction.getChildWidgetsForUser(widgetId, entlvo);
		// End the performance timer
		performanceTimer.endTimer();
		LOGGER.ctinfo("CTVDF00747");
		return listAllViews;
	}

	/**
	 * This method gets the list of child Widgets that are associated to the provided widget id for the given user /
	 * gcif. If there is no customization at the user level, then the default configuration is fetched.
	 * 
	 * @param widgetId The widget for which the list of child widgets needs to be fetched
	 * @param userNo The user who is trying to access the widget
	 * @param gcif The GCIF of the user
	 * @return The list of child widgets that are associated to the provided widget id for the given user
	 * @throws ViewDefinitionException Thrown if any error occurs while querying the database
	 */
	public Map getMultiWidgetForUser(String widgetId, CanvasViewEntlVO entlvo) throws ViewDefinitionException
	{
		Map widgetMap = null;
		LOGGER.ctinfo("CTVDF00748", widgetId);
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewManager.getChildWidgetsForUser(String widgetId, String userNo, String gcif)");

		ViewDefinitionInstruction instruction = new ViewDefinitionInstruction();
		widgetMap = instruction.getMultiWidgetForUser(widgetId, entlvo);
		// End the performance timer
		performanceTimer.endTimer();
		LOGGER.ctinfo("CTVDF00749");
		return widgetMap;
	}

	/**
	 * This method identifies the set of views that are enabled for a particular widget id for the given user. This
	 * returns the following for every view - VIEW_ID, VIEW_DISPLAY_NM, DEFAULT_VIEW_IND
	 * 
	 * @param widgetId The widget ID for which the views list needs to be fetched
	 * @param userNo The user for which the list of views needs to be fetched
	 * @param gcif The GCIF to which the user belongs to
	 * @return The list of views for the given user / widget
	 * @throws ViewDefinitionException Thrown if any error occurs while querying the database
	 */
	public List getViewListForUser(String widgetId, CanvasViewEntlVO entlvo) throws ViewDefinitionException
	{
		List listAllViews = null;
		LOGGER.ctinfo("CTVDF00750", widgetId);
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewManager.getViewListForUser(String widgetId, String userNo, String gcif)");

		ViewDefinitionInstruction instruction = new ViewDefinitionInstruction();
		listAllViews = instruction.getListOfViewsFor(widgetId, entlvo);
		// End the performance timer
		performanceTimer.endTimer();
		LOGGER.ctinfo("CTVDF00751");
		return listAllViews;
	}

	/**
	 * This method identifies the list of System Views NB: System Views are those for which the User Id and GCIF are
	 * null.
	 * 
	 * @return The list of System Views
	 * @throws ViewDefinitionException Thrown if an error occurs while processing the given request
	 */
	public List getSystemViews() throws ViewDefinitionException
	{
		List listSystemViews = null;
		LOGGER.ctinfo("CTVDF00752");
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewManager.getSystemViews");
		CacheManager cacheManager = CacheManager.getFWInstance();
		listSystemViews = cacheManager.getDataFromCache(null, "SYSTEM_VIEWS");
		LOGGER.ctdebug("CTVDF00753", listSystemViews);
		performanceTimer.endTimer();
		LOGGER.ctinfo("CTVDF00754");
		return listSystemViews;
	}

	/**
	 * This method creates a new view
	 * 
	 * @param viewDefinition
	 * @throws ViewDefinitionException
	 */
	public String createView(ViewDefinition viewDefinition) throws ViewDefinitionException
	{
		String createdViewId = null;
		LOGGER.ctinfo("CTVDF00755");
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewManager.createView");
		ViewDefinitionInstruction viewDefinitionInstruction = new ViewDefinitionInstruction();
		createdViewId = viewDefinitionInstruction.createView(viewDefinition);
		performanceTimer.endTimer();
		LOGGER.ctinfo("CTVDF00756");
		return createdViewId;
	}

	/**
	 * This method updates a view
	 * 
	 * @param viewDefinition
	 * @param isRestoreDefaults
	 * @param userValue
	 * @throws ViewDefinitionException
	 */
	public void updateView(ViewDefinition viewDefinition, boolean isRestoreDefaults, IUserValue userValue)
			throws ViewDefinitionException
	{
		LOGGER.ctinfo("CTVDF00757");
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewManager.updateView");
		IViewInstruction viewInstruction = null;
		LOGGER.ctdebug("CTVDF00758", userValue);
		String sUserNo = userValue.getUserNo();
		String sGcifID = userValue.getPrimaryGcif();
		LOGGER.ctdebug("CTVDF00759", sUserNo, sGcifID, isRestoreDefaults, viewDefinition);
		ViewInstructionFactory viewInstructionFactory = ViewInstructionFactory.getInstance();
		LOGGER.ctdebug("CTVDF00760", viewDefinition.getSystemViewID());
		if (viewDefinition.getSystemViewID() != null && !"".equals(viewDefinition.getSystemViewID()))
		{
			viewInstruction = viewInstructionFactory.getViewInstruction(viewDefinition.getSystemViewID(),
					viewDefinition);
		} else
		{
			viewInstruction = viewInstructionFactory.getViewInstruction(viewDefinition.getViewId(), viewDefinition);
		}
		LOGGER.ctdebug("CTVDF00761", viewInstruction);
		viewInstruction.deleteExtension(viewDefinition.getViewId());
		ViewDefinitionInstruction viewDefinitionInstruction = new ViewDefinitionInstruction();
		viewDefinitionInstruction.updateViewDefinition(viewDefinition, isRestoreDefaults, userValue.getUserNo(),
				userValue.getPrimaryGcif());
		performanceTimer.endTimer();
		LOGGER.ctinfo("CTVDF00762");
	}

	/**
	 * This method used to get a viewId for widget
	 * 
	 * @param widgetId
	 * @throws ViewDefinitionException
	 */
	public String getViewIdForWidget(String widgetId) throws ViewDefinitionException
	{
		String viewId = null;
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewManager.getViewForWidget");
		ViewDefinitionInstruction viewDefinitionInstruction = new ViewDefinitionInstruction();

		viewId = viewDefinitionInstruction.getViewForWidget(widgetId);
		performanceTimer.endTimer();
		return viewId;
	}

	/**
	 * This method updates a view
	 * 
	 * @param viewDefinition
	 * @return String
	 * 
	 * @throws ViewDefinitionException
	 */
	public String saveView(ViewDefinition viewDefinition) throws ViewDefinitionException
	{
		String savedViewId = null;
		LOGGER.ctinfo("CTVDF00763");
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewManager.saveView");
		IViewInstruction viewInstruction = null;
		LOGGER.ctdebug("CTVDF00761", viewInstruction);
		ViewDefinitionInstruction viewDefinitionInstruction = new ViewDefinitionInstruction();
		savedViewId = viewDefinitionInstruction.saveViewInstruction(viewDefinition);
		performanceTimer.endTimer();
		LOGGER.ctinfo("CTVDF00764");
		return savedViewId;
	}

	/**
	 * This method updates a view
	 * 
	 * @param viewId
	 * @param extKey
	 * @param extValue
	 * @throws ViewDefinitionException
	 */
	public void updateRateCard(String viewId, String extKey, String extValue) throws ViewDefinitionException
	{
		LOGGER.ctinfo("CTVDF00765");
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewManager.updateRateCard");
		ViewDefinitionInstruction viewDefinitionInstruction = new ViewDefinitionInstruction();
		viewDefinitionInstruction.insertAccListRateCard(viewId, extKey, extValue);
		performanceTimer.endTimer();
		LOGGER.ctinfo("CTVDF00766");
	}

	/**
	 * This method deletes the view definition provided.
	 * 
	 * @param viewDefinition
	 * @param userValue
	 * @throws ViewDefinitionException Thrown if any error occurs while querying database.
	 */
	public void deleteViewDefinition(ViewDefinition viewDefinition, IUserValue userValue)
			throws ViewDefinitionException
	{
		LOGGER.ctinfo("CTVDF00769");
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewManager.deleteViewDefinition");
		LOGGER.ctdebug("CTVDF00758", userValue);
		String sUserNo = userValue.getUserNo();
		String sGcifID = userValue.getPrimaryGcif();
		LOGGER.ctdebug("CTVDF00770", sUserNo, sGcifID, viewDefinition);
		ViewDefinitionInstruction viewDefinitionInstruction = new ViewDefinitionInstruction();
		viewDefinitionInstruction.deleteViewDefinition(viewDefinition.getViewId(), sUserNo, sGcifID);
		performanceTimer.endTimer();
		LOGGER.ctinfo("CTVDF00771");
	}

	/**
	 * This method returns the Context Menu List for the Views
	 * 
	 * @param widgetId
	 * @param gcifNo
	 * @param userNo
	 * @return List of context menus
	 * @throws ViewDefinitionException
	 **/
	public List getContextMenus(String widgetId, String gcifNo, String userNo, String deviceType, String sChannelId,
			String sUserRole) throws ViewDefinitionException
	{
		List contextList = null;
		ContextMenuList contextMenuList = new ContextMenuList();
		/**
		 * the code below calls the method for fetching the data for Context Menus and the attach it to the existing
		 * List for the view definition
		 */
		// the HashMap is to be converted into hierarchy based list here

		contextList = contextMenuList.getContextListMenus(widgetId, gcifNo, userNo, deviceType, sChannelId, sUserRole);

		LOGGER.ctdebug("CTVDF00772", contextList);

		return contextList;

	}

	/**
	 * This method returns the productCategory-Widgets Map. The result map will be constructed as follows, key -
	 * productCategory value - map which contains productCategory, productCategoryDisplayName, widgetIds list
	 * 
	 * The widgets will be selected which are configured against the user entitled products.
	 * 
	 * @param userNo the user number
	 * @param gcifNo - GCIF
	 * @return Map product Category versus widgets map
	 * @throws ViewDefinitionException will be raised when any error/exception occurred.
	 */
	public final Map productCategoryWidgetsMap(final String userNo, final String gcifNo, final String sChannelId,
			final String sUserRole) throws ViewDefinitionException
	{
		LOGGER.ctinfo("CTVDF00773");
		Map tmpProductCategoryMap = new HashMap();

		/**
		 * Step 1: Getting the widgets which are already assigned to the existing product categoreis.
		 */
		List widgetList = getWidgetsForThatCategories(userNo, gcifNo, sChannelId, sUserRole);
		Map catMap = null;
		String productCategory = null;
		String productCategoryDisplayName = null;
		String prodBundleKey = null;
		/**
		 * Step 2: Iterate the widgetList for constructing the product category map. Key - productCategory. Value - Map
		 * (productCategory, productCategoryDisplayName and widgets list).
		 */
		for (Object obj : widgetList)
		{
			catMap = (Map) obj;
			productCategory = (String) catMap.get(ViewDefinitionConstants.PARAM_PRODUCT_CATEGORY);
			productCategoryDisplayName = (String) catMap.get(ViewDefinitionConstants.PARAM_PRODUCT_CATEGORY_DISPLAY_NM);
			prodBundleKey = (String) catMap.get(ViewDefinitionConstants.PARAM_PROD_BUNDLE_KEY); // CT_DESIGN_CANVAS
			/**
			 * Step 3: If the tmpProductCategoryMap doesn't contain the entry for product category, create new entry
			 * work empty list.
			 */
			if (tmpProductCategoryMap.get(productCategory) == null)
			{
				tmpProductCategoryMap.put(
						productCategory,
						buildProductCategoryWidgetIdsMap(productCategory, productCategoryDisplayName,
								Collections.EMPTY_LIST));

				((Map) tmpProductCategoryMap.get(productCategory)).put(ViewDefinitionConstants.PARAM_BUNDLE_KEY,
						prodBundleKey); // CT_DESIGN_CANVAS
			}
			/**
			 * Step 4: Adding widget ids to the list which is assigned to the product category in tmpProductCategoryMap.
			 */
			((List) ((Map) tmpProductCategoryMap.get(productCategory)).get(ViewDefinitionConstants.PARAM_WIDGETS))
					.add(catMap.get(ViewDefinitionConstants.PARAM_WIDGET_ID));
		}

		LOGGER.ctinfo("CTVDF00773");
		return tmpProductCategoryMap;
	}

	/**
	 * This method returns the list of product categories with widget ids which are applicable to the user.
	 * 
	 * @param userNo the user number
	 * @param gcifNo - GCIF
	 * @return list of the widgets
	 * @throws ViewDefinitionException will be raised when any error/exception occurred.
	 */
	private List getWidgetsForThatCategories(final String userNo, final String gcifNo, final String sChannelId,
			final String sUserRole) throws ViewDefinitionException
	{

		List widgetList = null;
		List entitledProdList = null;
		EntitlementsHelper entlHelper = new EntitlementsHelper();

		// Should return the list of widgets for that product categories - entitlement class - getProductCategories
		try
		{
			/**
			 * Step 1: Fetch the user entitled products list from database.
			 * */
			entitledProdList = entlHelper.getUserAccessEntitlements(gcifNo, userNo).getEntitlementsAsProductFunction();
			/**
			 * Step 2: Adding the DEFAULT_WORKSPACE (DASHBOARD) to the product list to user.
			 * */
			/*
			 * Map addlProdMap = new HashMap(); addlProdMap.put("prodCode", ViewDefinitionConstants.DEFAULT_WORKSPACE);
			 * entitledProdList.add(addlProdMap);
			 */

			/**
			 * Step 3: Getting the product categories which are applicable to the entitled product list.
			 * */
			ViewDefinitionInstruction viewDefinitionInstruction = new ViewDefinitionInstruction();
			widgetList = viewDefinitionInstruction.getAllWidgets(userNo, gcifNo, entitledProdList);
		} catch (ViewDefinitionException exception)
		{
			LOGGER.cterror("CTVDF00806", gcifNo, userNo, exception);
			throw new ViewDefinitionException(exception);
		} catch (EntitlementException e)
		{
			LOGGER.cterror("CTVDF00806", gcifNo, userNo, e);
			throw new ViewDefinitionException(e);

		}
		return widgetList;

	}

	/**
	 * This method returns the widget which all are applicable to the user based on their entitled products.
	 * 
	 * @param userNo the user number
	 * @param gcifNo - GCIF
	 * @return widgets list
	 * @throws ViewDefinitionException will be raised when any error/exception occurred.
	 */
	public final List getAllWidgets(final String userNo, final String gcifNo, final String sChannelId,
			final String sUserRole) throws ViewDefinitionException
	{
		LOGGER.ctinfo("CTVDF00774");
		List widgetList = null;
		List<ProductFunctionVO> productFunctionVOList = null;
		try
		{
			EntitlementsHelper entlHelper = new EntitlementsHelper();
			productFunctionVOList = entlHelper.getUserAccessEntitlements(gcifNo, userNo, sUserRole)
					.getEntitlementsAsProductFunction();
			// CT_ENTITLEMENT ends

			ViewDefinitionInstruction viewDefinitionInstruction = new ViewDefinitionInstruction();
			widgetList = viewDefinitionInstruction.getAllWidgets(userNo, gcifNo, productFunctionVOList);

		} catch (ViewDefinitionException exception)
		{
			LOGGER.cterror("CTVDF00775", gcifNo, userNo, sUserRole, exception);
			throw new ViewDefinitionException(exception);
		} catch (EntitlementException e)
		{
			LOGGER.cterror("CTVDF00775", gcifNo, userNo, sUserRole, e);
			throw new ViewDefinitionException(e);
		}
		LOGGER.ctinfo("CTVDF00776");
		return widgetList;
	}

	/**
	 * This method returns the workspace definition object for the given workspace id.
	 * 
	 * @param userNo - the user number
	 * @param gcifNo - GCIF
	 * @param workspaceId - to get the workspace definition
	 * @return list of widget ids
	 * @throws ViewDefinitionException will be raised when any error/exception occurred.
	 */
	public final WorkspaceDefinition getWorkspaceDefinition(final String userNo, final String gcifNo,
			final String workspaceId) throws ViewDefinitionException
	{
		LOGGER.ctinfo("CTVDF00777");
		LOGGER.ctdebug("CTVDF00778", workspaceId);
		ViewDefinitionInstruction viewDefinitionInstruction = new ViewDefinitionInstruction();

		/**
		 * Fetching the workspace details for the workspace id.
		 * */
		WorkspaceDefinition workspaceDefinition = viewDefinitionInstruction.getWorkspaceDefinition(userNo, gcifNo,
				workspaceId);
		LOGGER.ctdebug("CTVDF00779", workspaceDefinition);

		LOGGER.ctinfo("CTVDF00780");
		return workspaceDefinition;
	}

	/**
	 * This methods returns the list of workspaces which contains the given display name.
	 * 
	 * @param workspaceDisplayName - to get the workspace definitions which all are have the same display name.
	 * @return list of workspaces
	 * @throws ViewDefinitionException will be raised if any error/exception occured
	 */
	public final List getWorkspaceByName(final String workspaceDisplayName) throws ViewDefinitionException
	{
		LOGGER.ctinfo("CTVDF00781");
		LOGGER.ctdebug("CTVDF00782", workspaceDisplayName);
		ViewDefinitionInstruction viewDefinitionInstruction = new ViewDefinitionInstruction();

		/**
		 * Fetching the workspace details for the workspaceDisplayName.
		 * */
		List workspaceList = viewDefinitionInstruction.getWorkspaceByName(workspaceDisplayName);
		LOGGER.ctdebug("CTVDF00783", workspaceList);

		LOGGER.ctinfo("CTVDF00784");
		return workspaceList;
	}

	/**
	 * This method save the workspace details to database. It gets the maximum workspace position from the databse and
	 * incremented by one and set it as new workspace position.
	 * 
	 * @param workspaceDefinition - workspace definition details
	 * @throws ViewDefinitionException will be raised if any error/exception occured
	 */
	public final void saveWorkspaceDefinition(final WorkspaceDefinition workspaceDefinition)
			throws ViewDefinitionException
	{
		LOGGER.ctinfo("CTVDF00785");
		ViewDefinitionInstruction viewDefinitionInstruction = new ViewDefinitionInstruction();

		/**
		 * Step 1: Fetching the maximum position for the workspace from database and increase by one and setting to new
		 * workspace.
		 * */
		int workspacePosition = getWorkspaceMaxPosition();
		workspaceDefinition.setPosition(++workspacePosition);

		/**
		 * Step 2: Inserting the workspace details to database.
		 * */
		LOGGER.ctdebug("CTVDF00786", workspacePosition);
		viewDefinitionInstruction.saveWorkSpaceDefinition(workspaceDefinition);

		LOGGER.ctinfo("CTVDF00787");
	}

	/**
	 * This method delete the workspace details from database.
	 * 
	 * @param userNo - the user number
	 * @param gcifNo - GCIF
	 * @param workspaceId to delete
	 * @return number of rows deleted
	 * @throws ViewDefinitionException will be raised if any error/exception occured
	 */
	public final int deleteWorkspaceDefinition(final String userNo, final String gcifNo, final String workspaceId)
			throws ViewDefinitionException
	{
		LOGGER.ctinfo("CTVDF00788");
		ViewDefinitionInstruction viewDefinitionInstruction = new ViewDefinitionInstruction();

		/**
		 * Step 1: Removing the workspace details from database.
		 * */
		int noOfRowsDeleted = viewDefinitionInstruction.deleteWorkspace(userNo, gcifNo, workspaceId);

		LOGGER.ctinfo("CTVDF00788");
		return noOfRowsDeleted;
	}

	/**
	 * This method returns the maximum value of the POSITION field in the WORKSPACE_DEFINITION table.
	 * 
	 * @return position
	 * @throws ViewDefinitionException will be raised if any error/exception occured
	 */
	public final int getWorkspaceMaxPosition() throws ViewDefinitionException
	{
		LOGGER.ctinfo("CTVDF00789");
		ViewDefinitionInstruction viewDefinitionInstruction = new ViewDefinitionInstruction();
		int maxPosition = viewDefinitionInstruction.getWorkspaceMaxPosition();
		LOGGER.ctdebug("CTVDF00790", maxPosition);
		LOGGER.ctinfo("CTVDF00791");
		return maxPosition;
	}

	/**
	 * This method returns the filtered map for the product category.<br/>
	 * Result Map: key - productCategory.<br/>
	 * value - Map contains productCategory, productCategoryDisplayName and widget id list.
	 * 
	 * @param productCategory - Product Category
	 * @param productCategoryDisplayName - Display name
	 * @param widgetList - Widgets List
	 * @return product category / Widget ids map
	 */
	public final Map buildProductCategoryWidgetIdsMap(final String productCategory,
			final String productCategoryDisplayName, final List widgetList)
	{
		Map workspaceMap = new HashMap();
		workspaceMap.put(ViewDefinitionConstants.PARAM_PRODUCT_CATEGORY, productCategory);
		workspaceMap.put(ViewDefinitionConstants.PARAM_PRODUCT_CATEGORY_DISPLAY_NM, productCategoryDisplayName);
		List widgetIdList = new ArrayList();
		String widgetId = null;
		for (Iterator widgetIter = widgetList.iterator(); widgetIter.hasNext();)
		{
			Map widget = (Map) widgetIter.next();
			widgetId = (String) widget.get(ViewDefinitionConstants.PARAM_WIDGET_ID);
			if (!widgetIdList.contains(widgetId))
			{
				widgetIdList.add(widgetId);
			}
		}
		workspaceMap.put(ViewDefinitionConstants.PARAM_WIDGETS, widgetIdList);
		return workspaceMap;
	}

	/**
	 * This method processes the widgetview tools map for the view
	 * 
	 * @param viewWidgetTools
	 * @return
	 */
	private List processWidgetViewToolsMap(List<HashMap> viewWidgetTools)
	{
		HashMap aMap;
		String widgetId;
		String viewId;
		StringBuffer toolsBuffer = new StringBuffer();
		HashMap<String, String> viewToolsMap = new HashMap<String, String>();
		Iterator<HashMap> iterator = viewWidgetTools.iterator();

		while (iterator.hasNext())
		{
			toolsBuffer.setLength(0);
			aMap = iterator.next();
			widgetId = (String) aMap.get(ViewDefinitionConstants.PARAM_WIDGET_ID);
			viewId = (String) aMap.get(ViewDefinitionConstants.VIEW_ID);
			checkAndAdd(ViewDefinitionConstants.FLD_TOOLS_CUSTOMIZE, ViewDefinitionConstants.TOOLS_CUSTOMIZE, aMap,
					toolsBuffer);
			checkAndAdd(ViewDefinitionConstants.FLD_TOOLS_EXPORT_TO_EXCEL,
					ViewDefinitionConstants.TOOLS_EXPORT_TO_EXCEL, aMap, toolsBuffer);
			checkAndAdd(ViewDefinitionConstants.FLD_TOOLS_EXPORT_TO_PDF, ViewDefinitionConstants.TOOLS_EXPORT_TO_PDF,
					aMap, toolsBuffer);
			checkAndAdd(ViewDefinitionConstants.FLD_TOOLS_EXPORT_TO_CSV, ViewDefinitionConstants.TOOLS_EXPORT_TO_CSV,
					aMap, toolsBuffer);
			checkAndAdd(ViewDefinitionConstants.FLD_TOOLS_EXPORT_TO_JPG, ViewDefinitionConstants.TOOLS_EXPORT_TO_JPG,
					aMap, toolsBuffer);
			checkAndAdd(ViewDefinitionConstants.FLD_TOOLS_FILTER, ViewDefinitionConstants.TOOLS_FILTER, aMap,
					toolsBuffer);
			checkAndAdd(ViewDefinitionConstants.FLD_TOOLS_HELP, ViewDefinitionConstants.TOOLS_HELP, aMap, toolsBuffer);
			checkAndAdd(ViewDefinitionConstants.FLD_TOOLS_HISTORY, ViewDefinitionConstants.TOOLS_HISTORY, aMap,
					toolsBuffer);
			checkAndAdd(ViewDefinitionConstants.FLD_TOOLS_PRINT, ViewDefinitionConstants.TOOLS_PRINT, aMap, toolsBuffer);
			checkAndAdd(ViewDefinitionConstants.FLD_TOOLS_PULL_OUT, ViewDefinitionConstants.TOOLS_PULLOUT, aMap,
					toolsBuffer);
			checkAndAdd(ViewDefinitionConstants.FLD_TOOLS_REFRESH, ViewDefinitionConstants.TOOLS_REFRESH, aMap,
					toolsBuffer);
			checkAndAdd(ViewDefinitionConstants.FLD_TOOLS_COLLAPSE, ViewDefinitionConstants.TOOLS_COLLAPSE, aMap,
					toolsBuffer);
			checkAndAdd(ViewDefinitionConstants.FLD_TOOLS_SHOW_AS_TOOLBAR,
					ViewDefinitionConstants.TOOLS_SHOW_AS_TOOLBAR, aMap, toolsBuffer);
			checkAndAdd(ViewDefinitionConstants.FLD_TOOLS_MAXIMIZE, ViewDefinitionConstants.TOOLS_MAXIMIZE, aMap,
					toolsBuffer);
			checkAndAdd(ViewDefinitionConstants.FLD_TOOLS_CHART, ViewDefinitionConstants.TOOLS_CHART, aMap, toolsBuffer);
			checkAndAdd(ViewDefinitionConstants.FLD_TOOLS_EXPORT_TO_RTF, ViewDefinitionConstants.TOOLS_EXPORT_TO_RTF,
					aMap, toolsBuffer);
			if (aMap.get(ViewDefinitionConstants.CUSTOM_TOOLS_ID) != null
					&& aMap.get(ViewDefinitionConstants.CUSTOM_TOOLS_ID).toString() != "")
			{
				toolsBuffer.append(",").append(aMap.get(ViewDefinitionConstants.CUSTOM_TOOLS_ID).toString());
				viewToolsMap.put(widgetId + "-" + viewId + "-" + ViewDefinitionConstants.CUSTOM_TOOLS_ID,
						aMap.get(ViewDefinitionConstants.CUSTOM_TOOLS_ID).toString());
			}
			viewToolsMap.put(widgetId + "-" + viewId, toolsBuffer.toString());
		}
		viewWidgetTools.clear();
		viewWidgetTools.add(viewToolsMap);
		return viewWidgetTools;
	}

	/**
	 * Helper method that checks whether the value for the field name provided is Yes in the map. If yes, then it
	 * appends the toolKey to the Stringbuffer.
	 * 
	 * @param toolFieldName The field name to check
	 * @param toolKey The key to be added to the buffer
	 * @param aMap The map having the tools configuration
	 * @param toolsBuffer The buffer consolidating the tools
	 */
	private void checkAndAdd(String toolFieldName, String toolKey, HashMap aMap, StringBuffer toolsBuffer)
	{
		if (ViewDefinitionConstants.VAL_BOOL_YES.equals(aMap.get(toolFieldName)))
		{
			if (toolsBuffer.length() > 0)
				toolsBuffer.append(",");
			toolsBuffer.append(toolKey);
		}
	}

	// An instance of Logger
	private static Logger LOGGER = Logger.getLogger(ViewManager.class);

}
