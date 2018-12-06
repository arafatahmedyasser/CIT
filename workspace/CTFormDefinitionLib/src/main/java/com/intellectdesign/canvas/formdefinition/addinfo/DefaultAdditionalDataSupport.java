/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.*/

package com.intellectdesign.canvas.formdefinition.addinfo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.log4j.Logger;

import com.intellectdesign.canvas.value.IUserValue;
import com.intellectdesign.canvas.formdefinition.FormDefinitionException;
import com.intellectdesign.canvas.formdefinition.FormItemDefinition;

import com.intellectdesign.canvas.viewdefinition.VDFReplyObject;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionException;
import com.intellectdesign.canvas.viewdefinition.ViewManager;

/**
 * This is the default implementation of the Inquiry Data support interface. This provides the default implementation
 * for handling the requests from the Inquiry framework. This class is expected to be a lightweight class that can be
 * easily created and disposed off as and when necessary. So it should not be storing references to any shared
 * resources.
 */
public class DefaultAdditionalDataSupport implements IAdditionalDataSupport
{

	/**
	 * 
	 * @see com.intellectdesign.cib.formdefinition.addinfo.IAdditionalDataSupport#getAdditionalDataFor(com.intellectdesign.cib.viewdefinition.ViewDefinition,
	 *      com.intellectdesign.cib.formdefinition.FormItemDefinition, com.orbidirect.aps.common.UserValue, java.util.HashMap)
	 */
	public ArrayList<AdditionalDataCodeValue> getAdditionalDataFor(FormItemDefinition itemDefn, IUserValue userValue,
			HashMap inputParams) throws FormDefinitionException
	
	{
		ViewManager aViewManager = new ViewManager();
		String codeValueViewId = itemDefn.getDsViewId();
		String codeValColName = itemDefn.getDsValueColumnId();
		String dispValColName = itemDefn.getDsKeyColumnId();

		VDFReplyObject vdfReply = null;
		LOGGER.debug("getSearchMetaDataFor: Fetching data for view - '" + codeValueViewId + "'");
		try
		{
			// Get all the data for the view
			vdfReply = aViewManager.getView(codeValueViewId, inputParams, userValue, null);
		} catch (ViewDefinitionException ex)
		{
			LOGGER.error("A ViewDefinitionException occurred", ex);
			throw new FormDefinitionException(ex);
		}
		if(null==vdfReply){
			return null;
		}else{
			// Convert it to the expected result format
			return convertToCodeValueList(vdfReply.getViewData(), codeValColName, dispValColName);
		}
	}

	/**
	 * Intended to create Code Value and Code Key lists. Iterates codeValList records 1) Get Code value from record and
	 * add that to codeColList. 2)Get code display value from record and add it to codeDispList.
	 * 
	 * @param codeValList - List of HashMap's, Each HashMap represents a code value record.
	 * @param codeVal - Code value code column key
	 * @param codeDisp - Code Value display column key
	 * @return Returns list of Code Value list and Code Key list
	 */
	private ArrayList<AdditionalDataCodeValue> convertToCodeValueList(List codeValList, String codeValColName,
			String codeDispColName)
	{
		LOGGER.debug("convertToCodeValueList: code values list to be converted - " + codeValList);
		LOGGER.debug("convertToCodeValueList: Code col = '" + codeValColName + "', Disp Col = '" + codeDispColName
				+ "'.");
		ArrayList<AdditionalDataCodeValue> returnList = new ArrayList<AdditionalDataCodeValue>();
		AdditionalDataCodeValue aCodeValue = null;
		if (codeValList != null && !codeValList.isEmpty())
		{
			int codeValListSize = codeValList.size();
			HashMap aRec = null;
			for (int index = 0; index < codeValListSize; index++)
			{
				aRec = (HashMap) codeValList.get(index);
				aCodeValue = new AdditionalDataCodeValue();
				aCodeValue.setCodeValue((String) aRec.get(codeValColName));
				aCodeValue.setDisplayValue((String) aRec.get(codeDispColName));
				returnList.add(aCodeValue);
			}
		}
		LOGGER.debug("convertToCodeValueList: Returning - " + returnList);
		return returnList;
	}

	private static Logger LOGGER = Logger.getLogger(DefaultAdditionalDataSupport.class);


}
