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

package com.intellectdesign.canvas.properties;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.ResourceBundle;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.intellectdesign.canvas.logger.Logger;

/**
 * This class is responsible to get complete readable message from property file for a message code in the preferred
 * language. This also supports phrase variable substitution
 * 
 * @version 1.0
 */
public class MessageManager
{
	public static final String ERROR_CODE_PREFIX = "ERR_";
	public static final String LABEL_CODE_PREFIX = "LBL_";

	/**
	 * This method returns the readable message in the preferred locale for a message code from the property file. The
	 * method checks the property file from the cache. If the property file is not in cache, the method loads the
	 * property file, caches it and then returns localized message description for message code.
	 * 
	 * @param product string value of the name of the property file
	 * @param messageCode string value of the name of the message key to find in the property file
	 * @param language string value of the name of language
	 * @param returnKeyIfMissing boolean flag that indicates whether the message code has message keys with phrase
	 *            variables
	 * @return messageDesc string value of readable message description for the message key or the message key itself in
	 *         ?messageCode? pattern in any one of following circumstance <li>when message object is not found for the
	 *         given key <li>when resource bundle is not found for the specified product
	 * 
	 * @exception anException exception object while retrieving the message
	 */
	public static String getMessage(String product, String messageCode, String language, boolean returnKeyIfMissing)
	{

		String cmName = "MessageManager.getMessage()";
		String messageDesc = "";
		String prptFileName = product + "_" + language;
		try
		{
			// If product value is either null or empty string then returning message code after prefix and suffixing ?.
			if (product == null || product.trim().equals(""))
			{
				// If product is provided as empty, it could mean that the translation may have to happen from the
				// default framework bundle. Try to load from the same.
				logger.ctdebug("CTPRU00014", cmName);
				// The framework bundles are cached using just the language key.
				prptFileName = language;
			}

			// verify if the resource bundle is in cache
			ResourceBundle res = bundles.get(prptFileName);

			// cache the resource bundle
			if (res == null)
			{
				logger.ctdebug("CTPRU00015", prptFileName);
				String country = "";
				String tempLang = "";
				if (language.indexOf("_") > 0)
				{
					country = language.substring(language.indexOf("_") + 1);
					tempLang = language.substring(0, language.indexOf("_"));
				}
				res = ResourceBundle.getBundle(product, new java.util.Locale(tempLang, country));
				// if for some reason the resource bundle is still null, then return the missing resource key
				if (res == null)
				{
					logger.ctdebug("CTPRU00016", prptFileName);
					messageDesc = constructMissingMessageKeyDescFor(messageCode, returnKeyIfMissing);
				} else
				// a valid resource bundle has been created cache it.
				{
					logger.ctdebug("CTPRU00017", prptFileName);
					bundles.put(prptFileName, res);
					logger.ctdebug("CTPRU00018", prptFileName);
				}
			}
			// the following check is required since in the preceding if condition,
			// if the resource bundle has not been created
			// a missing message description is already created.
			if (res != null)
			{
				// return the message description from the bundle
				messageDesc = res.getString(messageCode);
			}

		} catch (Exception anException)
		{
			logger.cterror("CTPRU00019", anException, messageCode, prptFileName);
			// create missingmessagekey descriptio for any exception.
			// if no resource bundle for the specified base name can be found
			messageDesc = constructMissingMessageKeyDescFor(messageCode, returnKeyIfMissing);

		}
		logger.ctdebug("CTPRU00020", messageCode, language, messageDesc);
		return messageDesc;
	}

	/**
	 * This method constructs the message code in ?MessageCode? pattern and then retruns the readable message in the
	 * preferred language from the property file for the message code. If the message description is not found in the
	 * property file, the method returns the ?MessageCode? as message description.
	 * 
	 * @param product string value of the name of the property file
	 * @param messageCode string value of the name of the message key to find in the property file
	 * @param language string value of the name of language
	 * @return messageDesc string value of readable message description for the message key or the message key itself in
	 *         ?messageCode? pattern in any one of following circumstance <li>when message object is not found for the
	 *         given key <li>when resource bundle is not found for the specified product
	 * 
	 * @exception anException exception object while retrieving the message
	 */
	public static String getMessage(String product, String messageCode, String language)
	{
		return getMessage(product, messageCode, language, false);
	}

	/**
	 * This overloaded method returns the message description in en_US language for the message code from the property
	 * file.
	 * 
	 * @param product string value of the name of the property file
	 * @param messageCode string value of the name of the message key to find in the property file
	 * @return messageDesc string value of readable message description for the message key or the message key itself in
	 *         ?messageCode? pattern in any one of following circumstance <li>when message object is not found for the
	 *         given key <li>when resource bundle is not found for the specified product
	 * 
	 * @exception anException exception object while retrieving the message
	 */
	public static String getMessage(String product, String messageCode)
	{
		return getMessage(product, messageCode, "en_US");
	}

	/**
	 * This utility method constructs a indexed list of message descriptions for list of MessageCodes. If the
	 * Messagecode List does not have an obejct, the method converts the Object to String and retrives description for
	 * the key.
	 * 
	 * @param product string value of the name of the property file
	 * @param messageCodeList string value of the message codes
	 * @param language string value of the language
	 * @return MessageList list of message descriptions for the corresponding message codes
	 */
	public static List<String> getMessages(String product, List<MessageCode> messageCodeList, String language)
	{
		List<String> returnList = new ArrayList<String>();
		if (messageCodeList != null && !messageCodeList.isEmpty())
		{
			Iterator<MessageCode> messageCodeListIterator = messageCodeList.iterator();
			String messageDesc;
			MessageCode amsgCode;
			while (messageCodeListIterator.hasNext())
			{
				try
				{
					amsgCode = messageCodeListIterator.next();
					messageDesc = getMessage(product, amsgCode, language);
				} catch (ClassCastException cce)
				{
					logger.cterror("CTPRU00021");
					/**
					 * This API is expected to all message cods are objects of MessageCode, If developer is faild to
					 * send as message codes then this API convert that Object to String and try to retrive description
					 * for the key.
					 */
					Object anOb = messageCodeListIterator.next();
					messageDesc = getMessage(product, anOb.toString(), language);
				}
				returnList.add(messageDesc);
			}
		}
		return returnList;
	}

	/**
	 * This method constructs message description for a message code object
	 * 
	 * @param product string value of the name of the property file
	 * @param amessageCode the MessageCode object containing message key, phrase variables and their values
	 * @param language string value of the name of the language
	 * @return tMessage string value of the message description or the value message code in ?messagekey? pattern
	 */
	public static String getMessage(String product, MessageCode amessageCode, String language)
	{
		return getMessage(product, amessageCode.getMessageKey(), language, amessageCode.getPhraseVariableCollection());
	}

	/**
	 * This method constructs readable message description after interpreting the phrase variables as values
	 * 
	 * @param product string value of the name of the property file
	 * @param messageCode string value of the message code for finding message description
	 * @param language string value of the name of the language
	 * @param phraseVariables the list of phrase variables that needs to be replaced with values
	 * @return returnMessage string value of the readable message description with phrase values
	 */
	public static String getMessage(String product, String messageCode, String language,
			List<PhraseVariable> phraseVariables)
	{
		String returnMessage = "";
		String rawMessage = getMessage(product, messageCode, language);
		// if there are no phrase variables or the message key is not present, then just return the message as it is.
		if (phraseVariables == null || phraseVariables.isEmpty() || isMissingMessageKey(rawMessage, messageCode))
			returnMessage = rawMessage;
		else
		{
			Iterator<PhraseVariable> pvIterator = phraseVariables.iterator();
			StringBuffer substitutedMessage = new StringBuffer();
			PhraseVariable aphrasevariable;
			while (pvIterator.hasNext())
			{
				// for each phrasevariable, construct phrasekey pattern to be searched for
				aphrasevariable = pvIterator.next();
				String pvKey = aphrasevariable.constructPhraseVariableKey();

				// find the pattern in the raw message description
				Pattern pvPattern = Pattern.compile(pvKey);
				Matcher pvMatcher = pvPattern.matcher(rawMessage);
				// if a match is found replace it with the value from phrasevariable
				// also the same phrase variable can be reused in the same description in more than one place
				// hence search the message description for all matches
				// and replace text as an when you find a match
				while (pvMatcher.find())
					pvMatcher.appendReplacement(substitutedMessage, aphrasevariable.getPhraseValue());
				// append the remaining portion of message to the new String
				pvMatcher.appendTail(substitutedMessage);
			}
			// at the end of this while the whole message description will have all the phrase variables substitued
			// with phrase values
			returnMessage = substitutedMessage.toString();
		}
		logger.ctdebug("CTPRU00022", messageCode, language, rawMessage);
		return returnMessage;
	}

	/**
	 * 
	 * This method constructs readable message description after interpreting the phrase variables those enclosed with
	 * custom delimiters
	 * 
	 * @param product string value of the name of the property file
	 * @param messageCode string value of the message code for finding message description
	 * @param language string value of the name of the language
	 * @param phraseVariables the list of phrase variables that needs to be replaced with values
	 * @param sStartPlaceHolder string value of the delimiter text that the phrase variable begins with
	 * @param sEndPlaceHolder string value of the delimiter text that the phrase variable ends with
	 * 
	 * @return returnMessage string value of the readable message description with phrase values
	 */
	public static String getMessage(String product, String messageCode, String language,
			List<PhraseVariable> phraseVariables, String sStartPlaceHolder, String sEndPlaceHolder)
	{
		String returnMessage = "";
		String rawMessage = getMessage(product, messageCode, language);
		// if there are no phrase variables or the message key is not present, then just return the message as it is.
		if (phraseVariables == null || phraseVariables.isEmpty() || isMissingMessageKey(rawMessage, messageCode)
				|| sStartPlaceHolder == null || sEndPlaceHolder == null)
			returnMessage = rawMessage;
		else
		{
			Iterator<PhraseVariable> pvIterator = phraseVariables.iterator();
			StringBuffer substitutedMessage = new StringBuffer(rawMessage);
			PhraseVariable aphrasevariable;
			String pvKey = null;
			Pattern pvPattern = null;
			Matcher pvMatcher = null;
			while (pvIterator.hasNext())
			{
				// for each phrasevariable, construct phrasekey pattern to be searched for
				aphrasevariable = pvIterator.next();
				pvKey = aphrasevariable.constructPhraseVariableKey(sStartPlaceHolder, sEndPlaceHolder);
				// find the pattern in the raw message description
				pvPattern = Pattern.compile(pvKey);
				pvMatcher = pvPattern.matcher(substitutedMessage.toString());
				substitutedMessage = new StringBuffer();
				// if a match is found replace it with the value from phrasevariable
				// also the same phrase variable can be reused in the same description in more than one place
				// hence search the message description for all matches
				// and replace text as an when you find a match
				String phraseVariable = null;
				while (pvMatcher.find())
				{
					phraseVariable = aphrasevariable.getPhraseValue().replace("$", "\\$");
					pvMatcher.appendReplacement(substitutedMessage, phraseVariable);
				}
				// append the remaining portion of message to the new String
				pvMatcher.appendTail(substitutedMessage);
			}// at the end of this while the whole message description will have all the phrase variables substitued
				// with phrase values
			returnMessage = substitutedMessage.toString();
		}
		logger.ctdebug("CTPRU00023", messageCode, language, rawMessage);
		return returnMessage;
	}

	/**
	 * This method checks and returns true when the message string passed is in ?messageCode? pattern
	 * 
	 * @param message string value of the text to check for message pattern
	 * @param messageCode string value of the message code
	 * @return true if matching the pattern or false it does not
	 */
	// private static boolean isMissingMessageKey(String message, String messageCode)
	public static boolean isMissingMessageKey(String message, String messageCode)
	{
		return (message.equals(constructMissingMessageKeyDescFor(messageCode)));
	}

	/**
	 * This method construts the message code with message pattern i.e ?messagecode?
	 * 
	 * @param messageCode string value of the message key without pattern
	 * 
	 * @return messageCode string value of the message key with ?messagecode? pattern
	 */
	protected static String constructMissingMessageKeyDescFor(String messageCode)
	{
		return MISSING_MESSAGE_KEY_IDENTIFIER + messageCode + MISSING_MESSAGE_KEY_IDENTIFIER;
	}

	/**
	 * This method checks and returns the message code with valid pattern (i.e ?messagecode?).
	 * 
	 * 
	 * @param messageCode string value of the message code with or without pattern
	 * @param returnKeyIfMissing boolean
	 * @return messageCode string value of the message code with valid pattern (i.e ?messagecode?)
	 */
	protected static String constructMissingMessageKeyDescFor(String messageCode, boolean returnKeyIfMissing)
	{
		if (returnKeyIfMissing)
			return messageCode;
		else
			return constructMissingMessageKeyDescFor(messageCode);
	}

	/**
	 * This method adds the default bundle used within the framework for the given locale.
	 * 
	 * @param locale The locale for which this is the default framework bundle
	 * @param aBundle The bundle to be registered.
	 */
	public static void registerDefaultBundle(String locale, ResourceBundle aBundle)
	{
		bundles.put(locale, aBundle);
	}

	/**
	 * This method returns the default bundle used within the framework for the given locale
	 * 
	 * @param locale The locale for which default bundle is required
	 * @return The framework bundle for the locale.
	 */
	public static ResourceBundle getDefaultBundleFor(String locale)
	{
		return bundles.get(locale);
	}

	// cache for resource bundles.
	private static HashMap<String, ResourceBundle> bundles = new HashMap<String, ResourceBundle>(3);

	private static final Logger logger = Logger.getLogger(MessageManager.class);

	// constants for indicating a missing message key
	private static final String MISSING_MESSAGE_KEY_IDENTIFIER = "?";
}