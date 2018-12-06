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

package com.intellectdesign.canvas.entitlement;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

import com.intellectdesign.canvas.common.UserValue;
import com.intellectdesign.canvas.constants.common.FrameworkConstants;
import com.intellectdesign.canvas.constants.login.LoginMasterConstants;
import com.intellectdesign.canvas.constants.preferences.PreferenceConstants;
import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;
import com.intellectdesign.canvas.exceptions.common.ProcessingErrorException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.logging.PerformanceTimer;
import com.intellectdesign.canvas.pref.value.CorporatePreferenceValue;
import com.intellectdesign.canvas.preferences.PreferenceException;
import com.intellectdesign.canvas.preferences.PreferenceManager;
import com.intellectdesign.canvas.properties.reader.PropertyReader;
import com.intellectdesign.canvas.value.IUserValue;
import com.intellectdesign.canvas.value.ListValue;

/**
 * Class to check list of product categories with widget ids which are applicable to the user.
 * 
 * @version 1.0
 */
public class CanvasViewEntitlement implements IEntitlementSource
{

	/**
	 * This method returns the list of product categories with widget ids which are applicable to the user.
	 * 
	 * @param userNo the user number
	 * @param gcifNo - GCIF
	 * @return list of the widgets
	 * @throws ViewDefinitionException will be raised when any error/exception occurred.
	 * @deprecated This is no longer used. Instead Canvas uses the getUserAccessEntitlements for identifying the
	 *             entitled product categories
	 */
	public List getProductCategories(final String userNo, final String gcifNo) throws EntitlementException
	{
		return Collections.EMPTY_LIST;
	}

	@Override
	/**
	 * Used to get the user details via loginId
	 * @param loginId
	 * @return userValue
	 
	 * @exception DatabaseException
	 */
	public IUserValue getUserDetails(String loginId)
	{
		ArrayList resultList = null;
		DatabaseRequest dbRequest = null;
		DatabaseResult dbresult = null;
		HashMap userData = null;
		UserValue userValue = null;
		PropertyReader propReader = new PropertyReader();
		String info = null;

		try
		{
			userValue = new UserValue();
			dbRequest = new CanvasDatabaseRequest();
			// First fire the request for validating the user no / login id.
			dbRequest.setDataAccessMapKey(LoginMasterConstants.DAM_KEY_LOGIN_CHECK_USER_EXISTENCE);
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setOperationExtension(LoginMasterConstants.DAM_OPER_EXTN_NICKNAME_MASTER);
			dbRequest.addFilter(LoginMasterConstants.PARAM_LOGIN_ID, loginId);
			dbresult = dbRequest.execute();
			resultList = (ArrayList) dbresult.getReturnedList();
			// If data is fetched, the populate the data into the value object.
			if (resultList.size() > 0)
			{
				userData = (HashMap) resultList.get(0);
				if (userData == null)
				{
					userValue.setTransactionStatus(LoginMasterConstants.STATUS_FAILURE);
					info = propReader.retrieveProperty(LoginMasterConstants.RESOURCE_BUNDLE_ERRORS,
							"ENTL_PROV_INVALID_LOGIN_ID");
					userValue.setInfo(info);
				} else
				{
					String userNo = (String) userData.get(LoginMasterConstants.FLD_USER_NO);
					String gcif = (String) userData.get(LoginMasterConstants.PARAM_OD_GCIF);
					String firstName = (String) userData.get("FIRST_NAME");
					String lastName = (String) userData.get("LAST_NAME");
					String middleName = (String) userData.get("MIDDLE_NAME");
					String lastLogin = (String) userData.get("LAST_LOGIN_DATE");

					userValue.setPrimaryGcif(gcif);
					userValue.setUserNo(userNo);
					userValue.setTransactionStatus(LoginMasterConstants.STATUS_SUCCESS);
					userValue.setFIRST_NAME(firstName);
					userValue.setLAST_NAME(lastName);
					userValue.setMIDDLE_NAME(middleName);
					userValue.setLastLogin(lastLogin);
					userValue.setLoginId(loginId);
				}
			} else
			{
				// No data fetched. Set the status to failure.
				userValue.setTransactionStatus(LoginMasterConstants.STATUS_FAILURE);
				info = propReader.retrieveProperty(LoginMasterConstants.RESOURCE_BUNDLE_ERRORS,
						"ENTL_PROV_INVALID_LOGIN_ID");
				userValue.setInfo(info);
			}
		} catch (DatabaseException dbExcep)
		{
			logger.cterror("CTENT00004", dbExcep, loginId);
			String errorMsg = "LBL_DB_EXCEPTION";
			String transactionStatus = LoginMasterConstants.STATUS_FAILURE;
			info = propReader.retrieveProperty(LoginMasterConstants.RESOURCE_BUNDLE_ERRORS, errorMsg);
			userValue.setInfo(info);
			userValue.setTransactionStatus(transactionStatus);
		}
		logger.ctinfo("CTENT00005", userValue);
		return userValue;
	}

	@Override
	/**
	 * Used to get user preferences using the userValue
	 * @param userValue
	 * @return userValue
	 * @throws ProcessingErrorException
	 */
	public IUserValue getUserPreferences(IUserValue userValue) throws ProcessingErrorException
	{
		ListValue[] userPrefData = null;
		CorporatePreferenceValue corpPrefValue = null;
		String userNo = null;
		String gcif = null;
		PreferenceManager prefManager = null;
		try
		{
			prefManager = new PreferenceManager();
			corpPrefValue = new CorporatePreferenceValue();
			userNo = userValue.getUserNo();
			gcif = userValue.getPrimaryGcif();
			corpPrefValue.setUserNo(userNo);
			corpPrefValue.setAttributeValues(userPrefData);
			userValue.setUserPreference(corpPrefValue);
			userValue.setPrimaryGcif(gcif);
			// First load the user preference data
			userPrefData = prefManager.getAllUserPreferences(userNo);
			if (userPrefData != null && userPrefData.length > 0)
			{
				int numPreferences = userPrefData.length;
				for (int count = 0; count < numPreferences; count++)
				{
					processPreferenceValue(userPrefData[count], userValue);
				}
			}
		} catch (PreferenceException e)
		{
			logger.cterror("CTENT00003", e);
			throw new ProcessingErrorException(e);
		}
		// Iterate through the preference and load the same into the User Value
		/**
		 * CT_Changes. Tentative comments //Check whether the Corporate Preference for Logo is presnet. If yes, then
		 * load the same. ListValue corpLogoPref; try { corpLogoPref = prefManager.getCorporatePreference(gcif, userNo,
		 * NickNameMasterConstants.CORP_LOGO); if(corpLogoPref != null){ processPreferenceValue(corpLogoPref,userValue);
		 * userValue.setCorpLogoExists(true); } } catch (PreferenceException e) { String errorMsg =
		 * "Caught Exception while getting user preferences. Converting to processing error"; logger.logError(cmName,
		 * errorMsg); logger.logError(cmName, e); throw new ProcessingErrorException(e); }
		 **/
		logger.ctinfo("CTENT00006", userValue);
		return userValue;
	}

	/**
	 * This method is used for getting the access entitlements for the views by populating the CanvasViewEntlVO
	 * 
	 * @param userNo
	 * @param gcifNo
	 * @return CanvasViewEntlVO
	 * @throws ViewDefinitionException
	 */
	@Override
	public CanvasViewEntlVO getUserAccessEntitlements(String gcifNo, String userNo, String sUserRole)
			throws EntitlementException
	{
		List records = null;
		CanvasViewEntlVO canvasViewEntlVO = null;
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		try
		{
			canvasViewEntlVO = new CanvasViewEntlVO();
			canvasViewEntlVO.setGcif(gcifNo);
			canvasViewEntlVO.setUserNo(userNo);
			canvasViewEntlVO.setUserRole(sUserRole);
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(EntlConstants.DB_DAM_KEY_VIEW_MANAGER);
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setOperationExtension(EntlConstants.GET_ACCESS_ENTITLEMENTS);
			dbRequest.addFilter(EntlConstants.FLD_OD_USER_NO, userNo);
			dbRequest.addFilter(EntlConstants.FLD_OD_GCIF, gcifNo);
			if(!"GUEST".equals(sUserRole) && !"".equals(sUserRole) && sUserRole!=null){
				dbRequest.addFilter(EntlConstants.FLD_USER_ROLE, sUserRole);
			}
			dbResult = dbRequest.execute();
			records = dbResult.getReturnedList();
			HashMap hm = new HashMap();
			hm.put("PRODUCT", "CANVAS");
			hm.put("SUBPROD", "CANVAS");
			hm.put("FUNCTION", "VSBLTY");
			records.add(hm);
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTENT00007", dbExp, gcifNo, userNo);
			throw new EntitlementException(dbExp);
		}
		canvasViewEntlVO.setEntitlements(records);
		return canvasViewEntlVO;

	}

	/**
	 * Used to get the user data entitlements based on productsList subprodList functionList gcif and userNo
	 * 
	 * @param productsList
	 * @param subprodList
	 * @param functionList
	 * @param gcif
	 * @param userNo
	 * @return
	 * @throws EntitlementException
	 * @deprecated This API is no longer referenced from Canvas.
	 */
	@Override
	public DataEntitlements getUserDataEntitlements(HashMap mapInputParams) throws EntitlementException
	{
		String userNo = (String) mapInputParams.get(EntlConstants.INPUT_USER_NO);
		String gcif = (String) mapInputParams.get(EntlConstants.INPUT_GCIF);
		String sUserRole = (String) mapInputParams.get(EntlConstants.INPUT_USER_ROLE);
		String sChannelId = (String) mapInputParams.get(EntlConstants.INPUT_CHANNEL_ID);
		List<String> productsList = (ArrayList) mapInputParams.get(EntlConstants.PRODUCT_LIST);
		List<String> subprodList = (ArrayList) mapInputParams.get(EntlConstants.SUB_PRODUCT_LIST);
		List<String> functionList = (ArrayList) mapInputParams.get(EntlConstants.FUNCTION_LIST);
		String[] prodArray = productsList.toArray(new String[productsList.size()]);
		String[] subprodArray = subprodList.toArray(new String[subprodList.size()]);
		String[] funcArray = functionList.toArray(new String[functionList.size()]);
		return getUserDataEntitlements(prodArray, subprodArray, funcArray, gcif, userNo, sChannelId, sUserRole);
	}

	/**
	 * Used to get the user data entitlements based on productsList subprodList functionList gcif and userNo
	 * 
	 * @param productsList
	 * @param subprodList
	 * @param functionList
	 * @param gcif
	 * @param userNo
	 * @return
	 * @throws EntitlementException
	 */
	@Override
	public DataEntitlements getUserDataEntitlements(String[] productsList, String[] subprodList, String[] functionList,
			String gcif, String userNo, String channelId, String sUserRole) throws EntitlementException
	{
		PerformanceTimer perfTimer = null;
		DataEntitlements dataEntitlements = null;
		String entlCheckErrCode = null;
		try
		{
			perfTimer = new PerformanceTimer();
			perfTimer.startTimer("CanvasViewEntitlement.getUserDataEntitlements");
			dataEntitlements = new DataEntitlements();
			/**
			 * Checking for the entitlement not only for product, sub product and function code, it will check the user
			 * is channeled if the user not mapped with the requested channel, it will return false. if it is mapped
			 * then only it will check for the user entitlement.
			 */
			entlCheckErrCode = checkEntitlement(productsList, subprodList, functionList, gcif, userNo, channelId,
					sUserRole);
			if (entlCheckErrCode == null)
			{
				/**
				 * If it is entitled, setting data entitlement is true.
				 */
				dataEntitlements.setEntitled(true);
				dataEntitlements.setEntitlements(getUserDataEntitlements(gcif, userNo, sUserRole));
			} 
			else
			{
				/**
				 * If it is not entitled, setting data entitlement value as false.
				 */
				dataEntitlements.setEntitled(false);
				dataEntitlements.setErrorCode(entlCheckErrCode);
			}

		}

		catch (DatabaseException dbException)
		{
			logger.cterror("CTENT00008", dbException, gcif, userNo, productsList, subprodList, functionList);
			throw new EntitlementException(dbException);
		}

		perfTimer.endTimer();
		return dataEntitlements;
	}

	/**
	 * Used to get the user data entitlements based on productsList subprodList functionList gcif and userNo
	 * 
	 * @param productsList
	 * @param subprodList
	 * @param functionList
	 * @param gcif
	 * @param userNo
	 * @return DataEntitlements
	 * @throws EntitlementException
	 */
	@Override
	public DataEntitlements getUserDataEntitlements(String products, String subprod, String function, String gcif,
			String userNo, String channelId, String sUserRole) throws EntitlementException
	{
		PerformanceTimer perfTimer = null;
		DataEntitlements dataEntitlements = null;
		String entlCheckErrCode = null;
		String[] productsList = null;
		String[] subprodList = null;
		String[] functionList = null;
		try
		{
			perfTimer = new PerformanceTimer();
			perfTimer.startTimer("CanvasViewEntitlement.getUserDataEntitlements");
			if (products != null && !products.trim().isEmpty())
			{
				productsList = new String[10];
				productsList[0] = products;
			}
			if (subprod != null && !subprod.trim().isEmpty())
			{
				subprodList = new String[10];
				subprodList[0] = subprod;
			}
			if (function != null && !function.trim().isEmpty())
			{
				functionList = new String[10];
				functionList[0] = function;
			}
			dataEntitlements = new DataEntitlements();
			/**
			 * Checking for the entitlement not only for product, sub product and function code, it will check the user
			 * is channeled if the user not mapped with the requested channel, it will return false. if it is mapped
			 * then only it will check for the user entitlement.
			 */
			entlCheckErrCode = checkEntitlement(productsList, subprodList, functionList, gcif, userNo, channelId,
					sUserRole);
			if (entlCheckErrCode == null)
			{
				/**
				 * If it is entitled, setting data entitlement is true.
				 */
				dataEntitlements.setEntitled(true);
				/**
				 * Getting the entitlement data values according to the user entitlement.
				 */
				dataEntitlements.setEntitlements(getUserDataEntitlements(gcif, userNo, sUserRole));
			} 
			else
			{
				/**
				 * If it is not entitled, setting data entitlement value as false.
				 */
				dataEntitlements.setEntitled(false);
				dataEntitlements.setErrorCode(entlCheckErrCode);
			}

		}

		catch (DatabaseException dbException)
		{
			logger.cterror("CTENT00008", dbException, gcif, userNo, products, subprod, function);
			throw new EntitlementException(dbException);
		}

		perfTimer.endTimer();
		return dataEntitlements;
	}

	/**
	 * Get the name of canvas view entitlement
	 * 
	 * @return Canvas View Entitlement
	 */
	@Override
	public String getName()
	{
		return "CanvasViewEntitlement";
	}

	/**
	 * It will check the entitlement for the user and the requseted channel.
	 * 
	 * @return entitlement check error code
	 * @throws DatabaseException
	 */
	private String checkEntitlement(String[] productsList, String[] subprodList, String[] functionList, String gcif,
			String userNo, String channelId, String sUserRole) throws DatabaseException
	{

		String entlCheckErrCode = null;
		boolean isEntitled = false;
		String userFuncChannelAvail = null;
		/**
		 * Checking for the user and function is channeled for the requested channel id.
		 */
		userFuncChannelAvail = new UserEntitlementDao().checkUserFuncChannelAvailablity(gcif, userNo, functionList,
				channelId);
		/**
		 * If the channel is available for the user, then it will check for the entitlement.
		 */
		if (userFuncChannelAvail.equals(FrameworkConstants.YES_Y))
		{
			isEntitled = new UserEntitlementDao().isUserFunctionEntitledFor(gcif, userNo, productsList, subprodList,
					functionList, sUserRole);
			if (!isEntitled)
			{
				entlCheckErrCode = FrameworkConstants.ERR_ENTL_USER;
				logger.cterror("CTENT00002", entlCheckErrCode);
			}
		}
		/**
		 * If the channel is not available for the user, returing the value as false.
		 */
		else
		{
			entlCheckErrCode = FrameworkConstants.ERR_ENTL_CHNANNEL;
			logger.cterror("The User Function not entitled with this channel :" + entlCheckErrCode);
		}

		logger.ctdebug("CTENT00010", entlCheckErrCode, gcif, userNo, productsList, subprodList, functionList);
		return entlCheckErrCode;
	}

	/**
	 * Get the records of User Data Entitlements
	 * 
	 * @param gcifNo
	 * @param userNo
	 * @return list of records
	 * @throws EntitlementException
	 */
	private List<ProductFunctionVO> getUserDataEntitlements(String gcifNo, String userNo, String sUserRole)
			throws EntitlementException
	{
		List<ProductFunctionVO> records = null;
		try
		{
			DatabaseRequest dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(EntlConstants.DB_DAM_KEY_VIEW_MANAGER);
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setOperationExtension(EntlConstants.GET_VIEW_ENTITLEMENTS);
			dbRequest.addFilter(EntlConstants.FLD_OD_USER_NO, userNo);
			dbRequest.addFilter(EntlConstants.FLD_OD_GCIF, gcifNo);
			if(!"GUEST".equals(sUserRole) && !"".equals(sUserRole) && sUserRole!=null){
				dbRequest.addFilter(EntlConstants.FLD_USER_ROLE, sUserRole);
			}
			DatabaseResult dbResult = dbRequest.execute();
			records = dbResult.getReturnedList();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTENT00011", dbExp, gcifNo, userNo);
			throw new EntitlementException(dbExp);
		}
		return records;
	}

	/**
	 * Helper method that populates a single preference value into the user value object.
	 * 
	 * @param aPrefData The preference value
	 * @param userValue The user value into which the data needs to be populated
	 * @throws ProcessingErrorException
	 */
	private void processPreferenceValue(ListValue aPrefData, IUserValue userValue) throws ProcessingErrorException
	{
		String prefId = aPrefData.getCode();
		String prefDesc = aPrefData.getDesc();
		String prefValue = aPrefData.getValue();
		if (PreferenceConstants.LANGUAGE_FORMAT.equals(prefId))
		{
			userValue.setLangId(prefDesc);
			if (aPrefData.getAdditionalProperties() != null && aPrefData.getAdditionalProperties().size() > 0)
			{
				userValue.setDirection(aPrefData.getAdditionalProperties().get(PreferenceConstants.DIRECTION_FORMAT));
			}
		} else if (PreferenceConstants.THEME_FORMAT.equals(prefId))
		{
			userValue.setThemeId(prefDesc);
		} else if (PreferenceConstants.FONTSIZE_FORMAT.equals(prefId))
		{
			userValue.setFontsizeId(prefDesc);

		} else if (PreferenceConstants.AMOUNT_FORMAT.equals(prefId))
		{
			userValue.setAmountId(prefDesc);
		} else if (PreferenceConstants.DATE_FORMAT.equals(prefId))
		{
			userValue.setDateId(prefDesc);
		} else if (PreferenceConstants.URL_FORMAT.equals(prefId))
		{
			userValue.setUrlId(prefDesc);
			userValue.setUrlDesc(prefId);
		} else if (PreferenceConstants.STARTWS.equals(prefId))
		{
			userValue.setStartUpWorkSpaceId(prefValue);
		} else if (PreferenceConstants.SLANGUAGE.equals(prefId))
		{
			userValue.setSeclangId(prefDesc);
		} else if (PreferenceConstants.ENASECLANG.equals(prefId) && "yes".equals(prefDesc))
		{
			userValue.setEnaSecLang(prefDesc);
		} else if (PreferenceConstants.TIMEZONE_FORMAT.equals(prefId))
		{
			userValue.setTimeZoneId(prefDesc);
		} else if (PreferenceConstants.CSTYLE.equals(prefId))
		{
			userValue.setChangeStyle(prefDesc);
		} else if (PreferenceConstants.RATECARD_PREF.equals(prefId))
		{
			userValue.setRateCard(prefValue);
		} else if (PreferenceConstants.EQUIVALENT_CUR_PREF.equals(prefId))
		{
			userValue.setEquivalentCurrency(prefValue);
		} else if (PreferenceConstants.USER_ROLE.equals(prefId))
		{
			userValue.setUserRole(prefDesc);
		} else if (PreferenceConstants.TIME_FORMAT.equals(prefId))
		{
			userValue.setTimeFormat(prefValue);
		} else if (PreferenceConstants.WORKSPACE.equals(prefId))
		{
			userValue.setPreferredWorkspaceId(prefDesc);
		}
	}

	/**
	 * Used to update User Preferences
	 * 
	 * @param preferenceType
	 * @param preferenceValues
	 * @return status of Preferences
	 * @throws ProcessingErrorException
	 */
	@Override
	public String updateUserPreferences(List<String> preferenceType, List<Object> preferenceValues, String userNo)
			throws ProcessingErrorException
	{
		String status = "failure";
		try
		{
			PreferenceManager pref = new PreferenceManager();
			pref.updateAllPreferences(preferenceType, preferenceValues, userNo);
			status = "success";

		} catch (PreferenceException prefExcep)
		{
			throw new ProcessingErrorException(prefExcep);
		}
		return status;
	}

	/**
	 * This method is for UserDataEntitlements
	 * 
	 * @param productsList
	 * @param subprodList
	 * @param functionList
	 * @param gcif
	 * @param userNo
	 * @return
	 * @throws EntitlementException
	 * @see com.intellectdesign.canvas.entitlement.IEntitlementSource#getUserDataEntitlements(java.lang.String[],
	 *      java.lang.String[], java.lang.String[], java.lang.String, java.lang.String)
	 */
	@Override
	public DataEntitlements getUserDataEntitlements(String[] productsList, String[] subprodList, String[] functionList,
			String gcif, String userNo) throws EntitlementException
	{
		return getUserDataEntitlements(productsList, subprodList, functionList, gcif, userNo, "3");
	}

	/**
	 * This method is for UserDataEntitlements
	 * 
	 * @param productsList
	 * @param subprodList
	 * @param functionList
	 * @param gcif
	 * @param userNo
	 * @return
	 * @throws EntitlementException
	 * @see com.intellectdesign.canvas.entitlement.IEntitlementSource#getUserDataEntitlements(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.String, java.lang.String)
	 */
	@Override
	public DataEntitlements getUserDataEntitlements(String productsList, String subprodList, String functionList,
			String gcif, String userNo) throws EntitlementException
	{
		return getUserDataEntitlements(productsList, subprodList, functionList, gcif, userNo, "3");
	}

	/**
	 * This methos is for UserAccessEntitlements contains ViewEntloVO
	 * 
	 * @param gcif
	 * @param userNo
	 * @return
	 * @throws EntitlementException
	 * @see com.intellectdesign.canvas.entitlement.IEntitlementSource#getUserAccessEntitlements(java.lang.String,
	 *      java.lang.String)
	 */
	@Override
	public CanvasViewEntlVO getUserAccessEntitlements(String gcif, String userNo) throws EntitlementException
	{
		return getUserAccessEntitlements(gcif, userNo, null);
	}

	/**
	 * This method is used to get the user data entitlements
	 * 
	 * @param productsList
	 * @param subprodList
	 * @param functionList
	 * @param gcif
	 * @param userNo
	 * @param channelId
	 * @return
	 * @throws EntitlementException
	 * @see com.intellectdesign.canvas.entitlement.IEntitlementSource#getUserDataEntitlements(java.lang.String[],
	 *      java.lang.String[], java.lang.String[], java.lang.String, java.lang.String, java.lang.String)
	 */
	@Override
	public DataEntitlements getUserDataEntitlements(String[] productsList, String[] subprodList, String[] functionList,
			String gcif, String userNo, String channelId) throws EntitlementException
	{
		return getUserDataEntitlements(productsList, subprodList, functionList, gcif, userNo, channelId, null);
	}

	/**
	 * This method is used to get the user data entitlements
	 * 
	 * @param productsList
	 * @param subprodList
	 * @param functionList
	 * @param gcif
	 * @param userNo
	 * @param channelId
	 * @return
	 * @throws EntitlementException
	 * @see com.intellectdesign.canvas.entitlement.IEntitlementSource#getUserDataEntitlements(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.String, java.lang.String, java.lang.String)
	 */
	@Override
	public DataEntitlements getUserDataEntitlements(String productsList, String subprodList, String functionList,
			String gcif, String userNo, String channelId) throws EntitlementException
	{
		return getUserDataEntitlements(productsList, subprodList, functionList, gcif, userNo, channelId, null);
	}
	
	private static final Logger logger = Logger.getLogger(CanvasViewEntitlement.class);
}
