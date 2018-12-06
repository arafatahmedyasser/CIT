/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 */
package com.intellectdesign.canvas.validator;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.intellectdesign.canvas.logger.Logger;
/**
 * This class is for ApplicationValidator
 * 
 * @version 1.0
 */
public class ApplicationValidator
{
	

	/**
	 * The <code>ApplicationValidator</code> desc empty constructor
	 */
	public ApplicationValidator()
	{
	}

	/**
	 * This is process method that does the application validation but ignores the variable skip the 
	 * the validation variable and so on compared to processex method
	 * 
	 * @param HashMap incomingData
	 * @param String vType
	 * @return String
	 * @exception ValidationException If any exception arises during the validation operation desc Hashmap will hold
	 *                database data and vtype will be the verification type, This method will validate the data based
	 *                Data and arraylist which hold the value of XML and the application will try to cross verify
	 * 
	 */
	public String process(HashMap incomingData, String vType, String fileName) throws ValidationException
	{
		String cmName = "ApplicationValidator.process";
		String data = "";
		logger.ctinfo("CTVAL00001", cmName);
		try
		{
			ParserWrapper parserWrapper = ParserWrapper.getInstance();
			ArrayList list = parserWrapper.validateMessage(vType, fileName);
			logger.ctdebug("CTVAL00002", cmName, incomingData);
			if (list == null || list.size() == 0)
			{
				logger.ctdebug("CTVAL00003", cmName);
				return data;
			}
			ServerValidator validation = new ServerValidation();
			data = validation.validate(incomingData, list);
			logger.ctdebug("CTVAL00004", data, cmName);
		} catch (Exception ex)
		{
			logger.cterror("CTVAL00043", ex, cmName);
			throw new ValidationException("Validation Exception process" + ex.getMessage());
		}
		return data;
	}

	/**
	 * The processEx method is extension of the process method. It takes the error string and converts them into message
	 * code objects with phrasevariable support
	 * 
	 * @param HashMap incomingData
	 * @param String vType, the vertical
	 * @param langId, the language Id
	 * @return List, a list of message codes
	 * @exception ValidationException If any exception arises during the validation operation desc Hashmap will hold
	 *                database data and vtype will be the verification type, his method will validate the data based
	 *                Data and arraylist which hold the value of XML and the application will try to cross verify
	 */
	public List processEx(HashMap incomingData, String vType, String fileName, String langId,
			String validationsToSkip, String validationStyle) throws ValidationException
	{
		String cmName = "ApplicationValidator.processEx";
		String data = "";
		List returnList = new ArrayList();

		logger.ctinfo("CTVAL00001", cmName);
		try
		{
			ParserWrapper parserWrapper = ParserWrapper.getInstance();
			ArrayList list = parserWrapper.validateMessage(vType, fileName);
			logger.ctdebug("CTVAL00006", cmName, incomingData);

			String txnStatus = (String) incomingData.get(INPUT_TXN_STATUS);
			logger.ctdebug("CTVAL00007", cmName, txnStatus);

			if (list == null || list.size() == 0)
			{
				logger.ctdebug("CTVAL00008", cmName);
				return returnList;
			}
			ServerValidator validation;
			int skipValidations = ServerValidation.PERFORM_ALL_VALIDATION;// initalise with default values
			int valStyle = VALIDATION_STYLE_BREAK_AT_FIRST_ERROR; // initalise with default values
			if (validationsToSkip != null && !validationsToSkip.equals(""))
			{
				logger.ctdebug("CTVAL00009", cmName, validationsToSkip);
				try
				{
					skipValidations = Integer.parseInt(validationsToSkip);
				} catch (NumberFormatException anException)// if an exception occurs just log it and use the default
															// value
				{
					logger.cterror("CTVAL00010", anException, cmName);
				}
				try
				{
					valStyle = Integer.parseInt(validationStyle);
				} catch (NumberFormatException anException)// if an exception occurs just log it and use the default
															// value
				{
					logger.cterror("CTVAL00011", anException, cmName);
				}

				validation = new ServerValidation(skipValidations, valStyle);
			} else
				validation = new ServerValidation();
			if (txnStatus != null && txnStatus.equals("DR"))
			{
			}

			else
			{
				data = validation.validate(incomingData, list);
			}
			logger.ctdebug("CTVAL00012", cmName, data);
			if (fileName.toLowerCase().equals("canvas"))
				fileName = fileName.toLowerCase() + "-default";
			returnList = ServerValidation.convertErrorStringToMessageCodeList(data, fileName.toLowerCase(), langId);// vertical
																														// type
																														// is
																														// used
																														// for
																														// fetching
																														// property
																														// file
																														// hence
																														// it
																														// has
																														// to
																														// be
																														// lowercase
		} catch (Exception ex)
		{
			logger.cterror("CTVAL00044", ex, cmName);
			throw new ValidationException("Validation Exception process" + ex.getMessage());
		}
		return returnList;

	}
	
	private static Logger logger = Logger.getLogger(ApplicationValidator.class);
	public static final int VALIDATION_STYLE_BREAK_AT_FIRST_ERROR = 1;
	public static final int VALIDATION_STYLE_FULL_VALIDATION = 2;
	private static final String INPUT_TXN_STATUS = "INPUT_TXN_STATUS";


}
