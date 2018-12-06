/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 **/
package com.intellectdesign.canvas.validator.locale;

import java.util.HashMap;
import java.util.Locale;

import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.validator.ServerValidation;
/**
 *Class <code>LocaleLanguageCharacterSetFactory</code> supports the User prefererred Locale by executing the validation
 * check based on the locale
 * 
 * @version 1.0
 */
public class LocaleLanguageCharacterSetFactory
{
	/**
	 * Executes the validation check based on the userpreferre locale. <code>execute</code>checks the input data
	 * recieved in the fields against the locale specific character Set.If the input data is not valid an error code
	 * suffix denoting the locale specific validation check faliure is returned
	 * 
	 * @param langId - User preferred locale
	 * @param inputData - Data which is received by the input fields which needs to be validated
	 * @param inclusiveData - permitted inclusive characters
	 * @param exclusiveData - special characters that needs to be eliminated while validation
	 * @param xml_type - The field type
	 * @return Returns true if valid or false otherwise
	 */
	public boolean execute(String langId, String inputData, String inclusiveData, String exclusiveData, String xml_type)
	{
		return execute(langId, inputData, inclusiveData, exclusiveData, xml_type, false);
	}

	/**
	 * Executes the validation check based on the userpreferre locale. <code>execute</code>checks the input data
	 * recieved in the fields against the locale specific character Set.If the input data is not valid an error code
	 * suffix denoting the locale specific validation check faliure is returned
	 * 
	 * @param langId - User preferred locale
	 * @param inputData - Data which is received by the input fields which needs to be validated
	 * @param inclusiveData - permitted inclusive characters
	 * @param exclusiveData - special characters that needs to be eliminated while validation
	 * @param multiLine - Flag indicating if the data is expected to be multi line
	 * @return Returns true if valid or false otherwise
	 */
	public boolean execute(String langId, String inputData, String inclusiveData, String exclusiveData,
			String xml_type, boolean multiLine)
	{
		return execute(langId, inputData, inclusiveData, exclusiveData, xml_type, multiLine, false, null, null);
	}

	/**
	 * Executes the validation check based on the userpreferre locale. <code>execute</code>checks the input data
	 * recieved in the fields against the locale specific character Set.If the input data is not valid an error code
	 * suffix denoting the locale specific validation check faliure is returned
	 * 
	 * @param langId - User preferred locale
	 * @param inputData - Data which is received by the input fields which needs to be validated
	 * @param inclusiveData - permitted inclusive characters
	 * @param exclusiveData - special characters that needs to be eliminated while validation
	 * @param multiLine - Flag indicating if the data is expected to be multi line
	 * @param multiLang - Flag indicating whether multi lingual input needs to be supported
	 * @param multilangIds - The list of lang ids configured
	 * @param restrictLangId - Any lang id restriction provided as part of data
	 * @return Returns true if valid or false otherwise
	 */
	public boolean execute(String inputLangId, String inputData, String inclusiveData, String exclusiveData,
			String xml_type, boolean multiLine, boolean multiLang, String multilangIds, String restrictLangId)
	{
		boolean isValid = false;
		char[] charSet = null;
		String langCode = null;
		String countryCode = null;
		ValidCharacterSet validateChar = null;

		logger.ctdebug("CTVAL00036", inputLangId, inputData, inclusiveData, exclusiveData, xml_type);

		// If no locale is specified the en_US should be taken as default langId
		if (inputLangId == null || inputLangId.trim().equals(""))
		{
			inputLangId = LocaleSupportConstants.LOCALE_ENGLISH;
		}

		langCode = inputLangId.substring(LocaleSupportConstants.LANG_CODE_START_INDEX,
				LocaleSupportConstants.LANG_CODE_END_INDEX);
		countryCode = inputLangId.substring(LocaleSupportConstants.COUNTRY_CODE_START_INDEX);

		if (multiLang)
		{
			// If multi lang is being used, then create that character set explicitly.
			validateChar = new MultiLangCharacterSet(multilangIds, restrictLangId);
		} else
		{
			// Otherwise create the character set based on the lang Id identified.
			validateChar = getCharSetImpl(inputLangId);
		}

		if (validateChar != null)
		{
			if (xml_type.equalsIgnoreCase(ServerValidation.TYPE_ALPHAONLY))
				charSet = validateChar.alphaCharSet();
			else if (xml_type.equalsIgnoreCase(ServerValidation.TYPE_STRINGNUMERICONLY))
				charSet = validateChar.numericCharSet();
			else if (xml_type.equalsIgnoreCase(ServerValidation.TYPE_ALPHANUMERICONLY))
				charSet = validateChar.alphaNumericCharSet();
			else if (xml_type.equalsIgnoreCase(ServerValidation.TYPE_ALPHAUPPERCASEONLY))
				charSet = getUpperCharSet(validateChar.alphaCharSet(), langCode, countryCode);
			else if (xml_type.equalsIgnoreCase(ServerValidation.TYPE_ALPHANUMERICUPPERCASEONLY))
				charSet = getUpperCharSet(validateChar.alphaNumericCharSet(), langCode, countryCode);
			else if (xml_type.equalsIgnoreCase(ServerValidation.TYPE_SWIFT))
			{
				if (multiLine)
					charSet = validateChar.alphaNumericCharSet();
				else
					charSet = validateChar.alphaCharSet();
			} else
			{
				charSet = ValidCharacterSet.BLANK_CHARACTER_SET;
				logger.cterror("CTVAL00037", xml_type);
			}

			// Set the character Set
			validateChar.setCharSet(charSet);
			// Set the inclusive characters allowed
			if (inclusiveData != null)
				validateChar.setInclusions(new StringBuffer(inclusiveData));
			// Set the exclusive characters
			if (exclusiveData != null)
				validateChar.setExclusions(new StringBuffer(exclusiveData));
			// isValid returns a boolean value to represent whether the inputdata ia valid or not
			if (inputData != null && !inputData.trim().equals(""))
			{
				isValid = validateChar.isValid(inputData);
			} else
				isValid = true;

		} else
		{
			// This could only mean that lang id provided is invalid. So log the same as an error.
			logger.cterror("CTVAL00038", inputLangId);
		}

		logger.ctdebug("CTVAL00039", xml_type, isValid);
		return isValid;
	}

	/**
	 * This method returns the class that implements the character set for the given lang id.
	 * 
	 * @param langId The lang id for which character set needs to be identified.
	 * @return The character set object for this lang id
	 */
	protected ValidCharacterSet getCharSetImpl(String langId)
	{
		ValidCharacterSet validateChar = null;
		String localeSpecificClassName = LOCALE_TO_CHARACTERSET_MAPPING.get(langId);
		Class validator;
		try
		{
			validator = Class.forName(localeSpecificClassName);
			validateChar = (ValidCharacterSet) validator.newInstance();
		} catch (ClassNotFoundException e)
		{
			logger.cterror("CTVAL00040", localeSpecificClassName);
		} catch (InstantiationException e)
		{
			logger.cterror("CTVAL00041", localeSpecificClassName);
		} catch (IllegalAccessException e)
		{
			logger.cterror("CTVAL00042", localeSpecificClassName);
		}
		return validateChar;
	}

	/**
	 * Returns a character array with uppercase values of the character set passed as argument
	 * 
	 * @param inputChar character array whose values has to be changed to uppercase
	 * @param langCode - language code for the locale for uppercase conversion
	 * @param countryCode - country code for the locale for uppercase conversion
	 * @return Returns a character array whose values are in upper case
	 */
	private char[] getUpperCharSet(char[] inputChar, String langCode, String countryCode)
	{
		char[] upperCharSet = null;
		String charSet = new String(inputChar);
		charSet = charSet.toUpperCase(new Locale(langCode, countryCode));
		upperCharSet = charSet.toCharArray();
		return upperCharSet;
	}

	// a mapping variable to maintain between the Locale and the character Set
	private static final HashMap<String, String> LOCALE_TO_CHARACTERSET_MAPPING = new HashMap<String, String>();
	private static final Logger logger = Logger.getLogger(LocaleLanguageCharacterSetFactory.class);

	// Static block to map locale to specific classes for handling that locale
	static
	{
		LOCALE_TO_CHARACTERSET_MAPPING.put(LocaleSupportConstants.LOCALE_ENGLISH,
				LocaleSupportConstants.LOCALE_ENGLISH_CLASS);
		LOCALE_TO_CHARACTERSET_MAPPING.put(LocaleSupportConstants.LOCALE_SPANISH,
				LocaleSupportConstants.LOCALE_SPANISH_CLASS);
		LOCALE_TO_CHARACTERSET_MAPPING.put(LocaleSupportConstants.LOCALE_ARABIC,
				LocaleSupportConstants.LOCALE_ARABIC_CLASS);
		LOCALE_TO_CHARACTERSET_MAPPING.put(LocaleSupportConstants.LOCALE_SIMPLIFIED_CHINESE,
				LocaleSupportConstants.ANYLOCALE_ANYLANGUAGE_CLASS);
		LOCALE_TO_CHARACTERSET_MAPPING.put(LocaleSupportConstants.LOCALE_SWIFT,
				LocaleSupportConstants.LOCALE_SWIFT_CLASS);
	}

}
