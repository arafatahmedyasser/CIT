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

package com.intellectdesign.canvas.value;

import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;
import java.util.Vector;

import com.intellectdesign.canvas.constants.common.JSPIOConstants;
import com.intellectdesign.canvas.constants.util.TIConstants;
import com.intellectdesign.canvas.constants.util.TRConstants;

/**
 * This class is for CBXReqdataObject
 * 
 * @version 1.0
 */
public class CBXRequestDataObject
{

	/**
	 * Constructor that takes the inputVector as paramater. This contructor takes the advantage of setting all the
	 * values of the private variables from the input vector.
	 * 
	 * @param inputVector
	 */
	public static final int HASH_MAP_POSITION = 26;
	public static final int VER_NO_POS = 16;
	public static final int TXN_STATUS_POS = 15;

	public CBXRequestDataObject(Vector inputVector)
	{
		additionalDataMap = new HashMap();
		for (int i = 15; i < inputVector.size(); i++)
		{
			additionalDataMap.put("VALUE_POSITION_" + i, inputVector.get(i));
		}

		setSessionId((String) inputVector.get(TIConstants.SESSIONID_INDEX_IN_VECTOR));
		setTxnCode((String) inputVector.get(TIConstants.TXN_CODE_POS));
		setCustomerNo((String) inputVector.get(TIConstants.GCIF_INDEX_IN_VECTOR));
		setUserNo((String) inputVector.get(TIConstants.USER_NO_INDEX_IN_VECTOR));
		setFunctionCode((String) inputVector.get(TIConstants.FUNCTION_CODE_INDEX_IN_VECTOR));
		setProductCode((String) inputVector.get(TIConstants.PROD_CODE_INDEX_IN_VECTOR));
		setSubProductCode((String) inputVector.get(TIConstants.SUBPROD_CODE_INDEX_IN_VECTOR));
		setDebitAccNumber((String) inputVector.get(TIConstants.VALUE_VECTOR_7));
		setDebitAmount(Double.parseDouble((String) inputVector.get(TIConstants.VALUE_VECTOR_8)));
		setCurrency((String) inputVector.get(TIConstants.VALUE_VECTOR_9));
		setChannelId((String) inputVector.get(TIConstants.CHANNEL_ID_POS));
		setRefNo((String) inputVector.get(TIConstants.REFERENCE_NO_POS));
		setLangId((String) inputVector.get(TIConstants.LANGID_INDEX_IN_VECTOR));
		setBranch((String) inputVector.get(TIConstants.VALUE_VECTOR_13));
		setDate((String) inputVector.get(TIConstants.VALUE_DATE_INDEX_IN_VECTOR));
		setTxnStatus((String) inputVector.get(TIConstants.TXNSTATUS_POS));
		setVersionNo((String) inputVector.get(TIConstants.VERSION_NO_POS));
		setCustType((String) inputVector.get(TIConstants.VALUE_VECTOR_17));
		setInputAction((String) inputVector.get(TIConstants.INPUT_ACTION_INDEX_IN_VECTOR));
		setConfirmScr((String) inputVector.get(TIConstants.CONFIRMSCR_POS));
		setInputParams((Map) inputVector.get(TIConstants.VALUE_VECTOR_21));

		setMode((String) inputVector.get(TIConstants.VALUE_VECTOR_20));
		setAugmentedCachedHashMap(getAugmentedCachedHashMap(inputVector));
		setActionCode((String) inputVector.get(TIConstants.INPUT_ACTION_INDEX_IN_VECTOR));

		if ((inputVector.get(inputVector.size() - 1)) instanceof Connection)
		{
			setConnection((Connection) inputVector.get(inputVector.size() - 1));
		}

		setUtilAuditDataMap((Map) inputVector.get(TIConstants.VALUE_VECTOR_21));
		setAdditionalDataMap(additionalDataMap);

		setPageCodeType((String) inputVector.get(TIConstants.VALUE_VECTOR_26));

	}

	/**
	 * Gets the cached HashMap from InputVector. Same as getJSPHashMap method except that other transaction related data
	 * is also populated in the return HashMap.
	 * 
	 * @param Vector Contains TI framework defined fields in positions ranging from 0 to 28+
	 * 
	 * @return Map Cached HashMap with additional data from Vector
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
	 * refactored method to get the jspfields hashmap from vector either from the 26th index in the vector, if not get
	 * from the last but one the position from the vector
	 * 
	 * @param inputVector
	 * @return the hashpmap present in the vector
	 */
	private static HashMap getFieldsHashMapFromVector(Vector inputVector)
	{
		HashMap map = new HashMap();
		Object cachedHashMapObj = inputVector.get(HASH_MAP_POSITION + 1);
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
	 * api to get the data in vector based on the index number of the input vector.
	 * 
	 * @param position of the data in input vector.
	 * @return data in the input vector for the index passed as param.
	 */
	public final Object getDataByPosition(final int position)
	{
		return additionalDataMap.get("VALUE_POSITION_" + position);
	}

	/**
	 * api to get the augmented Hash map.
	 * 
	 * @return augmentedCachedMap
	 */

	public final Map<String, Object> getAugmentedCachedHashMap()
	{
		return augmentedCachedHashMap;
	}

	/**
	 * sets the additional data map.
	 * 
	 * @param additionaldatamap the additionalDataMap to set.
	 */
	public final Map getAdditionalDataMap()
	{
		return additionalDataMap;
	}

	/**
	 * returns the session id.
	 * 
	 * @return the sessionId.
	 */
	public final String getSessionId()
	{
		return sessionId;
	}

	/**
	 * return the txn code.
	 * 
	 * @return the txnCode
	 */
	public final String getTxnCode()
	{
		return txnCode;
	}

	/**
	 * gets the customer number.
	 * 
	 * @return the customerNo
	 */
	public final String getCustomerNo()
	{
		return customerNo;
	}

	/**
	 * gets the user No.
	 * 
	 * @return the userNo.
	 */
	public final String getUserNo()
	{
		return userNo;
	}

	/**
	 * get the function code.
	 * 
	 * @return the functionCode
	 */
	public final String getFunctionCode()
	{
		return functionCode;
	}

	/**
	 * gets the product code.
	 * 
	 * @return the productCode.
	 */
	public final String getProductCode()
	{
		return productCode;
	}

	/**
	 * gets the sub product code.
	 * 
	 * @return the subProductCode
	 */
	public final String getSubProductCode()
	{
		return subProductCode;
	}

	/**
	 * gets the debt aacc number.
	 * 
	 * @return the debitAccNumber
	 */
	public final String getDebitAccNumber()
	{
		return debitAccNumber;
	}

	/**
	 * gets the debit amount.
	 * 
	 * @return the debitAmount
	 */
	public final double getDebitAmount()
	{
		return debitAmount;
	}

	/**
	 * gets the currency.
	 * 
	 * @return the currency
	 * 
	 */
	public final String getCurrency()
	{
		return currency;
	}

	/**
	 * gets the channel id.
	 * 
	 * @return the channelId
	 */
	public final String getChannelId()
	{
		return channelId;
	}

	/**
	 * gets the txn ref no.
	 * 
	 * @return the refNo
	 */
	public final String getRefNo()
	{
		return refNo;
	}

	/**
	 * gets the lang id.
	 * 
	 * @return the langId
	 */
	public final String getLangId()
	{
		return langId;
	}

	/**
	 * gets the branch name.
	 * 
	 * @return the branch
	 */
	public final String getBranch()
	{
		return branch;
	}

	/**
	 * gets the date.
	 * 
	 * @return the date
	 */
	public final String getDate()
	{
		return date;
	}

	/**
	 * gets the txn status.
	 * 
	 * @return the txnStatus
	 */
	public final String getTxnStatus()
	{
		return txnStatus;
	}

	/**
	 * gets the version number.
	 * 
	 * @return the versionNo
	 */
	public final String getVersionNo()
	{
		return versionNo;
	}

	/**
	 * gets yhe customer type.
	 * 
	 * @return the custType
	 */
	public final String getCustType()
	{
		return custType;
	}

	/**
	 * gets the input action.
	 * 
	 * @return the inputAction
	 */
	public final String getInputAction()
	{
		return inputAction;
	}

	/**
	 * gets the confirm screen.
	 * 
	 * @return the ConfirmScr
	 */
	public final String getConfirmScr()
	{
		return confirmScr;
	}

	/**
	 * gets the input parameters.
	 * 
	 * @return the inputParams
	 */
	public final Map getInputParams()
	{
		return inputParams;
	}

	/**
	 * gets the mode.
	 * 
	 * @return the mode
	 */
	public final String getMode()
	{
		return mode;
	}

	/**
	 * gets the pagecode type.
	 * 
	 * @return the pageCodeType
	 */
	public final String getPageCodeType()
	{
		return pageCodeType;
	}

	/**
	 * gets the action cod.
	 * 
	 * @return the actionCode
	 */
	public final String getActionCode()
	{
		return actionCode;
	}

	/**
	 * gets the connection.
	 * 
	 * @return the connection object
	 */

	public final Connection getConnection()
	{
		return connection;
	}

	/**
	 * gets the auditDataMap.
	 * 
	 * @return the utilAuditDataMap.
	 */

	public final Map getUtilAuditDataMap()
	{
		return utilAuditDataMap;
	}

	/**
	 * sets the action code.
	 * 
	 * @param actioncode : action for the request passed
	 */
	private void setActionCode(final String actioncode)
	{
		this.actionCode = actioncode;
	}

	/**
	 * 
	 * sets the connection object.
	 * 
	 * @param con : Connection object
	 */
	private void setConnection(final Connection con)
	{
		this.connection = con;
	}

	/**
	 * sets the auditdata map.
	 * 
	 * @param utilauditdatamap : map that holds the data for audit purpose
	 */
	private void setUtilAuditDataMap(final Map utilauditdatamap)
	{
		this.utilAuditDataMap = utilauditdatamap;
	}

	/**
	 * sets the session id.
	 * 
	 * @param sessionid the sessionId to set
	 */
	private void setSessionId(final String sessionid)
	{
		this.sessionId = sessionid;
	}

	/**
	 * sets the txn code.
	 * 
	 * @param txncode the txnCode to set
	 */
	private void setTxnCode(final String txncode)
	{
		this.txnCode = txncode;
	}

	/**
	 * sets the customer number.
	 * 
	 * @param customerno the customerNo to set
	 */
	private void setCustomerNo(final String customerno)
	{
		this.customerNo = customerno;
	}

	/**
	 * sets the user number.
	 * 
	 * @param userno the userNo to set
	 */
	private void setUserNo(final String userno)
	{
		this.userNo = userno;
	}

	/**
	 * sets the function code.
	 * 
	 * @param functioncode the functionCode to set
	 */
	private void setFunctionCode(final String functioncode)
	{
		this.functionCode = functioncode;
	}

	/**
	 * sets the product code.
	 * 
	 * @param productcode the productCode to set
	 */
	private void setProductCode(final String productcode)
	{
		this.productCode = productcode;
	}

	/**
	 * sets the sub product.
	 * 
	 * @param subProductcode the subProductCode to set
	 */
	private void setSubProductCode(final String subProductcode)
	{
		this.subProductCode = subProductcode;
	}

	/**
	 * sets the debit acc number.
	 * 
	 * @param debitAccnumber the debitAccNumber to set
	 */
	private void setDebitAccNumber(final String debitAccnumber)
	{
		this.debitAccNumber = debitAccnumber;
	}

	/**
	 * sets the debit amount.
	 * 
	 * @param debitamount the debitAmount to set
	 */
	private void setDebitAmount(final double debitamount)
	{
		this.debitAmount = debitamount;
	}

	/**
	 * sets the currenc.
	 * 
	 * @param curr the currency to set.
	 */
	private void setCurrency(final String curr)
	{
		this.currency = curr;
	}

	/**
	 * sets the channel id.
	 * 
	 * @param channelid the channelId to set
	 */
	private void setChannelId(final String channelid)
	{
		this.channelId = channelid;
	}

	/**
	 * sets the ref no.
	 * 
	 * @param refno the refNo to set
	 */

	public void setRefNo(final String refno)
	{
		this.refNo = refno;
	}

	/**
	 * sets the lang id.
	 * 
	 * @param langid the langId to set
	 */
	private void setLangId(final String langid)
	{
		this.langId = langid;
	}

	/**
	 * sets the branch.
	 * 
	 * @param branchname the branch to set
	 */
	private void setBranch(final String branchname)
	{
		this.branch = branchname;
	}

	/**
	 * sets the date.
	 * 
	 * @param datepay the date to set
	 */
	private void setDate(final String datepay)
	{
		this.date = datepay;
	}

	/**
	 * sets the txn status.
	 * 
	 * @param txnstatus the txnStatus to set
	 */

	public void setTxnStatus(final String txnstatus)
	{
		this.txnStatus = txnstatus;
	}

	/**
	 * sets the ver no.
	 * 
	 * @param versionno the versionNo to set
	 */

	public void setVersionNo(final String versionno)
	{
		this.versionNo = versionno;
	}

	/**
	 * sets the customer type.
	 * 
	 * @param custtype the custType to set
	 */
	private void setCustType(final String custtype)
	{
		this.custType = custtype;
	}

	/**
	 * sets the input action.
	 * 
	 * @param inputaction the inputAction to set
	 */
	private void setInputAction(final String inputaction)
	{
		this.inputAction = inputaction;
	}

	/**
	 * sets the confirmscr.
	 * 
	 * @param confirmscr the ConfirmScr to set
	 */
	private void setConfirmScr(final String confirmscr)
	{
		this.confirmScr = confirmscr;
	}

	/**
	 * sets the input params.
	 * 
	 * @param inputparams the inputParams to set
	 */
	private void setInputParams(final Map inputparams)
	{
		this.inputParams = inputparams;
	}

	/**
	 * sets the modetype.
	 * 
	 * @param modetype the mode to set
	 */
	private void setMode(final String modetype)
	{
		this.mode = modetype;
	}

	/**
	 * sets the pagecodetype.
	 * 
	 * @param pagecodetype the pageCodeType to set
	 */
	private void setPageCodeType(final String pagecodetype)
	{
		this.pageCodeType = pagecodetype;
	}

	/**
	 * sets the additional data map.
	 * 
	 * @param additionaldatamap the additionalDataMap to set.
	 */
	public void setAdditionalDataMap(final Map additionaldatamap)
	{
		this.additionalDataMap = additionaldatamap;
	}

	/**
	 * sets the augmented cached hash map.
	 * 
	 * @param augmentedCachedHashmap the augmentedCachedHashmap to set
	 */
	public void setAugmentedCachedHashMap(final Map augmentedCachedHashmap)
	{
		this.augmentedCachedHashMap = augmentedCachedHashmap;
	}

	// private variables
	private String sessionId;
	private String txnCode;
	private String customerNo;
	private String userNo;
	private String functionCode;
	private String productCode;
	private String subProductCode;
	private String debitAccNumber;
	private double debitAmount;
	private String currency;
	private String channelId;
	private String refNo;
	private String langId;
	private String branch;
	private String date;

	private String txnStatus;
	private String versionNo;
	private String custType;
	private String inputAction;
	private String confirmScr;
	private Map inputParams;
	private String mode;
	private String pageCodeType;
	private Map additionalDataMap;

	private Map<String, Object> augmentedCachedHashMap; // Hashmap position if req param INPUT_MODE is not present.
														// Sometimes referred

	private String actionCode;
	private Connection connection;
	private Map utilAuditDataMap;

	/**
	 * this is ref to return DeviceType
	 * 
	 * @return the deviceType
	 */
	public String getDeviceType()
	{
		return (String) this.augmentedCachedHashMap.get("deviceType");
	}

	public Map getOldDataMap()
	{
		/**
		 * this is ref to return OldDataMap
		 * 
		 * @return HashMap
		 */
		return oldDataMap;
	}

	public void setOldDataMap(Map oldDataMap)
	{
		/**
		 * This method is used to SetOldDataMap
		 * 
		 * @param map
		 */
		this.oldDataMap = oldDataMap;
	}

	public Map getNewDataMap()
	{
		/**
		 * This methos is refer to getNewDataMap
		 */
		return newDataMap;
	}

	public void setNewDataMap(Map newDataMap)
	{
		/**
		 * This method is used to SetNewDataMap
		 * 
		 * @param Map
		 */
		this.newDataMap = newDataMap;
	}

	private Map oldDataMap;
	private Map newDataMap;

}
