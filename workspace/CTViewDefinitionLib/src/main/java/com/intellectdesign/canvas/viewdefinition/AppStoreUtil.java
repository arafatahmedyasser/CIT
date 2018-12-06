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

import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Vector;

import com.intellectdesign.canvas.common.ExtReplyObject;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.SystemPreferenceDescriptor;
import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.constants.common.JSPIOConstants;
import com.intellectdesign.canvas.constants.util.TIConstants;
import com.intellectdesign.canvas.constants.util.TRConstants;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.properties.MessageManager;

/**
 * This class is for app store util
 * 
 * @version 1.0
 */
public class AppStoreUtil
{
	/**
	 * ref to class Js field to AppStoreUtil
	 */
	private static int VER_NO_POS = 16;
	private static int TXN_STATUS_POS = 15;
	private static String HASH_MAP_POSITION = "26";

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
	 * This method performs validation for the delete action. If the validation succeeds, <br/>
	 * success reply will be returned otherwise error reply will be returned.
	 * 
	 * @param inputVector - The InputVector.
	 * @param workspaceId - The WorkspaceID which would be validated.
	 * @return extReplyObject - The ExtReplyObject which contains the status details.
	 * @throws ViewDefinitionException - ViewDefinitionException will be raised if any error occured.
	 */
	public final ExtReplyObject validateOnDelete(final Vector inputVector, final String workspaceId)
			throws ViewDefinitionException
	{
		ExtReplyObject replyObject = null;
		String gcifNo = (String) inputVector.get(TIConstants.GCIF_INDEX_IN_VECTOR);
		String userNo = (String) inputVector.get(TIConstants.USER_NO_INDEX_IN_VECTOR);
		String[] messageData = null;
		/**
		 * Validating the workspace id.
		 * */
		if (workspaceId == null)
		{
			replyObject = constructErrorReply(inputVector, ViewDefinitionConstants.ERR_EMPTY_WORKSPACE_ID, messageData);
			logger.cterror("CTVDF00338");
		} else
		{
			ViewManager viewManager = new ViewManager();
			WorkspaceDefinition workspaceDefinition = viewManager.getWorkspaceDefinition(userNo, gcifNo, workspaceId);
			if (workspaceDefinition == null)
			{
				replyObject = constructErrorReply(inputVector, ViewDefinitionConstants.ERR_INVALID_WORKSPACE_ID,
						messageData);
				logger.cterror("CTVDF00339");
			}
		}
		if (replyObject == null)
		{
			replyObject = constructSuccessReply();
		}
		return replyObject;
	}

	/**
	 * This method performs validation for the save action. If the validation succeeds, <br/>
	 * success reply will be returned otherwise error reply will be returned.
	 * 
	 * @param inputVector - The InputVector.
	 * @return extReplyObject - The ExtReplyObject which contains the status details.
	 * @throws ViewDefinitionException - ViewDefinitionException will be raised if any error occured.
	 */
	public final ExtReplyObject validateOnSave(final Vector inputVector) throws ViewDefinitionException
	{
		return validateWorkspace(inputVector, true, false);
	}

	/**
	 * This method performs validation for the update action. If the validation succeeds, <br/>
	 * success reply will be returned otherwise error reply will be returned.
	 * 
	 * @param inputVector - The InputVector.
	 * @param workspaceId - Workspace id.
	 * @return extReplyObject - The ExtReplyObject which contains the status details.
	 * @throws ViewDefinitionException - ViewDefinitionException will be raised if any error occured.
	 */
	public final ExtReplyObject validateOnUpdate(final Vector inputVector, final String workspaceId)
			throws ViewDefinitionException
	{
		ExtReplyObject replyObject = null;
		String[] messageData = new String[]
		{ workspaceId };
		String gcifNo = (String) inputVector.get(TIConstants.GCIF_INDEX_IN_VECTOR);
		String userNo = (String) inputVector.get(TIConstants.USER_NO_INDEX_IN_VECTOR);

		if (workspaceId == null)
		{
			replyObject = constructErrorReply(inputVector, ViewDefinitionConstants.ERR_EMPTY_WORKSPACE_ID, messageData);
			logger.cterror("CTVDF00338");
		} else
		{
			ViewManager viewManager = new ViewManager();
			WorkspaceDefinition workspaceDefinition = viewManager.getWorkspaceDefinition(userNo, gcifNo, workspaceId);
			if (workspaceDefinition == null)
			{
				replyObject = constructErrorReply(inputVector, ViewDefinitionConstants.ERR_INVALID_WORKSPACE_ID,
						messageData);
				logger.cterror("CTVDF00340", workspaceId);
			} else
			{

				Map paramsMap = getAugmentedCachedHashMap(inputVector);
				String workspaceDisplayName = (String) paramsMap
						.get(ViewDefinitionConstants.PARAM_WORKSPACE_DISPLAY_NM);
				boolean isWorkspaceNameChanged = !workspaceDefinition.getWorkspaceDisplayName().equalsIgnoreCase(
						workspaceDisplayName);

				replyObject = validateWorkspace(inputVector, false, isWorkspaceNameChanged);
			}
		}
		if (replyObject == null)
		{
			replyObject = constructSuccessReply();
		}
		return replyObject;
	}

	/**
	 * This method performs validation for the workspace creation. If the validation succeeded,<br/>
	 * success reply will be returned otherwise error reply will be returned.
	 * 
	 * @param inputVector - The InputVector.
	 * @param isNewWorkspace - true if it is a save action otherwise false.
	 * @return extReplyObject - The ExtReplyObject which contains the status details.
	 * @throws ViewDefinitionException - ViewDefinitionException will be raised if any error occured.'
	 */
	private ExtReplyObject validateWorkspace(final Vector inputVector, final boolean isNewWorkspace,
			final boolean isWorkspaceNameChanged) throws ViewDefinitionException
	{
		ExtReplyObject replyObject = null;

		String gcifNo = (String) inputVector.get(TIConstants.GCIF_INDEX_IN_VECTOR);
		String userNo = (String) inputVector.get(TIConstants.USER_NO_INDEX_IN_VECTOR);

		/**
		 * Step 1: Fetching the input params from the input vector.
		 * */
		Map paramsMap = getAugmentedCachedHashMap(inputVector);
		String workspaceDisplayName = (String) paramsMap.get(ViewDefinitionConstants.PARAM_WORKSPACE_DISPLAY_NM);

		/**
		 * Step 2: Getting the warning list from the input params if any.
		 * */
		List warningList = (List) paramsMap.get(FrameworkConstants.KEY_WARNING_LIST);

		ViewManager viewManager = new ViewManager();
		String[] messageData = null;
		if (workspaceDisplayName == null || workspaceDisplayName.trim().length() == 0)
		{
			/**
			 * Validating workspace display name.
			 * */
			messageData = new String[]
			{};
			replyObject = constructErrorReply(inputVector, ViewDefinitionConstants.ERR_WORKSPACE_DISP_NAME_EMPTY,
					messageData);
		} else
		{
			List workspaceList = viewManager.getWorkspaceByName(workspaceDisplayName.toUpperCase());
			if (workspaceList != null && !workspaceList.isEmpty())
			{
				String tmpUserNo = null;
				String tmpGcifNo = null;
				for (Object obj : workspaceList)
				{
					Map workspaceObj = (Map) obj;
					tmpUserNo = (String) workspaceObj.get(ViewDefinitionConstants.FLD_OD_USER_NO);
					tmpGcifNo = (String) workspaceObj.get(ViewDefinitionConstants.FLD_OD_GCIF);
					if (ViewDefinitionConstants.DATA_ALL_USERS.equals(tmpUserNo)
							&& ViewDefinitionConstants.DATA_ALL_CORPORATES.equals(tmpGcifNo))
					{
						/**
						 * Case 1: UserNo: -1 GCIF: -1 --> System Level
						 * */
						if (warningList == null
								|| !warningList
										.contains(ViewDefinitionConstants.ERR_WORKSPACE_DISP_NAME_EXISTS_IN_SYSTEM_LEVEL))
						{
							messageData = new String[]
							{ workspaceDisplayName, tmpGcifNo, tmpUserNo };
							replyObject = addWarning(replyObject, inputVector,
									ViewDefinitionConstants.ERR_WORKSPACE_DISP_NAME_EXISTS_IN_SYSTEM_LEVEL, messageData);
						}
					} else if (ViewDefinitionConstants.DATA_ALL_USERS.equals(tmpUserNo) && gcifNo.equals(tmpGcifNo))
					{
						/**
						 * Case 2: UserNo: -1 GCIF: xxxxx --> Corporate Level
						 * */
						if (warningList == null
								|| !warningList
										.contains(ViewDefinitionConstants.ERR_WORKSPACE_DISP_NAME_EXISTS_IN_CORP_LEVEL))
						{
							messageData = new String[]
							{ workspaceDisplayName, tmpGcifNo, tmpUserNo };
							replyObject = addWarning(replyObject, inputVector,
									ViewDefinitionConstants.ERR_WORKSPACE_DISP_NAME_EXISTS_IN_CORP_LEVEL, messageData);
						}
					} else if ((isNewWorkspace || isWorkspaceNameChanged) && userNo.equals(tmpUserNo)
							&& gcifNo.equals(tmpGcifNo))
					{
						/**
						 * Case 3: UserNo: xxxxx GCIF: xxxxx --> User Level
						 * */
						messageData = new String[]
						{ workspaceDisplayName, tmpGcifNo, tmpUserNo };
						replyObject = constructErrorReply(inputVector,
								ViewDefinitionConstants.ERR_WORKSPACE_DISP_NAME_EXISTS_IN_USER_LEVEL, messageData);
					}
				}
			}
			if (!validateLayouts(paramsMap))
			{
				/**
				 * Validating the Layouts and widgets count.
				 * */

				ConfigurationManager configMgr = ConfigurationManager.getInstance();
				SystemPreferenceDescriptor sysPref = configMgr.getSystemPrefDescriptor();

				String allowedLimit = "" + sysPref.getStrAllowedWidgetsLimitAppstore();

				messageData = new String[]
				{ allowedLimit };
				replyObject = constructErrorReply(inputVector, ViewDefinitionConstants.ERR_WIDGETS_COUNT, messageData);
			}
		}
		if (replyObject == null)
		{
			replyObject = constructSuccessReply();
		} else
		{
			replyObject.sErrTxn = new String[]
			{ ViewDefinitionConstants.ERR_SERVER_VALDN_FAILURE };
			replyObject.headerMap.put(FrameworkConstants.KEY_ERROR_CODE,
					ViewDefinitionConstants.ERR_SERVER_VALDN_FAILURE);
			replyObject.headerMap.put(FrameworkConstants.KEY_REPLY_TYPE, FrameworkConstants.KEY_ERROR);
			replyObject.headerMap.put(FrameworkConstants.SUCCESS, false);
		}
		return replyObject;
	}

	/**
	 * This method returns the success reply object.
	 * 
	 * @return extReplyObject
	 */
	private ExtReplyObject constructSuccessReply()
	{
		ExtReplyObject reply = new ExtReplyObject();
		reply.headerMap = new HashMap();
		reply.headerMap.put(FrameworkConstants.SUCCESS, ViewDefinitionConstants.VAL_BOOL_TRUE);
		reply.headerMap.put(FrameworkConstants.KEY_REPLY_TYPE, FrameworkConstants.KEY_SUCCESS);
		return reply;
	}

	/**
	 * This method returns the error reply object.
	 * 
	 * @param inputVector - The InputVector.
	 * @param errorCode - Error Code
	 * @param messageData - Message array which contains the place holder values in the message.
	 * @return extReplyObject - ExtReplyObject with error details.
	 */
	private ExtReplyObject constructErrorReply(final Vector inputVector, final String errorCode,
			final Object[] messageData)
	{
		String strLocale = (String) inputVector.get(TIConstants.LANGID_INDEX_IN_VECTOR);
		if (strLocale == null || strLocale.trim().length() == 0)
		{
			strLocale = "en_US";
		}

		String strErrorMessage = MessageManager.getMessage("canvas-default", errorCode, strLocale);
		if (messageData != null)
		{
			MessageFormat mf = new MessageFormat(strErrorMessage);
			strErrorMessage = mf.format(messageData);
		}

		logger.cterror("CTVDF00341", errorCode, strErrorMessage);

		ExtReplyObject reply = new ExtReplyObject();
		reply.sErrTxn = new String[]
		{ ViewDefinitionConstants.ERR_SERVER_VALDN_FAILURE };
		reply.headerMap = new HashMap();
		reply.headerMap.put(FrameworkConstants.KEY_ERROR_CODE, errorCode);
		reply.headerMap.put(FrameworkConstants.KEY_REPLY_TYPE, FrameworkConstants.KEY_ERROR);
		reply.headerMap.put(FrameworkConstants.KEY_ERROR_MESSAGE, strErrorMessage);
		reply.headerMap.put(FrameworkConstants.SUCCESS, false);
		return reply;
	}

	/**
	 * This method returns the warning reply object.
	 * 
	 * @param reply - ExtReplyObject
	 * @param inputVector - The input vector
	 * @param warningId - Warning id
	 * @param messageData - Message array which contains the place holder values in the message.
	 * @return ExtReplyObject
	 */
	private ExtReplyObject addWarning(ExtReplyObject reply, final Vector inputVector, final String warningId,
			final Object[] messageData)
	{
		String strLocale = (String) inputVector.get(TIConstants.LANGID_INDEX_IN_VECTOR);
		if (strLocale == null || strLocale.trim().length() == 0)
		{
			strLocale = "en_US";
		}
		String strWarningMessage = MessageManager.getMessage("canvas-default", warningId, strLocale);
		if (messageData != null)
		{
			MessageFormat mf = new MessageFormat(strWarningMessage);
			strWarningMessage = mf.format(messageData);
		}

		logger.cterror("CTVDF00342", warningId, strWarningMessage);

		if (reply == null)
		{
			reply = new ExtReplyObject();
		}

		if (reply.headerMap == null)
		{
			reply.headerMap = new HashMap();
		}

		if (reply.headerMap.get(FrameworkConstants.KEY_WARNING_LIST) == null)
		{
			reply.headerMap.put(FrameworkConstants.KEY_WARNING_LIST, new ArrayList());
		}
		Map warningMap = new HashMap();

		warningMap.put(FrameworkConstants.KEY_WARN_ID, warningId);
		warningMap.put(FrameworkConstants.KEY_REPLY_TYPE, FrameworkConstants.KEY_WARN);
		warningMap.put(FrameworkConstants.KEY_WARN_MESSAGE, strWarningMessage);
		reply.headerMap.put(FrameworkConstants.SUCCESS, false);
		((List) reply.headerMap.get(FrameworkConstants.KEY_WARNING_LIST)).add(warningMap);
		return reply;
	}

	/**
	 * This methods validates whether the widgets count in a layout is lessthan the limit from the
	 * Orbionedirect.properties.
	 * 
	 * @param paramsMap input parameters
	 * @return true if the layout is valid otherwise false
	 */
	private boolean validateLayouts(final Map paramsMap)
	{
		/**
		 * Step 1: Setting the widgets limit from orbionedirect.properties.
		 * */
		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		SystemPreferenceDescriptor sysPref = configMgr.getSystemPrefDescriptor();

		int allowedLimit = sysPref.getStrAllowedWidgetsLimitAppstore();
		/**
		 * Step 2: Getting the available layouts in the input params.
		 * */
		List layouts = (List) paramsMap.get(ViewDefinitionConstants.PARAM_CHILD_LAYOUTS);
		boolean isValid = layouts != null && !layouts.isEmpty();
		if (layouts != null)
		{
			/**
			 * Step 3: Iterating the layout list.
			 * */
			int widgetsCount = 0;
			for (Object object : layouts)
			{
				Map layoutMap = (Map) object;
				/**
				 * Step 4: Get the widgets count in the layout.
				 * */
				widgetsCount = getWidgetsCount(layoutMap);
				/**
				 * Step 5: Validate the widgets count is in the allowed limit.
				 * */
				if (widgetsCount < 1 || widgetsCount > allowedLimit)
				{
					return false;
				}
			}
		}
		return isValid;
	}

	/**
	 * This method returns the number of widgets in the layout.
	 * 
	 * @param layoutMap layout details
	 * @return number of widgets in the layout
	 */
	private int getWidgetsCount(final Map layoutMap)
	{
		int widgetCount = 0;
		/**
		 * Step 1: Getting the widgets from the layoutMap.
		 * */
		Map childWidgetsMap = (Map) layoutMap.get(ViewDefinitionConstants.PARAM_CHILD_WIDGETS);

		/**
		 * Step 2: Finding the widgets count.
		 * */
		String widgetId = null;
		List wgtList = null;
		for (Iterator wgtIter = childWidgetsMap.entrySet().iterator(); wgtIter.hasNext();)
		{
			Map.Entry mapEntry = (Map.Entry) wgtIter.next();
			wgtList = (List) mapEntry.getValue();
			for (Iterator widgetIterator = wgtList.iterator(); widgetIterator.hasNext();)
			{
				widgetId = (String) widgetIterator.next();
				if (widgetId != null && widgetId.trim().length() > 0)
				{
					widgetCount++;
				}
			}
		}
		return widgetCount;
	}

	private static Logger logger = Logger.getLogger(AppStoreUtil.class);
}
