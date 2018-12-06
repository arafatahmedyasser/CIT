/***************************************************************
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
 *****************************************************************/

package com.intellectdesign.canvas.datahandler;

import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

import javax.servlet.http.HttpServletRequest;

import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.login.sessions.SessionManager;
import com.intellectdesign.canvas.pref.amount.AmountFormatterManager;
import com.intellectdesign.canvas.pref.date.DateFormatterManager;

/**
 * Utility class to handle type based formatting required for some paramname paramvalue of request object Support types
 * are amount A and date D.
 * 
 * @version 1.0
 */
public class ParamValueTypeHandler
{
	/**
	 * Performs the typebased handling on the paramname's value in the request object
	 * 
	 * @param paramname
	 * @param request
	 * @return String , typically the formatted value for the corresponding type.
	 */
	public static String performTypeHandlingFor(String paramname, HttpServletRequest request)
	{
		String value = request.getParameter(paramname);
		if (paramname != null && paramname.indexOf(TYPE_IDENTIFIER) == -1)
			return value;
		else
		{
			String type = getTypeInfo(paramname);
			if (isValidType(type))
				value = executeTypeHandler(type, value, request);
		}
		return value;
	}

	/**
	 * Retrieves only the key portion from the aparamkey, ex: if aparamkey is CODE$D, then this method returns CODE if
	 * aparamkey is CODES$A, then this method returns CODES if aparamkey does not have a $ then it returns the paramkey
	 * as is. if aparamkey does not have the $ as the last but 1 character, it return the aparamkey as is
	 * 
	 * @param aparamkey
	 * @return returns only the key portion of aparamkey
	 */
	protected static String getOnlyKeyFrom(String aparamkey)
	{
		String returnKey = "";
		if (aparamkey != null)
		{
			int typeIdentifierIndex = aparamkey.indexOf(TYPE_IDENTIFIER);
			if (typeIdentifierIndex == -1)// if there is no type_identifier
				returnKey = aparamkey;
			else
			{
				int typeIdentifierRelativeIndex = aparamkey.length() - TYPE_IDENTIFIER_RELATIVE_INDEX;
				// if the type_identifier is not the last but one character in the paramkey return the paramkey itself
				// the minimum typeIdentifierRelativeIndex value should be 1,
				// if it is 0, it means the first character is the typeIdentifier itself,
				// in which case, it is not a valid "typeinfo-loaded-paramkey"
				// Refer this class's documentation for more details
				if (typeIdentifierRelativeIndex > 0)
				{
					String typeIdentifierInParamKey = String.valueOf(aparamkey.charAt(typeIdentifierRelativeIndex));
					if (!TYPE_IDENTIFIER.equals(typeIdentifierInParamKey))
						returnKey = aparamkey;
					else
					{
						// this means the type_identifier is the last but one character in the paramkey,
						// hence return the key portion using typeIdentifierIndex.
						// note: typeIdentifierIndex has the index of first occurence of typeIdentifier
						// which is to be used to retrieve only the key portion
						// while typeIdentifierRelativeIndex is to check whether the type_identifier is the last but one
						// character
						returnKey = aparamkey.substring(0, typeIdentifierIndex);
					}

				} else
					returnKey = aparamkey;
			}
		} else
			returnKey = "";

		logger.ctdebug("CTRND00024", aparamkey, returnKey);
		return returnKey;
	}

	/**
	 * This method calls the appropriate type handler for performing type based handling
	 * 
	 * @param type
	 * @param value
	 * @return String
	 */
	private static String executeTypeHandler(String type, String value, HttpServletRequest request)
	{
		logger.ctdebug("CTRND00025", type, value);
		if (type.equals(TYPE_AMOUNT))
		{
			logger.ctdebug("CTRND00026");
			return handleAmountType(value, request);
		} else if (type.equals(TYPE_DATE))
		{
			logger.ctdebug("CTRND00027");
			return handleDateType(value, request);
		} else
		{
			logger.ctdebug("CTRND00028", type);
			return value;
		}

	}

	/**
	 * amount type handler, basically format the amount value to the user's preferred amount format
	 * 
	 * @param origValue, the unformattted amount value
	 * @param request
	 * @return the formmatted amount, or the origValue if any exception occurs
	 */
	private static String handleAmountType(String origValue, HttpServletRequest request)
	{
		String formattedAmount = "";
		if (origValue == null || origValue.equals(""))
			return origValue;
		SessionManager lSessionManager = SessionManager.getInstance();
		String amountFormat = lSessionManager.getUserSessionInfo(request).mAmtFormat;

		if (amountFormat == null || amountFormat.equals(""))
		{
			logger.ctdebug("CTRND00029");
			// try attempting to format assuming a standardformat
			amountFormat = "USA";
		}
		formattedAmount = AmountFormatterManager.convertAmountToStandardFormat(origValue, amountFormat);
		return formattedAmount;
	}

	/**
	 * date type handler, basically formats the date value to the user's preferred date format
	 * 
	 * @param origValue, the unformattted date value
	 * @param request
	 * @return the formatted date, or the origValue if any exception occurs
	 */
	private static String handleDateType(String origValue, HttpServletRequest request)
	{
		String formattedDate = null;
		String jDateFormat = null;
		if (origValue == null || origValue.equals(""))
			return origValue;

		SessionManager lSessionManager = SessionManager.getInstance();
		String dateFormat = lSessionManager.getUserSessionInfo(request).mDateFormat;

		if (dateFormat == null || dateFormat.equals(""))
		{
			logger.ctdebug("CTRND00030");
			// try attempting to format assuming a standardformat
			jDateFormat = "dd/MM/YYYY";
		}else{
			jDateFormat = DateFormatterManager.getJavaDateFormat(dateFormat);
		}

		formattedDate = DateFormatterManager.convertDateToStandardFormat(jDateFormat, origValue);

		return formattedDate;
	}

	/**
	 * Check if the type info in the paramName is a valid type for now, valid types of 'A' and 'D'
	 * 
	 * @param type
	 * @return boolean
	 */
	private static boolean isValidType(String type)
	{
		if (type == null || type.equals(""))
			return false;
		else
			return validListOfTypes.contains(type);
	}

	/**
	 * Returns the type string from the paramName
	 * 
	 * @param paramName
	 * @return String, the type info from the paramName
	 */
	private static String getTypeInfo(String paramName)
	{
		StringTokenizer st = new StringTokenizer(paramName, TYPE_IDENTIFIER);
		String aToken = "";
		while (st.hasMoreTokens())
			aToken = st.nextToken();
		return aToken;// returns the lastToken which has the type info.
	}

	// Type identifier
	public static final String TYPE_IDENTIFIER = "$";
	// Amount data type
	public static final String TYPE_AMOUNT = "A";
	// Date data type
	public static final String TYPE_DATE = "D";
	// index of the Type_identifier in a key from the end of the string, basically it should be last but 1 charcater
	public static final int TYPE_IDENTIFIER_RELATIVE_INDEX = 2;
	// a list of valid datatypes
	private static final List validListOfTypes = new ArrayList();
	// Logger object
	private static final Logger logger = Logger.getLogger(ParamValueTypeHandler.class);

	// initializer block to maintain the type information
	static
	{
		validListOfTypes.add(TYPE_AMOUNT);
		validListOfTypes.add(TYPE_DATE);
	}

}
