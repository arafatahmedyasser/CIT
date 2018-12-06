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

package com.intellectdesign.canvas.viewdefinition.handler;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;
import java.util.UUID;
import java.util.Vector;

import javax.transaction.HeuristicMixedException;
import javax.transaction.HeuristicRollbackException;
import javax.transaction.NotSupportedException;
import javax.transaction.RollbackException;
import javax.transaction.SystemException;
import javax.transaction.UserTransaction;

import com.intellectdesign.canvas.audit.handler.AuditConstants;
import com.intellectdesign.canvas.cache.CBXCacheException;
import com.intellectdesign.canvas.classicdb.DataManager;
import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.common.ReplyObject;
import com.intellectdesign.canvas.common.UserValue;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.SystemPreferenceDescriptor;
import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.constants.common.JSPIOConstants;
import com.intellectdesign.canvas.constants.util.TIConstants;
import com.intellectdesign.canvas.constants.util.TRConstants;
import com.intellectdesign.canvas.database.PaginationModel;
import com.intellectdesign.canvas.entitlement.CanvasViewEntlVO;
import com.intellectdesign.canvas.entitlement.EntitlementException;
import com.intellectdesign.canvas.entitlement.EntitlementsHelper;
import com.intellectdesign.canvas.event.Event;
import com.intellectdesign.canvas.event.EventDispatcher;
import com.intellectdesign.canvas.event.EventHandlerFrameworkConstants;
import com.intellectdesign.canvas.event.handler.HandlerException;
import com.intellectdesign.canvas.exceptions.common.OnlineException;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.handler.SimpleRequestHandler;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.logging.PerformanceTimer;
import com.intellectdesign.canvas.pref.date.DateFormatterManager;
import com.intellectdesign.canvas.properties.MessageManager;
import com.intellectdesign.canvas.viewdefinition.AppStoreUtil;
import com.intellectdesign.canvas.viewdefinition.ColumnDefinition;
import com.intellectdesign.canvas.viewdefinition.ColumnFilter;
import com.intellectdesign.canvas.viewdefinition.EhCacheDataUtil;
import com.intellectdesign.canvas.viewdefinition.LayoutDefinition;
import com.intellectdesign.canvas.viewdefinition.LayoutWidgetMapping;
import com.intellectdesign.canvas.viewdefinition.SortDefinition;
import com.intellectdesign.canvas.viewdefinition.VDFReplyObject;
import com.intellectdesign.canvas.viewdefinition.ViewDefinition;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionConstants;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionException;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionInstruction;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionPreferences;
import com.intellectdesign.canvas.viewdefinition.ViewManager;
import com.intellectdesign.canvas.viewdefinition.WorkspaceDefinition;

/**
 * This is the request handler for all View Definition framework related requests from the browser. This handler
 * primarily handles the following actions - INIT_ACTION - This action is called for loading the data for any view that
 * is currently loaded INIT_HEADER_ACTION - This action is called for loading the header (list of views, default view,
 * etc.)
 * 
 * @version 1.0
 */
public class ViewDefinitionRequestHandler extends SimpleRequestHandler
{
	/**
	 * The default constructor for this handler. Nothing to be done here.
	 */
	public ViewDefinitionRequestHandler()
	{
		LOGGER.ctdebug("CTVDF00019");
	}

	private static int VER_NO_POS = 16;
	private static int TXN_STATUS_POS = 15;
	private static String HASH_MAP_POSITION = "26";

	/**
	 * This method is called from the framework when it encounters any unknown framework action.
	 * 
	 * @param obj
	 * @exception online exception
	 * @see com.orbidirect.aps.handler.ODRequestHandler#onlineProcess(java.lang.Object)
	 */
	@Override
	public ReplyObject processRequest(Vector inputVector) throws ProcessingErrorException
	{
		PerformanceTimer perfTimer = new PerformanceTimer();
		ReplyObject reply = null;
		// Get the action from the Vector and check whether it is one of the
		// supported custom actions.
		String action = (String) inputVector.get(TIConstants.INPUT_ACTION_INDEX_IN_VECTOR);
		try
		{
			if (ViewDefinitionConstants.INIT_ACTION.equals(action))
			{
				perfTimer.startTimer("ViewDefinitionRequestHandler.fetchViewData");
				reply = fetchViewData(inputVector);
			} else if (ViewDefinitionConstants.ACTION_INIT_MULTI_HEADER_ACTION.equals(action))
			{
				perfTimer.startTimer("ViewDefinitionRequestHandler.processInitializeHeaderRequest");
				reply = processInitializeMultiHeaderRequest(inputVector);
			} else if (ViewDefinitionConstants.ACTION_INIT_HEADER_ACTION.equals(action))
			{
				perfTimer.startTimer("ViewDefinitionRequestHandler.processInitializeHeaderRequest");
				reply = processInitializeHeaderRequest(inputVector);
			} else if (ViewDefinitionConstants.ACTION_INIT_VIEW.equals(action))
			{
				perfTimer.startTimer("ViewDefinitionRequestHandler.processInitializeViewRequest");
				reply = processInitializeViewRequest(inputVector);
			} else if (ViewDefinitionConstants.ACTION_PREF_SAVE_NEW.equals(action))
			{
				perfTimer.startTimer("ViewDefinitionRequestHandler.processWidgetPrefSaveNewRequest");
				reply = processWidgetPrefSaveNewRequest(inputVector);
			} else if (ViewDefinitionConstants.ACTION_PREF_SAVE.equals(action))
			{
				perfTimer.startTimer("ViewDefinitionRequestHandler.processWidgetPrefSaveNewRequest");
				reply = processWidgetPrefSaveRequest(inputVector);
			} else if (ViewDefinitionConstants.ACTION_PREF_DELETE.equals(action))
			{
				perfTimer.startTimer("ViewDefinitionRequestHandler.processWidgetPrefDeleteRequest");
				reply = processWidgetPrefDeleteRequest(inputVector);
			} else if (ViewDefinitionConstants.ACTION_EXPORT.equals(action)
					|| ViewDefinitionConstants.ACTION_PRINT.equals(action))
			{
				reply = fetchViewData(inputVector);
			} else if (ViewDefinitionConstants.ACTION_APPSTORE_INIT_ACTION.equals(action))
			{
				perfTimer.startTimer("ViewDefinitionRequestHandler.processAppStoreInitActionRequest");
				reply = processAppStoreInitActionRequest(inputVector);
			} else if (ViewDefinitionConstants.ACTION_APPSTORE_SAVE.equals(action))
			{
				perfTimer.startTimer("ViewDefinitionRequestHandler.processAppStoreSaveActionRequest");
				reply = processAppStoreSaveActionRequest(inputVector);
			} else if (ViewDefinitionConstants.ACTION_APPSTORE_DELETE.equals(action))
			{
				perfTimer.startTimer("ViewDefinitionRequestHandler.processAppStoreDeleteActionRequest");
				reply = processAppStoreDeleteActionRequest(inputVector);
			} else if (ViewDefinitionConstants.GET_WIDGET_METADATA.equals(action))
			{
				perfTimer.startTimer("ViewDefinitionRequestHandler.processWidgetMetadataRequest");
				reply = processWidgetMetadata(inputVector);
			} else if (ViewDefinitionConstants.ACTION_CLEAR_EHCACHE_DATA.equals(action))
			{
				perfTimer.startTimer("ViewDefinitionRequestHandler.processWidgetMetadataRequest");
				reply = processWidgetDataCacheResetRequest(inputVector);
			}
		} catch (ViewDefinitionException e)
		{
			throw new ProcessingErrorException(e);
		} finally
		{
			perfTimer.endTimer();
		}
		return reply;
	}

	/**
	 * this is ref to processWidgetMetadata
	 * 
	 * @param inputVector
	 * @return
	 * @throws ViewDefinitionException
	 */
	private ReplyObject processWidgetMetadata(final Vector inputVector) throws ViewDefinitionException
	{

		ExtReplyObject reply = new ExtReplyObject();
		ViewDefinitionInstruction viewDefinitionInstruction = new ViewDefinitionInstruction();
		Map inputParams = getAugmentedCachedHashMap(inputVector);
		String widgetId = (String) inputParams.get(ViewDefinitionConstants.PARAM_WIDGET_ID);
		List md = viewDefinitionInstruction.getWidgetMetadata(widgetId);
		reply.headerMap = new HashMap();
		if (md.size() > 0)
		{
			reply.headerMap.put("JSON_MAP", md.get(0));
		}

		return reply;
	}

	/**
	 * Helper method intended to communicate with ViewManager for requested View Data
	 * 
	 * @param inputVector - Augmented/submitted Input Values from client
	 * @return ReplyObject - ReplyObject headerMap will contain view data
	 */
	private ReplyObject fetchViewData(Vector inputVector)
	{
		PerformanceTimer perfTimer = new PerformanceTimer();
		ExtReplyObject reply = null;
		LOGGER.ctdebug("CTVDF00020");
		Event event;
		// First read the necessary set of attributes from the input Vector.
		String gcifNo = (String) inputVector.get(TIConstants.GCIF_INDEX_IN_VECTOR);
		String userNo = (String) inputVector.get(TIConstants.USER_NO_INDEX_IN_VECTOR);
		HashMap paramsMap = (HashMap) getAugmentedCachedHashMap(inputVector);
		String widgetId = (String) paramsMap.get(ViewDefinitionConstants.PARAM_WIDGET_ID);
		String viewId = (String) paramsMap.get(ViewDefinitionConstants.FLD_VIEW_ID);
		String action = (String) inputVector.get(TIConstants.INPUT_ACTION_INDEX_IN_VECTOR);
		PaginationModel pmModel = null;
		ViewManager viewmgr = new ViewManager();
		boolean dataFetchSuccess = false;

		// For Editable Lookup- using widgetId and get the view id for getting response data
		String lookupFlag = (String) paramsMap.get(ViewDefinitionConstants.LOOKUP_FLAG);

		// Session id is passed as parameter as it is used by cacheframework for data caching.
		paramsMap.put(ViewDefinitionConstants.INPUT_SESSION_ID, inputVector.get(TIConstants.SESSIONID_INDEX_IN_VECTOR));

		Map browser_params = (HashMap) inputVector.get(TIConstants.VALUE_VECTOR_21);
		paramsMap.put(ViewDefinitionConstants.INPUT_LOGIN_ID, browser_params.get(TIConstants.LOGIN_ID));

		if (lookupFlag != null)
		{
			try
			{
				viewId = getViewId(widgetId);
			} catch (ViewDefinitionException vde)
			{
				LOGGER.cterror("CTVDF00021", vde);
				// Since the method signature does not allow us to throw an
				// exception, This is being eaten and instead null
				// is being returned.
				reply = (ExtReplyObject) getErrorReply(inputVector);
			}
		}

		// If Widget Id is not provided, then thrown an error as this is needed
		// for this action processing.
		if ((widgetId == null) || (widgetId.length() == 0))
		{
			LOGGER.cterror("CTVDF00022", ViewDefinitionConstants.PARAM_WIDGET_ID);
			return getErrorReply(inputVector);
		}

		// If View Id is not provided, then thrown an error as this is needed
		// for this action processing.
		if ((viewId == null) || (viewId.length() == 0))
		{
			LOGGER.cterror("CTVDF00023", ViewDefinitionConstants.FLD_VIEW_ID);
			return getErrorReply(inputVector);
		}

		UserValue userValue = new UserValue();
		userValue.setPrimaryGcif(gcifNo);
		userValue.setUserNo(userNo);
		perfTimer.startTimer("ViewDefinitionRequestHandler.fetchViewData");
		try
		{
			LOGGER.ctdebug("CTVDF00024", paramsMap);
			if (!(ViewDefinitionConstants.ACTION_EXPORT.equals(action) || ViewDefinitionConstants.ACTION_PRINT
					.equals(action)))
			{
				pmModel = new PaginationModel(paramsMap);

			}
			LOGGER.ctdebug("CTVDF00025", pmModel);
			VDFReplyObject vdfReplyObject = viewmgr.getViewData(widgetId, viewId, paramsMap, userValue, pmModel);

			if (vdfReplyObject == null)
				reply = (ExtReplyObject) getErrorReply(inputVector);
			else
			{
				// Get the View data from the VDF Reply and set it into our
				// reply.
				reply = new ExtReplyObject();
				reply.headerMap = new HashMap();
				reply.headerMap.put(ViewDefinitionConstants.HEADER_KEY_VIEW_DATA, vdfReplyObject.getViewData());
				// Get the additional data present in the vdf reply and set it
				// into a separate key.
				reply.headerMap.put(ViewDefinitionConstants.HEADER_KEY_ADDITIONAL_DATA,
						vdfReplyObject.getAdditionalData());
				if (!(ViewDefinitionConstants.ACTION_EXPORT.equals(action) || ViewDefinitionConstants.ACTION_PRINT
						.equals(action)))
				{
					// Put the total count of records from the pagination model.
					Map addtnData = vdfReplyObject.getAdditionalData();
					int totalCount = -1;
					if (addtnData.containsKey(ViewDefinitionConstants.KEY_TOTAL_NUM_RECORDS))
					{
						totalCount = (Integer) addtnData.get(ViewDefinitionConstants.KEY_TOTAL_NUM_RECORDS);
					}
					reply.headerMap.put(ViewDefinitionConstants.HEADER_KEY_TOTAL_COUNT,
							pmModel.calculateTotalCount(vdfReplyObject.getViewData(), totalCount));
				}
				if (ViewDefinitionConstants.ACTION_EXPORT.equals(action))
				{
					reply.headerMap.put(ViewDefinitionConstants.HEADER_KEY_VIEW_METADATA, vdfReplyObject
							.getViewMetaData().clone());
				}
				// Populate the last updated date / time into the reply object.
				populateLastUpdatedDateTimeInto(reply);
				dataFetchSuccess = true;
			}

			try
			{
				// For all actions other than export, audit the data fetch sequence appropriately
				if (!ViewDefinitionConstants.ACTION_EXPORT.equals(action))
				{
					String eventAction = (dataFetchSuccess) ? "SUCCESS" : "FAILURE";
					String eventFunction = "VIEW";
					if (ViewDefinitionConstants.ACTION_PRINT.equals(action))
						eventFunction = "PRINT_PRVW";
					event = Event.getEventFor("CANVAS", "APP", eventFunction, eventAction);

					auditEvent(event, inputVector, eventAction);
				}
			} catch (OnlineException e)
			{
				LOGGER.cterror("CTVDF00026", e, viewId);
			}
		} catch (ViewDefinitionException vde)
		{
			LOGGER.cterror("CTVDF00026", vde, viewId);
			// Since the method signature does not allow us to throw an
			// exception, This is being eaten and instead null
			// is being returned.
			reply = (ExtReplyObject) getErrorReply(inputVector);
		} catch (CloneNotSupportedException ce)
		{
			LOGGER.cterror("CTVDF00026", ce, viewId);
			// Since the method signature does not allow us to throw an
			// exception, This is being eaten and instead null
			// is being returned.
			reply = (ExtReplyObject) getErrorReply(inputVector);
		}
		perfTimer.endTimer();
		return reply;
	}

	/**
	 * this method used get the view id for widget id for get the editable lookup widget response
	 * 
	 * @param widgetId
	 * @return String ViewId of the widgetId
	 * @throws ViewDefinitionException
	 */
	private String getViewId(String widgetId) throws ViewDefinitionException
	{
		String viewId = "";
		ViewManager vmng = new ViewManager();
		viewId = vmng.getViewIdForWidget(widgetId);
		return viewId;
	}

	/**
	 * this is ref to validateWidgetIdViewId
	 * 
	 * @param widgetId
	 * @param viewId
	 * @param inputVector
	 * @return
	 */
	private ReplyObject validateWidgetIdViewId(String widgetId, String viewId, Vector inputVector)
	{
		ReplyObject ob = null;
		// If Widget Id is not provided, then thrown an error as this is needed
		// for this action processing.
		if ((widgetId == null) || (widgetId.length() == 0))
		{
			LOGGER.cterror("CTVDF00027", ViewDefinitionConstants.PARAM_WIDGET_ID);
			ob = getErrorReply(inputVector);
		}

		// If View Id is not provided, then thrown an error as this is needed
		// for this action processing.
		if ((viewId == null) || (viewId.length() == 0))
		{
			LOGGER.cterror("CTVDF00028", ViewDefinitionConstants.FLD_VIEW_ID);
			ob = getErrorReply(inputVector);
		}
		return ob;
	}

	/**
	 * Helper Method to Convert ',' separated Strings to a Array List
	 * 
	 * @param initialString
	 * @return finalArrList
	 */
	private static ArrayList<String> stringToArrayList(String initialString)
	{
		ArrayList<String> finalArrList = new ArrayList<String>();
		String[] stringArray;
		String delimiter = ",";
		stringArray = initialString.split(delimiter);
		int arrlen = stringArray.length;
		for (int i = 0; i < arrlen; i++)
		{
			finalArrList.add(stringArray[i]);
		}
		return finalArrList;
	}

	/**
	 * refactored method to get the jspfields hashmap from vector either from the 26th index in the vector, if not get
	 * from the last but one the position from the vector
	 * 
	 * @param inputVector
	 * @return the hashpmap present in the vector
	 */
	private static HashMap getFieldsHashMapFromVector(Vector inputVector)
	{
		HashMap map = new HashMap();
		Object cachedHashMapObj = inputVector.get(Integer.parseInt(HASH_MAP_POSITION) + 1);
		if (cachedHashMapObj instanceof HashMap)
			map = (HashMap) cachedHashMapObj;
		else
		{
			cachedHashMapObj = inputVector.get(inputVector.size() + TIConstants.REL_CACHEDMAP_INDEX_IN_VECTOR);
			if (cachedHashMapObj instanceof HashMap)
				map = (HashMap) cachedHashMapObj;
		}
		return map;
	}

	/**
	 * Gets the cached HashMap from InputVector. Same as getJSPHashMap method except that other transaction related data
	 * is also populated in the return HashMap.
	 * 
	 * @param Vector Contains TI framework defined fields in positions ranging from 0 to 28+
	 * 
	 * @param Map Cached HashMap with additional data from Vector
	 */
	protected static Map getAugmentedCachedHashMap(Vector inputVector)
	{
		HashMap map = getFieldsHashMapFromVector(inputVector);
		map.put(JSPIOConstants.INPUT_REFERENCE_NO, inputVector.get(TIConstants.REFERENCE_NO_POS));
		map.put(TRConstants.VER_NO, inputVector.get(VER_NO_POS));
		map.put(TIConstants.TXN_STATUS, inputVector.get(TXN_STATUS_POS));

		map.put(TIConstants.CHANNEL_ID, inputVector.get(10));

		return map;
	}

	/**
	 * This Method processes the delete request of the Preferences View
	 * 
	 * @param inputVector
	 * @return reply
	 * @throws ViewDefinitionException
	 */
	private ExtReplyObject processWidgetPrefDeleteRequest(Vector inputVector) throws ViewDefinitionException
	{
		ExtReplyObject reply = null;

		LOGGER.ctdebug("CTVDF00029");
		HashMap paramsMap = (HashMap) getAugmentedCachedHashMap(inputVector);
		String action = (String) inputVector.get(TIConstants.INPUT_ACTION_INDEX_IN_VECTOR);
		LOGGER.ctdebug("CTVDF00030", paramsMap);
		String widgetId = (String) paramsMap.get(ViewDefinitionConstants.PARAM_WIDGET_ID);
		String viewId = (String) paramsMap.get(ViewDefinitionConstants.FLD_VIEW_ID);
		String gcifNo = (String) inputVector.get(TIConstants.GCIF_INDEX_IN_VECTOR);
		String userNo = (String) inputVector.get(TIConstants.USER_NO_INDEX_IN_VECTOR);
		UserTransaction userTxn = null;
		ViewManager vmng = new ViewManager();
		ViewDefinition viewDefinition = null;
		UserValue userValue = new UserValue();
		boolean deleteSuccess = false;

		try
		{
			viewDefinition = vmng.getViewDefinition(widgetId, viewId, paramsMap);
			viewDefinition.setWidgetId(widgetId);
			Map viewData = viewDefinition.getViewDefinitionAsMap();
			LOGGER.ctdebug("CTVDF00031", viewData);
			userValue.setPrimaryGcif(gcifNo);
			userValue.setUserNo(userNo);

			userTxn = DataManager.getUserTransaction();
			// begin the transaction
			if (userTxn != null)
			{
				userTxn.begin();
			}
			/**
			 * Deleting the View Definition
			 */
			vmng.deleteViewDefinition(viewDefinition, userValue);

			// Raise the event.
			Event deleteEvent = Event.getEventFor("CANVAS", "APP", "CUSTOMIZER", "DELETE");
			Map eventData = new HashMap();
			Map mandatoryData = EventHandlerFrameworkConstants.getEventMandatoryDataFrom(getOriginalRequest(),
					deleteEvent, viewId);
			String viewName = MessageManager.getMessage(viewDefinition.getBundleKey(), viewDefinition.getViewName(),
					FrameworkConstants.DEFAULT_LOCALE, true);
			mandatoryData.put(EventHandlerFrameworkConstants.FLD_REFERENCE_NO, viewName);
			viewData = getViewDefinitionAuditData(viewDefinition);
			eventData.put(AuditConstants.MANDATORY_AUDIT_META_DATA, mandatoryData);
			eventData.put(AuditConstants.MANDATORY_AUDIT_DATA_OLD_STATE, viewData);
			eventData.put(AuditConstants.MANDATORY_AUDIT_DATA_NEW_STATE, viewData);
			EventDispatcher.getInstance().raiseEvent(deleteEvent, eventData);
			// commit the transaction
			if (userTxn != null)
			{
				userTxn.commit();
			}
			userTxn = null;
			deleteSuccess = true;
		} catch (HandlerException e)
		{
			LOGGER.cterror("CTVDF00816", e);
			throw new ViewDefinitionException(e);
		} catch (Exception nex)
		{
			LOGGER.cterror("CTVDF00032", nex);
			throw new ViewDefinitionException(nex);
		} finally
		{
			if (!deleteSuccess)
			{
				try
				{
					if (userTxn != null)
						userTxn.rollback();
				} catch (SystemException sex)
				{
					LOGGER.cterror("CTVDF00041", sex);
					throw new ViewDefinitionException(sex);
				}
			}
		}
		LOGGER.ctdebug("CTVDF00042");
		reply = new ExtReplyObject();
		reply.headerMap = createPrefActionReplyMap(viewDefinition, viewId, action);
		LOGGER.ctdebug("CTVDF00043", reply.headerMap);
		return reply;
	}

	/**
	 * This method is called whenever the user changes the Preferences of a view in a particular widget. for both Save
	 * New
	 * 
	 * @param inputVector
	 * @return Reply object having the Status of Saving the Preferences
	 * @throws ViewDefinitionException
	 */
	private ReplyObject processWidgetPrefSaveRequest(Vector inputVector) throws ViewDefinitionException
	{
		ExtReplyObject replyObject = null;
		String action = (String) inputVector.get(TIConstants.INPUT_ACTION_INDEX_IN_VECTOR);
		LOGGER.ctdebug("CTVDF00044", action);
		HashMap paramsMap = (HashMap) getAugmentedCachedHashMap(inputVector);
		LOGGER.ctdebug("CTVDF00045", paramsMap);
		// First read the necessary set of attributes from the input Vector and
		// perform necessary initial validations
		String widgetId = (String) paramsMap.get(ViewDefinitionConstants.PARAM_WIDGET_ID);
		String parentViewId = (String) paramsMap.get(ViewDefinitionConstants.FLD_PARENT_VIEW_ID);
		String viewName = (String) paramsMap.get(ViewDefinitionConstants.PARAM_VIEW_NAME);
		String viewId = (String) paramsMap.get(ViewDefinitionConstants.FLD_VIEW_ID);
		String gcifNo = (String) inputVector.get(TIConstants.GCIF_INDEX_IN_VECTOR);
		String userNo = (String) inputVector.get(TIConstants.USER_NO_INDEX_IN_VECTOR);
		UserTransaction userTxn = null;
		ViewDefinition parentViewDefn = null;
		ViewDefinition currViewDefn = null;
		String createdViewId = "";
		boolean creationSuccess = false;
		replyObject = (ExtReplyObject) validateWidgetIdViewId(widgetId, parentViewId, inputVector);

		if (replyObject != null)
		{
			return replyObject;
		}

		ViewManager vmng = new ViewManager();
		try
		{

			/**
			 * Step 1: Get the Parent View Definition Object from the View Manager
			 */
			parentViewDefn = vmng.getViewDefinition(widgetId, parentViewId, paramsMap);
			LOGGER.ctdebug("CTVDF00046", parentViewDefn, parentViewDefn.getViewDefinitionAsMap(),
					parentViewDefn.hashCode());

			/**
			 * Step 2: Clone the Parent to create the current View Definition Object for further manipulation
			 * considering the Preferences.
			 */
			currViewDefn = (ViewDefinition) parentViewDefn.clone();
			LOGGER.ctdebug("CTVDF00047", currViewDefn, currViewDefn.getViewDefinitionAsMap(), currViewDefn.hashCode());
			/**
			 * Step 3: Clone the Parent VDF object and Manipulate according to the preferences
			 */
			currViewDefn = manipulateVDFobj(gcifNo, userNo, paramsMap, currViewDefn);

			// Need to explicitly set the View Id as the Current View Id
			// since we are manipulating the System View Id
			currViewDefn.setViewId(viewId);
			currViewDefn.setViewName(viewName);
			LOGGER.ctdebug("CTVDF00048", currViewDefn, currViewDefn.getViewDefinitionAsMap(), currViewDefn.hashCode());
			userTxn = DataManager.getUserTransaction();
			// begin the transaction
			userTxn.begin();
			/**
			 * Step 3: Using the manipulated View Definition create View using View manager.
			 */
			createdViewId = vmng.saveView(currViewDefn);

			// Raise the event.
			Event createEvent = Event.getEventFor("CANVAS", "APP", "CUSTOMIZER", "UPDATE");
			Map eventData = new HashMap();
			Map mandatoryData = EventHandlerFrameworkConstants.getEventMandatoryDataFrom(getOriginalRequest(),
					createEvent, createdViewId);
			mandatoryData.put(EventHandlerFrameworkConstants.FLD_REFERENCE_NO, viewName);
			Map viewData = getViewDefinitionAuditData(currViewDefn);

			eventData.put(AuditConstants.MANDATORY_AUDIT_META_DATA, mandatoryData);
			eventData.put(AuditConstants.MANDATORY_AUDIT_DATA_OLD_STATE, viewData);
			eventData.put(AuditConstants.MANDATORY_AUDIT_DATA_NEW_STATE, viewData);
			EventDispatcher.getInstance().raiseEvent(createEvent, eventData);

			userTxn.commit();
			userTxn = null;
			creationSuccess = true;
		} catch (Exception ex)
		{
			LOGGER.cterror("CTVDF00050", ex);
			throw new ViewDefinitionException(ex);
		} finally
		{
			try
			{
				if (!creationSuccess && userTxn != null)
					userTxn.rollback();
			} catch (Exception sex)
			{
				LOGGER.cterror("CTVDF00058", sex);
				throw new ViewDefinitionException(sex);
			}
		}
		replyObject = new ExtReplyObject();
		replyObject.headerMap = createPrefActionReplyMap(currViewDefn, createdViewId, action);
		LOGGER.ctdebug("CTVDF00060", replyObject.headerMap);
		return replyObject;
	}

	/**
	 * This method is called whenever the user changes the Preferences of a view in a particular widget. for Save New
	 * 
	 * @param inputVector
	 * @return Reply object having the Status of Saving the Preferences
	 * @throws ViewDefinitionException
	 */
	private ReplyObject processWidgetPrefSaveNewRequest(Vector inputVector) throws ViewDefinitionException
	{
		ExtReplyObject replyObject = new ExtReplyObject();
		replyObject.headerMap = new HashMap<String, String>();
		String action = (String) inputVector.get(TIConstants.INPUT_ACTION_INDEX_IN_VECTOR);
		LOGGER.ctdebug("CTVDF00061", action);
		HashMap paramsMap = (HashMap) getAugmentedCachedHashMap(inputVector);
		LOGGER.ctdebug("CTVDF00062", paramsMap);
		// First read the necessary set of attributes from the input Vector and
		// perform necessary initial validations
		String widgetId = (String) paramsMap.get(ViewDefinitionConstants.PARAM_WIDGET_ID);

		String viewName = (String) paramsMap.get(ViewDefinitionConstants.PARAM_VIEW_NAME);
		String vdefProduct = (String) paramsMap.get(ViewDefinitionConstants.PARAM_VDEF_PRODUCT);
		String vdefSubProduct = (String) paramsMap.get(ViewDefinitionConstants.PARAM_VDEF_SUBPRODUCT);
		String parentViewId = (String) paramsMap.get(ViewDefinitionConstants.FLD_PARENT_VIEW_ID);
		String gcifNo = (String) inputVector.get(TIConstants.GCIF_INDEX_IN_VECTOR);
		String userNo = (String) inputVector.get(TIConstants.USER_NO_INDEX_IN_VECTOR);
		String prodCode = (String) inputVector.get(TIConstants.PROD_CODE_INDEX_IN_VECTOR);
		String strLocale = (String) inputVector.get(TIConstants.LANGID_INDEX_IN_VECTOR);
		ViewManager vmng = new ViewManager();
		UserTransaction userTxn = null;
		ViewDefinition parentViewDefn = null;
		ViewDefinition currViewDefn = null;
		String createdViewId = "";
		boolean creationSuccess = false;

		// This part helps validating the Uniqueness of the View Name field
		if (vmng.isViewNameUnique(userNo, gcifNo, viewName, vdefProduct, vdefSubProduct, parentViewId))
		{
			try
			{
				/**
				 * Step 1: Get the Parent View Definition Object from the View Manager
				 */
				parentViewDefn = vmng.getViewDefinition(widgetId, parentViewId, paramsMap);
				LOGGER.ctdebug("CTVDF00063", parentViewDefn, parentViewDefn.getViewDefinitionAsMap(),
						parentViewDefn.hashCode());

				/**
				 * Step 2: Clone the Parent to create the current View Definition Object for further manipulation
				 * considering the Preferences.
				 */
				currViewDefn = (ViewDefinition) parentViewDefn.clone();
				LOGGER.ctdebug("CTVDF00064", currViewDefn, currViewDefn.getViewDefinitionAsMap(),
						currViewDefn.hashCode());
				/**
				 * Step 3: Clone the Parent VDF object and Manipulate according to the preferences
				 */
				currViewDefn = manipulateVDFobj(gcifNo, userNo, paramsMap, currViewDefn);
				LOGGER.ctdebug("CTVDF00065", currViewDefn, currViewDefn.getViewDefinitionAsMap(),
						currViewDefn.hashCode());
				LOGGER.ctdebug("CTVDF00066", parentViewDefn, parentViewDefn.getViewDefinitionAsMap(),
						parentViewDefn.hashCode());
				userTxn = DataManager.getUserTransaction();
				// begin the transaction
				userTxn.begin();
				/**
				 * Step 3: Using the manipulated View Definition create View using View manager.
				 */
				// Setting the View Name - Given by the User
				currViewDefn.setViewName(viewName);
				createdViewId = vmng.createView(currViewDefn);// commit the transaction

				// Raise the event.
				Event createEvent = Event.getEventFor("CANVAS", "APP", "CUSTOMIZER", "CREATE");
				Map eventData = new HashMap();
				Map mandatoryData = EventHandlerFrameworkConstants.getEventMandatoryDataFrom(getOriginalRequest(),
						createEvent, createdViewId);
				mandatoryData.put(EventHandlerFrameworkConstants.FLD_REFERENCE_NO, viewName);
				Map viewData = getViewDefinitionAuditData(currViewDefn);

				eventData.put(AuditConstants.MANDATORY_AUDIT_META_DATA, mandatoryData);
				eventData.put(AuditConstants.MANDATORY_AUDIT_DATA_OLD_STATE, viewData);
				eventData.put(AuditConstants.MANDATORY_AUDIT_DATA_NEW_STATE, viewData);
				EventDispatcher.getInstance().raiseEvent(createEvent, eventData);

				userTxn.commit();
				userTxn = null;
				creationSuccess = true;
			} catch (HandlerException nex)
			{
				throw new ViewDefinitionException(nex);
			} catch (Exception seex)
			{
				LOGGER.cterror("CTVDF00068", seex);
				throw new ViewDefinitionException(seex);
			} finally
			{
				try
				{
					if (!creationSuccess && userTxn != null)
						userTxn.rollback();
				} catch (Exception sex)
				{
					LOGGER.cterror("CTVDF00076", sex);
					throw new ViewDefinitionException(sex);
				}
			}
			replyObject.headerMap = createPrefActionReplyMap(currViewDefn, createdViewId, action);
			LOGGER.ctdebug("CTVDF00078", replyObject.headerMap);
		} else
		{
			LOGGER.ctdebug("CTVDF00079");
			HashMap<String, String> errorReplyMap = new HashMap<String, String>();
			errorReplyMap.put(FrameworkConstants.KEY_ERROR_CODE, ViewDefinitionConstants.VIEW_NAME_NOT_UNIQUE);
			LOGGER.ctdebug("CTVDF00080", prodCode.toLowerCase(), strLocale);
			String errorMessage = MessageManager.getMessage(prodCode.toLowerCase(),
					ViewDefinitionConstants.VIEW_NAME_NOT_UNIQUE, strLocale);
			errorReplyMap.put(FrameworkConstants.KEY_ERROR_MESSAGE, errorMessage);
			replyObject.headerMap = errorReplyMap;
			LOGGER.ctdebug("CTVDF00081", replyObject.headerMap);
		}
		return replyObject;
	}

	/**
	 * Helper method to get the state of a view definition for Audit purposes
	 * 
	 * @param aDefinition
	 * @return
	 */
	private Map getViewDefinitionAuditData(ViewDefinition aDefinition)
	{
		Map auditData = new HashMap();
		String bundle = aDefinition.getBundleKey();
		ColumnDefinition colDef;
		ColumnFilter filterDef;
		SortDefinition sortDef;
		List temp;

		auditData.put("VIEW_ID", aDefinition.getViewId());
		auditData.put("SYSTEM_VIEW_ID", aDefinition.getSystemViewID());
		auditData.put("VIEW_NAME",
				MessageManager.getMessage(bundle, aDefinition.getViewName(), FrameworkConstants.DEFAULT_LOCALE, true));
		temp = new ArrayList<String>();
		for (ColumnDefinition aCol : aDefinition.getAllVisibleColumns())
		{
			temp.add(MessageManager.getMessage(bundle, aCol.getColumnDisplayNameKey(),
					FrameworkConstants.DEFAULT_LOCALE, true));
		}

		auditData.put("VISIBLE_COLS", temp);

		temp = new ArrayList<String>();
		for (Object aSort : aDefinition.getOrderedSortDefinition())
		{
			sortDef = (SortDefinition) aSort;
			colDef = aDefinition.getColumnDefnForColumn((sortDef).getColumnID());
			temp.add(MessageManager.getMessage(bundle, colDef.getColumnDisplayNameKey(),
					FrameworkConstants.DEFAULT_LOCALE, true) + "(" + sortDef.getSortOrder() + ")");
		}

		auditData.put("SORTED_COLS", temp);

		temp = new ArrayList<String>();
		for (ColumnDefinition aCol : aDefinition.getOrderedGroupColumns())
		{
			temp.add(MessageManager.getMessage(bundle, aCol.getColumnDisplayNameKey(),
					FrameworkConstants.DEFAULT_LOCALE, true));
		}

		auditData.put("GROUPED_COLS", temp);

		temp = new ArrayList<String>();
		for (Object aFilter : aDefinition.getListFilters())
		{
			filterDef = (ColumnFilter) aFilter;
			colDef = aDefinition.getColumnDefnForColumn(filterDef.getColumnID());
			temp.add(MessageManager.getMessage(bundle, colDef.getColumnDisplayNameKey(),
					FrameworkConstants.DEFAULT_LOCALE, true));
		}

		auditData.put("FILTERED_COLS", temp);

		return auditData;
	}

	/**
	 * This Method is a Intended to clone the passed parent VDF obj and manipulate according to the Preferences set in
	 * the param and return the cloned and manipulated VDF obj
	 * 
	 * @param gcifNo
	 * @param userNo
	 * @param paramsMap
	 * @param vdfObjToManipulate
	 * @return manipulteVdfObj
	 */
	private ViewDefinition manipulateVDFobj(String gcifNo, String userNo, Map paramsMap,
			ViewDefinition vdfObjToManipulate)
	{
		String strDefaultView = (String) paramsMap.get(ViewDefinitionConstants.PARAM_IS_DEFAULT_VIEW);
		String widgetId = (String) paramsMap.get(ViewDefinitionConstants.PARAM_WIDGET_ID);
		String parentViewId = (String) paramsMap.get(ViewDefinitionConstants.FLD_PARENT_VIEW_ID);

		/**
		 * Step 1: Manipulate the current View Definition Object according to the Preferences details in request
		 * parameters
		 */
		// Setting the Widget Id
		vdfObjToManipulate.setWidgetId(widgetId);

		// View ID: new UUID is created by ViewDefinitionInstruction.createView
		// - not necessary

		// Setting the Parent View Id - Current View Id from request params
		vdfObjToManipulate.setParentViewId(parentViewId);

		// Instruction Class name - is created by
		// ViewDefinitionInstruction.createView - not necessary

		// Setting User Number - User Id of the User
		vdfObjToManipulate.setUserNumber(userNo);

		// Setting the GCIF to which the User Belongs
		vdfObjToManipulate.setGCIF(gcifNo);

		// Default View:
		vdfObjToManipulate.setStrDefaultView(strDefaultView);

		if ((String) paramsMap.get(ViewDefinitionConstants.FLD_FUNCTION) != null)
			vdfObjToManipulate.setFunctionCode((String) paramsMap.get(ViewDefinitionConstants.FLD_FUNCTION));

		// Product: Not Required

		// SubProduct: Not Required,

		// Setting the View preferences obj
		String lastColumnHandling = (String) paramsMap.get(ViewDefinitionConstants.PARAM_LAST_COL);
		ViewDefinitionPreferences viewDefnPref = vdfObjToManipulate.getViewPreferences();
		LOGGER.ctdebug("CTVDF00082", viewDefnPref.getPreferenceAsMap());

		viewDefnPref.setLastColumnHandling(lastColumnHandling);
		LOGGER.ctdebug("CTVDF00083", viewDefnPref.getPreferenceAsMap());
		vdfObjToManipulate.setViewPreferences(viewDefnPref);

		// Setting the List Columns - Array List of the ColumnDefinition
		// objects.
		String selectedGroupBy = (String) paramsMap.get(ViewDefinitionConstants.PARAM_GROUP_BY);
		String columnOrdering = (String) paramsMap.get(ViewDefinitionConstants.PARAM_MULTI_SELECT);
		String columnsSelected = (String) paramsMap.get(ViewDefinitionConstants.PARAM_COLUMNS_GROUP);
		String strAccountGrpArr = (String) paramsMap.get(ViewDefinitionConstants.PARAM_ACCOUNT_GRP);
		String strSortFldName = (String) paramsMap.get("SORT_FLD_PREF");
		String strSortOrder = (String) paramsMap.get("SORT_DIREC_PREF");
		ArrayList<String> groupByatrArr = stringToArrayList(selectedGroupBy);
		ArrayList<String> columnsSelectedArr = stringToArrayList(columnsSelected);
		ArrayList<String> columnOrdAtrArr = stringToArrayList(columnOrdering);
		String filter1ComboVal = (String) paramsMap.get(ViewDefinitionConstants.PARAM_FILTER1_COMBO_PREF_FILTER);
		String filter2ComboVal = (String) paramsMap.get(ViewDefinitionConstants.PARAM_FILTER2_COMBO_PREF_FILTER);

		String maxSelectedBucket = getMaxSelectedBucket(columnsSelectedArr);

		ArrayList allListColDefs = vdfObjToManipulate.getListColumns();
		ArrayList allNonHiddenColumns = vdfObjToManipulate.getAllNonHiddenColumns();
		int fixedPosiAndContextCount = getFixedPosiPlusContextCount(columnsSelectedArr, allNonHiddenColumns);
		int orderingPosition = 0;
		int visiFalsePosition = 0;
		int visiFalseCount = 1;
		for (int i = 0, len = allListColDefs.size(); i < len; i++)
		{
			ColumnDefinition eachColDefn = (ColumnDefinition) allListColDefs.get(i);
			String cName = eachColDefn.getColumnDisplayNameKey();
			String cId = eachColDefn.getColumnId();
			LOGGER.ctdebug("CTVDF00084", cName);
			if (eachColDefn.isGroupable())
			{
				LOGGER.ctdebug("CTVDF00085", cName, i);
				if (groupByatrArr.contains(cName))
				{
					LOGGER.ctdebug("CTVDF00086", cName, i);
					// Sort Position i , Sort Order ASC, Position in Grp i, is
					// Grouped Y
					int sortPosition = groupByatrArr.indexOf(cName) + 1;
					eachColDefn.setSortPosition(sortPosition);
					eachColDefn.setSortOrder(ViewDefinitionConstants.SQL_SORT_ORDER_ASCENDING);
					eachColDefn.setGroupPosition(sortPosition);
					eachColDefn.setGrouped(true);
				} else
				{
					LOGGER.ctdebug("CTVDF00087", cName, i);
					// Sort Position null , Sort Order null, Position in Grp
					// null, is Grouped N
					eachColDefn.setStrSortPosition("");
					eachColDefn.setSortOrder("");
					eachColDefn.setGroupPosition(-1);
					eachColDefn.setGrouped(false);
				}
			}
			if (!eachColDefn.isHidden())
			{
				LOGGER.ctdebug("CTVDF00088", cName, i);
				// To handle exclusive and inclusive Last column Handling
				cName = removePlusfromCName(cName);
				eachColDefn.setColumnDisplayNameKey(cName);
				if (ViewDefinitionConstants.LAST_COL_HANDLING_INCLUSIVE.equals(lastColumnHandling)
						&& !maxSelectedBucket.equals(""))
				{
					if (cName.equals(maxSelectedBucket))
					{
						LOGGER.ctdebug("CTVDF00089");
						eachColDefn.setColumnDisplayNameKey(cName + "_PLUS");
					}
				}
				if (columnsSelectedArr.contains(cName))
				{
					eachColDefn.setVisible(true);
					if (eachColDefn.getColumnDisplayNameKey().equals(filter1ComboVal)
							|| eachColDefn.getColumnDisplayNameKey().equals(filter2ComboVal))
					{
						ArrayList listFilterVals = createColumnFilterList(eachColDefn, paramsMap);
						eachColDefn.setListFilters(listFilterVals);
						eachColDefn.setFilterRequired(true);
					}
				}
				if (columnOrdAtrArr.contains(cName))
				{
					// Position indexOf(cname) , Visible Indicator Y
					// Mandatory and Content wont be available in the
					// columnOrdAtrArr need to handle this
					orderingPosition = fixedPosiAndContextCount + columnOrdAtrArr.indexOf(cName) + 1;
					if (vdfObjToManipulate.isColumnOrderingEnabled())
					{
						LOGGER.ctdebug("CTVDF00090");
						eachColDefn.setPosition(orderingPosition);
					}
				}
				if (!columnsSelectedArr.contains(cName) && !columnOrdAtrArr.contains(cName) && !"CONTEXT".equals(cName))
				{
					// Position Value greater than the Column order array length
					// , Visible Indicator Y
					// Mandatory and Content wont be available in the
					// columnOrdAtrArr need to handle this
					visiFalsePosition = fixedPosiAndContextCount + columnOrdAtrArr.size() + visiFalseCount;
					if (vdfObjToManipulate.isColumnOrderingEnabled())
					{
						LOGGER.ctdebug("CTVDF00090");
						eachColDefn.setPosition(visiFalsePosition);
					}
					eachColDefn.setVisible(false);
					visiFalseCount++;
				}
				// To handle Sort By Field Handling
				if (eachColDefn.isSortable())
				{
					eachColDefn.setStrSortPosition("");
					eachColDefn.setSortOrder("");
					if (strSortFldName.equals(cName))
					{
						// Setting Sorting as per Preference
						LOGGER.ctdebug("CTVDF00091", cName, strSortOrder);
						eachColDefn.setSortPosition(1);
						eachColDefn.setSortOrder(strSortOrder);
					}
				}
			}
			if (!eachColDefn.isGroupable() && eachColDefn.isHidden())
			{
				LOGGER.ctdebug("CTVDF00092", cName, i);
				if (groupByatrArr.contains("ACC_GR_NAME") && "ACC_GR_ID".equals(cName))
				{
					LOGGER.ctdebug("CTVDF00093", cName, strAccountGrpArr);

					if (!"".equals(strAccountGrpArr))
					{
						ArrayList<String> listAcctGrps = stringToArrayList(strAccountGrpArr);
						LOGGER.ctdebug("CTVDF00094", cName, cId, eachColDefn.getDataType(), listAcctGrps);
						ArrayList<ColumnFilter> listAcctGrpsFilter = createAccountGrpFilter(cId,
								eachColDefn.getDataType(), listAcctGrps);
						eachColDefn.setListFilters(listAcctGrpsFilter);
						eachColDefn.setFilterRequired(true);
					}
				}
			}
		}
		vdfObjToManipulate.setListColumns(allListColDefs);
		LOGGER.ctdebug("CTVDF00095", vdfObjToManipulate, vdfObjToManipulate.getViewDefinitionAsMap(),
				vdfObjToManipulate.hashCode());

		// Records Per Page: Not Required
		// SQL Param Map ID : handled by ViewDefinitionInstruction.createView
		// Overridden Flag : false,
		// System View ID : Always set the parent pre defined view

		return vdfObjToManipulate;
	}

	/**
	 * this is ref to createAccountGrpFilter to ArrayList
	 * 
	 * @param columnID
	 * @param dataType
	 * @param listAcctGrps
	 * @return ArrayList
	 */

	private ArrayList<ColumnFilter> createAccountGrpFilter(String columnID, String dataType,
			ArrayList<String> listAcctGrps)
	{
		ArrayList<ColumnFilter> accGrpFilterList = new ArrayList<ColumnFilter>();
		ColumnFilter columnFilter = new ColumnFilter();
		columnFilter.setColumnID(columnID);
		columnFilter.setDataType(dataType);
		columnFilter.setFilterType(ViewDefinitionConstants.OP_STR_IN);
		columnFilter.setFilterValues(listAcctGrps);
		LOGGER.ctdebug("CTVDF00096", columnFilter);
		accGrpFilterList.add(columnFilter);
		LOGGER.ctdebug("CTVDF00097", accGrpFilterList);
		return accGrpFilterList;
	}

	/**
	 * Intended to remove _PLUS from the Column Display name Key
	 * 
	 * @param name
	 * @return String
	 */
	private String removePlusfromCName(String name)
	{
		if (name.endsWith("_PLUS"))
			return name.substring(0, name.length() - 5);
		return name;
	}

	/**
	 * The Method is intended to return the max selected Bucket.
	 * 
	 * @param columnsSelectedArr
	 * @return String
	 */
	private String getMaxSelectedBucket(ArrayList<String> columnsSelectedArr)
	{
		ArrayList<String> bucketsList = stringToArrayList(ViewDefinitionConstants.BUCKET_NM_STR);
		ArrayList<String> selectedBucketsList = new ArrayList<String>();
		for (int i = 0, len = bucketsList.size(); i < len; i++)
		{
			if (columnsSelectedArr.contains(bucketsList.get(i)))
			{
				selectedBucketsList.add(bucketsList.get(i));
			}
		}
		return !selectedBucketsList.isEmpty() ? selectedBucketsList.get(selectedBucketsList.size() - 1) : "";
	}

	/**
	 * This is a helper method to return the widget Renderflag based on the preference Action Used by the Client side
	 * 
	 * @param action
	 * @param currViewDefn
	 * @return boolean
	 */
	private String getWidgetRenderFlg(String action)
	{
		if (action.equals(ViewDefinitionConstants.ACTION_PREF_DELETE))
		{
			return ViewDefinitionConstants.VAL_BOOL_YES;
		}
		return ViewDefinitionConstants.VAL_BOOL_NO;
	}

	/**
	 * Creates the Reply Map which would be updated in the Reply object.
	 * 
	 * @param currViewDefn
	 * @param viewid
	 * @param inputaction
	 * @return replyMap
	 */
	private HashMap<String, String> createPrefActionReplyMap(ViewDefinition currViewDefn, String viewid,
			String inputaction)
	{
		HashMap<String, String> replyMap = new HashMap<String, String>();
		String tools = currViewDefn.getAllTools();
		String customizeInd = tools.contains(ViewDefinitionConstants.TOOLS_CUSTOMIZE) ? ViewDefinitionConstants.VAL_BOOL_YES
				: ViewDefinitionConstants.VAL_BOOL_NO;
		replyMap.put(ViewDefinitionConstants.PARAM_SUCCESS, ViewDefinitionConstants.VAL_BOOL_TRUE);
		replyMap.put(ViewDefinitionConstants.PARAM_WIDGET_ID, currViewDefn.getWidgetId());
		replyMap.put(ViewDefinitionConstants.FLD_VIEW_ID, viewid);
		replyMap.put(ViewDefinitionConstants.FLD_CUSTOMIZE_IND, customizeInd);
		replyMap.put(ViewDefinitionConstants.FLD_GCIF, currViewDefn.getGCIF());
		replyMap.put(ViewDefinitionConstants.FLD_USER_NO, currViewDefn.getUserNumber());
		replyMap.put(ViewDefinitionConstants.FLD_SYSTEM_VIEW_ID, currViewDefn.getSystemViewID());
		replyMap.put(ViewDefinitionConstants.FLD_VIEW_NAME, currViewDefn.getViewName());
		replyMap.put(ViewDefinitionConstants.FLD_DEFAULT, currViewDefn.getStrDefaultView());
		replyMap.put(ViewDefinitionConstants.ACTION_PREF_ACTION, inputaction);
		replyMap.put(ViewDefinitionConstants.PARAM_SOURCE, ViewDefinitionConstants.PREFERENCES);
		replyMap.put(ViewDefinitionConstants.PARAM_RENDER_FLG, getWidgetRenderFlg(inputaction));
		return replyMap;
	}

	/**
	 * Helper method intended to create the List of Filter values based on the values set in the preferences.
	 * 
	 * @param eachColDefn
	 * @param paramsMap
	 * @return filterValList
	 */
	private ArrayList createColumnFilterList(ColumnDefinition eachColDefn, Map paramsMap)
	{
		LOGGER.ctdebug("CTVDF00098");
		ArrayList filterColList = new ArrayList();
		String filter1FldCombo = (String) paramsMap.get(ViewDefinitionConstants.PARAM_FILTER1_COMBO_PREF_FILTER);
		String filter2FldCombo = (String) paramsMap.get(ViewDefinitionConstants.PARAM_FILTER2_COMBO_PREF_FILTER);
		String constraintFilter1 = (String) paramsMap.get(ViewDefinitionConstants.PARAM_CONSTRAINT1_COM_PREF_FILTER);
		String constraintFilter2 = (String) paramsMap.get(ViewDefinitionConstants.PARAM_CONSTRAINT2_COM_PREF_FILTER);
		String columnName = eachColDefn.getColumnDisplayNameKey();
		String columnId = eachColDefn.getColumnId();
		String columnDataType = eachColDefn.getDataType();
		String filterValueOne = null;
		String filterDateOne = "";
		String filterDateTwo = "";
		String filterValueTwo = null;
		ColumnFilter columnFilter = null;
		ArrayList filterValueOneList = new ArrayList();
		ArrayList filterValueTwoList = new ArrayList();
		ArrayList filterOne = new ArrayList();
		ArrayList filterTwo = new ArrayList();
		String userPrefDateFormat = (String) paramsMap.get(ViewDefinitionConstants.USER_PREFEERENCE_DATE_FORMAT);
		if (columnName.equals(filter1FldCombo))
		{
			columnFilter = new ColumnFilter();
			columnFilter.setColumnID(columnId);
			columnFilter.setDataType(columnDataType);
			if (ViewDefinitionConstants.DATA_TYPE_DATE.equals(columnDataType))
			{
				if (ViewDefinitionConstants.OP_DT_RANGE.equals(constraintFilter1))
				{
					if ("".equals(paramsMap.get(ViewDefinitionConstants.PARAM_FILTER_DATE1_PREF_FILTER)))
					{
						columnFilter.setFilterType(ViewDefinitionConstants.OP_DT_LESSTHAN_EQUAL_DATE);
					} else if ("".equals(paramsMap.get(ViewDefinitionConstants.PARAM_FILTER_DATE2_PREF_FILTER)))
					{
						columnFilter.setFilterType(ViewDefinitionConstants.OP_DT_GREATERTHAN_EQUAL_DATE);
					} else
						columnFilter.setFilterType(constraintFilter1);
				} else
				{
					columnFilter.setFilterType(constraintFilter1);
				}
				/*
				 * Converting date to dd/MM/yyyy to save the user preference in database
				 */
				filterValueOne = DateFormatterManager.convertDateToStandardFormat(userPrefDateFormat,
						(String) paramsMap.get(ViewDefinitionConstants.PARAM_FILTER_DATE1_PREF_FILTER));
				filterDateOne = DateFormatterManager.convertDateToStandardFormat(userPrefDateFormat,
						(String) paramsMap.get(ViewDefinitionConstants.PARAM_FILTER_DATE2_PREF_FILTER));
			} else
			{
				filterValueOne = (String) paramsMap.get(ViewDefinitionConstants.PARAM_FILTER_TEXT1_PREF_FILTER);
				columnFilter.setFilterType(constraintFilter1);
			}

			filterValueOneList.add(filterValueOne);

			if (!"".equals(filterDateOne))
				filterValueOneList.add(filterDateOne);
			columnFilter.setFilterValues(filterValueOneList);
			filterOne.add(columnFilter);
			filterColList = filterOne;

		}

		if (columnName.equals(filter2FldCombo))
		{
			columnFilter = new ColumnFilter();
			columnFilter.setColumnID(columnId);
			constraintFilter2 = (String) paramsMap.get(ViewDefinitionConstants.PARAM_CONSTRAINT2_COM_PREF_FILTER);
			columnFilter.setDataType(columnDataType);
			if (ViewDefinitionConstants.DATA_TYPE_DATE.equals(columnDataType))
			{
				if (ViewDefinitionConstants.OP_DT_RANGE.equals(constraintFilter2))
				{
					if ("".equals(paramsMap.get(ViewDefinitionConstants.PARAM_FILTER2_DATE1_PREF_FILTER)))
					{
						columnFilter.setFilterType(ViewDefinitionConstants.OP_DT_LESSTHAN_EQUAL_DATE);
					} else if ("".equals(paramsMap.get(ViewDefinitionConstants.PARAM_FILTER2_DATE2_PREF_FILTER)))
					{
						columnFilter.setFilterType(ViewDefinitionConstants.OP_DT_GREATERTHAN_EQUAL_DATE);
					} else
						columnFilter.setFilterType(constraintFilter2);
				} else
				{
					columnFilter.setFilterType(constraintFilter2);
				}
				/**
				 * Converting date to dd/MM/yyyy to save the user preference in database
				 */
				filterValueTwo = DateFormatterManager.convertDateToStandardFormat(userPrefDateFormat,
						(String) paramsMap.get(ViewDefinitionConstants.PARAM_FILTER2_DATE1_PREF_FILTER));
				filterDateTwo = DateFormatterManager.convertDateToStandardFormat(userPrefDateFormat,
						(String) paramsMap.get(ViewDefinitionConstants.PARAM_FILTER2_DATE2_PREF_FILTER));
			} else
			{
				filterValueTwo = (String) paramsMap.get(ViewDefinitionConstants.PARAM_FILTER2_TEXT1_PREF_FILTER);
				columnFilter.setFilterType(constraintFilter2);
			}
			filterValueTwoList.add(filterValueTwo);
			if (!"".equals(filterDateTwo))
				filterValueTwoList.add(filterDateTwo);
			columnFilter.setFilterValues(filterValueTwoList);

			if (!filter2FldCombo.equals(filter1FldCombo))
			{
				filterTwo.add(columnFilter);
				filterColList = filterTwo;

			} else
			{
				filterOne.add(columnFilter);
				filterColList = filterOne;

			}
		}
		LOGGER.ctdebug("CTVDF00099", filterColList);
		LOGGER.ctdebug("CTVDF00100");

		return filterColList;
	}

	/**
	 * Helper Method to find the count of Position Fixed Column id's in the Selected Columns check boxes in the Columns
	 * Included check boxes group
	 * 
	 * @param columnsSelectedArr
	 * @param allNonHiddenColumns
	 * @return
	 */
	private int getFixedPosiPlusContextCount(ArrayList columnsSelectedArr, ArrayList allNonHiddenColumns)
	{
		int count = 0;
		String cname = "";
		int colArraLength = allNonHiddenColumns.size();
		for (int i = 0; i < colArraLength; i++)
		{
			ColumnDefinition nonHidColDef = (ColumnDefinition) allNonHiddenColumns.get(i);
			cname = nonHidColDef.getColumnDisplayNameKey();
			if ((columnsSelectedArr.contains(cname) && nonHidColDef.isPositionFixed()) || "CONTEXT".equals(cname))
			{
				count++;
			}
		}
		return count;
	}

	/**
	 * This method is called whenever the user changes a view in the widget and the browser needs the view meta data.
	 * 
	 * @param inputVector The input request
	 * @return Reply object having the view meta data information
	 */
	private ReplyObject processInitializeViewRequest(Vector inputVector)
	{
		HashMap headerMap = new HashMap();
		ExtReplyObject reply = null;

		LOGGER.ctdebug("CTVDF00101");
		// First read the necessary set of attributes from the input Vector.
		Map paramsMap = getAugmentedCachedHashMap(inputVector);
		String widgetId = (String) paramsMap.get(ViewDefinitionConstants.PARAM_WIDGET_ID);
		String viewId = (String) paramsMap.get(ViewDefinitionConstants.FLD_VIEW_ID);

		// If Widget Id is not provided, then thrown an error as this is needed
		// for this action processing.
		if ((widgetId == null) || (widgetId.length() == 0))
		{
			LOGGER.cterror("CTVDF00102", ViewDefinitionConstants.PARAM_WIDGET_ID);
			return getErrorReply(inputVector);
		}

		// If View Id is not provided, then thrown an error as this is needed
		// for this action processing.
		if ((viewId == null) || (viewId.length() == 0))
		{
			LOGGER.cterror("CTVDF00103", ViewDefinitionConstants.FLD_VIEW_ID);
			return getErrorReply(inputVector);
		}

		// At this point in time, there is a widget Id and View Id.
		try
		{
			// Step 1: Ask the View Manager to get the view definition for the
			// given view.
			populateViewDefinitionInto(headerMap, widgetId, viewId, inputVector);

			// Now construct the reply Object.
			reply = new ExtReplyObject();
			reply.headerMap = headerMap;
			// Populate the last updated date / time into the reply object.
			populateLastUpdatedDateTimeInto(reply);

		} catch (ViewDefinitionException vde)
		{
			LOGGER.cterror("CTVDF00104", vde, widgetId);
			// Since the method signature does not allow us to throw an
			// exception, This is being eaten and instead error
			// reply is being returned.
			reply = (ExtReplyObject) getErrorReply(inputVector);
		}

		LOGGER.ctinfo("CTVDF00105", reply);
		return reply;
	}

	/**
	 * This method is called when ever a Multi widget is getting initialized. This fetches the following information -
	 * a) WIDGET LAYOUT - TAB | STACK b) CHILD_WIDGETS - Metadata of the Child Widgets
	 * 
	 * 
	 * @param inputVector The input request
	 * @return Reply object having the Multi list information
	 */
	private ReplyObject processInitializeMultiHeaderRequest(Vector inputVector)
	{
		HashMap headerMap = new HashMap();
		ExtReplyObject reply = null;
		LOGGER.ctdebug("CTVDF00106");
		// First read the necessary set of attributes from the input Vector.
		String gcifNo = (String) inputVector.get(TIConstants.GCIF_INDEX_IN_VECTOR);
		String userNo = (String) inputVector.get(TIConstants.USER_NO_INDEX_IN_VECTOR);
		Map params = getAugmentedCachedHashMap(inputVector);
		String multiWidgetId = (String) params.get(ViewDefinitionConstants.PARAM_WIDGET_ID);
		String sUserRole = (String) params.get(ViewDefinitionConstants.INPUT_USER_ROLE);
		ViewManager viewmgr = new ViewManager();

		// If Widget Id is not provided, then thrown an error as this is needed
		// for this action processing.
		if ((multiWidgetId == null) || (multiWidgetId.length() == 0))
			return getErrorReply(inputVector);
		try
		{
			CanvasViewEntlVO entlvo = getViewEntitlementVO(gcifNo, userNo, sUserRole); // CANVAS_ENTITLEMENT
			Map widgetConfig = viewmgr.getMultiWidgetForUser(multiWidgetId, entlvo); // CANVAS_ENTITLEMENT
			headerMap.put(ViewDefinitionConstants.HEADER_MULTI_WIDGET_METADATA, widgetConfig);

			ArrayList allChildWidgets = (ArrayList) viewmgr.getChildWidgetsForUser(multiWidgetId, entlvo);

			Map viewMetaMap = new HashMap();
			Map widgetMetaMap;
			List allViews = null;
			String widgetId;
			if (allChildWidgets != null)
			{
				int len = allChildWidgets.size();
				/** Adding child view information of all the child widgets */
				for (int i = 0; i < len; i++)
				{
					allViews = null;
					widgetMetaMap = (HashMap) allChildWidgets.get(i);
					widgetId = (String) widgetMetaMap.get(ViewDefinitionConstants.PARAM_WIDGET_ID);
					allViews = viewmgr.getViewListForUser(widgetId, entlvo);
					widgetMetaMap.put(ViewDefinitionConstants.HEADER_KEY_VIEWS_LIST, allViews);
				}
			}
			headerMap.put(ViewDefinitionConstants.HEADER_KEY_VIEWS_LIST, viewMetaMap);

			headerMap.put(ViewDefinitionConstants.HEADER_MULTI_WIDGETS_CHILDREN, allChildWidgets);

			// Now construct the reply Object.
			reply = new ExtReplyObject();
			reply.headerMap = headerMap;
			// Populate the last updated date / time into the reply object.
			populateLastUpdatedDateTimeInto(reply);
		} catch (ViewDefinitionException vde)
		{
			LOGGER.cterror("CTVDF00107", vde, multiWidgetId);
			// Since the method signature does not allow us to throw an
			// exception, This is being eaten and instead null
			// is being returned.
		}

		LOGGER.ctinfo("CTVDF00108", reply);
		return reply;
	}

	/**
	 * The method to fetch the view entitlements from the specific entitlement class in the orbionedirect.properties
	 * 
	 * @param gcifNo
	 * @param userNo
	 * @return CanvasViewEntlVO
	 * @throws ViewDefinitionException
	 */
	private CanvasViewEntlVO getViewEntitlementVO(String gcifNo, String userNo, String sUserRole)
			throws ViewDefinitionException
	{
		/**
		 * Get the Entitlements for the views to be rendered
		 */
		CanvasViewEntlVO entlvo = null;
		try
		{
			EntitlementsHelper entlHelper = new EntitlementsHelper();
			entlvo = entlHelper.getUserAccessEntitlements(gcifNo, userNo, sUserRole);
		} catch (EntitlementException e)
		{
			LOGGER.cterror("CTVDF00815", gcifNo, userNo, sUserRole, e);
			throw new ViewDefinitionException(e);
		}

		// CT_ENTITLEMENT ends
		return entlvo;
	}

	/**
	 * This method is called when ever a widget is getting initialized. This fetches the following information - a)
	 * VIEW_LIST - The list of views (view id, view name, default indicator) b) VIEW_MD - The view meta data for the
	 * default view
	 * 
	 * @param inputVector The input request
	 * @return Reply object having the View list information
	 */
	private ReplyObject processInitializeHeaderRequest(Vector inputVector)
	{
		HashMap headerMap = new HashMap();
		HashMap aRowMap;
		String defaultInd;
		String defaultViewId = null;
		ExtReplyObject reply = null;

		LOGGER.ctdebug("CTVDF00109");
		// First read the necessary set of attributes from the input Vector.
		String gcifNo = (String) inputVector.get(TIConstants.GCIF_INDEX_IN_VECTOR);
		String userNo = (String) inputVector.get(TIConstants.USER_NO_INDEX_IN_VECTOR);
		Map params = getAugmentedCachedHashMap(inputVector);
		String widgetId = (String) params.get(ViewDefinitionConstants.PARAM_WIDGET_ID);
		String sUserRole = (String) params.get(ViewDefinitionConstants.INPUT_USER_ROLE);
		String sChannelId = (String) params.get(ViewDefinitionConstants.INPUT_CHANNEL_ID);
		ViewManager viewmgr = new ViewManager();

		// If Widget Id is not provided, then thrown an error as this is needed
		// for this action processing.
		if ((widgetId == null) || (widgetId.length() == 0))
			return getErrorReply(inputVector);

		// At this point in time, there is a widget Id.
		try
		{
			CanvasViewEntlVO entlvo = getViewEntitlementVO(gcifNo, userNo, sUserRole);

			// Step 1: Ask the View Manager to provide the list of all Views
			// corresponding to the Widget Id.
			ArrayList allViews = (ArrayList) viewmgr.getViewListForUser(widgetId, entlvo);
			headerMap.put(ViewDefinitionConstants.HEADER_KEY_VIEWS_LIST, allViews);

			// Step 2: Get the default view id and get the view definition meta
			// data for that view.
			Iterator<HashMap> viewsIterator = allViews.iterator();
			while (viewsIterator.hasNext())
			{
				aRowMap = viewsIterator.next();
				defaultInd = (String) aRowMap.get(ViewDefinitionConstants.FLD_DEFAULT);
				if (ViewDefinitionConstants.VAL_BOOL_YES.intern() == defaultInd.intern())
				{
					defaultViewId = (String) aRowMap.get(ViewDefinitionConstants.FLD_VIEW_ID);
					break;
				}
			}
			LOGGER.ctinfo("CTVDF00110", widgetId, defaultViewId);
			if (params.containsKey(ViewDefinitionConstants.APPLICABLE_TOOLS))
			{
				headerMap.put(ViewDefinitionConstants.APPLICABLE_TOOLS,
						params.get(ViewDefinitionConstants.APPLICABLE_TOOLS));
			}
			// Get the view definition information for the default view and
			// populate into the header map.
			populateViewDefinitionInto(headerMap, widgetId, defaultViewId, inputVector);

			List contextList = viewmgr.getContextMenus(widgetId, gcifNo, userNo, (String) params.get("deviceType"),
					sChannelId, sUserRole);
			LOGGER.ctdebug("CTVDF00111", contextList);
			headerMap.put(ViewDefinitionConstants.VIEW_CONTEXT_LIST, contextList);
			LOGGER.ctdebug("CTVDF00112", headerMap);

			// Now construct the reply Object.
			reply = new ExtReplyObject();
			reply.headerMap = headerMap;
			// Populate the last updated date / time into the reply object.
			populateLastUpdatedDateTimeInto(reply);

		} catch (ViewDefinitionException vde)
		{
			LOGGER.cterror("CTVDF00113", vde, widgetId);
			// Since the method signature does not allow us to throw an
			// exception, This is being eaten and instead null
			// is being returned.
		}

		LOGGER.ctinfo("CTVDF00115", reply);
		return reply;
	}

	/**
	 * This is a helper method that populates a View definition data into the standard keys in the header map provided.
	 * If the view definition has a rate card applicable then the list of currencies from that rate card are also
	 * populated in the key CCY_LIST
	 * 
	 * @param headerMap The header map that will be returned back to the client
	 * @param widgetId The widget for which this view is being loaded.
	 * @param viewId The view id for which definition needs to be fetched
	 * @param inputVector The input request to this handler
	 * @throws ViewDefinitionException Thrown if any error occurs while accessing the view definition
	 */
	private void populateViewDefinitionInto(HashMap headerMap, String widgetId, String viewId, Vector inputVector)
			throws ViewDefinitionException
	{
		// First read the necessary set of attributes from the input Vector.
		ViewManager viewmgr = new ViewManager();

		// Step 1: Ask the View Manager to get the view definition for the given
		// view.
		ViewDefinition viewDefn = viewmgr.getViewDefinition(widgetId, viewId, headerMap);
		if (viewDefn == null)
		{
			return;
		}
		headerMap.put(ViewDefinitionConstants.HEADER_KEY_VIEW_METADATA, viewDefn.getViewDefinitionAsMap());

		// Step 2: Check if the View says that it requires a rate card. If yes,
		// then the client may require the list
		// of currencies for which the rate card is applicable. So try to fetch
		// this information.
		ViewDefinitionPreferences viewPrefs = viewDefn.getViewPreferences();
		if (viewPrefs != null)
		{
			if (viewPrefs.isRateCardAvailableInd())
			{
				// Need to implement the rate card implementation
			}
		}
	}

	/**
	 * This is a helper method that creates a default error reply with predefined error codes
	 * 
	 * @param inputVector The input received by the handler
	 * @return The error reply object
	 */
	private ReplyObject getErrorReply(Vector inputVector)
	{
		String errorCode = FrameworkConstants.ERROR_SYSTEM_ERROR;
		ExtReplyObject reply = new ExtReplyObject();
		String strLocale = (String) inputVector.get(TIConstants.LANGID_INDEX_IN_VECTOR);
		// Construct the error message as per the local language preference of
		// the user.
		String errorMessage = MessageManager.getMessage(null, errorCode, strLocale);
		// Put the error code and message into the header map
		reply.headerMap = new HashMap();
		reply.headerMap.put(FrameworkConstants.KEY_ERROR_CODE, errorCode);
		reply.headerMap.put(FrameworkConstants.KEY_ERROR_MESSAGE, errorMessage);
		return reply;
	}

	/**
	 * Helper method that populates the last updated date time into the header.
	 * 
	 * @param reply The reply object into which the last updated date time needs to be added
	 */
	private void populateLastUpdatedDateTimeInto(ExtReplyObject reply)
	{
		Date currentDate = new Date();
		String dateAsString = DateFormatterManager.getDateAndTimeString(
				ViewDefinitionConstants.DEFAULT_DATE_TIME_FORMAT, currentDate);
		if (reply.headerMap == null)
			reply.headerMap = new HashMap();
		reply.headerMap.put(ViewDefinitionConstants.HEADER_KEY_LAST_UPDATED_DATE_TIME, dateAsString);
	}

	/**
	 * This method returns the ext reply object for APPSTORE_INIT_ACTION.
	 * 
	 * The headerMap contains the following details,
	 * 
	 * WIDGET_META_DATA - The widget meta data for the available widgets for the user according to their entitlement.
	 * PRODUCT_CATEGORY_WIDGETS_MAP - The valid/available widgets with product categories.<br/>
	 * LAYOUT_CATAGORIES - The available catagories like Stack, Two-Column and Three-Column. The values are getting from
	 * orbionedirect.properties,<br/>
	 * VALID_LAYOUT_CATAGORIES_FOR_APPSTORE=Stack,Two-Column,Three-Column.
	 * 
	 * SELECTED_WORKSPACE - If the request contains the workspace Id, the workspace details as Map.
	 * 
	 * @param inputVector - the input vector
	 * @return ExtReplyObject with status flag
	 * @throws ViewDefinitionException will be raised when any error/exception occurred.
	 */
	private ExtReplyObject processAppStoreInitActionRequest(final Vector inputVector) throws ViewDefinitionException
	{
		LOGGER.ctinfo("CTVDF00115");
		ExtReplyObject replyObject = null;
		try
		{
			PerformanceTimer perfTimer = new PerformanceTimer();
			perfTimer.startTimer("ViewDefinitionRequestHandler.processAppStoreInitActionRequest");
			final String gcifNo = (String) inputVector.get(TIConstants.GCIF_INDEX_IN_VECTOR);
			final String userNo = (String) inputVector.get(TIConstants.USER_NO_INDEX_IN_VECTOR);

			Map paramsMap = getAugmentedCachedHashMap(inputVector);
			ViewManager viewManager = new ViewManager();
			final String sUserRole = (String) paramsMap.get(ViewDefinitionConstants.INPUT_USER_ROLE);
			final String sChannelId = (String) paramsMap.get(ViewDefinitionConstants.INPUT_CHANNEL_ID);
			/**
			 * Getting the widgets which all are the current user can accessible. - WIDGET_META_DATA
			 * */
			LOGGER.ctdebug("CTVDF00116");
			List allWidgets = viewManager.getAllWidgets(userNo, gcifNo, sChannelId, sUserRole);

			/**
			 * Getting product category versus widgets map.
			 * */
			LOGGER.ctdebug("CTVDF00117");
			Map productCategoryWidgetsMap = viewManager
					.productCategoryWidgetsMap(userNo, gcifNo, sChannelId, sUserRole);

			/**
			 * All the available widgets are grouped as one map in result map (key - ALL) if the
			 * orbionedirect.properties file contains the following entry "INCLUDE_ALL_CATAGORY_IN_APPSTORE = Y",
			 * otherwise not.
			 */

			ConfigurationManager configMgr = ConfigurationManager.getInstance();
			SystemPreferenceDescriptor sysPref = configMgr.getSystemPrefDescriptor();

			if (sysPref.getStrIncludeAllCategoriesAppstore())
			{
				if (allWidgets != null)
				{
					Map workspaceMap = viewManager.buildProductCategoryWidgetIdsMap(ViewDefinitionConstants.ALL,
							ViewDefinitionConstants.LBL_ALL_WIDGETS, allWidgets);
					productCategoryWidgetsMap.put(ViewDefinitionConstants.ALL_WIDGETS, workspaceMap);
				}
			}

			replyObject = new ExtReplyObject();
			replyObject.headerMap = new HashMap();

			String workspaceId = (String) paramsMap.get(ViewDefinitionConstants.PARAM_WORKSPACE_ID);
			LOGGER.ctdebug("CTVDF00118", workspaceId);
			/**
			 * If the workspaceId is given by the user, fetch the workspace details including the layouts and widgets.
			 * This flow will execute when the user load the existing workspace to UPDATE.
			 * */
			if (workspaceId != null && workspaceId.trim().length() > 0)
			{
				LOGGER.ctdebug("CTVDF00119");
				WorkspaceDefinition workspaceDefinition = viewManager.getWorkspaceDefinition(userNo, gcifNo,
						workspaceId);
				/**
				 * Setting the workspace details in the reply object for UPDATE flow.
				 * */
				replyObject.headerMap.put(ViewDefinitionConstants.SELECTED_WORKSPACE,
						workspaceDefinition.getWorkspaceDefinitionAsMap());
			}

			/**
			 * Building the widgetsMap (widget id as key and widget as value) and setting to the reply object.
			 * */
			replyObject.headerMap.put(ViewDefinitionConstants.WIDGET_META_DATA, buildWidgetMap(allWidgets));
			replyObject.headerMap.put(ViewDefinitionConstants.PRODUCT_CATEGORY_WIDGETS_MAP, new ArrayList(
					productCategoryWidgetsMap.values()));
			replyObject.headerMap.put(ViewDefinitionConstants.LAYOUT_CATAGORIES, layoutCatagories);
			replyObject.headerMap.put(FrameworkConstants.SUCCESS, ViewDefinitionConstants.VAL_BOOL_TRUE);
			perfTimer.endTimer();
		} catch (ViewDefinitionException exception)
		{
			LOGGER.cterror("CTVDF00120", exception);
			throw new ViewDefinitionException(exception);
		}
		LOGGER.ctinfo("CTVDF00121");
		return replyObject;
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
		LOGGER.ctinfo("CTVDF00122");
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

	/**
	 * This methods stores the workspace details to database.
	 * 
	 * If the input params contains workspaceid, it will take it as update operation. For workspace update, it will
	 * delete the old entries and add a new workspace with the given workspace id. It validates the user inputs and if
	 * the validation is success, it saves the workspace into db otherwise add the error message in reply object.
	 * 
	 * If it loads in SIMULATION MODE, it will add a record in OD_AUDIT table and will not do any other db changes
	 * related with workspace. If it loads in NON SIMULATION MODE is will insert the given workspace details in the
	 * following tables.
	 * 
	 * 1. WORKSPACE_DEFINITION 2. WORKSPACE_MENU_DEFINITION 3. LAYOUT_DEFINITION 4. WORKSPACE_LAYOUT_MAPPING and 5.
	 * LAYOUT_WIDGET_MAPPING.
	 * 
	 * It adds an entry in OD_AUDIT table of auditing.
	 * 
	 * If the workspace is already exists in database, it will remove the related entries and insert a new one.
	 * 
	 * @param inputVector - the input vector
	 * @return ExtReplyObject with status flag
	 * @throws ViewDefinitionException will be raised when any error/exception occurred.
	 */
	private ExtReplyObject processAppStoreSaveActionRequest(final Vector inputVector) throws ViewDefinitionException
	{
		LOGGER.ctinfo("CTVDF00123");
		ExtReplyObject replyObject = null;
		try
		{
			PerformanceTimer perfTimer = new PerformanceTimer();
			perfTimer.startTimer("ViewDefinitionRequestHandler.processAppStoreSaveActionRequest");
			String gcifNo = (String) inputVector.get(TIConstants.GCIF_INDEX_IN_VECTOR);
			String userNo = (String) inputVector.get(TIConstants.USER_NO_INDEX_IN_VECTOR);
			Map paramsMap = getAugmentedCachedHashMap(inputVector);
			paramsMap.put("REQ_HEADER_DATA", inputVector.get(TIConstants.VALUE_VECTOR_21));
			paramsMap.put("SESSION_ID", inputVector.get(0));
			String workspaceId = null;
			ViewDefinitionInstruction VDFInstruction = null;

			workspaceId = (String) paramsMap.get(ViewDefinitionConstants.PARAM_WORKSPACE_ID);
			LOGGER.ctdebug("CTVDF00124", workspaceId);
			boolean isUpdateAction = workspaceId != null;

			/**
			 * Step 1: Validating the user input to Save workspace.
			 * */
			LOGGER.ctdebug("CTVDF00125");
			replyObject = performAppStoreValidation(inputVector, workspaceId);

			if (replyObject.sErrTxn == null || replyObject.sErrTxn.length == 0)
			{
				/**
				 * Step 2: Validation succeeded. Construct the workspaceDefinition object from the input params.
				 * */
				LOGGER.ctdebug("CTVDF00126");
				WorkspaceDefinition workspaceDefinition = constructWorkspaceDefinition(inputVector);

				/**
				 * Step 3: Getting the Simulation mode details. If its simulation mode, no transaction will be
				 * performed.
				 * */
				boolean isSimulationMode = isSimulationMode(inputVector);

				if (!isSimulationMode)
				{
					if (replyObject.headerMap == null)
					{
						replyObject.headerMap = new HashMap();
					}
					UserTransaction userTransaction = DataManager.getUserTransaction();
					/**
					 * Step 4: Begin the transaction
					 * */
					if (userTransaction != null)
					{
						userTransaction.begin();
					}

					/**
					 * Step 5: Deleting the workspace details if it is update action.
					 * */
					ViewManager viewManager = new ViewManager();
					if (isUpdateAction)
					{
						LOGGER.ctdebug("CTVDF00127", workspaceId);
						VDFInstruction = new ViewDefinitionInstruction();
						List dycMetaDataList = VDFInstruction.getDYCCanvasMetadata(workspaceId);
						populateDYCDataForAudit(dycMetaDataList, paramsMap);
						viewManager.deleteWorkspaceDefinition(userNo, gcifNo, workspaceId);

					}
					/**
					 * Step 6: Inserting the workspace details to database.
					 * */
					LOGGER.ctdebug("CTVDF00128");
					viewManager.saveWorkspaceDefinition(workspaceDefinition);
					/**
					 * Step 7: Commit the transaction
					 * */
					if (userTransaction != null)
					{
						raiseEventForDYC((HashMap) paramsMap, isUpdateAction, false); // raise event for DYC
						userTransaction.commit();
					}
					/**
					 * Step 8: Constructing the reply map.
					 * */
					LOGGER.ctdebug("CTVDF00129");
					replyObject.headerMap.put(FrameworkConstants.SUCCESS, ViewDefinitionConstants.VAL_BOOL_TRUE);

					replyObject.headerMap.put(ViewDefinitionConstants.PARAM_WORKSPACE_ID,
							workspaceDefinition.getWorkspaceId());

				} else
				{
					/**
					 * Step 9: Setting the appropriate message if it is in simulation mode.
					 * */
					LOGGER.ctdebug("CTVDF00130");
					String actionMessage = MessageManager.getMessage(FrameworkConstants.BUNDLE_CANVAS_DEFAULT,
							"APPSTORE_SAVE_SIMULATION", FrameworkConstants.DEFAULT_LOCALE);
					replyObject = getSimulationModeReplyObj(actionMessage);
				}

				/**
				 * Step 10: Auditing the event. If the workspaceId is null, it will take it as save action otherwise it
				 * will take is as update action.
				 * */
				if (workspaceId == null)
				{
					LOGGER.ctdebug("CTVDF00131", ViewDefinitionConstants.ACTION_APPSTORE_SAVE);
					// auditEvent(inputVector, ViewDefinitionConstants.ACTION_APPSTORE_SAVE);
				} else
				{
					LOGGER.ctdebug("CTVDF00131", ViewDefinitionConstants.ACTION_APPSTORE_UPDATE);
				}
			} else
			{
				LOGGER.ctdebug("CTVDF00132");
			}
			perfTimer.endTimer();
		} catch (ViewDefinitionException exception)
		{
			handleException(exception, replyObject, "processAppStoreSaveActionRequest");
		} catch (SecurityException exception)
		{
			handleException(exception, replyObject, "processAppStoreSaveActionRequest");
		} catch (IllegalStateException exception)
		{
			handleException(exception, replyObject, "processAppStoreSaveActionRequest");
		} catch (RollbackException exception)
		{
			handleException(exception, replyObject, "processAppStoreSaveActionRequest");
		} catch (HeuristicMixedException exception)
		{
			handleException(exception, replyObject, "processAppStoreSaveActionRequest");
		} catch (HeuristicRollbackException exception)
		{
			handleException(exception, replyObject, "processAppStoreSaveActionRequest");
		} catch (SystemException exception)
		{
			handleException(exception, replyObject, "processAppStoreSaveActionRequest");
		} catch (NotSupportedException exception)
		{
			handleException(exception, replyObject, "processAppStoreSaveActionRequest");
		}
		LOGGER.ctinfo("CTVDF00133");
		return replyObject;
	}

	/**
	 * Returns ExtReplyObject after setting for required parameter for simulation mode in the header map
	 * 
	 * @param void
	 * @return ExtReplyObject after setting required parameter for simulation mode in the header map
	 */
	protected ExtReplyObject getSimulationModeReplyObj(String action)
	{
		String cmName = "getSimulationModeReplyObj";
		LOGGER.ctinfo("CTVDF00134", cmName);
		ExtReplyObject tmpExtReply = new ExtReplyObject();
		tmpExtReply.headerMap = new HashMap<String, String>();
		tmpExtReply.headerMap.put(FrameworkConstants.SIMULATION_SUCCESS_FLAG, FrameworkConstants.TRUE);
		tmpExtReply.headerMap.put(FrameworkConstants.SUCCESS, FrameworkConstants.TRUE);
		tmpExtReply.headerMap.put(FrameworkConstants.SUBMIT_SUCCESS, FrameworkConstants.YES_Y);
		tmpExtReply.headerMap.put(FrameworkConstants.RESPONSE_ACTION, action);
		LOGGER.ctinfo("CTVDF00135", cmName, tmpExtReply);
		return tmpExtReply;
	}

	/**
	 * This methods delete the workspace details from database.
	 * 
	 * It performs the validation for delete action. It validation succeeds it will delete the workspace otherwise add
	 * the error message in replyObject.
	 * 
	 * It audits the changes in database.
	 * 
	 * If it loads in SIMULATION MODE it will not do any db changes.
	 * 
	 * If it loads in NON SIMULATION MODE it will remove the necessary entries from the following tables.
	 * 
	 * 1. WORKSPACE_DEFINITION <br/>
	 * 2. WORKSPACE_MENU_DEFINITION <br/>
	 * 3. LAYOUT_DEFINITION <br/>
	 * 4. WORKSPACE_LAYOUT_MAPPING and <br/>
	 * 5. LAYOUT_WIDGET_MAPPING.
	 * 
	 * @param inputVector - the input vector
	 * @return ExtReplyObject - reply object with status flag
	 * @throws ViewDefinitionException will be raised when any error/exception occurred.
	 */
	private ExtReplyObject processAppStoreDeleteActionRequest(final Vector inputVector) throws ViewDefinitionException
	{
		LOGGER.ctinfo("CTVDF00136");
		ExtReplyObject replyObject = null;
		boolean deleteSuccess = false;
		UserTransaction userTransaction = null;

		try
		{
			PerformanceTimer perfTimer = new PerformanceTimer();

			perfTimer.startTimer("ViewDefinitionRequestHandler.processAppStoreDeleteActionRequest");
			String gcifNo = (String) inputVector.get(TIConstants.GCIF_INDEX_IN_VECTOR);
			String userNo = (String) inputVector.get(TIConstants.USER_NO_INDEX_IN_VECTOR);

			/**
			 * Step 1: Fetching the input params from the input vector.
			 * */
			Map paramsMap = getAugmentedCachedHashMap(inputVector);
			paramsMap.put("REQ_HEADER_DATA", inputVector.get(TIConstants.VALUE_VECTOR_21));
			paramsMap.put("SESSION_ID", inputVector.get(0));
			ViewDefinitionInstruction VDFInstruction = null;

			String workspaceId = (String) paramsMap.get(ViewDefinitionConstants.PARAM_WORKSPACE_ID);
			LOGGER.ctdebug("CTVDF00137", workspaceId);
			/**
			 * Step 2: Validating the user input to delete workspace.
			 * */
			replyObject = performAppStoreValidation(inputVector, workspaceId);

			if (replyObject.sErrTxn == null || replyObject.sErrTxn.length == 0)
			{
				LOGGER.ctdebug("CTVDF00138");
				/**
				 * Step 3: Validation succeeded. Getting the Simulation mode details. If its simulation mode, no
				 * transaction will be performed.
				 * */
				boolean isSimulationMode = isSimulationMode(inputVector);

				if (!isSimulationMode)
				{
					if (replyObject.headerMap == null)
					{
						replyObject.headerMap = new HashMap();
					}
					ViewManager viewManager = new ViewManager();
					int rowsDeleted = 0;
					userTransaction = DataManager.getUserTransaction();
					/**
					 * Step 4: Begin the transaction
					 * */
					if (userTransaction != null)
					{
						userTransaction.begin();
					}
					/**
					 * Step 5: Inserting the workspace details to db.
					 * */
					VDFInstruction = new ViewDefinitionInstruction();
					List dycMetaDataList = VDFInstruction.getDYCCanvasMetadata(workspaceId);
					populateDYCDataForAudit(dycMetaDataList, paramsMap);
					LOGGER.ctdebug("CTVDF00139", workspaceId);
					rowsDeleted = viewManager.deleteWorkspaceDefinition(userNo, gcifNo, workspaceId);
					raiseEventForDYC((HashMap) paramsMap, false, true); // raising event for deletion of canvas
					/**
					 * Step 6: Commit the transaction
					 **/
					if (userTransaction != null)
					{
						userTransaction.commit();
						userTransaction = null;
					}
					deleteSuccess = true;
					/**
					 * Step 7: Setting the status in the result.
					 * */
					if (rowsDeleted > 0)
					{
						replyObject.headerMap.put(FrameworkConstants.SUCCESS, ViewDefinitionConstants.VAL_BOOL_TRUE);
						LOGGER.ctdebug("CTVDF00140", workspaceId);
					} else
					{
						replyObject.headerMap.put(FrameworkConstants.SUCCESS, ViewDefinitionConstants.VAL_BOOL_FALSE);
						LOGGER.ctdebug("CTVDF00141", workspaceId);
					}
				} else
				{
					/**
					 * Step 8: Setting the proper message if it is in simulation mode.
					 * */
					LOGGER.ctdebug("CTVDF00142");
					String actionMessage = MessageManager.getMessage(FrameworkConstants.BUNDLE_CANVAS_DEFAULT,
							"APPSTORE_DELETE_SIMULATION", FrameworkConstants.DEFAULT_LOCALE);
					replyObject = getSimulationModeReplyObj(actionMessage);
				}

				/**
				 * Step 9: Auditing the workspace definition delete event
				 * */
				// auditEvent(inputVector, ViewDefinitionConstants.ACTION_APPSTORE_DELETE);

			} else
			{
				LOGGER.ctdebug("CTVDF00132");
			}

			perfTimer.endTimer();

		} catch (ViewDefinitionException exception)
		{
			handleException(exception, replyObject, "processAppStoreDeleteActionRequest");
		} catch (Exception exception)
		{
			handleException(exception, replyObject, "processAppStoreDeleteActionRequest");
		} finally
		{
			if (!deleteSuccess && userTransaction != null)
			{
				try
				{
					userTransaction.rollback();
				} catch (Exception e)
				{
					// Error while rolling back transaction
					throw new ViewDefinitionException(e);
				}
			}
		}
		LOGGER.ctinfo("CTVDF00144");
		return replyObject;
	}

	/**
	 * This method constructs a WorkspaceDefinition object from the user inputs.
	 * 
	 * If the workspace is new, it will set random id for the workspace.
	 * 
	 * @param inputVector - the input vector
	 * @return workspace definition object
	 * @throws ViewDefinitionException will be raised when any error/exception occurred.
	 */
	private WorkspaceDefinition constructWorkspaceDefinition(final Vector inputVector) throws ViewDefinitionException
	{
		LOGGER.ctinfo("CTVDF00143");
		WorkspaceDefinition workspaceDefinition = new WorkspaceDefinition();
		String gcifNo = (String) inputVector.get(TIConstants.GCIF_INDEX_IN_VECTOR);
		String userNo = (String) inputVector.get(TIConstants.USER_NO_INDEX_IN_VECTOR);
		String productcode = (String) inputVector.get(TIConstants.PROD_CODE_INDEX_IN_VECTOR);
		String subProductcode = (String) inputVector.get(TIConstants.SUBPROD_CODE_INDEX_IN_VECTOR);

		/**
		 * Step 1: Fetching the input params from the input vector.
		 * */
		Map paramsMap = getAugmentedCachedHashMap(inputVector);

		if (paramsMap != null)
		{
			String workspaceId = (String) paramsMap.get(ViewDefinitionConstants.PARAM_WORKSPACE_ID);

			/**
			 * Step 2: If the workspace is new, construct the random id for workspace id.
			 * */
			if (workspaceId == null || workspaceId.trim().length() == 0)
			{
				workspaceId = UUID.randomUUID().toString();
			}
			workspaceDefinition.setWorkspaceId(workspaceId);
			workspaceDefinition.setUserNumber(userNo);
			workspaceDefinition.setGCIF(gcifNo);
			workspaceDefinition.setWorkspaceLayout((String) paramsMap
					.get(ViewDefinitionConstants.PARAM_WORKSPACE_LAYOUT));
			workspaceDefinition.setWorkspaceDisplayName((String) paramsMap
					.get(ViewDefinitionConstants.PARAM_WORKSPACE_DISPLAY_NM));
			workspaceDefinition.setProduct(productcode);
			workspaceDefinition.setSubProduct(subProductcode);

			String isSystemWorkspace = (String) paramsMap.get(ViewDefinitionConstants.PARAM_SYSTEM_WORKSPACE_IND);
			if (isSystemWorkspace == null)
			{
				isSystemWorkspace = ViewDefinitionConstants.VAL_BOOL_NO;
			}
			workspaceDefinition.setSystemWorkspaceInd(isSystemWorkspace);
			workspaceDefinition.setWorkspaceActivateHandler((String) paramsMap
					.get(ViewDefinitionConstants.PARAM_WORKSPACE_ACTIVE_HANDLER)); // null
			workspaceDefinition.setCustomSpaceBlockPosition((String) paramsMap
					.get(ViewDefinitionConstants.PARAM_CUSTOMSPACE_BLOCKPOSITION));

			String channel_ID = (String) paramsMap.get(ViewDefinitionConstants.INPUT_CHANNEL_ID);
			if (channel_ID != null)
			{
				if (channel_ID.equals("3"))
					workspaceDefinition.setChannelId("A");
			}
			if ((String) paramsMap.get(ViewDefinitionConstants.PARAM_BUNDLE_KEY) == null)
				workspaceDefinition.setBundleKey("canvas-default");
			workspaceDefinition.setIsTFDRequired((String) paramsMap.get(ViewDefinitionConstants.PARAM_TFD_REQ));

			/**
			 * Step 3: Construct the layout definition list and set to the workspace definition object.
			 * */
			List layoutDefinitionList = constructLayoutDefinitionList(workspaceId, inputVector);
			workspaceDefinition.setLayoutDefinitions(layoutDefinitionList);
		}

		LOGGER.ctinfo("CTVDF00143");
		return workspaceDefinition;
	}

	/**
	 * This method constructs the Layout Definition list from input params and returns the same.
	 * 
	 * The Layout id is generated with the workspace id as follows: LYT_<LAYOUT_POSITION>_<WORKSPACE_ID>
	 * 
	 * @param workspaceId to construct the layout id and set into layout definition object.
	 * @param inputVector - input vector
	 * @return list of layout definitions
	 */
	private List constructLayoutDefinitionList(final String workspaceId, final Vector inputVector)
	{
		LOGGER.ctinfo("CTVDF00145");
		List layoutList = new ArrayList();
		/**
		 * Step 1: Fetching the input params and gcif, userNo, product and subproduct from the input vector.
		 * */

		String gcifNo = (String) inputVector.get(TIConstants.GCIF_INDEX_IN_VECTOR);
		String userNo = (String) inputVector.get(TIConstants.USER_NO_INDEX_IN_VECTOR);
		String productcode = (String) inputVector.get(TIConstants.PROD_CODE_INDEX_IN_VECTOR);
		String subProductcode = (String) inputVector.get(TIConstants.SUBPROD_CODE_INDEX_IN_VECTOR);
		Map paramsMap = getAugmentedCachedHashMap(inputVector);
		String layoutCategory = null;
		String layoutDisplayName = null;
		List layouts = (List) paramsMap.get(ViewDefinitionConstants.PARAM_CHILD_LAYOUTS);
		Map childWidgetsMap = null;
		int position = 0;
		String layoutId = null;
		/**
		 * Step 2: iterating the layouts and add construct the layout definitions to add in layout definition list.
		 * */
		for (Object object : layouts)
		{
			Map layoutMap = (Map) object;
			LayoutDefinition layoutDefinition = new LayoutDefinition();
			/**
			 * Step 3: Constructing the layout id.
			 * */
			layoutId = ViewDefinitionConstants.LAYOUT_ID_PREFIX + (++position) + "_" + workspaceId;
			layoutDefinition.setLayoutId(layoutId);
			layoutDisplayName = (String) layoutMap.get(ViewDefinitionConstants.PARAM_LAYOUT_DISPLAY_NM);

			layoutDefinition.setLayoutDisplayName(layoutDisplayName);
			layoutDefinition.setWorkspaceId(workspaceId);
			layoutDefinition.setGCIF(gcifNo);
			layoutDefinition.setUserNumber(userNo);
			layoutDefinition.setProduct(productcode);
			layoutDefinition.setSubProduct(subProductcode);
			layoutCategory = (String) layoutMap.get(ViewDefinitionConstants.PARAM_LAYOUT_CATAGORY);
			layoutDefinition.setLayoutCategory(layoutCategory);
			layoutDefinition.setProportion((String) layoutMap.get(ViewDefinitionConstants.PARAM_PROPORTION));
			layoutDefinition.setContextAppWidget((String) layoutMap
					.get(ViewDefinitionConstants.PARAM_CONTEXT_APP_WIDGET));
			layoutDefinition.setIsParentInd((String) layoutMap.get(ViewDefinitionConstants.PARAM_IS_PARENT_IND));
			if ((String) layoutMap.get(ViewDefinitionConstants.PARAM_BUNDLE_KEY) != null)
				layoutDefinition.setBundleKey((String) layoutMap.get(ViewDefinitionConstants.PARAM_BUNDLE_KEY));

			if ((String) layoutMap.get(ViewDefinitionConstants.PARAM_CHANNEL_ID) != null)
				layoutDefinition.setChannelId((String) layoutMap.get(ViewDefinitionConstants.PARAM_CHANNEL_ID));

			childWidgetsMap = (Map) layoutMap.get(ViewDefinitionConstants.PARAM_CHILD_WIDGETS);
			/**
			 * Step 4: Constructing the widget details and adding to the layout definition.
			 * */
			layoutDefinition.setWidgets(getWidgetsList(userNo, gcifNo, childWidgetsMap, layoutId, layoutCategory));
			layoutList.add(layoutDefinition);

		}
		LOGGER.ctinfo("CTVDF00145");
		return layoutList;
	}

	/**
	 * This method constructs the Layout-Widget map details and return as list.
	 * 
	 * It sets the Closed Indicator for the widget as "N" by default.
	 * 
	 * @param userNo - The current user no.
	 * @param gcifNo - GCIF
	 * @param widgetsMap - Which contains the maps
	 * @param layoutId - Layout ID
	 * @param layoutCategory - Layout Category
	 * @return list of layout-widget mapping list
	 */
	private List getWidgetsList(final String userNo, final String gcifNo, final Map widgetsMap, final String layoutId,
			final String layoutCategory)
	{
		LOGGER.ctinfo("CTVDF00146");
		List widgets = new ArrayList();
		int widgetPosition = 0;
		String widgetId = null;
		String blockPosition = null;
		List wgtList = null;
		for (Iterator wgtIter = widgetsMap.entrySet().iterator(); wgtIter.hasNext();)
		{
			Map.Entry mapEntry = (Map.Entry) wgtIter.next();
			blockPosition = (String) mapEntry.getKey();
			wgtList = (List) mapEntry.getValue();
			if (wgtList != null && !wgtList.isEmpty())
			{
				widgetPosition = 0;
				for (Iterator widgetIterator = wgtList.iterator(); widgetIterator.hasNext();)
				{
					widgetId = (String) widgetIterator.next();
					LayoutWidgetMapping wlMapping = new LayoutWidgetMapping();
					wlMapping.setLayoutId(layoutId);
					wlMapping.setWidgetId(widgetId);
					/**
					 * Increasing the widget position by 1.
					 * */
					wlMapping.setLayoutWidgetPosition(++widgetPosition);
					wlMapping.setBlockPosition(blockPosition);
					wlMapping.setClosedInd(ViewDefinitionConstants.VAL_BOOL_NO); // Default
																					// value
																					// "N".
					widgets.add(wlMapping);
				}
			}
		}
		LOGGER.ctinfo("CTVDF00146");
		return widgets;
	}

	/**
	 * This method logs the exception and throws ViewDefinitionException.
	 * 
	 * @param exception - exception object
	 * @param replyObject - reply object
	 * @param methodName - method name to log
	 * @throws ViewDefinitionException will be thrown by default
	 */
	private void handleException(final Exception exception, final ExtReplyObject replyObject, final String methodName)
			throws ViewDefinitionException
	{
		LOGGER.cterror("CTVDF00147", exception, methodName, exception.getClass());
		throw new ViewDefinitionException(exception);
	}

	/**
	 * This method performs necessary validation for the appstore related actions.
	 * 
	 * @param inputVector - input vector
	 * @param workspaceId - workspace id to identify whether Save or Update action
	 * @return extReplyObject - if validation failed, the error object will be returned otherwise success reply will be
	 *         returned.
	 * @throws ViewDefinitionException will be raised when any error/exception occurred.
	 */
	private ExtReplyObject performAppStoreValidation(final Vector inputVector, final String workspaceId)
			throws ViewDefinitionException
	{
		LOGGER.ctinfo("CTVDF00148");
		ExtReplyObject extReplyObject = new ExtReplyObject();

		String action = (String) inputVector.get(TIConstants.INPUT_ACTION_INDEX_IN_VECTOR);
		AppStoreUtil appStoreUtil = new AppStoreUtil();
		if (ViewDefinitionConstants.ACTION_APPSTORE_SAVE.equals(action))
		{
			if (workspaceId == null)
			{
				/**
				 * Validation for Save action.
				 * */
				LOGGER.ctdebug("CTVDF00149");
				extReplyObject = appStoreUtil.validateOnSave(inputVector);
			} else
			{
				/**
				 * Validation for Update action.
				 * */
				LOGGER.ctdebug("CTVDF00150");
				extReplyObject = appStoreUtil.validateOnUpdate(inputVector, workspaceId);
			}
		} else if (ViewDefinitionConstants.ACTION_APPSTORE_DELETE.equals(action))
		{
			/**
			 * Validation for delete action.
			 * */
			LOGGER.ctdebug("CTVDF00151");
			extReplyObject = appStoreUtil.validateOnDelete(inputVector, workspaceId);
		}
		LOGGER.ctinfo("CTVDF00153");
		return extReplyObject;
	}

	/**
	 * This method builds the widgets map from the given widget list. Key - WidgetId Value - Widget index
	 * 
	 * @param widgetList - list of widgets
	 * @return Map contains widget id and widget index
	 */
	private Map buildWidgetMap(final List widgetList)
	{
		if (widgetList == null)
		{
			return null;
		}
		Map resultMap = new HashMap();
		String widgetId = null;
		int count = 1;
		for (Iterator widgetIter = widgetList.iterator(); widgetIter.hasNext();)
		{
			Map widget = (Map) widgetIter.next();
			widgetId = (String) widget.get(ViewDefinitionConstants.PARAM_WIDGET_ID);
			widget.put(ViewDefinitionConstants.WGT_INDEX, count++);
			resultMap.put(widgetId, widget);
		}
		return resultMap;
	}

	/**
	 * Carrys out auditing of View definition framework related operations. Invokes audit helper classes of Data and
	 * Value to audit the operation. Constructs a audit value object and invokes data's insert to insert the record in
	 * audit table.
	 * 
	 * @param inputVector Vector Vector containing all request specific information
	 * @param action denotes the action to be performed - Save/Update/Delete.
	 * @throws OnlineException In case there is some problem in auditing
	 */
	protected final void auditEvent(Event event, final Vector inputVector, final String dataLoadStatus) throws OnlineException
	{
		LOGGER.ctdebug("CTVDF00153", inputVector);
		HashMap dataMap = null;
		HashMap auditDataMap = new HashMap();

		if (inputVector != null)
		{
			HashMap utilAuditDataMap = (HashMap) inputVector.get(TIConstants.VALUE_VECTOR_21);
			String productcode = (String) inputVector.get(TIConstants.PROD_CODE_INDEX_IN_VECTOR);
			String subProductcode = (String) inputVector.get(TIConstants.SUBPROD_CODE_INDEX_IN_VECTOR);
			String functioncode = (String) inputVector.get(TIConstants.FUNCTION_CODE_INDEX_IN_VECTOR);
			String gcif = (String) inputVector.get(TIConstants.GCIF_INDEX_IN_VECTOR);
			String userNo = (String) inputVector.get(TIConstants.USER_NO_INDEX_IN_VECTOR);
			HashMap paramsMap = (HashMap) getAugmentedCachedHashMap(inputVector);
			// String action = (String)
			// inputVector.get(TIConstants.INPUT_ACTION_INDEX_IN_VECTOR);
			LOGGER.ctdebug("CTVDF00154", productcode, subProductcode, functioncode);

			dataMap = (HashMap) getAugmentedCachedHashMap(inputVector);
			dataMap.put(EventHandlerFrameworkConstants.FLD_SESSION_ID, inputVector.get(0));
			dataMap.put(EventHandlerFrameworkConstants.FLD_USER_NO, userNo);
			dataMap.put(EventHandlerFrameworkConstants.FLD_GCIF, gcif);
			dataMap.put(EventHandlerFrameworkConstants.FLD_PARENT_GCIF, gcif);
			dataMap.put(EventHandlerFrameworkConstants.FLD_TRAN_REF_NO, "Transaction Ref");
			dataMap.put(EventHandlerFrameworkConstants.FLD_REFERENCE_NO, paramsMap.get("VIEW_ID"));
			dataMap.put(EventHandlerFrameworkConstants.FLD_REFERENCE_KEY,paramsMap.get("VIEW_ID") );
			dataMap.put(EventHandlerFrameworkConstants.FLD_PROD_CODE, productcode);
			dataMap.put(EventHandlerFrameworkConstants.FLD_SUB_PROD_CODE, subProductcode);
			dataMap.put(EventHandlerFrameworkConstants.FLD_FUNC_CODE, functioncode);
			dataMap.put(EventHandlerFrameworkConstants.EVENT_ID, event.getEventId());
			dataMap.put(EventHandlerFrameworkConstants.FLD_CHANNEL_ID,
					utilAuditDataMap.get(EventHandlerFrameworkConstants.FLD_CHANNEL_ID));
			dataMap.put(EventHandlerFrameworkConstants.FLD_APP_SERVER_IP,
					utilAuditDataMap.get(EventHandlerFrameworkConstants.FLD_APP_SERVER_IP));
			dataMap.put(EventHandlerFrameworkConstants.FLD_WEB_SERVER_IP,
					utilAuditDataMap.get(EventHandlerFrameworkConstants.FLD_WEB_SERVER_IP));
			dataMap.put(EventHandlerFrameworkConstants.FLD_BROWSER,
					utilAuditDataMap.get(EventHandlerFrameworkConstants.FLD_BROWSER_NAME));
			dataMap.put(EventHandlerFrameworkConstants.FLD_CLIENT_IP,
					utilAuditDataMap.get(EventHandlerFrameworkConstants.FLD_CLIENT_IP));
			dataMap.put(EventHandlerFrameworkConstants.FLD_LOGIN_ID,
					utilAuditDataMap.get(EventHandlerFrameworkConstants.FLD_LOGIN_ID));
			dataMap.put(EventHandlerFrameworkConstants.FLD_SIMULATION_USERID,
					utilAuditDataMap.get(EventHandlerFrameworkConstants.FLD_SIMULATION_USERID));
			dataMap.put(EventHandlerFrameworkConstants.FLD_SIMULATION_MODE,
					utilAuditDataMap.get(EventHandlerFrameworkConstants.FLD_SIMULATION_MODE));
			dataMap.put(EventHandlerFrameworkConstants.DEVICE_BAND_ID,
					utilAuditDataMap.get(EventHandlerFrameworkConstants.DEVICE_BAND_ID));
			dataMap.put(EventHandlerFrameworkConstants.USER_AGENT,
					utilAuditDataMap.get(EventHandlerFrameworkConstants.USER_AGENT));
			dataMap.put(EventHandlerFrameworkConstants.WORKSPACE_ID,
					paramsMap.get(EventHandlerFrameworkConstants.WORKSPACE_ID));
			dataMap.put(EventHandlerFrameworkConstants.LAYOUT_ID,
					paramsMap.get(EventHandlerFrameworkConstants.LAYOUT_ID));
			dataMap.put(EventHandlerFrameworkConstants.WIDGET_ID,
					paramsMap.get(EventHandlerFrameworkConstants.WIDGET_ID));
			dataMap.put(EventHandlerFrameworkConstants.GEO_LOCATION,paramsMap.get(EventHandlerFrameworkConstants.GEO_LOCATION));   // need to verify
			dataMap.put(EventHandlerFrameworkConstants.REQUEST_ID,
					utilAuditDataMap.get(EventHandlerFrameworkConstants.REQUEST_ID));
			dataMap.put(EventHandlerFrameworkConstants.REQUEST_URI,
					utilAuditDataMap.get(EventHandlerFrameworkConstants.REQUEST_URI));
			dataMap.put("DATA_LOAD_STATUS", dataLoadStatus);
			dataMap.put("PRINT_STATUS", dataLoadStatus);
			dataMap.put(EventHandlerFrameworkConstants.UDF1, paramsMap.get(EventHandlerFrameworkConstants.UDF1));
			dataMap.put(EventHandlerFrameworkConstants.UDF2, paramsMap.get(EventHandlerFrameworkConstants.UDF2));
			dataMap.put(EventHandlerFrameworkConstants.UDF3, paramsMap.get(EventHandlerFrameworkConstants.UDF3));
			dataMap.put(EventHandlerFrameworkConstants.UDF4, paramsMap.get(EventHandlerFrameworkConstants.UDF4));
			dataMap.put(EventHandlerFrameworkConstants.UDF5, paramsMap.get(EventHandlerFrameworkConstants.UDF5));
			dataMap.put(EventHandlerFrameworkConstants.UDF6, paramsMap.get(EventHandlerFrameworkConstants.UDF6));
			dataMap.put(EventHandlerFrameworkConstants.UDF7, paramsMap.get(EventHandlerFrameworkConstants.UDF7));
			dataMap.put(EventHandlerFrameworkConstants.UDF8, paramsMap.get(EventHandlerFrameworkConstants.UDF8));
			dataMap.put(EventHandlerFrameworkConstants.UDF9, paramsMap.get(EventHandlerFrameworkConstants.UDF9));
			dataMap.put(EventHandlerFrameworkConstants.UDF10, paramsMap.get(EventHandlerFrameworkConstants.UDF10));

			LOGGER.ctdebug("CTVDF00156", dataMap);

			auditDataMap.put(AuditConstants.MANDATORY_AUDIT_META_DATA, dataMap);
			auditDataMap.put(AuditConstants.MANDATORY_AUDIT_DATA_OLD_STATE, dataMap);
			auditDataMap.put(AuditConstants.MANDATORY_AUDIT_DATA_NEW_STATE, dataMap);
			LOGGER.ctdebug("CTVDF00158", auditDataMap);
			EventDispatcher eventDispatcher = EventDispatcher.getInstance();
			try
			{
				eventDispatcher.raiseEvent(event, auditDataMap);
			} catch (HandlerException e)
			{
				LOGGER.cterror("CTVDF00147", e, "HandlerException", this.getClass().getName() + ".auditEvent");
				throw new OnlineException(e);
			}
		}
	}

	/**
	 * This method returns list of available layout catagories. This value is getting from the
	 * VALID_LAYOUT_CATAGORIES_FOR_APPSTORE value in the orbionedirect.properties.
	 * 
	 * @return list of layout catagories.
	 */
	private static List getLayoutCatagoryList()
	{
		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		SystemPreferenceDescriptor sysPref = configMgr.getSystemPrefDescriptor();

		String[] appStoreLayoutCategories = sysPref.getStrValidLayoutCategoriesAppstore().split(",");
		List layoutCatagoriesList = new ArrayList();
		for (int i = 0; i < appStoreLayoutCategories.length; i++)
		{
			Map layoutMap = new HashMap();
			layoutMap.put(ViewDefinitionConstants.PARAM_LAYOUT_ID, appStoreLayoutCategories[i]);
			layoutCatagoriesList.add(layoutMap);
		}
		return layoutCatagoriesList;
	}

	/**
	 * This method is used to reset cache data
	 * 
	 * @param inputVector
	 * @return
	 * @throws ViewDefinitionException
	 */
	private ExtReplyObject processWidgetDataCacheResetRequest(final Vector inputVector) throws ViewDefinitionException
	{
		ExtReplyObject reply = null;
		Map paramsMap = getAugmentedCachedHashMap(inputVector);

		String widgetId = (String) paramsMap.get(ViewDefinitionConstants.PARAM_WIDGET_ID);
		String viewId = (String) paramsMap.get(ViewDefinitionConstants.VIEW_ID);
		String gcif = (String) inputVector.get(TIConstants.GCIF_INDEX_IN_VECTOR);
		String userNo = (String) inputVector.get(TIConstants.USER_NO_INDEX_IN_VECTOR);
		ViewManager viewManager = new ViewManager();
		ViewDefinition viewDefinition = viewManager.getViewDefinition(viewId);
		try
		{
			if (ViewDefinitionConstants.VAL_BOOL_YES.equals(viewDefinition.getIsDataCached())
					&& ViewDefinitionConstants.INSTANCE.equals(viewDefinition.getDataCacheScope()))
			{
				EhCacheDataUtil cacheUtil = new EhCacheDataUtil();

				cacheUtil.resetCache((String) paramsMap.get(ViewDefinitionConstants.INPUT_SESSION_ID), widgetId,
						viewId, userNo, gcif);
			}
		} catch (CBXCacheException cbxCacheExp)
		{
			throw new ViewDefinitionException(cbxCacheExp.getErrorCode(), cbxCacheExp);
		}

		reply = new ExtReplyObject();
		reply.headerMap = new HashMap();
		return reply;
	}

	/**
	 * It returns the list of valid layout catagories.
	 */
	private static List layoutCatagories = getLayoutCatagoryList();

	/**
	 * Helper method to raise event for DYC based on the flag isUpdation
	 * 
	 * @param Event Data Map
	 * 
	 * 
	 */

	private void raiseEventForDYC(HashMap inputMap, boolean isUpdation, boolean isDeletion)
	{
		Event dyc_event = null;
		HashMap eventData = new HashMap();
		HashMap prefMap = new HashMap();
		HashMap dyc_oldstate_data = null;
		ViewDefinitionInstruction viewIns = new ViewDefinitionInstruction();
		HashMap reqHeaderMap = (HashMap) inputMap.get("REQ_HEADER_DATA");
		prefMap.put(EventHandlerFrameworkConstants.FLD_USER_NO, inputMap.get(JSPIOConstants.INPUT_USER_NO));
		prefMap.put(EventHandlerFrameworkConstants.FLD_GCIF, inputMap.get(JSPIOConstants.INPUT_GCIF));
		prefMap.put(EventHandlerFrameworkConstants.FLD_SESSION_ID,
				inputMap.get(EventHandlerFrameworkConstants.FLD_SESSION_ID));
		prefMap.put(EventHandlerFrameworkConstants.FLD_REFERENCE_NO, EventHandlerFrameworkConstants.FLD_NOT_AVAILABLE);
		prefMap.put(EventHandlerFrameworkConstants.FLD_CHANNEL_ID,
				reqHeaderMap.get(EventHandlerFrameworkConstants.FLD_CHANNEL_ID));
		prefMap.put(EventHandlerFrameworkConstants.FLD_APP_SERVER_IP,
				reqHeaderMap.get(EventHandlerFrameworkConstants.FLD_APP_SERVER_IP));
		prefMap.put(EventHandlerFrameworkConstants.FLD_WEB_SERVER_IP,
				reqHeaderMap.get(EventHandlerFrameworkConstants.FLD_WEB_SERVER_IP));
		prefMap.put(EventHandlerFrameworkConstants.FLD_BROWSER,
				reqHeaderMap.get(EventHandlerFrameworkConstants.FLD_BROWSER_NAME));
		prefMap.put(EventHandlerFrameworkConstants.FLD_CLIENT_IP,
				reqHeaderMap.get(EventHandlerFrameworkConstants.FLD_CLIENT_IP));
		prefMap.put(EventHandlerFrameworkConstants.FLD_LOGIN_ID,
				reqHeaderMap.get(EventHandlerFrameworkConstants.FLD_LOGIN_ID));
		ResourceBundle rb = null;
		if (!isDeletion)
		{
			ArrayList widList = (ArrayList) inputMap.get(ViewDefinitionConstants.PARAM_CHILD_LAYOUTS);
			HashMap childlayouts = (HashMap) widList.get(0);

			prefMap.put(ViewDefinitionConstants.PARAM_WORKSPACE_DISPLAY_NM,
					inputMap.get(ViewDefinitionConstants.PARAM_WORKSPACE_DISPLAY_NM));
			prefMap.put(ViewDefinitionConstants.PARAM_WORKSPACE_LAYOUT,
					inputMap.get(ViewDefinitionConstants.PARAM_WORKSPACE_LAYOUT));
			prefMap.put(ViewDefinitionConstants.SUB_WORKSPACE_LAYOUT,
					childlayouts.get(ViewDefinitionConstants.LAYOUT_CATAGORY));

			HashMap childApp = (HashMap) childlayouts.get(ViewDefinitionConstants.PARAM_CHILD_WIDGETS);
			int i = 0;
			List tmpApplistHolder = new ArrayList();
			String appId;
			String langId = (String) inputMap.get(ViewDefinitionConstants.INPUT_LANGUAGE_ID);
			if (langId == null)
			{
				langId = "en_US";
			}
			for (i = 0; i < ((List) childApp.get(ViewDefinitionConstants.LEFT)).size(); i++)
			{
				HashMap tmpAppHolder = new HashMap(); // temporary hashmap for holding the app id and postion
				tmpAppHolder.put(ViewDefinitionConstants.LEFT_POSITION, i + 1);
				appId = (String) ((List) childApp.get(ViewDefinitionConstants.LEFT)).get(i);
				tmpAppHolder.put(ViewDefinitionConstants.LEFT_APP, appId);
				HashMap appNameMap = null;
				String displayName = null;
				try
				{
					appNameMap = viewIns.getAppinfo(appId);
					rb = ResourceBundle.getBundle((String) appNameMap.get(ViewDefinitionConstants.BUNDLE_KEY) + "_"
							+ langId);
					displayName = rb.containsKey((String) appNameMap.get(ViewDefinitionConstants.FLD_VIEW_NAME)) ? rb
							.getString((String) appNameMap.get(ViewDefinitionConstants.FLD_VIEW_NAME))
							: (String) appNameMap.get(ViewDefinitionConstants.FLD_VIEW_NAME);
				}

				catch (Exception ex)
				{
					LOGGER.cterror("CTVDF00819", ex);
				}
				tmpAppHolder.put(ViewDefinitionConstants.LEFT_APP_NAME, displayName);
				tmpAppHolder.put("index", "LEFT-" + String.valueOf(i + 1));
				tmpApplistHolder.add(tmpAppHolder);
			}
			prefMap.put(ViewDefinitionConstants.LEFT_APP_LIST, tmpApplistHolder);
			tmpApplistHolder = null;
			tmpApplistHolder = new ArrayList();
			for (i = 0; i < ((List) childApp.get(ViewDefinitionConstants.RIGHT)).size(); i++)
			{
				HashMap tmpAppHolder = new HashMap(); // temporary hashmap for holding the app id and postion
				tmpAppHolder.put(ViewDefinitionConstants.RIGHT_POSITION, i + 1);
				appId = (String) ((List) childApp.get(ViewDefinitionConstants.RIGHT)).get(i);
				tmpAppHolder.put(ViewDefinitionConstants.RIGHT_APP, appId);
				HashMap appNameMap = null;
				String displayName = null;
				try
				{
					appNameMap = viewIns.getAppinfo(appId);
					rb = ResourceBundle.getBundle((String) appNameMap.get(ViewDefinitionConstants.BUNDLE_KEY) + "_"
							+ langId);
					displayName = rb.containsKey((String) appNameMap.get(ViewDefinitionConstants.FLD_VIEW_NAME)) ? rb
							.getString((String) appNameMap.get(ViewDefinitionConstants.FLD_VIEW_NAME))
							: (String) appNameMap.get(ViewDefinitionConstants.FLD_VIEW_NAME);
				}

				catch (Exception ex)
				{
					LOGGER.cterror("CTVDF00820", ex);
				}
				tmpAppHolder.put(ViewDefinitionConstants.RIGHT_APP_NAME, displayName);
				tmpAppHolder.put("index", "RIGHT-" + String.valueOf(i + 1));
				tmpApplistHolder.add(tmpAppHolder);
			}
			prefMap.put(ViewDefinitionConstants.RIGHT_APP_LIST, tmpApplistHolder);

			tmpApplistHolder = null;
			tmpApplistHolder = new ArrayList();
			for (i = 0; i < ((List) childApp.get(ViewDefinitionConstants.CENTER)).size(); i++)
			{
				HashMap tmpAppHolder = new HashMap(); // temporary hashmap for holding the app id and postion
				tmpAppHolder.put(ViewDefinitionConstants.CENTER_POSITION, i + 1);
				appId = (String) ((List) childApp.get(ViewDefinitionConstants.CENTER)).get(i);
				tmpAppHolder.put(ViewDefinitionConstants.CENTER_APP, appId);
				HashMap appNameMap = null;
				String displayName = null;
				try
				{
					appNameMap = viewIns.getAppinfo(appId);
					rb = ResourceBundle.getBundle((String) appNameMap.get(ViewDefinitionConstants.BUNDLE_KEY) + "_"
							+ langId);
					displayName = rb.containsKey((String) appNameMap.get(ViewDefinitionConstants.FLD_VIEW_NAME)) ? rb
							.getString((String) appNameMap.get(ViewDefinitionConstants.FLD_VIEW_NAME))
							: (String) appNameMap.get(ViewDefinitionConstants.FLD_VIEW_NAME);
				}

				catch (Exception ex)
				{
					LOGGER.cterror("CTVDF00821", ex);
				}
				tmpAppHolder.put(ViewDefinitionConstants.CENTER_APP_NAME, displayName);
				tmpAppHolder.put("index", "CENTER-" + String.valueOf(i + 1));
				tmpApplistHolder.add(tmpAppHolder);
			}
			prefMap.put(ViewDefinitionConstants.CENTER_APP_LIST, tmpApplistHolder);

			prefMap.put(ViewDefinitionConstants.PROPORTION, childlayouts.get(ViewDefinitionConstants.PROPORTION));
			if (isUpdation)
			{
				dyc_event = Event.getEventFor("CANVAS", "WORKSPACE", "CUSTOMIZER", "UPDATE"); // DYC update event
				dyc_oldstate_data = (HashMap) inputMap.get(ViewDefinitionConstants.OLD_DYC_METADATA);
			} else
			{
				dyc_event = Event.getEventFor("CANVAS", "WORKSPACE", "CUSTOMIZER", "CREATE"); // DYC create Event
				dyc_oldstate_data = prefMap;
			}

		} else
		{
			dyc_event = Event.getEventFor("CANVAS", "WORKSPACE", "CUSTOMIZER", "DELETE"); // DYC DELETE Event
			prefMap.put(ViewDefinitionConstants.PARAM_WORKSPACE_DISPLAY_NM, ((HashMap) inputMap
					.get(ViewDefinitionConstants.OLD_DYC_METADATA))
					.get(ViewDefinitionConstants.PARAM_WORKSPACE_DISPLAY_NM));
			prefMap.put(ViewDefinitionConstants.PARAM_WORKSPACE_ID,
					inputMap.get(ViewDefinitionConstants.PARAM_WORKSPACE_ID));
			dyc_oldstate_data = prefMap;
		}

		eventData.putAll(prefMap);
		eventData.put(AuditConstants.MANDATORY_AUDIT_META_DATA, prefMap);
		eventData.put(AuditConstants.MANDATORY_AUDIT_DATA_OLD_STATE, dyc_oldstate_data);
		eventData.put(AuditConstants.MANDATORY_AUDIT_DATA_NEW_STATE, prefMap);
		try
		{

			EventDispatcher.getInstance().raiseEvent(dyc_event, eventData);
		} catch (Exception ex)
		{
			LOGGER.cterror("CTVDF00816", ex);
		}
	}

	/*
	 * helper method to polpulate DYC old data for audit and trail params: inputParam, DYColddataList return :
	 * inputParam (with injected DYC metadata)
	 */

	private void populateDYCDataForAudit(List dycMetaDataList, Map paramsMap)
	{
		HashMap dycData = new HashMap();
		List leftAppList = new ArrayList();
		List rightAppList = new ArrayList();
		List centerAppList = new ArrayList();
		HashMap tmp = null;
		HashMap workspaceDataMap = ((HashMap) dycMetaDataList.get(0));
		dycData.put(ViewDefinitionConstants.PARAM_WORKSPACE_DISPLAY_NM,
				workspaceDataMap.get(ViewDefinitionConstants.PARAM_WORKSPACE_DISPLAY_NM));
		dycData.put(ViewDefinitionConstants.PARAM_WORKSPACE_LAYOUT,
				workspaceDataMap.get(ViewDefinitionConstants.PARAM_WORKSPACE_LAYOUT));
		dycData.put(ViewDefinitionConstants.SUB_WORKSPACE_LAYOUT,
				workspaceDataMap.get(ViewDefinitionConstants.SUB_WORKSPACE_LAYOUT));
		dycData.put(ViewDefinitionConstants.PROPORTION, workspaceDataMap.get(ViewDefinitionConstants.PROPORTION));
		String appId;
		String langId = (String) paramsMap.get(ViewDefinitionConstants.INPUT_LANGUAGE_ID);
		if (langId == null)
		{
			langId = "en_US";
		}
		ResourceBundle rb = null;
		for (int i = 0; i < dycMetaDataList.size(); i++) // create three different list for block position (LEFT,
															// RIGHT,CENTER)
		{
			tmp = (HashMap) dycMetaDataList.get(i);
			if (ViewDefinitionConstants.LEFT.equals(tmp.get(ViewDefinitionConstants.PARAM_BLOCK_POSITION))) // creating
																											// List for
																											// LEFT and
																											// so on
			{
				rb = ResourceBundle.getBundle(tmp.get(ViewDefinitionConstants.BUNDLE_KEY) + "_" + langId);
				String displayNM = rb.containsKey((String) tmp.get(ViewDefinitionConstants.FLD_VIEW_NAME)) ? rb
						.getString((String) tmp.get(ViewDefinitionConstants.FLD_VIEW_NAME)) : (String) tmp
						.get(ViewDefinitionConstants.FLD_VIEW_NAME);
				HashMap tmpAppDataHolder = new HashMap();
				tmpAppDataHolder.put(ViewDefinitionConstants.LEFT_POSITION,
						tmp.get(ViewDefinitionConstants.PARAM_POSITION));
				appId = (String) tmp.get(ViewDefinitionConstants.PARAM_WIDGET_ID);
				tmpAppDataHolder.put(ViewDefinitionConstants.LEFT_APP, appId);
				tmpAppDataHolder.put(ViewDefinitionConstants.LEFT_APP_NAME, displayNM);
				tmpAppDataHolder.put("index", "LEFT-" + tmp.get(ViewDefinitionConstants.PARAM_POSITION));
				leftAppList.add(tmpAppDataHolder);

			} else if (ViewDefinitionConstants.RIGHT.equals(tmp.get(ViewDefinitionConstants.PARAM_BLOCK_POSITION)))
			{
				rb = ResourceBundle.getBundle(tmp.get(ViewDefinitionConstants.BUNDLE_KEY) + "_" + langId);
				String displayNM = rb.containsKey((String) tmp.get(ViewDefinitionConstants.FLD_VIEW_NAME)) ? rb
						.getString((String) tmp.get(ViewDefinitionConstants.FLD_VIEW_NAME)) : (String) tmp
						.get(ViewDefinitionConstants.FLD_VIEW_NAME);
				HashMap tmpAppDataHolder = new HashMap();
				tmpAppDataHolder.put(ViewDefinitionConstants.RIGHT_POSITION,
						tmp.get(ViewDefinitionConstants.PARAM_POSITION));
				appId = (String) tmp.get(ViewDefinitionConstants.PARAM_WIDGET_ID);
				tmpAppDataHolder.put(ViewDefinitionConstants.RIGHT_APP, appId);
				tmpAppDataHolder.put(ViewDefinitionConstants.RIGHT_APP_NAME, displayNM);
				tmpAppDataHolder.put("index", "RIGHT-" + tmp.get(ViewDefinitionConstants.PARAM_POSITION));
				rightAppList.add(tmpAppDataHolder);

			} else if (ViewDefinitionConstants.CENTER.equals(tmp.get(ViewDefinitionConstants.PARAM_BLOCK_POSITION)))
			{
				rb = ResourceBundle.getBundle(tmp.get(ViewDefinitionConstants.BUNDLE_KEY) + "_" + langId);
				String displayNM = rb.containsKey((String) tmp.get(ViewDefinitionConstants.FLD_VIEW_NAME)) ? rb
						.getString((String) tmp.get(ViewDefinitionConstants.FLD_VIEW_NAME)) : (String) tmp
						.get(ViewDefinitionConstants.FLD_VIEW_NAME);
				HashMap tmpAppDataHolder = new HashMap();
				tmpAppDataHolder.put(ViewDefinitionConstants.CENTER_POSITION,
						tmp.get(ViewDefinitionConstants.PARAM_POSITION));
				appId = (String) tmp.get(ViewDefinitionConstants.PARAM_WIDGET_ID);
				tmpAppDataHolder.put(ViewDefinitionConstants.CENTER_APP, appId);
				tmpAppDataHolder.put(ViewDefinitionConstants.CENTER_APP_NAME, displayNM);
				tmpAppDataHolder.put("index", "CENTER-" + tmp.get(ViewDefinitionConstants.PARAM_POSITION));
				centerAppList.add(tmpAppDataHolder);

			}

		}
		dycData.put(ViewDefinitionConstants.CENTER_APP_LIST, centerAppList);
		dycData.put(ViewDefinitionConstants.RIGHT_APP_LIST, rightAppList);
		dycData.put(ViewDefinitionConstants.LEFT_APP_LIST, leftAppList);

		paramsMap.put(ViewDefinitionConstants.OLD_DYC_METADATA, dycData);
	}

	/**
	 * Initializing the Logger.
	 * */
	private static Logger LOGGER = Logger.getLogger(ViewDefinitionRequestHandler.class);
}
