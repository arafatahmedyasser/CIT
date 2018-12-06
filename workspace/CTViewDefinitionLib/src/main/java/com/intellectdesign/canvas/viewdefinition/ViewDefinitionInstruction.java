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
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.intellectdesign.canvas.cache.handler.CacheManager;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.SystemPreferenceDescriptor;
import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;
import com.intellectdesign.canvas.entitlement.CanvasViewEntlVO;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.logging.PerformanceTimer;

/**
 * This class is for view definition instruction implements iview definition instruction
 * 
 * @version 1.0
 */
public class ViewDefinitionInstruction implements IViewDefinitionInstruction
{
	/**
	 * Retrieves a view definition identified by the viewId.
	 * 
	 * @param sViewId
	 * @return ViewDefinition
	 * @throws ViewDefinitionException
	 */
	public final ViewDefinition getViewDefinition(final String sViewId) throws ViewDefinitionException
	{
		List viewList = null;
		ViewDefinition viewDefinition = null;
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		logger.ctinfo("CTVDF00400");
		logger.ctinfo("CTVDF00401", sViewId);
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.getViewDefinition");
		try
		{
			// Go to db and fetch the view definition
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_GET_VIEW_FOR_ID_QRY);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_VIEW_ID, sViewId);
			dbResult = dbRequest.execute();
			viewList = dbResult.getReturnedList();
			if (viewList != null && !viewList.isEmpty())
			{
				viewDefinition = (ViewDefinition) viewList.get(0);
			} else
			{
				logger.ctdebug("CTVDF00402", sViewId);
			}
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00403", dbExp, sViewId);
			throw new ViewDefinitionException(dbExp);
		}
		performanceTimer.endTimer();
		logger.ctdebug("CTVDF00404", viewDefinition);
		logger.ctinfo("CTVDF00405");
		return viewDefinition;
	}

	/**
	 * This method gets the default view id for the given user.
	 * 
	 * @param sUserNo
	 * @param sGcifID
	 * @return String - the view id
	 * @throws ViewDefinitionException
	 */
	public final String getDefaultViewIdForUser(final String sUserNo, final String sGcifID)
			throws ViewDefinitionException
	{
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		List viewIDList = null;
		HashMap hmViewIDMap = null;
		String sViewID = null;
		logger.ctinfo("CTVDF00406");
		logger.ctinfo("CTVDF00407", sUserNo, sGcifID);
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.getDefaultViewIdForUser");
		try
		{
			// Go to db and fetch the default view id
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_GET_DEFAULT_VIEW_ID_QRY);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_USER_NO, sUserNo);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_GCIF, sGcifID);
			dbResult = dbRequest.execute();
			viewIDList = dbResult.getReturnedList();
			if (viewIDList != null && !viewIDList.isEmpty())
			{
				hmViewIDMap = (HashMap) viewIDList.get(0);
				logger.ctdebug("CTVDF00408", hmViewIDMap);
				sViewID = (String) (hmViewIDMap.get("VIEW_ID"));
			} else
			{
				logger.ctdebug("CTVDF00409");
			}
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00410", dbExp, sUserNo);
			throw new ViewDefinitionException(dbExp);
		}
		performanceTimer.endTimer();
		logger.ctdebug("CTVDF00411", sViewID);
		logger.ctinfo("CTVDF00412");
		return sViewID;
	}

	/**
	 * This method gets the Customized default view id for the given user for a particular Widget.
	 * 
	 * @param sUserNo
	 * @param sGcifID
	 * @param widgetId
	 * @return String - the view id
	 * @throws ViewDefinitionException
	 */
	public final String getUsersCustDefViewIdForWidget(final String sUserNo, final String sGcifID, final String widgetId)
			throws ViewDefinitionException
	{
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		List viewIDList = null;
		HashMap hmCustDefViewIDMap = null;
		String sViewID = null;
		logger.ctinfo("CTVDF00413");
		logger.ctinfo("CTVDF00414", sUserNo, sGcifID, widgetId);
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.getUsersCustDefViewIdForWidget");
		try
		{
			// Go to db and fetch the default view id
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_GET_CUST_DEFAULT_VIEW_ID_QRY);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_USER_NO, sUserNo);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_GCIF, sGcifID);
			dbRequest.addFilter(ViewDefinitionConstants.PARAM_WIDGET_ID, widgetId);
			dbResult = dbRequest.execute();
			viewIDList = dbResult.getReturnedList();
			if (viewIDList != null && !viewIDList.isEmpty())
			{
				hmCustDefViewIDMap = (HashMap) viewIDList.get(0);
				logger.ctdebug("CTVDF00415", hmCustDefViewIDMap);
				sViewID = (String) (hmCustDefViewIDMap.get("DEFAULT_VIEW_ID"));
			} else
			{
				sViewID = ViewDefinitionConstants.NO_CUST_DEF_VIEW_ID;
				logger.ctdebug("CTVDF00416");
			}
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00418", dbExp, sUserNo);
			throw new ViewDefinitionException(dbExp);
		}
		performanceTimer.endTimer();
		logger.ctdebug("CTVDF00419", sViewID);
		logger.ctinfo("CTVDF00420");
		return sViewID;
	}

	/**
	 * This method gets all the view definiton for the given user. All view definitions include 1. The system view
	 * definitions and 2. The view definitions defined by the user
	 * 
	 * @param sUserNo
	 * @param sGcifID
	 * @return ArrayList - ArrayList of view definitions
	 * @throws ViewDefinitionException
	 */
	public final List getAllViewDefinitions(final String sUserNo, final String sGcifID) throws ViewDefinitionException
	{
		List listViews = null;
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		logger.ctinfo("CTVDF00421");
		logger.ctinfo("CTVDF00422", sUserNo, sGcifID);
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.getAllViewDefinitions");
		try
		{
			// Go to db and fetch all the view definitions for the user
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_GET_ALL_VIEWS_FOR_USER_QRY);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_USER_NO, sUserNo);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_GCIF, sGcifID);
			dbResult = dbRequest.execute();
			listViews = dbResult.getReturnedList();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00423", dbExp, sUserNo);
			throw new ViewDefinitionException(dbExp);
		}
		performanceTimer.endTimer();
		logger.ctinfo("CTVDF00424");
		return listViews;
	}

	/**
	 * This method updates the view definition. If restoreDefaults = true, then it rolls backs the view definiton to the
	 * default system view definition.
	 * 
	 * @param viewDefinition
	 * @param isRestoreDefaults
	 * @param sUserNo
	 * @param sGcifID
	 * @throws ViewDefinitionException
	 */
	public final void updateViewDefinition(final ViewDefinition viewDefinition, final boolean isRestoreDefaults,
			final String sUserNo, final String sGcifID) throws ViewDefinitionException
	{
		String sParentViewID = null;
		ViewDefinition parentViewDefinition = null;
		boolean isUserDefinedView = false;
		logger.ctinfo("CTVDF00425");
		logger.ctinfo("CTVDF00426", viewDefinition, isRestoreDefaults, sUserNo, sGcifID);
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.updateViewDefinition");
		if (viewDefinition != null)
		{
			// The user cannot update the system views or the views that are
			// created by other users. He can update the
			// views which he has created.
			// This check is accomplished by ensuring that the user no and gcif
			// of the view to be updated, matches to
			// that of the user.
			// isUserDefined view will be true if this view is created by this
			// user.
			// else it returns false
			isUserDefinedView = isUserDefinedView(viewDefinition.getViewId(), sUserNo, sGcifID);
			if (isUserDefinedView)
			{
				if (isRestoreDefaults)
				{
					restoreDefaults(viewDefinition, sUserNo, sGcifID);
				} else
				{
					sParentViewID = viewDefinition.getParentViewId();
					logger.ctdebug("CTVDF00427", sParentViewID);
					// Get the parent view definition. The child view will
					// inherit the parent's instruction class, sql
					// param map, product and subproduct.
					parentViewDefinition = getViewDefinition(sParentViewID);
					logger.ctdebug("CTVDF00428", parentViewDefinition);
					viewDefinition.setInstructionClassName(parentViewDefinition.getInstructionClassName());
					viewDefinition.setSqlParamMapID(parentViewDefinition.getSqlParamMapID());
					viewDefinition.setProduct(parentViewDefinition.getProduct());
					viewDefinition.setSubProduct(parentViewDefinition.getSubProduct());
					logger.ctdebug("CTVDF00429", viewDefinition);
					if (viewDefinition.isDefaultView())
					{
						resetDefaultViewForUser(viewDefinition.getUserNumber(), viewDefinition.getGCIF());
					}
					deleteViewDefinition(viewDefinition.getViewId(), sUserNo, sGcifID);
					insertViewDefinition(viewDefinition, parentViewDefinition);
				}
			} else
			{
				logger.cterror("CTVDF00430");
				throw new ViewDefinitionException("This view is not created by the user. Hence it cannot be updated. ",
						"The user id is" + sUserNo);
			}
		} else
		{
			logger.cterror("CTVDF00431");
			throw new ViewDefinitionException("View definition is null", "ViewDefinition : " + viewDefinition);
		}
		performanceTimer.endTimer();
		logger.ctinfo("CTVDF00432");
	}

	/**
	 * This method returns the system view definiton for the given view id, user no and gcif.
	 * 
	 * @param sViewId
	 * @param sUserNo
	 * @param sGcifID
	 * @return ViewDefinition
	 * @throws ViewDefinitionException
	 */
	public final ViewDefinition getSystemViewForUserDefinedView(final String sViewId, final String sUserNo,
			final String sGcifID) throws ViewDefinitionException
	{
		ViewDefinition viewDefinition = null;
		String sSystemViewId = null;
		logger.ctinfo("CTVDF00433");
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.getSystemViewForUserDefinedView");
		sSystemViewId = getSystemViewIdForUserDefinedView(sViewId, sUserNo, sGcifID);
		logger.ctinfo("CTVDF00434", sSystemViewId);
		viewDefinition = getViewDefinition(sSystemViewId);
		logger.ctdebug("CTVDF00435", viewDefinition);
		performanceTimer.endTimer();
		logger.ctinfo("CTVDF00436");
		return viewDefinition;
	}

	/**
	 * This method is intended to check whether the View Name is already available.
	 * 
	 * @param userNo
	 * @param gcif
	 * @param product
	 * @param subProduct
	 * @param viewName
	 * @return boolean
	 * @throws ViewDefinitionException
	 */
	public final boolean viewNameCheck(final String userNo, final String gcif, final String product,
			final String subProduct, final String viewName, final String sysViewId) throws ViewDefinitionException
	{
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;

		List<String> listViewName = null;
		logger.ctinfo("CTVDF00437");
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.getViewNameCount");
		try
		{
			// Go to db and get the system view id for the given view id
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_GET_VIEW_DISP_NM_COUNT_QRY);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_USER_NO, userNo);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_GCIF, gcif);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_PRODUCT_CODE, product);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_SUB_PRODUCT_CODE, subProduct);
			dbRequest.addFilter(ViewDefinitionConstants.PARAM_VIEW_NAME, viewName);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_SYSTEM_VIEW_ID, sysViewId);
			dbResult = dbRequest.execute();
			listViewName = dbResult.getReturnedList();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00438", dbExp, viewName);
			throw new ViewDefinitionException(dbExp);
		}
		logger.ctdebug("CTVDF00439", listViewName);
		if (!listViewName.isEmpty())
		{
			logger.ctinfo("CTVDF00440");
			return false;
		}
		performanceTimer.endTimer();
		logger.ctinfo("CTVDF00440");
		return true;
	}

	/**
	 * This method returns the system view id for the given view.
	 * 
	 * @param sViewId
	 * @param sUserNo
	 * @param sGcifID
	 * @return String - the system view id
	 * @throws ViewDefinitionException
	 */
	public final String getSystemViewIdForUserDefinedView(final String sViewId, final String sUserNo,
			final String sGcifID) throws ViewDefinitionException
	{
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		String sSystemViewId = null;
		List listSystemViewID = null;
		HashMap hmSystemViewId = null;
		logger.ctinfo("CTVDF00441");
		logger.ctinfo("CTVDF00442", sViewId, sUserNo, sGcifID);
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.getSystemViewIdForUserDefinedView");
		try
		{
			// Go to db and get the system view id for the given view id
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_GET_SYSTEM_VIEW_ID_QRY);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_VIEW_ID, sViewId);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_USER_NO, sUserNo);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_GCIF, sGcifID);
			dbResult = dbRequest.execute();
			listSystemViewID = dbResult.getReturnedList();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00443", dbExp, sViewId);
			throw new ViewDefinitionException(dbExp);
		}
		logger.ctdebug("CTVDF00444", listSystemViewID);
		if (listSystemViewID != null && !listSystemViewID.isEmpty())
		{
			hmSystemViewId = (HashMap) listSystemViewID.get(0);
			sSystemViewId = (String) (hmSystemViewId.get(ViewDefinitionConstants.FLD_SYSTEM_VIEW_ID));
		} else
		{
			logger.cterror("CTVDF00445", sViewId);
			throw new ViewDefinitionException("No System View found for the given view", "View Id : " + sViewId);
		}
		performanceTimer.endTimer();
		logger.ctinfo("CTVDF00446");
		logger.ctinfo("CTVDF00447", sSystemViewId);
		return sSystemViewId;
	}

	/**
	 * This method deletes the view definition of the user for the given view id. Also deletes the associated column
	 * definitions of the view and the filters.
	 * 
	 * @param sViewID
	 * @param sUserNo
	 * @param sGcifID
	 * @throws ViewDefinitionException
	 */
	public final void deleteViewDefinition(final String sViewID, final String sUserNo, final String sGcifID)
			throws ViewDefinitionException
	{
		DatabaseRequest dbRequest = null;
		boolean isUserDefinedView = false;
		logger.ctinfo("CTVDF00448");
		logger.ctinfo("CTVDF00449", sViewID, sUserNo, sGcifID);
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.deleteViewDefinition");
		isUserDefinedView = isUserDefinedView(sViewID, sUserNo, sGcifID);
		// The user cannot delete the system views or the views that are created
		// by other users. He can delete the views
		// which he has created.
		// This check is accomplished by ensuring that the user no and gcif of
		// the view to be deleted, matches to that
		// of the user.
		// isUserDefined view will be true if this view is created by this user.
		// else it returns false
		if (isUserDefinedView)
		{
			try
			{
				// delete the filter definitions
				deleteColumnFilterDefinitions(sViewID);
				// delete the column definitions
				deleteColumndefinitions(sViewID);
				// Go to db and delete the view definition.
				deleteViewDefnAddlPref(sViewID);
				dbRequest = new CanvasDatabaseRequest();
				dbRequest.setOperation(DatabaseConstants.DELETE);
				dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
				dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_DELETE_VIEW_DEFINITIONS_QRY);
				dbRequest.addFilter(ViewDefinitionConstants.FLD_VIEW_ID, sViewID);
				dbRequest.addFilter(ViewDefinitionConstants.FLD_USER_NO, sUserNo);
				dbRequest.addFilter(ViewDefinitionConstants.FLD_GCIF, sGcifID);
				dbRequest.execute();
				// delete the column definitions
				deleteWidgetDefn(sViewID);
			} catch (DatabaseException dbExp)
			{
				logger.cterror("CTVDF00450", dbExp);
				throw new ViewDefinitionException(dbExp);
			}
		} else
		{
			logger.cterror("CTVDF00451");
			throw new ViewDefinitionException("This view is not created by the user. Hence it cannot be deleted",
					"The user id is" + sUserNo);
		}
		performanceTimer.endTimer();
		logger.ctinfo("CTVDF00453");
	}

	/**
	 * This method deletes the view definition additional preferences
	 * 
	 * @param viewID
	 * @throws ViewDefinitionException
	 */

	private void deleteViewDefnAddlPref(final String viewID) throws ViewDefinitionException
	{
		DatabaseRequest dbRequest = null;
		logger.ctinfo("CTVDF00454");
		logger.ctinfo("CTVDF00455", viewID);
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.deleteViewDefnAddlPref");
		try
		{
			// Go to db and delete column filter definition
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.DELETE);
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_DELETE_VIEWDEF_ADDL_PREF_DEL_QRY);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_VIEW_ID, viewID);
			dbRequest.execute();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00456", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
		performanceTimer.endTimer();
		logger.ctinfo("CTVDF00457");

	}

	/**
	 * This method deletes the Widget definition of the user for setting the default view id. Also deletes the
	 * associated column definitions of the view and the filters.
	 * 
	 * @param viewID
	 * @throws ViewDefinitionException
	 */
	private void deleteWidgetDefn(final String viewID) throws ViewDefinitionException
	{
		DatabaseRequest dbRequest = null;
		logger.ctinfo("CTVDF00458");
		logger.ctinfo("CTVDF00459", viewID);
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.deleteWidgetDefn");
		try
		{
			// Go to db and delete column filter definition
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.DELETE);
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_DELETE_WIDGET_DEFINITIONS_QRY);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_VIEW_ID, viewID);
			dbRequest.execute();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00460", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
		performanceTimer.endTimer();
		logger.ctinfo("CTVDF00461");

	}

	/**
	 * This method creates a new view from the given view definition.
	 * 
	 * @param viewDefinition
	 * @return String
	 * @throws ViewDefinitionException
	 */
	public final String createView(final ViewDefinition viewDefinition) throws ViewDefinitionException
	{
		String createdViewId = null;
		ViewDefinition parentViewDefinition = null;
		logger.ctinfo("CTVDF00462");
		if (viewDefinition != null)
		{
			logger.ctdebug("CTVDF00463", viewDefinition.getViewDefinitionAsMap());
			logger.ctinfo("CTVDF00464", viewDefinition);
		}
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.createView");
		if (viewDefinition != null)
		{
			createdViewId = UUID.randomUUID().toString();
			logger.ctdebug("CTVDF00465", parentViewDefinition);
			viewDefinition.setViewId(createdViewId);

			insertViewDefinition(viewDefinition);
		}
		performanceTimer.endTimer();
		logger.ctinfo("CTVDF00466");
		return createdViewId;
	}

	/**
	 * This method creates a new view from the given view definition.
	 * 
	 * @param viewDefinition
	 * @return String
	 * @throws ViewDefinitionException
	 */
	public final String saveViewInstruction(final ViewDefinition viewDefinition) throws ViewDefinitionException
	{
		String sViewID = null;
		String sUserNo = null;
		String sGcif = null;
		logger.ctinfo("CTVDF00467");
		if (viewDefinition != null)
		{
			logger.ctdebug("CTVDF00463", viewDefinition.getViewDefinitionAsMap());
			logger.ctinfo("CTVDF00464", viewDefinition);
		}
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.saveViewInstruction");
		if (viewDefinition != null)
		{
			sViewID = viewDefinition.getViewId();
			sUserNo = viewDefinition.getUserNumber();
			sGcif = viewDefinition.getGCIF();
			deleteViewDefinition(sViewID, sUserNo, sGcif);
			insertViewDefinition(viewDefinition);
		}
		performanceTimer.endTimer();
		logger.ctinfo("CTVDF00468");
		return sViewID;
	}

	/**
	 * This method resetes the default view indicator to false, for the given View id, user number and gcif.
	 * 
	 * @param sUserNumber
	 * @param sGcif
	 * @throws ViewDefinitionException
	 */
	private void resetDefaultViewForUser(final String sUserNumber, final String sGcif) throws ViewDefinitionException
	{
		DatabaseRequest dbRequest = null;
		logger.ctinfo("CTVDF00469");
		logger.ctdebug("CTVDF00470", sUserNumber, sGcif);
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.resetDefaultViewForUser");
		try
		{
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.UPDATE);
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_RESET_DEFAULT_VIEW);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_USER_NO, sUserNumber);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_GCIF, sGcif);
			dbRequest.execute();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00471", dbExp, sUserNumber);
			throw new ViewDefinitionException(dbExp);
		}
		performanceTimer.endTimer();
		logger.ctinfo("CTVDF00472");
	}

	/**
	 * This method inserts the view definition including the column definition of the view and the filters.
	 * 
	 * @param viewDefinition
	 * @throws ViewDefinitionException
	 */
	private void insertViewDefinition(final ViewDefinition viewDefinition) throws ViewDefinitionException
	{
		ArrayList listColumnDefinition = null;
		ColumnDefinition columnDefinition = null;
		ColumnFilter columnFilter = null;
		String sFilterID = null;
		ArrayList listFilters = null;

		ArrayList listColumnDefnMap = null;
		HashMap mapColumnDefn = null;
		ArrayList listColumnFilterDefnMap = null;
		HashMap mapColumnFilterDefn = null;
		logger.ctinfo("CTVDF00473");
		if (viewDefinition != null)
		{
			logger.ctdebug("CTVDF00474", viewDefinition.getViewDefinitionAsMap());
			logger.ctinfo("CTVDF00474", viewDefinition);
		}
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.insertViewDefinition");
		if (viewDefinition != null)
		{

			// Insert into WIDGET_DEFINITION Table if default View is set as Yes
			// for the newly created View
			if (viewDefinition.isDefaultView())
			{
				String custDefViewId = getUsersCustDefViewIdForWidget(viewDefinition.getUserNumber(),
						viewDefinition.getGCIF(), viewDefinition.getWidgetId());
				deleteWidgetDefn(custDefViewId);
				logger.ctdebug("CTVDF00475");
				insertIntoWidgetDefnTbl(viewDefinition);
			}
			// Insert Into VIEW_DEFINITION
			insertIntoViewDefinitionTbl(viewDefinition);

			// Insert Into VIEW_DEFINITION_TOOL_PREF

			// Insert Into VIEW_DEFN_ADDL_PREFERENCES
			insertIntoViewDefnAddlPrefTbl(viewDefinition);

			listColumnDefinition = viewDefinition.getListColumns();
			if (listColumnDefinition != null && !listColumnDefinition.isEmpty())
			{
				listColumnDefnMap = new ArrayList();
				listColumnFilterDefnMap = new ArrayList();
				for (int i = 0; i < listColumnDefinition.size(); i++)
				{
					columnDefinition = (ColumnDefinition) listColumnDefinition.get(i);
					columnDefinition.setViewId(viewDefinition.getViewId());
					logger.ctdebug("CTVDF00476", columnDefinition.getColumnId(),
							columnDefinition.getColumnDefinitionAsMap());
					mapColumnDefn = formColumnDefnDataMap(columnDefinition);
					listColumnDefnMap.add(mapColumnDefn);
					// Insert column definiton
					// insertColumnDefinition(columnDefinition);
					listFilters = columnDefinition.getListFilters();
					if (listFilters != null && !listFilters.isEmpty())
					{
						for (int j = 0; j < listFilters.size(); j++)
						{
							columnFilter = (ColumnFilter) listFilters.get(j);
							sFilterID = getFilterIDForFilterType(columnFilter.getFilterType(),
									columnFilter.getDataType());
							columnFilter.setFilterID(sFilterID);
							mapColumnFilterDefn = formColumnFilterDataMap(columnFilter, viewDefinition.getViewId());
							listColumnFilterDefnMap.add(mapColumnFilterDefn);

						}
					} else
					{
						logger.ctdebug("CTVDF00477", columnDefinition.getColumnId());
					}
				}
				// Insert Into VIEW_COLUMN_DEFINITION
				insertColumnDefinitions(listColumnDefnMap);
				// Insert Into VIEW_COLUMN_FILTER
				insertColumnFilterDefns(listColumnFilterDefnMap);
			} else
			{
				logger.cterror("CTVDF00478");
				throw new ViewDefinitionException("No column definitions found for the given view ",
						viewDefinition.getViewId());
			}
		}
		performanceTimer.endTimer();

	}

	/**
	 * This method inserts ViewDefn additional pref into table
	 * 
	 * @param viewDefinition
	 * @throws ViewDefinitionException
	 */
	private void insertIntoViewDefnAddlPrefTbl(final ViewDefinition viewDefinition) throws ViewDefinitionException
	{
		DatabaseRequest dbRequest = null;
		HashMap hmViewDefnAddlPrefMap = null;

		if (viewDefinition.getViewPreferences() != null)
		{
			hmViewDefnAddlPrefMap = formViewDefnAddlPrfDataMap(viewDefinition);
			logger.ctdebug("CTVDF00479", hmViewDefnAddlPrefMap);
			try
			{
				// Go to db and insert the view definition
				dbRequest = new CanvasDatabaseRequest();
				dbRequest.setOperation(DatabaseConstants.INSERT);
				dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
				dbRequest
						.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_INSERT_VIEW_DEFN_ADDL_PREFERENCES_QRY);
				dbRequest.setData(hmViewDefnAddlPrefMap);
				dbRequest.execute();

			} catch (DatabaseException dbExp)
			{
				logger.cterror("CTVDF00480", dbExp);
				throw new ViewDefinitionException(dbExp);
			}
		}
	}

	/**
	 * This method returns a hashmap of formViewDefnAddlPrfData
	 * 
	 * @param viewDefinition
	 * @return HashMap
	 */
	private HashMap formViewDefnAddlPrfDataMap(final ViewDefinition viewDefinition)
	{
		HashMap hmViewDefnAddlPrefMap = null;
		logger.ctinfo("CTVDF00481");
		logger.ctinfo("CTVDF00482", viewDefinition);
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.formViewDefnAddlPrfDataMap");
		if (viewDefinition != null)
		{
			hmViewDefnAddlPrefMap = new HashMap();
			hmViewDefnAddlPrefMap.put("VIEW_ID", viewDefinition.getViewId());
			hmViewDefnAddlPrefMap.put("RATECARD_IND", viewDefinition.getViewPreferences().getRateCardAvailableInd());
			hmViewDefnAddlPrefMap.put("RATECARD", viewDefinition.getViewPreferences().getRateCardId());
			hmViewDefnAddlPrefMap.put("REFERENCE_CCY_IND", viewDefinition.getViewPreferences()
					.getReferenceCcyAvailableInd());
			hmViewDefnAddlPrefMap.put("REFERENCE_CCY", viewDefinition.getViewPreferences().getReferenceCcy());
			hmViewDefnAddlPrefMap.put("LAST_COL_HANDLE_IND", viewDefinition.getViewPreferences()
					.getLastColumnHandlingAvailableInd());
			hmViewDefnAddlPrefMap.put("LAST_COL_HANDLE_METHOD", viewDefinition.getViewPreferences()
					.getLastColumnHandling());
			hmViewDefnAddlPrefMap.put("ACCT_GRP_HANDLE_IND", viewDefinition.getViewPreferences()
					.getAcctGroupHandlingAvailableInd());
			hmViewDefnAddlPrefMap.put("ACCT_GRP_HANDLE_METHOD", viewDefinition.getViewPreferences()
					.getAcctGroupHandling());
			hmViewDefnAddlPrefMap.put("PERIOD_IND", viewDefinition.getViewPreferences().getPeriodInd());
			hmViewDefnAddlPrefMap.put("PERIOD", viewDefinition.getViewPreferences().getPeriod());
			hmViewDefnAddlPrefMap.put("SUB_PERIOD", viewDefinition.getViewPreferences().getSubPeriod());
			hmViewDefnAddlPrefMap.put("FROM_DATE", viewDefinition.getViewPreferences().getFromDate());
			hmViewDefnAddlPrefMap.put("TO_DATE", viewDefinition.getViewPreferences().getToDate());
		}
		performanceTimer.endTimer();
		logger.ctdebug("CTVDF00483", viewDefinition);
		logger.ctinfo("CTVDF00484");
		return hmViewDefnAddlPrefMap;
	}

	/**
	 * This method inserts ViewDefn into ViewDefinition table
	 * 
	 * @param viewDefinition
	 * @throws ViewDefinitionException
	 */
	private void insertIntoViewDefinitionTbl(final ViewDefinition viewDefinition) throws ViewDefinitionException
	{
		DatabaseRequest dbRequest = null;
		HashMap hmViewDefnMap = null;
		hmViewDefnMap = formViewDefnDataMap(viewDefinition);
		logger.ctdebug("CTVDF00485", hmViewDefnMap);
		try
		{
			// Go to db and insert the view definition
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.INSERT);
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_INSERT_VIEW_DEFINITION_QRY);
			dbRequest.setData(hmViewDefnMap);
			dbRequest.execute();

		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00486", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
	}

	/**
	 * This method inserts WidgetDefn into WidgetDefinition table
	 * 
	 * @param viewDefinition
	 * @throws ViewDefinitionException
	 */
	private void insertIntoWidgetDefnTbl(final ViewDefinition viewDefinition) throws ViewDefinitionException
	{
		DatabaseRequest dbRequest = null;
		HashMap hmWidgetDefnMap = null;
		hmWidgetDefnMap = formWidgetDefnDataMap(viewDefinition);
		logger.ctdebug("CTVDF00487", hmWidgetDefnMap);
		try
		{
			// Go to db and insert the view definition
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.INSERT);
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_INSERT_WIDGET_DEFINITION_QRY);
			dbRequest.setData(hmWidgetDefnMap);
			dbRequest.execute();

		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00488", dbExp);
			throw new ViewDefinitionException(dbExp);
		}

	}

	/**
	 * Forms the Widget Definition Data map from the ViewDefinition.
	 * 
	 * @param viewDefinition
	 * @return HashMap
	 */
	private HashMap formWidgetDefnDataMap(ViewDefinition viewDefinition)
	{
		HashMap hmWidgetDefnMap = null;
		logger.ctinfo("CTVDF00489");
		logger.ctinfo("CTVDF00490", viewDefinition);
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.formWidgetDefnDataMap");
		if (viewDefinition != null)
		{
			hmWidgetDefnMap = new HashMap();
			hmWidgetDefnMap.put("WIDGET_ID", viewDefinition.getWidgetId());
			hmWidgetDefnMap.put("DEFAULT_VIEW_ID", viewDefinition.getViewId());
			hmWidgetDefnMap.put("OD_USER_NO", viewDefinition.getUserNumber());
			hmWidgetDefnMap.put("OD_GCIF", viewDefinition.getGCIF());
			hmWidgetDefnMap.put("OD_PRODUCT", viewDefinition.getProduct());
			hmWidgetDefnMap.put("OD_SUB_PRODUCT", viewDefinition.getSubProduct());
		}
		performanceTimer.endTimer();
		logger.ctdebug("CTVDF00491", viewDefinition);
		logger.ctinfo("CTVDF00492");
		return hmWidgetDefnMap;
	}

	/**
	 * Forms the View Definition Data map from the ViewDefinition.
	 * 
	 * @param viewDefinition
	 * @return HashMap
	 */
	private HashMap formViewDefnDataMap(final ViewDefinition viewDefinition)
	{
		HashMap hmViewDefnMap = null;
		logger.ctinfo("CTVDF00493");
		logger.ctinfo("CTVDF00494", viewDefinition);
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.formViewDefnDataMap");
		if (viewDefinition != null)
		{
			hmViewDefnMap = new HashMap();
			hmViewDefnMap.put("VIEW_ID", viewDefinition.getViewId());
			hmViewDefnMap.put("VIEW_DISPLAY_NM", viewDefinition.getViewName());
			hmViewDefnMap.put("DEFAULT_VIEW_IND", viewDefinition.getStrDefaultView());
			hmViewDefnMap.put("INSTRUCTION_CLASS", viewDefinition.getInstructionClassName());
			hmViewDefnMap.put("PARENT_VIEW_ID", viewDefinition.getParentViewId());
			hmViewDefnMap.put("PRODUCT", viewDefinition.getProduct());
			hmViewDefnMap.put("SUB_PRODUCT", viewDefinition.getSubProduct());
			hmViewDefnMap.put("USER_NO", viewDefinition.getUserNumber());
			hmViewDefnMap.put("GCIF", viewDefinition.getGCIF());
			hmViewDefnMap.put("RECORDS_PER_PAGE", viewDefinition.getStrRecordsPerPage());
			hmViewDefnMap.put("SQL_PARAM_MAP_ID", viewDefinition.getSqlParamMapID());
			hmViewDefnMap.put("OVERRIDDEN_FLAG", viewDefinition.getStrOverriddenView());
			hmViewDefnMap.put("SYSTEM_VIEW_ID", viewDefinition.getSystemViewID());
			hmViewDefnMap.put("FILTER_ENABLED", viewDefinition.getStrFilterEnabled());
			hmViewDefnMap.put("COLUMN_ORDERING", viewDefinition.getStrColumnOrderingEnabled());
			hmViewDefnMap.put("GROUPING_ENABLED_IND", viewDefinition.getStrGroupingEnabled());
			hmViewDefnMap.put("START_UP_MODE", viewDefinition.getStartUpMode());
			hmViewDefnMap.put("VIEW_TYPE", viewDefinition.getViewType());
			hmViewDefnMap.put("CHART_TYPE", viewDefinition.getChartType());
			hmViewDefnMap.put("INIT_COLLAPSED", viewDefinition.getInitCollapsed());
			hmViewDefnMap.put("PAGE_SIZE", viewDefinition.getPageSize());
			hmViewDefnMap.put("DETAIL_ACTION_IND", viewDefinition.getDetailActionInd());
			hmViewDefnMap.put("CONTEXT_ACTION_IND", viewDefinition.getContextActionInd());

			hmViewDefnMap.put("AUTOLOAD_IND", viewDefinition.getGetAutoLoadInd());
			hmViewDefnMap.put("DISPLAY_TOTAL_RESULT_IND", viewDefinition.getTotalResultInd());
			hmViewDefnMap.put("GROUP_HEADER_REQD_IND", viewDefinition.getGroupingHeaderReqd());

			hmViewDefnMap.put("SELECTION_TYPE", viewDefinition.getSelectionType());
			hmViewDefnMap.put("DATA_SRC_ID", viewDefinition.getDataSrcId());
			hmViewDefnMap.put("CONTEXT_COLUMN", viewDefinition.getContextColumn());
			hmViewDefnMap.put("GLOBAL_DATE_FILTER_IND", viewDefinition.getGlobalDateFitlerInd());
			hmViewDefnMap.put("IS_DATA_CACHED", viewDefinition.getIsDataCached());
			hmViewDefnMap.put("IS_GROUP_MODIFIABLE", viewDefinition.getIsGroupModifiable());
			hmViewDefnMap.put("INIT_GROUP_STAGE", viewDefinition.getInitGroupStage());
			hmViewDefnMap.put("IS_SUMMARY_REQUIRED", viewDefinition.getIsSummaryReqd());

			hmViewDefnMap.put("DETAIL_MSG_IND", viewDefinition.getDetailMsgInd());
			hmViewDefnMap.put("DETAIL_MSG_LBL", viewDefinition.getDetailMsgLbl());

			hmViewDefnMap.put("RESPONSIVE_TEMPLATE", viewDefinition.getResponsiveTemplate());
			hmViewDefnMap.put("BUNDLE_KEY", viewDefinition.getBundleKey());
			hmViewDefnMap.put("FUNCTION_CODE", viewDefinition.getFunctionCode());
		}
		performanceTimer.endTimer();
		logger.ctdebug("CTVDF00495", viewDefinition);
		logger.ctinfo("CTVDF00496");
		return hmViewDefnMap;
	}

	/**
	 * Forms the Column Definition Data map from the ColumnDefinition.
	 * 
	 * @param columnDefinition
	 * @return HashMap
	 */
	private HashMap formColumnDefnDataMap(final ColumnDefinition columnDefinition)
	{
		HashMap hmColumnDefnMap = null;
		logger.ctinfo("CTVDF00497");
		logger.ctinfo("CTVDF00498", columnDefinition);
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.formColumnDefnDataMap");
		if (columnDefinition != null)
		{
			hmColumnDefnMap = new HashMap();
			hmColumnDefnMap.put("VIEW_ID", columnDefinition.getViewId());
			hmColumnDefnMap.put("COLUMN_ID", columnDefinition.getColumnId());
			hmColumnDefnMap.put("COLUMN_DISPLAY_NM_KEY", columnDefinition.getColumnDisplayNameKey());
			hmColumnDefnMap.put("POSITION", columnDefinition.getPosition());
			hmColumnDefnMap.put("POSITION_FIXED_IND", columnDefinition.getStrPositionFixed());
			hmColumnDefnMap.put("MANDATORY_IND", columnDefinition.getStrMandatory());
			hmColumnDefnMap.put("VISIBLE_IND", columnDefinition.getStrVisible());
			hmColumnDefnMap.put("SORT_POSITION", columnDefinition.getStrSortPosition());
			hmColumnDefnMap.put("SORT_ORDER", columnDefinition.getSortOrder());
			hmColumnDefnMap.put("DATA_TYPE", columnDefinition.getDataType());
			hmColumnDefnMap.put("HIDDEN_IND", columnDefinition.getStrHidden());
			hmColumnDefnMap.put("SORTABLE_IND", columnDefinition.getStrSortable());
			hmColumnDefnMap.put("GROUPABLE_IND", columnDefinition.getStrGroupable());
			hmColumnDefnMap.put("REL_POS_IN_GRP", columnDefinition.getStrGroupRelativePosition());
			hmColumnDefnMap.put("POS_IN_GRP", columnDefinition.getGroupPosition());
			hmColumnDefnMap.put("MANDATORY_IN_GRP_IND", columnDefinition.getStrMandatoryInGroup());
			hmColumnDefnMap.put("IS_GROUPED", columnDefinition.getStrGrouped());
			hmColumnDefnMap.put("DRILL_DOWN_IND", columnDefinition.getStrDrilldownRequired());
			hmColumnDefnMap.put("SEARCH_INDICATOR", columnDefinition.getStrSearchAllowed());
			hmColumnDefnMap.put("SEARCH_ORDER", columnDefinition.getSearchOrder());
			hmColumnDefnMap.put("SEARCH_DATA_TYPE", columnDefinition.getSearchDataType());
			hmColumnDefnMap.put("CODE_VAL_VIEW_ID", columnDefinition.getCodeValViewId());
			hmColumnDefnMap.put("CODE_VAL_CODE_COL", columnDefinition.getCodeValCodeCol());
			hmColumnDefnMap.put("CODE_VAL_DISP_COL", columnDefinition.getCodeValDisplayCol());
			hmColumnDefnMap.put("X_SERIES_IND", columnDefinition.getXSeriesInd());
			hmColumnDefnMap.put("Y_SERIES_IND", columnDefinition.getYSeriesInd());
			hmColumnDefnMap.put("DATA_SERIES_IND", columnDefinition.getDataSeriedInd());
			hmColumnDefnMap.put("FILTER_HANDLER_ID", columnDefinition.getFilterHandlerId());
			hmColumnDefnMap.put("FILTER_DATA_TYPE", columnDefinition.getFilterDataType());
			hmColumnDefnMap.put("FILTERING_ENABLED_IND", columnDefinition.getFilterEnableInd());
			hmColumnDefnMap.put("LINKED_SOURCE_AMT", columnDefinition.getLinkedSourceAmt());
			hmColumnDefnMap.put("LINKED_SOURCE_CCY", columnDefinition.getLinkedSourceCcy());
			hmColumnDefnMap.put("LOOKUP_FILTER_EXTPARAMS", columnDefinition.getLookupFilterExtParams());

			hmColumnDefnMap.put("PARENT_COLUMN_ID", columnDefinition.getParentColumnId());

			hmColumnDefnMap.put("APPEND_CURRENCY_MODE", columnDefinition.getCurrencyAppend());
			hmColumnDefnMap.put("PRIORITY", columnDefinition.getPriority());
		}
		performanceTimer.endTimer();
		logger.ctdebug("CTVDF00499", hmColumnDefnMap);
		logger.ctinfo("Exited from formColumnDefnDataMap method");
		return hmColumnDefnMap;
	}

	/**
	 * Forms the Column Filter definition Data map from the ColumnFilter. Definition
	 * 
	 * @param columnFilter ColumnFilter
	 * @param sViewID sViewID
	 * @return HashMap
	 */
	private HashMap formColumnFilterDataMap(final ColumnFilter columnFilter, final String sViewID)
	{
		HashMap hmColumnFilterMap = null;
		logger.ctinfo("CTVDF00500");
		logger.ctinfo("CTVDF00501", columnFilter, sViewID);
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.formColumnFilterDataMap");
		if (columnFilter != null)
		{
			hmColumnFilterMap = new HashMap();
			hmColumnFilterMap.put("VIEW_ID", sViewID);
			hmColumnFilterMap.put("COLUMN_ID", columnFilter.getColumnID());
			hmColumnFilterMap.put("FILTER_ID", columnFilter.getFilterID());
			hmColumnFilterMap.put("FILTER_VALUES", columnFilter.getStrFilterValues());
		}
		performanceTimer.endTimer();
		logger.ctdebug("CTVDF00502", hmColumnFilterMap);
		logger.ctinfo("CTVDF00503");
		return hmColumnFilterMap;
	}

	/**
	 * This method gets the system views NB: System views are those views for which the user no and gcif are null.
	 * 
	 * 
	 * @return List - list of system views
	 * @throws ViewDefinitionException
	 */
	public final List getSystemViews() throws ViewDefinitionException
	{
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		List listSystemViews = null;
		logger.ctinfo("CTVDF00504");
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.getSystemViews");
		try
		{
			// Go to db and fetch the system views
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_GET_SYSTEM_VIEWS_QRY);
			dbResult = dbRequest.execute();
			listSystemViews = dbResult.getReturnedList();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00505", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
		performanceTimer.endTimer();
		logger.ctdebug("CTVDF00506", listSystemViews);
		logger.ctinfo("CTVDF00507");
		return listSystemViews;
	}

	/**
	 * This method gets the combination mapping of all widget to applicable views for that widget along with the tools
	 * enabled map for that combination
	 * 
	 * @return The list of maps containing the widget / view to the tools enabled configuration
	 * @throws ViewDefinitionException thrown if any error occurs while querying database.
	 */
	public final List getWidgetViewToolsMapping() throws ViewDefinitionException
	{
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		List systemViewWidgetToolsList = null;
		logger.ctinfo("CTVDF00508");
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.getWidgetViewToolsMapping");
		try
		{
			// Go to db and fetch the system views
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_VIEW_WIDGET_TOOLS);
			dbResult = dbRequest.execute();
			systemViewWidgetToolsList = dbResult.getReturnedList();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00509", dbExp);
			throw new ViewDefinitionException(dbExp);
		}

		performanceTimer.endTimer();
		logger.ctdebug("CTVDF00510", systemViewWidgetToolsList);
		logger.ctinfo("CTVDF00511");
		return systemViewWidgetToolsList;
	}

	/**
	 * This method restore the defualts for the given view. i.e. rolls back the properties as that of the system view
	 * from which it is derived, except for the view name, view id, isdefaultView, parent view id, user number, gcif,
	 * system view id .
	 * 
	 * @param viewDefinition
	 * @param sUserNo
	 * @param sGcifID
	 * @throws ViewDefinitionException
	 */
	private void restoreDefaults(final ViewDefinition viewDefinition, final String sUserNo, final String sGcifID)
			throws ViewDefinitionException
	{
		ViewDefinition systemViewDefinition = null;
		ViewDefinition defaultViewDefiniton = null;
		logger.ctinfo("CTVDF00512");
		logger.ctinfo("CTVDF00513", viewDefinition, sUserNo, sGcifID);
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.restoreDefaults");
		// Restore defualts will roll back all the properties of the view to
		// system view except for the view id and view
		// name
		systemViewDefinition = getSystemViewForUserDefinedView(viewDefinition.getViewId(), sUserNo, sGcifID);
		defaultViewDefiniton = systemViewDefinition;
		logger.ctdebug("CTVDF00514", systemViewDefinition);
		if (defaultViewDefiniton != null)
		{
			deleteViewDefinition(viewDefinition.getViewId(), sUserNo, sGcifID);
		} else
		{
			logger.ctdebug("CTVDF00515");
			throw new ViewDefinitionException("No System view definition found for the given view ",
					viewDefinition.getViewId());
		}
		performanceTimer.endTimer();
		logger.ctinfo("CTVDF00516");
	}

	/**
	 * This method inserts the view definition. This method is used by updateViewDefinition() and createView() methods
	 * 
	 * @param viewDefinition
	 * @param parentViewDefinition
	 * @throws ViewDefinitionException
	 */
	private void insertViewDefinition(final ViewDefinition viewDefinition, final ViewDefinition parentViewDefinition)
			throws ViewDefinitionException
	{
		ArrayList listParentColumnDefinitions = null;
		ArrayList listUpdatedColumnDefinitions = null;
		ColumnDefinition parentColumnDefinition = null;
		ColumnDefinition columnDefinition = null;
		ColumnDefinition updatedColumnDefinition = null;// This will have the
														// updated column
														// definitions of the
														// child
		PerformanceTimer performanceTimer = new PerformanceTimer();
		logger.ctdebug("CTVDF00517", viewDefinition.getViewDefinitionAsMap());
		performanceTimer.startTimer("ViewDefinitionInstruction.insertViewDefinition");
		logger.ctinfo("CTVDF00518");
		// Get the parent view's column definitions. This column definition has
		// to be overridden by the child's.
		listParentColumnDefinitions = parentViewDefinition.getListColumns();
		if (listParentColumnDefinitions != null && !listParentColumnDefinitions.isEmpty())
		{
			listUpdatedColumnDefinitions = new ArrayList();
			for (int i = 0; i < listParentColumnDefinitions.size(); i++)
			{
				// Get a column definition of the parent
				parentColumnDefinition = (ColumnDefinition) listParentColumnDefinitions.get(i);
				updatedColumnDefinition = parentColumnDefinition;
				// Get the corresponding column definition of the child using
				// the column id.
				columnDefinition = viewDefinition.getColumnDefnForColumn(parentColumnDefinition.getColumnId());
				// If the child column definition is not null, do the following
				// 1. Set the visibility of the updated column as that of the
				// child, if the column is not mandatory. The
				// mandatory column by default will be visible in case of child
				// view too.
				// 2. Set the list of filters for the updated column as that of
				// the child.
				// 3. Set the position of the updated column as that of the
				// child, if the position of the column is not
				// fixed.
				if (columnDefinition != null)
				{
					if (!updatedColumnDefinition.isMandatory())
					{
						updatedColumnDefinition.setVisible(columnDefinition.isVisible());
					}
					updatedColumnDefinition.setListFilters(columnDefinition.getListFilters());
					updatedColumnDefinition.setFilterRequired(columnDefinition.isFilterRequired());
					if (!updatedColumnDefinition.isPositionFixed())
					{
						updatedColumnDefinition.setPosition(columnDefinition.getPosition());
					}
				} else
				{
					// If the child column definition is null, do the following
					// 1. Set visibility of the parent column to false, if the
					// column is not mandatory
					// 2. Remove the filters for this column from the parent
					// 3. Remove the position for this column from the parent
					if (!updatedColumnDefinition.isMandatory())
					{
						updatedColumnDefinition.setVisible(false);
					}
					updatedColumnDefinition.setListFilters(null);
					updatedColumnDefinition.setFilterRequired(false);
					if (!updatedColumnDefinition.isPositionFixed())
					{
						updatedColumnDefinition.setPosition(ViewDefinitionConstants.NO_POSITION);
					}
				}
				updatedColumnDefinition.setViewId(viewDefinition.getViewId());
				// Now the updated column definition have all the settings.
				listUpdatedColumnDefinitions.add(updatedColumnDefinition);
			}
		}
		logger.ctdebug("CTVDF00519", listUpdatedColumnDefinitions);
		// viewDefinition.setListColumns(listUpdatedColumnDefinitions);
		logger.ctdebug("CTVDF00520", viewDefinition);
		insertViewDefinition(viewDefinition);
		performanceTimer.endTimer();
		logger.ctinfo("CTVDF00521");
	}

	/**
	 * This method deletes the column filter definitions identified by the view id.
	 * 
	 * @param sViewId
	 * @throws ViewDefinitionException
	 */
	private void deleteColumnFilterDefinitions(final String sViewId) throws ViewDefinitionException
	{
		DatabaseRequest dbRequest = null;
		logger.ctinfo("CTVDF00522");
		logger.ctinfo("CTVDF00523", sViewId);
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.deleteColumnFilterDefinitions");
		try
		{
			// Go to db and delete column filter definition
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.DELETE);
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_DELETE_COLUMN_FILTER_DEFN_QRY);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_VIEW_ID, sViewId);
			dbRequest.execute();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00524", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
		performanceTimer.endTimer();
		logger.ctinfo("CTVDF00525");
	}

	/**
	 * This method inserts the column filter definition (Bulk insert).
	 * 
	 * @param columnFilter
	 * @param listColumnFilterDefn
	 * @throws ViewDefinitionException
	 */
	private void insertColumnFilterDefns(final ArrayList listColumnFilterDefn) throws ViewDefinitionException
	{
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		int nTotalRowsAffected = 0;
		logger.ctinfo("CTVDF00526");
		logger.ctinfo("CTVDF00527", listColumnFilterDefn);
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.insertColumnFilterDefns");
		if (listColumnFilterDefn != null)
		{
			try
			{
				// Go to db and update the view definition
				dbRequest = new CanvasDatabaseRequest();
				dbRequest.setOperation(DatabaseConstants.BATCH_INSERT);
				dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
				dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_INSERT_BULK_COLUMN_FILTER_QRY);
				dbRequest.setBatchData(listColumnFilterDefn);
				dbResult = dbRequest.execute();
				nTotalRowsAffected = dbResult.getNoOfRowsAffected();
			} catch (DatabaseException dbExp)
			{
				logger.cterror("CTVDF00528", dbExp);
				throw new ViewDefinitionException(dbExp);
			}
			if (nTotalRowsAffected > 0)
			{
				logger.ctdebug("CTVDF00529");
			} else
			{
				logger.ctdebug("CTVDF00530");
			}
		} else
		{
			logger.ctdebug("CTVDF00531");
		}
		performanceTimer.endTimer();
		logger.ctinfo("CTVDF00532");
	}

	/**
	 * This method gets the filter id for the given filter type.
	 * 
	 * @param sFilterType
	 * @param sDataType
	 * @return String - the filter id
	 * @throws ViewDefinitionException
	 */

	public String getFilterIDForFilterType(final String sFilterType, final String sDataType)
			throws ViewDefinitionException
	{

		logger.ctinfo("CTVDF00533");
		logger.ctdebug("CTVDF00534", sFilterType, sDataType);
		String filterID = null;
		List filterMaster = CacheManager.getFWInstance().getDataFromCache(null,
				ViewDefinitionConstants.CACHE_KEY_VDF_FILTER_MASTER_DATA);

		if (!filterMaster.isEmpty())
		{
			for (Iterator fltrMstIter = filterMaster.iterator(); fltrMstIter.hasNext();)
			{
				Map filter = (Map) fltrMstIter.next();
				String tmpDataType = String.valueOf(filter.get(ViewDefinitionConstants.FLD_DAT_TYP));
				String tmpFilterName = String.valueOf(filter.get(ViewDefinitionConstants.FLD_FILTER_NAME));
				if ((tmpDataType.equals(sDataType)) && (tmpFilterName.equals(sFilterType)))
				{
					filterID = String.valueOf(filter.get(ViewDefinitionConstants.FLD_FILTER_ID));
					return filterID;

				}
			}
		}
		logger.ctdebug("CTVDF00535", filterID);
		logger.ctinfo("CTVDF00536");
		return filterID;

	}

	/**
	 * This method deletes the column definition details identified by the view id.
	 * 
	 * @param sViewId
	 * @throws ViewDefinitionException
	 */
	private void deleteColumndefinitions(final String sViewId) throws ViewDefinitionException
	{
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		int nTotalRowsAffected = 0;
		logger.ctinfo("CTVDF00537");
		logger.ctinfo("CTVDF00538", sViewId);
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.getFilterIDForFilterType");
		try
		{
			// Go to db and delte the column definitions
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.DELETE);
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_DELETE_COLUMN_DEFINITIONS_QRY);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_VIEW_ID, sViewId);
			dbResult = dbRequest.execute();
			nTotalRowsAffected = dbResult.getNoOfRowsAffected();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00539", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
		if (nTotalRowsAffected > 0)
		{
			logger.ctdebug("CTVDF00540");
		} else
		{
			logger.ctdebug("CTVDF00541");
		}
		performanceTimer.endTimer();
		logger.ctinfo("CTVDF00542");
	}

	/**
	 * This method inserts the column definition details(Bulk).
	 * 
	 * @param listColumnDefn
	 * @throws ViewDefinitionException
	 */
	private void insertColumnDefinitions(final ArrayList listColumnDefn) throws ViewDefinitionException
	{
		DatabaseRequest dbRequest = null;
		logger.ctinfo("CTVDF00543");
		logger.ctinfo("CTVDF00544", listColumnDefn);
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.insertColumnDefinitions");
		if (listColumnDefn != null)
		{
			try
			{
				// Go to db and update the view definition
				dbRequest = new CanvasDatabaseRequest();
				dbRequest.setOperation(DatabaseConstants.BATCH_INSERT);
				dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
				dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_INSERT_BULK_COLUMN_DEFINITION_QRY);
				dbRequest.setBatchData(listColumnDefn);
				dbRequest.execute();
			} catch (DatabaseException dbExp)
			{
				logger.cterror("CTVDF00545", dbExp);
				throw new ViewDefinitionException(dbExp);
			}
		} else
		{
			logger.cterror("CTVDF00546");
			throw new ViewDefinitionException("Column definition arraylist is null", "listColumnDefn : "
					+ listColumnDefn);
		}
		performanceTimer.endTimer();
		logger.ctinfo("CTVDF00547");
	}

	/**
	 * This method checks whether this view is created by the given user or not.
	 * 
	 * @param sViewID
	 * @param sUserNo
	 * @param sGcifID
	 * @return boolean
	 * @throws ViewDefinitionException
	 */
	private boolean isUserDefinedView(final String sViewID, final String sUserNo, final String sGcifID)
			throws ViewDefinitionException
	{
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		boolean isUserDefinedView = false;
		List listUserDetails = null;
		HashMap hmUserDetails = null;
		String sViewUserNo = null;
		String sViewGcifID = null;
		logger.ctinfo("CTVDF00548");
		logger.ctinfo("CTVDF00549", sViewID, sUserNo, sGcifID);
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.isUserDefinedView");
		try
		{
			// Go to db and get the userno and GCIF for the given view
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_GET_USER_DETAILS_QRY);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_VIEW_ID, sViewID);
			dbResult = dbRequest.execute();
			listUserDetails = dbResult.getReturnedList();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00550", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
		if (listUserDetails != null && !listUserDetails.isEmpty())
		{
			hmUserDetails = (HashMap) listUserDetails.get(0);
			sViewUserNo = (String) hmUserDetails.get(ViewDefinitionConstants.FLD_USER_NO);
			sViewGcifID = (String) hmUserDetails.get(ViewDefinitionConstants.FLD_GCIF);
		} else
		{
			logger.cterror("CTVDF00551");
			throw new ViewDefinitionException("No such view exists in db", sViewID);
		}
		logger.ctdebug("CTVDF00552", sViewUserNo, sViewGcifID);
		if (sUserNo.equals(sViewUserNo) && sGcifID.equals(sViewGcifID))
		{
			isUserDefinedView = true;
		} else
		{
			isUserDefinedView = false;
		}
		performanceTimer.endTimer();
		logger.ctinfo("CTVDF00553");
		return isUserDefinedView;
	}

	/**
	 * This method inserts the rate card defintion for account list view.
	 * 
	 * @param viewId
	 * @param extKey
	 * @param extValue
	 * @throws ViewDefinitionException
	 */
	public final void insertAccListRateCard(final String viewId, final String extKey, final String extValue)
			throws ViewDefinitionException
	{
		DatabaseRequest dbRequest = null;
		HashMap hmColumnDefnMap = null;
		logger.ctinfo("CTVDF00554");
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.insertAccListRateCard");

		hmColumnDefnMap = new HashMap();
		hmColumnDefnMap.put("VIEW_ID", viewId);
		hmColumnDefnMap.put("EXT_KEY", extKey);
		hmColumnDefnMap.put("EXT_VALUE", extValue);
		logger.ctdebug("CTVDF00555", hmColumnDefnMap);
		try
		{
			// Go to db and update the view definition
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.INSERT);
			dbRequest.setDataAccessMapKey("ACC_LIST_RATE");
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_INSERT_COLUMN_DEFINITION_QRY);
			dbRequest.setData(hmColumnDefnMap);
			dbRequest.execute();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00560", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
		performanceTimer.endTimer();
		logger.ctinfo("CTVDF00561");
	}

	/**
	 * This method deletes the rate card defintion for account list view.
	 * 
	 * @param viewId
	 * @throws ViewDefinitionException
	 */
	public final void deleteAccListRateCard(final String viewId) throws ViewDefinitionException
	{
		DatabaseRequest dbRequest = null;
		logger.ctinfo("CTVDF00562");
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.deleteAccListRateCard");

		try
		{
			// Go to db and update the view definition
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.DELETE);
			dbRequest.setDataAccessMapKey("ACC_LIST_RATE");
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_INSERT_COLUMN_DEFINITION_QRY);
			dbRequest.addFilter(ViewDefinitionConstants.VIEW_ID, viewId);
			dbRequest.execute();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00563", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
		performanceTimer.endTimer();
		logger.ctinfo("CTVDF00564");
	}

	/**
	 * This method gets configuration data of the provided widget id for a specific user / gcif. If there is no
	 * customization at the user level, then the default configuration is fetched.
	 * 
	 * @param widgetId The widget for which the data needs to be fetched
	 * @param userNo The user who is trying to access the widget
	 * @param gcif The GCIF of the user
	 * @return The list of child widgets that are associated to the provided widget id for the given user
	 * @exception ViewDefinitionException thrown if any error occurs while querying database
	 */
	public final Map getMultiWidgetForUser(final String widgetId, CanvasViewEntlVO entlvo)
			throws ViewDefinitionException
	{
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult;
		List returnList = null;
		logger.ctinfo("CTVDF00565");
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.getChildWidgetsForUser");

		try
		{
			// Fire the next query to get the list of views for the widget for
			// this user. Against each view there is a
			// default view indicator
			// that helps identify whether a particular view is default.
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_USER_CONFIG_FOR_WIDGET);
			dbRequest.addFilter(ViewDefinitionConstants.PARAM_WIDGET_ID, widgetId);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_USER_NO, entlvo.getUserNo());
			dbRequest.addFilter(ViewDefinitionConstants.FLD_GCIF, entlvo.getGcif());
			dbRequest.addFilter(ViewDefinitionConstants.ENTITLEMENTS, entlvo.getEntitlements());
			dbResult = dbRequest.execute();
			returnList = dbResult.getReturnedList();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00566", dbExp, widgetId, entlvo.getUserNo());
			throw new ViewDefinitionException(dbExp);
		}
		performanceTimer.endTimer();
		logger.ctinfo("CTVDF00567", widgetId, returnList);

		if (returnList.isEmpty())
		{
			return new HashMap();
		}

		return (HashMap) returnList.get(0);
	}

	/**
	 * This method gets the list of child Widgets that are associated to the provided widget id for the given user /
	 * gcif. If there is no customization at the user level, then the default configuration is fetched.
	 * 
	 * @param widgetId The widget for which the list of child widgets needs to be fetched
	 * @param userNo The user who is trying to access the widget
	 * @param gcif The GCIF of the user
	 * @return The list of child widgets that are associated to the provided widget id for the given user
	 * @exception ViewDefinitionException thrown if any error occurs while querying database
	 */
	public final List getChildWidgetsForUser(final String widgetId, CanvasViewEntlVO entlvo)
			throws ViewDefinitionException
	{
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult;
		List returnList = null;
		logger.ctinfo("CTVDF00568");
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.getChildWidgetsForUser");

		try
		{
			// Fire the next query to get the list of views for the widget for
			// this user. Against each view there is a
			// default view indicator
			// that helps identify whether a particular view is default.
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_LIST_ALL_USER_CHILD_WIDGETS_FOR_WIDGET);
			dbRequest.addFilter(ViewDefinitionConstants.PARAM_WIDGET_ID, widgetId);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_USER_NO, entlvo.getUserNo());
			dbRequest.addFilter(ViewDefinitionConstants.FLD_GCIF, entlvo.getGcif());
			dbRequest.addFilter(ViewDefinitionConstants.ENTITLEMENTS, entlvo.getEntitlements());
			dbResult = dbRequest.execute();
			returnList = dbResult.getReturnedList();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00569", dbExp, widgetId, entlvo.getUserNo());
			throw new ViewDefinitionException(dbExp);
		}
		performanceTimer.endTimer();
		logger.ctinfo("CTVDF00570", widgetId, returnList);

		return returnList;
	}

	/**
	 * This method gets the list of views that are applicable for this widget id for the given user / gcif. If there is
	 * no customization at the user level, then the default configuration is fetched.
	 * 
	 * @param widgetId The widget for which the list of views needs to be fetched
	 * @param userNo The user who is trying to access the widget
	 * @param gcif The GCIF of the user
	 * @return The list of views for the widget for the given user
	 * @exception ViewDefinitionException thrown if any error occurs while querying database
	 */
	public final List getListOfViewsFor(final String widgetId, CanvasViewEntlVO entlvo) throws ViewDefinitionException
	{
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult;
		List returnList = null;
		logger.ctinfo("CTVDF00571");
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.getListOfViewsFor");

		try
		{
			// Fire the next query to get the list of views for the widget for
			// this user. Against each view there is a
			// default view indicator
			// that helps identify whether a particular view is default.
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_LIST_ALL_USER_VIEWS_FOR_WIDGET);
			dbRequest.addFilter(ViewDefinitionConstants.PARAM_WIDGET_ID, widgetId);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_USER_NO, entlvo.getUserNo());
			dbRequest.addFilter(ViewDefinitionConstants.FLD_GCIF, entlvo.getGcif());
			dbRequest.addFilter(ViewDefinitionConstants.ENTITLEMENTS, entlvo.getEntitlements());
			dbResult = dbRequest.execute();
			returnList = dbResult.getReturnedList();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00572", dbExp, widgetId, entlvo.getUserNo());
			throw new ViewDefinitionException(dbExp);
		}

		performanceTimer.endTimer();
		logger.ctinfo("CTVDF00586", widgetId, returnList);

		return returnList;
	}

	/**
	 * Fetch the workspace hierarchy data configured for the given userNo and gcif.
	 * 
	 * @param userNo
	 * @param gcif
	 * @param channelId
	 * @return List
	 * @throws ViewDefinitionException
	 */
	public final List getApplicationStructureNodesForUser(CanvasViewEntlVO entlvo, final int channelId)
			throws ViewDefinitionException
	{
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		List listSystemViews = null;
		logger.ctinfo("CTVDF00573");
		PerformanceTimer performanceTimer = new PerformanceTimer();
		// frank
		List clientDevice = new ArrayList();
		clientDevice.add("A");

		if (channelId == 3)
		{
			clientDevice.add("D"); // code added by anand
		} else if (channelId == 1 ||channelId == 2  )
		{
			clientDevice.add("M");
		} else if (channelId == 4 || channelId == 5)
		{
			clientDevice.add("T");
		}
		// frank
		performanceTimer.startTimer("ViewDefinitionInstruction.getApplicationStructureForUser");
		try
		{
			// Go to db and fetch the system views
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_GET_APP_STRUCTURE_QRY);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_USER_NO, entlvo.getUserNo());
			dbRequest.addFilter(ViewDefinitionConstants.FLD_GCIF, entlvo.getGcif());
			dbRequest.addFilter(ViewDefinitionConstants.ENTITLEMENTS, entlvo.getEntitlements());

			dbRequest.addFilter(ViewDefinitionConstants.DEVICE, clientDevice);
			dbResult = dbRequest.execute();
			listSystemViews = dbResult.getReturnedList();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00574", dbExp);
			throw new ViewDefinitionException(dbExp);
		}

		performanceTimer.endTimer();
		logger.ctdebug("CTVDF00556", listSystemViews);
		logger.ctinfo("CTVDF00557");
		return listSystemViews;
	}

	/**
	 * This method will return a map of all the buttons configured for the widget with key "TBAR_CONFIG",
	 * 
	 * @param widgetId
	 * @return Map of ArrayList value with key "TBAR_CONFIG" - ArrayList of Top Bar button definitions
	 * @throws ViewDefinitionException
	 */

	public Map getWidgetTopBarButtons(String widgetId) throws ViewDefinitionException
	{
		List allButtons = null;
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		logger.ctinfo("CTVDF00558");
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.getWidgetTopBarButtons");
		try
		{
			// Go to db and fetch all the view definitions for the user
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_TBAR_BUTTONS_FOR_WIDGET);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_WIDGET_ID, widgetId);
			dbResult = dbRequest.execute();
			allButtons = dbResult.getReturnedList();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00559", dbExp, widgetId);
			throw new ViewDefinitionException(dbExp);
		}
		Map buttonsMap = null;
		if (allButtons != null && allButtons.size() > 0)
		{
			buttonsMap = new HashMap();

			buttonsMap.put("TBAR_CONFIG", allButtons);
		}

		return buttonsMap;
	}

	/**
	 * This method will return a map of all the buttons configured for the widget with 2 keys "POSITIVE_BUTTONS",
	 * "NEGATIVE_BUTTONS"
	 * 
	 * @param widgetId
	 * @return ArrayList - ArrayList of Bottom Bar button definitions
	 * @throws ViewDefinitionException
	 */
	public final Map getWidgetBottomBarButtons(final String widgetId) throws ViewDefinitionException
	{
		List allButtons = null;
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		logger.ctinfo("CTVDF00558");
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.getWidgetBottomBarButtons");
		try
		{
			// Go to db and fetch all the view definitions for the user
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_BBAR_BUTTONS_FOR_WIDGET);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_WIDGET_ID, widgetId);
			dbResult = dbRequest.execute();
			allButtons = dbResult.getReturnedList();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00559", dbExp, widgetId);
			throw new ViewDefinitionException(dbExp);
		}
		Map buttonsMap = null;
		if (allButtons != null && allButtons.size() > 0)
		{
			buttonsMap = new HashMap();
			Iterator buttonsItertor = allButtons.iterator();
			List pButtons = new ArrayList();
			List nButtons = new ArrayList();
			while (buttonsItertor.hasNext())
			{
				Map button = (HashMap) buttonsItertor.next();
				if (button != null
						&& ViewDefinitionConstants.BBAR_BUTTON_POSITIVE.equals(button
								.get(ViewDefinitionConstants.FLD_BTN_TYPE_IND)))
				{
					button.remove(ViewDefinitionConstants.FLD_BTN_TYPE_IND);// removing
																			// filed
																			// as
																			// it
																			// is
																			// not
																			// needed
																			// for
																			// the
																			// client
																			// VDF
					pButtons.add(button);
				} else if (button != null
						&& ViewDefinitionConstants.BBAR_BUTTON_NEGATIVE.equals(button
								.get(ViewDefinitionConstants.FLD_BTN_TYPE_IND)))
				{
					button.remove(ViewDefinitionConstants.FLD_BTN_TYPE_IND); // removing
																				// filed
																				// as
																				// it
																				// is
																				// not
																				// needed
																				// for
																				// the
																				// client
																				// VDF
					nButtons.add(button);
				}
			}
			buttonsMap.put("POSITIVE_BUTTONS", pButtons);
			buttonsMap.put("NEGATIVE_BUTTONS", nButtons);
		}
		performanceTimer.endTimer();
		logger.ctinfo("CTVDF00575");
		return buttonsMap;
	}

	/**
	 * This method will return a List of SystemMenuDefinition
	 * 
	 * @return List
	 * @throws ViewDefinitionException
	 */

	public final List getSystemMenuDefinition() throws ViewDefinitionException
	{
		List itemList = null;
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		logger.ctinfo("CTVDF00576");
		try
		{
			itemList = new ArrayList();
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey("VIEW_MGR_FRMWK_MNT");
			dbRequest.setOperationExtension("GET_MENU_STRUCTURE_QRY");
			dbResult = dbRequest.execute();
			itemList = dbResult.getReturnedList();

		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00577", dbExp);
			throw new ViewDefinitionException(dbExp);

		}
		return itemList;

	}

	/**
	 * The method fetch the data from CUSTOM_TOOLS_DEFINITION table This method is called by the
	 * SystemCustomToolsCacheBuilder.
	 * 
	 * @return List
	 * @throws ViewDefinitionException
	 */

	public final List getCustomToolsDefinition() throws ViewDefinitionException
	{
		List itemList = null;
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		logger.ctinfo("CTVDF00578");
		try
		{
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
			dbRequest.setOperationExtension(ViewDefinitionConstants.GET_CUSTOM_TOOLS_DEF);
			dbResult = dbRequest.execute();
			itemList = dbResult.getReturnedList();

		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00579", dbExp);
			throw new ViewDefinitionException(dbExp);

		}

		return itemList;

	}

	/**
	 * This method returns the all the widgets which configured to the given product list.
	 * 
	 * @param odUserNo - User number.
	 * @param odGCIF - GCIF code
	 * @param productList - List of product codes
	 * @return list of widgets
	 * @throws ViewDefinitionException will be raised when error/exception occured.
	 */
	public final List getAllWidgets(final String odUserNo, final String odGCIF, final List productList)
			throws ViewDefinitionException
	{
		logger.ctinfo("CTVDF00580");
		logger.ctdebug("CTVDF00581", odUserNo, odGCIF);
		List returnList = null;
		try
		{
			DatabaseRequest dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_APPSTORE);
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_ALL_WIDGETS_QRY);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_OD_USER_NO, odUserNo);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_OD_GCIF, odGCIF);
			dbRequest.addFilter(ViewDefinitionConstants.PRODUCT_LIST, productList);
			DatabaseResult dbResult = dbRequest.execute();
			returnList = dbResult.getReturnedList();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00582", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
		logger.ctinfo("CTVDF00583");
		return returnList;
	}

	/**
	 * This method returns the workspace definition object for the given workspace id from the database.
	 * 
	 * @param odUserNo - User number.
	 * @param odGCIF - GCIF code
	 * @param workspaceId to retrieve the workspace details
	 * @return workspaceDefinition
	 * @throws ViewDefinitionException will be raised when error/exception occured.
	 */
	public final WorkspaceDefinition getWorkspaceDefinition(final String odUserNo, final String odGCIF,
			final String workspaceId) throws ViewDefinitionException
	{
		logger.ctinfo("CTVDF00584");
		logger.ctdebug("CTVDF00585", odUserNo, odGCIF, workspaceId);
		WorkspaceDefinition workspaceDefinition = null;
		try
		{
			DatabaseRequest dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_APPSTORE);
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_WORKSPACE_DEFINITION_QRY);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_OD_USER_NO, odUserNo);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_OD_GCIF, odGCIF);
			dbRequest.addFilter(ViewDefinitionConstants.PARAM_WORKSPACE_ID, workspaceId);
			DatabaseResult dbResult = dbRequest.execute();
			List returnList = dbResult.getReturnedList();
			if (returnList != null && returnList.size() > 0)
			{
				workspaceDefinition = (WorkspaceDefinition) returnList.get(0);
			} else
			{
				logger.ctdebug("CTVDF00587", workspaceId);
			}
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00588", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
		logger.ctinfo("CTVDF00589");
		return workspaceDefinition;
	}

	/**
	 * This method returns the workspace menu definition list for the given workspace id from the database.
	 * 
	 * @param workspaceId to denote the workspace
	 * @return list of workspace menu definitions
	 * @throws ViewDefinitionException will be raised when error/exception occured.
	 */
	public final List getWorkspaceMenuItems(final String workspaceId) throws ViewDefinitionException
	{
		logger.ctinfo("CTVDF00591");
		logger.ctdebug("CTVDF00591", workspaceId);
		List returnList = null;
		try
		{
			DatabaseRequest dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_APPSTORE);
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_WORKSPACE_MENU_DEFINITION_QRY);
			dbRequest.addFilter(ViewDefinitionConstants.PARAM_WORKSPACE_ID, workspaceId);
			DatabaseResult dbResult = dbRequest.execute();
			returnList = dbResult.getReturnedList();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00592", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
		logger.ctinfo("CTVDF00593");
		return returnList;
	}

	/**
	 * This methods returns the layout ids for the given workspace.
	 * 
	 * @param workspaceId to denote the workspace
	 * @return list of layout
	 * @throws ViewDefinitionException will be raised when error/exception occured.
	 */
	public final List getLayoutIdsForWorkspace(final String workspaceId) throws ViewDefinitionException
	{
		logger.ctinfo("CTVDF00600");
		logger.ctdebug("CTVDF00601", workspaceId);
		List returnList = null;
		try
		{
			DatabaseRequest dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_APPSTORE);
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_WORKSPACE_LAYOUT_IDS_QRY);
			dbRequest.addFilter(ViewDefinitionConstants.PARAM_WORKSPACE_ID, workspaceId);
			DatabaseResult dbResult = dbRequest.execute();
			returnList = dbResult.getReturnedList();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00594", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
		logger.ctinfo("CTVDF00595");
		return returnList;
	}

	/**
	 * This methods returns the list of workspaces which contains the given display name.
	 * 
	 * @param workspaceDisplayName to get the workspace list
	 * @return list of workspaces
	 * @throws ViewDefinitionException will be raised when error/exception occured.
	 */
	public final List getWorkspaceByName(final String workspaceDisplayName) throws ViewDefinitionException
	{
		logger.ctinfo("CTVDF00596");
		logger.ctdebug("CTVDF00597", workspaceDisplayName);
		List returnList = null;
		try
		{
			DatabaseRequest dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_APPSTORE);
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_WORKSPACE_DEFINITION_BY_NAME_QRY);
			dbRequest.addFilter(ViewDefinitionConstants.PARAM_WORKSPACE_DISPLAY_NM, workspaceDisplayName);
			DatabaseResult dbResult = dbRequest.execute();
			returnList = dbResult.getReturnedList();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00598", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
		logger.ctinfo("getWorkspaceByName method.");
		return returnList;
	}

	/**
	 * This method stores the Workspace definition. It creates entries in WORKSPACE_DEFINITION, LAYOUT_DEFINITION,
	 * WORKSPACE_MENU_DEFINITION, WORKSPACE_LAYOUT_MAPPING and LAYOUT_WIDGET_MAPPING tables.
	 * 
	 * It loads the default menu items from the DEFAULT_WORKSPACE and loads if the menu ids are in the list
	 * CUSTOM_WORKSPACE_MENU_ITEMS which is configured in orbionedirect.properties.
	 * 
	 * @param workspaceDefinition to save
	 * @throws ViewDefinitionException will be raised when error/exception occured.
	 */
	public final void saveWorkSpaceDefinition(final WorkspaceDefinition workspaceDefinition)
			throws ViewDefinitionException
	{
		logger.ctinfo("CTVDF00602");
		logger.ctdebug("CTVDF00603", workspaceDefinition);
		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		SystemPreferenceDescriptor sysPrefDescriptor = configMgr.getSystemPrefDescriptor();
		try
		{
			/**
			 * Step 1: Inserting the workspace details to the WORKSPACE_DEFINITION table.
			 * */
			insertWorkSpaceDefinition(workspaceDefinition);
			logger.ctdebug("CTVDF00604");
			/**
			 * Step 2: If workspace has been successfully inserted to database, insert the layout and menu definition
			 * details to database. Getting the layout details from the workspace object.
			 * */
			List layoutList = workspaceDefinition.getLayoutDefinitions();

			if (!layoutList.isEmpty())
			{
				List layoutDefnList = new ArrayList();
				List workspaceLayoutMapDefnList = new ArrayList();
				List layoutWidgetMapDefList = new ArrayList();
				/**
				 * Step 3: Building the layoutDefnList, workspaceLayoutMapDefnList and layoutWidgetMapDef list.
				 * */
				updateLayoutDetails(workspaceDefinition.getWorkspaceId(), layoutList, layoutDefnList,
						workspaceLayoutMapDefnList, layoutWidgetMapDefList);
				/**
				 * Step 4: Inserting the layout definition details to the database.
				 * */
				int layoutsInserted = insertLayoutDefinition(layoutDefnList);
				logger.ctdebug("CTVDF00605", layoutsInserted);
				/**
				 * Step 5: If the layout has been successfully inserted to database, insert the workspace-layout and
				 * layout-widget maps to database. Inserting the workspace-layout mapping details to database.
				 * */
				if (!workspaceLayoutMapDefnList.isEmpty())
				{
					int wlMapInserted = insertWorkspaceLayoutMap(workspaceLayoutMapDefnList);
					logger.ctdebug("CTVDF00606", wlMapInserted);
				}
				/**
				 * Step 6: Inserting the layout-widget mapping details to database.
				 * */
				if (!layoutWidgetMapDefList.isEmpty())
				{
					int lwMapInserted = insertLayoutWidgetMap(layoutWidgetMapDefList);
					logger.ctdebug("CTVDF00607", lwMapInserted);
				}
			}
			/**
			 * Step 7: Checking the workspace contains menu details, otherwise fetch the default menu items from the
			 * database.
			 * */
			List workspacesMenus = workspaceDefinition.getWorkspaceMenuDefinitions();
			if (workspacesMenus == null)
			{
				workspacesMenus = getWorkspaceMenuItems(sysPrefDescriptor.getStrDefaultWrkspce()); // CT_DESIGN_CANVAS
			}
			if (workspacesMenus != null)
			{
				List workspaceMenuDefnList = new ArrayList();
				WorkspaceMenuDefinition workspaceMenuDefinition = null;
				/**
				 * Step 8: Getting the default menu items.
				 * */
				String[] defaultMenuItems = sysPrefDescriptor.getStrCustomWrkspceMenuItems().split(","); // CT_DESIGN_CANVAS
				List defaultMenus = Arrays.asList(defaultMenuItems);
				/**
				 * Step 9: Building the workspace menu definition map list.
				 * */
				for (Object obj : workspacesMenus)
				{
					workspaceMenuDefinition = (WorkspaceMenuDefinition) obj;
					/**
					 * Step 10: Update the workspace id in the menu items.
					 * */
					workspaceMenuDefinition.setParentId(workspaceDefinition.getWorkspaceId());
					/**
					 * Step 11: Updating the workspace menu details.
					 * */
					if ("OTHER_SERVICES_DASH".equals(workspaceMenuDefinition.getItemId()))
					{
						logger.ctdebug("CTVDF00608");
						workspaceMenuDefinition.setItemId("OTHER_SERVICES_CUSTOM");
					}
					/**
					 * Step 12: Building the workspace menu definition map and adding to the workspace menu definition
					 * list.
					 * */
					if (defaultMenus.contains(workspaceMenuDefinition.getItemId()))
					{
						workspaceMenuDefnList.add(workspaceMenuDefinition.getWorkspaceMenuDefinitionAsMap());
					}
				}
				workspaceMenuDefinition = getDefaultAppstoreMenus(workspaceDefinition);
				workspaceMenuDefnList.add(workspaceMenuDefinition.getWorkspaceMenuDefinitionAsMap());
				/**
				 * Step 13: Adding the workspace menu definition parent entry.
				 * */
				logger.ctdebug("CTVDF00609");

				workspaceMenuDefinition = getParentWrkSpcMenu(workspaceDefinition);
				workspaceMenuDefnList.add(workspaceMenuDefinition.getWorkspaceMenuDefinitionAsMap());
				/**
				 * Step 14: Inserting the workspace menu definitions for the workspace to the database.
				 * */
				int workspaceMenusInserted = insertWorkspaceMenuDefinition(workspaceMenuDefnList);
				logger.ctdebug("CTVDF00610", workspaceMenusInserted);
			}

		} catch (ViewDefinitionException dbExp)
		{
			logger.cterror("CTVDF00611", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
		logger.ctinfo("CTVDF00612");
	}

	/***
	 * Method to get the default app store menus
	 * 
	 * @param workspaceDefinition
	 * @return
	 */
	private WorkspaceMenuDefinition getDefaultAppstoreMenus(WorkspaceDefinition workspaceDefinition)
	{
		WorkspaceMenuDefinition workspaceMenuDefinition = new WorkspaceMenuDefinition();
		workspaceMenuDefinition.setItemId("OTHER_SERVICES_CUSTOM");
		workspaceMenuDefinition.setParentId(workspaceDefinition.getWorkspaceId());
		workspaceMenuDefinition.setMenuDisplayKey("LBL_OTHER_SERVICES_CUSTOM");
		workspaceMenuDefinition.setBlockPosition("RIGHT");
		workspaceMenuDefinition.setContainerFlag("Y");
		workspaceMenuDefinition.setOrderPosition(1);
		workspaceMenuDefinition.setProduct("CANVAS");
		workspaceMenuDefinition.setSubProduct("CANVAS");
		workspaceMenuDefinition.setFuncCode("VSBLTY");
		workspaceMenuDefinition.setIconInd("Y");
		workspaceMenuDefinition.setLabelInd("Y");
		workspaceMenuDefinition.setContainerId("");
		return workspaceMenuDefinition;
	}

	/**
	 * @param workspaceId to find the layout maximum position
	 * @param layoutList - list of layouts
	 * @param layoutDefnList - An empty ArrayList. The LayoutDefinitions will be added to this list.
	 * @param workspaceLayoutMapDefnList - An empty ArrayList. The WorkspaceLayoutMaps will be added to this list.
	 * @param layoutWidgetMapDefList - An empty ArrayList. The LayoutWidgetMaps will be added to this list.
	 * @throws ViewDefinitionException will be raised if any error/exception occurred.
	 */
	private void updateLayoutDetails(final String workspaceId, final List layoutList, final List layoutDefnList,
			final List workspaceLayoutMapDefnList, final List layoutWidgetMapDefList) throws ViewDefinitionException
	{
		/**
		 * Step 1: Getting the maximum layout position for the workspace from the database. It will be increased by one
		 * while inserting the layout details.
		 * */
		int layoutPosition = getLayoutMaxPositionInWorkspace(workspaceId);
		logger.ctdebug("CTVDF00613", layoutPosition);
		/**
		 * Step 2: Iterating the layout list and insert into database.
		 * */
		for (Iterator layoutIterator = layoutList.iterator(); layoutIterator.hasNext();)
		{
			LayoutDefinition layoutDefinition = (LayoutDefinition) layoutIterator.next();
			/**
			 * Step 3: Incresing the layout position by one and set to the layout definition. Converting the
			 * layoutDefinition object to map and set into the layout definition list to update in database.
			 * */
			layoutDefinition.setLayoutPosition(++layoutPosition);
			layoutDefnList.add(layoutDefinition.getLayoutDefinitionAsMap());
			/**
			 * Step 4: Converting the workspacelayout mapping details as map and set to the workspace-layout map
			 * definition list.
			 * */
			workspaceLayoutMapDefnList.add(layoutDefinition.getWorkspaceLayoutMap());
			/**
			 * Step 5: Iterating the widgets list in the layout and converting as layout-widget map definition list.
			 * */
			List layoutWidgetMapList = layoutDefinition.getWidgets();
			if (layoutWidgetMapList != null)
			{
				for (Iterator wlmIterator = layoutWidgetMapList.iterator(); wlmIterator.hasNext();)
				{
					LayoutWidgetMapping wlMapping = (LayoutWidgetMapping) wlmIterator.next();
					layoutWidgetMapDefList.add(wlMapping.getLayoutWidgetMappingAsMap());
				}
			}
		}
	}

	/**
	 * This method deletes the workspace details from the following tables. WORKSPACE_DEFINITION, LAYOUT_DEFINITION,
	 * WORKSPACE_MENU_DEFINITION, WORKSPACE_LAYOUT_MAPPING and LAYOUT_WIDGET_MAPPING.
	 * 
	 * @param odUserNo - User number
	 * @param odGCIF - GCIF code
	 * @param workspaceId to delete the workspace definition
	 * @return no of workspaces deleted
	 * @throws ViewDefinitionException will be raised when error/exception occured.
	 */
	public final int deleteWorkspace(final String odUserNo, final String odGCIF, final String workspaceId)
			throws ViewDefinitionException
	{
		logger.ctinfo("CTVDF00614");
		logger.ctdebug("CTVDF00615", odUserNo, odGCIF, workspaceId);
		int rowsDeleted = 0;
		/**
		 * Step 1: Getting the layout ids to map with given workspaceId from database.
		 * */
		List layoutsToRemove = getLayoutIdsForWorkspace(workspaceId);
		logger.ctdebug("CTVDF00616", layoutsToRemove);

		if (layoutsToRemove == null)
		{
			logger.ctdebug("CTVDF00617", workspaceId);
		} else
		{
			/**
			 * Step 2: Removing the workspace-layout map details from database.
			 * */
			logger.ctdebug("CTVDF00618");
			deleteLayoutWidgetMap(layoutsToRemove);

			/**
			 * Step 3: Removing the workspace-layout map details from database.
			 * */
			logger.ctdebug("CTVDF00619");
			deleteWorkSpaceLayoutMap(workspaceId);

			/**
			 * Step 4: Removing the layout definition details from database.
			 * */
			logger.ctdebug("CTVDF00620");
			deleteLayoutDefinition(odUserNo, odGCIF, layoutsToRemove);

			/**
			 * Step 5: Removing the workspace menu definition details from database.
			 * */
			logger.ctdebug("CTVDF00621");
			deleteWorkSpaceMenuDefinition(workspaceId);

			/**
			 * Step 6: Removing the workspace definition details from database.
			 * */
			logger.ctdebug("CTVDF00622");
			rowsDeleted = deleteWorkSpaceDefinition(odUserNo, odGCIF, workspaceId);
//			rowsDeleted = deleteUserPref(odUserNo, odGCIF, workspaceId);
			logger.ctdebug("CTVDF00623", rowsDeleted);
		}
		logger.ctinfo("CTVDF00624");
		return rowsDeleted;
	}

	/**
	 * This method delete a record from WORKSPACE_DEFINITION table.
	 * 
	 * @param odUserNo - User number
	 * @param odGCIF - GCIF code
	 * @param workspaceId to delete the workspace definition
	 * @return number of workspaces inserted
	 * @throws ViewDefinitionException will be raised when error/exception occured.
	 */
	private int deleteWorkSpaceDefinition(final String odUserNo, final String odGCIF, final String workspaceId)
			throws ViewDefinitionException
	{
		logger.ctinfo("CTVDF00625");
		logger.ctdebug("CTVDF00626", odUserNo, odGCIF, workspaceId);
		int rowsDeleted = 0;
		try
		{
			DatabaseRequest dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_APPSTORE);
			dbRequest.setOperation(DatabaseConstants.DELETE);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_WORKSPACE_DEFINITION_QRY);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_OD_USER_NO, odUserNo);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_OD_GCIF, odGCIF);
			dbRequest.addFilter(ViewDefinitionConstants.PARAM_WORKSPACE_ID, workspaceId);
			DatabaseResult dbResult = dbRequest.execute();
			rowsDeleted = dbResult.getNoOfRowsAffected();
			logger.ctdebug("CTVDF00651", rowsDeleted);
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00652", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
		logger.ctinfo("CTVDF00653");
		return rowsDeleted;
	}
	private int deleteUserPref(final String odUserNo, final String odGCIF, final String workspaceId)
			throws ViewDefinitionException
	{
		logger.ctinfo("CTVDF00625");
		logger.ctdebug("CTVDF00626", odUserNo, odGCIF, workspaceId);
		int rowsDeleted = 0;
		try
		{
			DatabaseRequest dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_APPSTORE);
			dbRequest.setOperation(DatabaseConstants.DELETE);
			dbRequest.setOperationExtension("USER_PREF_QRY");
			dbRequest.addFilter(ViewDefinitionConstants.FLD_OD_USER_NO, odUserNo);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_OD_GCIF, odGCIF);
			dbRequest.addFilter(ViewDefinitionConstants.PARAM_WORKSPACE_ID, workspaceId);
			DatabaseResult dbResult = dbRequest.execute();
			rowsDeleted = dbResult.getNoOfRowsAffected();
			logger.ctdebug("CTVDF00651", rowsDeleted);
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00652", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
		logger.ctinfo("CTVDF00653");
		return rowsDeleted;
	}

	/**
	 * This method delete a record from WORKSPACE_MENU_DEFINITION table.
	 * 
	 * @param workspaceId to delete the workspace definition menu items
	 * @return number of rows deleted
	 * @throws ViewDefinitionException will be raised when error/exception occured.
	 */
	private int deleteWorkSpaceMenuDefinition(final String workspaceId) throws ViewDefinitionException
	{
		logger.ctinfo("CTVDF00627");
		logger.ctdebug("CTVDF00628", workspaceId);
		int rowsDeleted = 0;
		try
		{
			DatabaseRequest dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_APPSTORE);
			dbRequest.setOperation(DatabaseConstants.DELETE);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_WORKSPACE_MENU_DEFINITION_QRY);
			dbRequest.addFilter(ViewDefinitionConstants.PARAM_WORKSPACE_ID, workspaceId);
			DatabaseResult dbResult = dbRequest.execute();
			rowsDeleted = dbResult.getNoOfRowsAffected();
			logger.ctdebug("CTVDF00629", rowsDeleted);
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00630", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
		logger.ctinfo("CTVDF00631");
		return rowsDeleted;
	}

	/**
	 * This method delete a record from WORKSPACE_MENU_DEFINITION table.
	 * 
	 * @param workspaceId to delete the workspace-layout map entries
	 * @return number of rows inserted
	 * @throws ViewDefinitionException will be raised when error/exception occured.
	 */
	private int deleteWorkSpaceLayoutMap(final String workspaceId) throws ViewDefinitionException
	{
		logger.ctinfo("CTVDF00632");
		logger.ctdebug("CTVDF00633", workspaceId);
		int rowsDeleted = 0;
		try
		{
			DatabaseRequest dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_APPSTORE);
			dbRequest.setOperation(DatabaseConstants.DELETE);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_WORKSPACE_LAYOUT_MAP_QRY);
			dbRequest.addFilter(ViewDefinitionConstants.PARAM_WORKSPACE_ID, workspaceId);
			DatabaseResult dbResult = dbRequest.execute();
			rowsDeleted = dbResult.getNoOfRowsAffected();
			logger.ctdebug("CTVDF00634", rowsDeleted);
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00635", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
		logger.ctinfo("CTVDF00636");
		return rowsDeleted;
	}

	/**
	 * This method delete a record from LAYOUT_DEFINITION table.
	 * 
	 * @param odUserNo - User number
	 * @param odGCIF - GCIF code
	 * @param layoutIds to delete the layout definitions
	 * @return number of rows deleted
	 * @throws ViewDefinitionException will be raised when error/exception occured.
	 */
	private int deleteLayoutDefinition(final String odUserNo, final String odGCIF, final List layoutIds)
			throws ViewDefinitionException
	{
		logger.ctinfo("CTVDF00637");
		logger.ctdebug("CTVDF00638", odUserNo, odGCIF, layoutIds);
		int rowsDeleted = 0;
		try
		{
			DatabaseRequest dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_APPSTORE);
			dbRequest.setOperation(DatabaseConstants.DELETE);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_LAYOUT_DEFINITION_QRY);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_OD_USER_NO, odUserNo);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_OD_GCIF, odGCIF);
			dbRequest.addFilter(ViewDefinitionConstants.PARAM_LAYOUTS, layoutIds);
			DatabaseResult dbResult = dbRequest.execute();
			rowsDeleted = dbResult.getNoOfRowsAffected();
			logger.ctdebug("CTVDF00639", rowsDeleted);
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00640", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
		logger.ctinfo("CTVDF00641");
		return rowsDeleted;
	}

	/**
	 * This method delete a record from LAYOUT_WIDGET_MAP table.
	 * 
	 * @param layoutIds to delete the layout-widget map entries
	 * @return number of rows deleted
	 * @throws ViewDefinitionException will be raised when error/exception occured.
	 */
	private int deleteLayoutWidgetMap(final List layoutIds) throws ViewDefinitionException
	{
		logger.ctinfo("CTVDF00642");
		logger.ctdebug("CTVDF00643", layoutIds);
		int rowsDeleted = 0;
		try
		{
			DatabaseRequest dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_APPSTORE);
			dbRequest.setOperation(DatabaseConstants.DELETE);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_LAYOUT_WIDGET_MAP_QRY);
			dbRequest.addFilter(ViewDefinitionConstants.PARAM_LAYOUTS, layoutIds);
			DatabaseResult dbResult = dbRequest.execute();
			rowsDeleted = dbResult.getNoOfRowsAffected();
			logger.ctdebug("CTVDF00644", rowsDeleted);
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00645", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
		logger.ctinfo("CTVDF00646");
		return rowsDeleted;
	}

	/**
	 * This method inserts a record into WORKSPACE_DEFINITION table.
	 * 
	 * @param workspaceDefinition to save
	 * @throws ViewDefinitionException will be raised when error/exception occured.
	 */
	private void insertWorkSpaceDefinition(final WorkspaceDefinition workspaceDefinition)
			throws ViewDefinitionException
	{
		logger.ctinfo("CTVDF00647");
		logger.ctdebug("CTVDF00648", workspaceDefinition);
		int rowsInserted = 0;
		try
		{
			Map parametersMap = workspaceDefinition.getWorkspaceDefinitionAsMap();
			DatabaseRequest dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_APPSTORE);
			dbRequest.setOperation(DatabaseConstants.INSERT);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_WORKSPACE_DEFINITION_QRY);
			dbRequest.setData(parametersMap);
			DatabaseResult dbResult = dbRequest.execute();
			rowsInserted = dbResult.getNoOfRowsAffected();
			logger.ctdebug("CTVDF00649", workspaceDefinition);
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00650", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
		logger.ctinfo("CTVDF00654");
	}

	/**
	 * This method inserts records into LAYOUT_DEFINITION table.
	 * 
	 * @param layoutDefnList - List of Layout definitions
	 * @return number of rows inserted
	 * @throws ViewDefinitionException will be raised when error/exception occured.
	 */
	private int insertLayoutDefinition(final List layoutDefnList) throws ViewDefinitionException
	{
		logger.ctinfo("CTVDF00655");
		int rowsInserted = 0;
		try
		{
			DatabaseRequest dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_APPSTORE);
			dbRequest.setOperation(DatabaseConstants.BATCH_INSERT);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_LAYOUT_DEFINITION_QRY);
			dbRequest.setBatchData(layoutDefnList);
			DatabaseResult dbResult = dbRequest.execute();
			rowsInserted = dbResult.getNoOfRowsAffected();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00656", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
		logger.ctinfo("CTVDF00657");
		return rowsInserted;
	}

	/**
	 * This method inserts records into WORKSPACE_LAYOUT_MAP table.
	 * 
	 * @param workspaceLayoutMapDefnList - List of WorkspaceLayoutMaps
	 * @return number of rows inserted
	 * @throws ViewDefinitionException will be raised when error/exception occured.
	 */
	private int insertWorkspaceLayoutMap(final List workspaceLayoutMapDefnList) throws ViewDefinitionException
	{
		logger.ctinfo("CTVDF00658");
		int rowsInserted = 0;
		try
		{
			DatabaseRequest dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_APPSTORE);
			dbRequest.setOperation(DatabaseConstants.BATCH_INSERT);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_WORKSPACE_LAYOUT_MAP_QRY);
			dbRequest.setBatchData(workspaceLayoutMapDefnList);
			DatabaseResult dbResult = dbRequest.execute();
			rowsInserted = dbResult.getNoOfRowsAffected();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00659", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
		logger.ctinfo("CTVDF00660");
		return rowsInserted;
	}

	/**
	 * This method inserts records into LAYOUT_WIDGET_MAP table.
	 * 
	 * @param layoutWidgetMapDefnList - List of LayoutWidgetMaps
	 * @return number of rows inserted
	 * @throws ViewDefinitionException will be raised when error/exception occured.
	 */
	private int insertLayoutWidgetMap(final List layoutWidgetMapDefnList) throws ViewDefinitionException
	{
		logger.ctinfo("CTVDF00661");
		int rowsInserted = 0;
		try
		{
			DatabaseRequest dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_APPSTORE);
			dbRequest.setOperation(DatabaseConstants.BATCH_INSERT);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_LAYOUT_WIDGET_MAP_QRY);
			dbRequest.setBatchData(layoutWidgetMapDefnList);
			DatabaseResult dbResult = dbRequest.execute();
			rowsInserted = dbResult.getNoOfRowsAffected();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00662", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
		logger.ctinfo("CTVDF00663");
		return rowsInserted;
	}

	/**
	 * This method inserts records into WORKSPACE_MENU_DEFINITION table.
	 * 
	 * @param workspaceMenuDefnList - List workspace menu definitions
	 * @return number of rows inserted
	 * @throws ViewDefinitionException will be raised when error/exception occured.
	 */
	private int insertWorkspaceMenuDefinition(final List workspaceMenuDefnList) throws ViewDefinitionException
	{
		logger.ctinfo("CTVDF00664");
		int rowsInserted = 0;
		try
		{
			DatabaseRequest dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_APPSTORE);
			dbRequest.setOperation(DatabaseConstants.BATCH_INSERT);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_WORKSPACE_MENU_DEFINITION_QRY);
			dbRequest.setBatchData(workspaceMenuDefnList);
			DatabaseResult dbResult = dbRequest.execute();
			rowsInserted = dbResult.getNoOfRowsAffected();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00665", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
		logger.ctinfo("CTVDF00667");
		return rowsInserted;
	}

	/**
	 * This method returns the max value from WORKSPACE_DEFINITION table.
	 * 
	 * @return max position
	 * @throws ViewDefinitionException will be raised when error/exception occured.
	 */
	public final int getWorkspaceMaxPosition() throws ViewDefinitionException
	{
		logger.ctinfo("CTVDF00667");
		int maxPosition = 0;
		try
		{
			DatabaseRequest dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_APPSTORE);
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_WORKSPACE_MAX_POSITION_QRY);
			DatabaseResult dbResult = dbRequest.execute();
			List resultList = dbResult.getReturnedList();
			if (resultList != null && !resultList.isEmpty())
			{
				Map positionMap = (HashMap) resultList.get(0);
				maxPosition = (Integer) positionMap.get(ViewDefinitionConstants.PARAM_MAX_POSITION);
			}
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00668", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
		logger.ctinfo("CTVDF00669");
		return maxPosition;
	}

	/**
	 * This method return the max position for the given workspace from WORKSPACE_LAYOUT_MAP table.
	 * 
	 * @param workspaceId - WorkspaceId
	 * @return max position for the workspace
	 * @throws ViewDefinitionException will be raised when error/exception occured.
	 */
	public final int getLayoutMaxPositionInWorkspace(final String workspaceId) throws ViewDefinitionException
	{
		logger.ctinfo("CTVDF00670");
		int maxPosition = 1;
		try
		{
			Map parametersMap = new HashMap();
			parametersMap.put("WORKSPACE_ID", workspaceId);
			DatabaseRequest dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_APPSTORE);
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_LAYOUT_MAX_POSITION_IN_WORKSPACE_QRY);
			dbRequest.setData(parametersMap);
			DatabaseResult dbResult = dbRequest.execute();
			List resultList = dbResult.getReturnedList();
			if (resultList != null && !resultList.isEmpty())
			{
				Map positionMap = (HashMap) resultList.get(0);
				maxPosition = (Integer) positionMap.get(ViewDefinitionConstants.PARAM_MAX_POSITION);
			}
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00671", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
		logger.ctinfo("CTVDF00672");
		return maxPosition;
	}

	/**
	 * This method is used to create a parent workspace menu definition for the given workspace.
	 * 
	 * @param workspaceDefinition - workspaceDefinition
	 * @return Parent WorkspaceMenuDefinition
	 */
	private WorkspaceMenuDefinition getParentWrkSpcMenu(final WorkspaceDefinition workspaceDefinition)
	{
		WorkspaceMenuDefinition workspaceMenuDefinition = new WorkspaceMenuDefinition();
		workspaceMenuDefinition.setBlockPosition(ViewDefinitionConstants.EMPTY_STR);
		workspaceMenuDefinition.setContainerFlag(ViewDefinitionConstants.VAL_BOOL_YES);
		workspaceMenuDefinition.setFuncCode(ViewDefinitionConstants.EMPTY_STR);
		workspaceMenuDefinition.setIconInd(ViewDefinitionConstants.EMPTY_STR);
		workspaceMenuDefinition.setItemId(workspaceDefinition.getWorkspaceId());
		workspaceMenuDefinition.setLabelInd(ViewDefinitionConstants.EMPTY_STR);
		workspaceMenuDefinition.setMenuDisplayKey(workspaceDefinition.getWorkspaceId());
		workspaceMenuDefinition.setOrderPosition(0);
		workspaceMenuDefinition.setParentId(ViewDefinitionConstants.EMPTY_STR);
		workspaceMenuDefinition.setProduct(ViewDefinitionConstants.EMPTY_STR);
		workspaceMenuDefinition.setSubProduct(ViewDefinitionConstants.EMPTY_STR);
		workspaceMenuDefinition.setContainerId(ViewDefinitionConstants.EMPTY_STR);
		return workspaceMenuDefinition;

	}

	/**
	 * This method is used to fetch the viewId for given widgetId.
	 * 
	 * @param widgetId String
	 * @return HashMap
	 */
	public final String getViewForWidget(String widgetId) throws ViewDefinitionException
	{
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;

		List viewList = null;
		logger.ctinfo("CTVDF00673");
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.getViewForWidget");
		try
		{
			// Go to db and fetch the system views
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_GETVIEW_FOR_WIDGETINFO);
			dbRequest.addFilter(ViewDefinitionConstants.PARAM_WIDGET_ID, widgetId);
			dbResult = dbRequest.execute();
			viewList = dbResult.getReturnedList();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00674", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
		HashMap viewdefMap = (HashMap) viewList.get(0);
		String viewId = (String) viewdefMap.get(ViewDefinitionConstants.VIEW_ID);

		performanceTimer.endTimer();

		logger.ctdebug("CTVDF00675", viewList);
		logger.ctinfo("CTVDF00676");
		return viewId;
	}

	/**
	 * method to get app source data
	 * 
	 * @param sUserNo
	 * @param sGcifID
	 * @return
	 * @throws ViewDefinitionException
	 */
	public List getAppSourceData(String sUserNo, String sGcifID) throws ViewDefinitionException
	{
		logger.ctinfo("CTVDF00677");
		List data = null;
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.getAppSourceData");
		try
		{
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
			dbRequest.setOperationExtension(ViewDefinitionConstants.GET_APP_CONTAINER_METADATA);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_USER_NO, sUserNo);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_GCIF, sGcifID);
			dbResult = dbRequest.execute();
			data = dbResult.getReturnedList();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00678", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
		return data;
	}

	/**
	 * method to update app definition
	 * 
	 * @param appDataList
	 * @throws ViewDefinitionException
	 */
	public void updateAppDefinitionForAdd(List appDataList) throws ViewDefinitionException
	{
		logger.ctinfo("CTVDF00679");
		List data = null;
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.updateAppDefinitionForAdd");
		try
		{
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.BATCH_INSERT);
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
			dbRequest.setOperationExtension(ViewDefinitionConstants.APP_DEFINTION_FOR_ADD);
			dbRequest.setBatchData(appDataList);
			dbResult = dbRequest.execute();
			data = dbResult.getReturnedList();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00680", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
	}

	/**
	 * This method is used to fetch the values that helps in providing additional features for the chart for given
	 * viewId.
	 * 
	 * @param viewId String
	 * @return HashMap
	 */
	public final List getChartAddlConfig(String viewId) throws ViewDefinitionException
	{
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		List chartAddlConfigList = null;
		logger.ctinfo("CTVDF00681");
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.getChartAddlConfig");
		try
		{
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_GET_CHART_ADDL_CONFIG);
			dbRequest.addFilter(ViewDefinitionConstants.VIEW_ID, viewId);
			dbResult = dbRequest.execute();
			chartAddlConfigList = dbResult.getReturnedList();

		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00682", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
		performanceTimer.endTimer();

		logger.ctinfo("CTVDF00683");
		return chartAddlConfigList;
	}

	/**
	 * Method update app definition while deleting
	 * 
	 * @param appId
	 * @param userNo
	 * @param gcif
	 * @param appContanerId
	 * @throws ViewDefinitionException
	 */
	public void updateAppDefinitionForDelete(String appId, String userNo, String gcif, String appContanerId)
			throws ViewDefinitionException
	{
		logger.ctinfo("CTVDF00684");
		List data = null;
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.updateAppDefinitionForAdd");
		try
		{
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.DELETE);
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
			dbRequest.setOperationExtension(ViewDefinitionConstants.APP_DEFINTION_FOR_DELETE);
			dbRequest.addFilter("OD_USER_NO", userNo);
			dbRequest.addFilter("OD_GCIF", gcif);
			dbRequest.addFilter("APP_ID", appId);
			dbRequest.addFilter("APP_CONTAINER_ID", appContanerId);
			dbResult = dbRequest.execute();

		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00685", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
	}

	/**
	 * method to get all apps
	 * 
	 * @param deviceType
	 * @return
	 * @throws ViewDefinitionException
	 */
	public List getAllApps(String deviceType) throws ViewDefinitionException
	{
		logger.ctinfo("CTVDF00686");
		List data = null;
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.getAppSourceData");
		try
		{
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
			dbRequest.setOperationExtension(ViewDefinitionConstants.GET_ALL_APPS);
			dbRequest.addFilter(ViewDefinitionConstants.DEVICE_CHANNEL, deviceType);
			dbResult = dbRequest.execute();
			data = dbResult.getReturnedList();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00687", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
		return data;
	}

	/**
	 * Method get the tools mapping
	 * 
	 * @param deviceType
	 * @return
	 * @throws ViewDefinitionException
	 */
	public List<Map> getToolsMapping(String deviceType) throws ViewDefinitionException
	{
		List<Map> appToolsList = null;
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		logger.ctinfo("CTVDF00688");
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.getToolsMapping");
		try
		{
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
			dbRequest.setOperationExtension(ViewDefinitionConstants.DB_EXT_KEY_GET_APP_TOOLS_MAP);
			dbRequest.addFilter(ViewDefinitionConstants.DEVICE_CHANNEL, deviceType);
			dbResult = dbRequest.execute();
			appToolsList = dbResult.getReturnedList();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00689", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
		logger.ctinfo("CTVDF00690");
		return appToolsList;
	}

	/**
	 * method to get the widget metadata
	 * 
	 * @param widgetId
	 * @return
	 * @throws ViewDefinitionException
	 */
	public List getWidgetMetadata(String widgetId) throws ViewDefinitionException
	{
		logger.ctinfo("CTVDF00803");
		List metaData = null;
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.getAppSourceData");
		try
		{
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
			dbRequest.setOperationExtension(ViewDefinitionConstants.GET_WIDGET_METADATA);
			dbRequest.addFilter(ViewDefinitionConstants.PARAM_WIDGET_ID, widgetId);
			dbResult = dbRequest.execute();
			metaData = dbResult.getReturnedList();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00804", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
		logger.ctinfo("CTVDF00805");
		return metaData;
	}

	/**
	 * method to get the DYC metadata for Audit
	 * 
	 * @param workspaceId
	 * @return
	 * @throws ViewDefinitionException
	 */
	public List getDYCCanvasMetadata(String workspaceId) throws ViewDefinitionException
	{
		List metaData = null;
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ViewDefinitionInstruction.getDYCCanvasMetadata");
		try
		{
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
			dbRequest.setOperationExtension(ViewDefinitionConstants.GET_DYC_METADATA);
			dbRequest.addFilter(ViewDefinitionConstants.PARAM_WORKSPACE_ID, workspaceId);
			dbResult = dbRequest.execute();
			metaData = dbResult.getReturnedList();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00817", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
		return metaData;
	}
	
	/**
	 * method to get the DYC metadata for Audit
	 * 
	 * @param workspaceId
	 * @return
	 * @throws ViewDefinitionException
	 */
	public HashMap getAppinfo(String appId) throws ViewDefinitionException
	{
		HashMap AppnameMap=null;
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		try
		{
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setDataAccessMapKey(ViewDefinitionConstants.DB_DAM_KEY_VIEW_MANAGER);
			dbRequest.setOperationExtension("GET_APP_NAMEFORDYC");
			dbRequest.addFilter("WIDGET_ID", appId);
			dbResult = dbRequest.execute();
			AppnameMap = ((HashMap)(dbResult.getReturnedList().get(0)));
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTVDF00818", dbExp);
			throw new ViewDefinitionException(dbExp);
		}
		return AppnameMap;
	}
	// An instance of Logger
	private Logger logger = Logger.getLogger(ViewDefinitionInstruction.class);

}
