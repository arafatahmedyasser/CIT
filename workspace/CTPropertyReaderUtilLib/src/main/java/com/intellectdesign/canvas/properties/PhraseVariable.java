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

import java.io.Serializable;

/**
 * This class is responsible to capture the phrasal variable entities used in messages. A phrase variable is a
 * substitution variable that appear with values in the info, error or warning messages across CT framework.
 * 
 * @version 1.0
 */
public class PhraseVariable implements Serializable
{

	/**
	 * Default value of serialVersionUID
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * This constructor initializes phrase variables and their values.
	 * 
	 * @param aphrasekey string value of the phrase variables
	 * @param aphrasevalue string value of the values for the variables
	 */
	public PhraseVariable(String aphrasekey, String aphrasevalue)
	{
		setPhraseKey(aphrasekey);
		setPhraseValue(aphrasevalue);
	}

	/**
	 * This method returns the phrase keyes in the phrase variable
	 * 
	 * @return phraseKey string value of the phrase keys in the phrase variable.
	 */
	public String getPhraseKey()
	{
		return phraseKey;
	}

	/**
	 * This method sets the variables passed as argument as phrase keys
	 * 
	 * @param phraseKey string value of the list of phrase keys
	 */
	public void setPhraseKey(String phraseKey)
	{
		this.phraseKey = phraseKey;
	}

	/**
	 * This method returns the values of phrase variables
	 * 
	 * @return phraseValue string value of the list of phraseReturns the phraseValue
	 */
	public String getPhraseValue()
	{
		return phraseValue;
	}

	/**
	 * This method sets the values for the phrase variables
	 * 
	 * @param phraseValue string value of the variables to be set as phrase variables
	 */
	public void setPhraseValue(String phraseValue)
	{
		this.phraseValue = phraseValue;
	}

	/**
	 * This method creates the Phrase Variable keys for an errorCode passed as argument
	 * 
	 * @param errorCode string value of the error code
	 * @return PhraseVariableKey string value of the constructed variable key in the format PK@errorCode@phrasekey
	 */
	protected String constructPhraseVariableKeyUsing(String errorCode)
	{
		StringBuffer returnString = new StringBuffer();
		returnString.append(PHRASE_VARIABLE_PREFIX);
		returnString.append(PHRASE_VARIABLE_KEYS_SEPARATOR);
		returnString.append(errorCode);
		returnString.append(PHRASE_VARIABLE_KEYS_SEPARATOR);
		returnString.append(getPhraseKey());
		return returnString.toString();
	}

	/**
	 * This method constructs a phrase keys in <> pattern. For example: <<PK@phrasekey@>> will fetch messages similar to
	 * <<PK@FLDNAME@>> is invalid
	 * 
	 * @return PhraseVariableKey string value of the phrase key pattern
	 */
	protected String constructPhraseVariableKey()
	{
		return RB_PHRASE_VARIABLE_PREFIX + getPhraseKey() + RB_PHRASE_VARIABLE_SUFFIX;
	}

	/**
	 * This method constructs a phrase variable key pattern with the given start and end place holder text. For example:
	 * {phrasekey}
	 * 
	 * This method is added as part of alert Framework for PORTAL Implementation
	 * 
	 * @param sStartPlaceHolder string value of the special character which will appear before the phrase variable key
	 * @param sEndPlaceHolder string value of the special character which will appear before the phrase variable key
	 * @return PhraseVariableKey string value of the string pattern
	 */
	protected String constructPhraseVariableKey(String sStartPlaceHolder, String sEndPlaceHolder)
	{
		return sStartPlaceHolder + getPhraseKey() + sEndPlaceHolder;
	}

	/**
	 * This method is responsible for returning the phrase variable object with phrase key, and their values for the
	 * given errorcode, phrase variable string and the values. The phrase variable string which is passed as an argument
	 * must be in the format of PK@errorCode@phrasekey. If the phrase key is not valid, the method returns null value.
	 * 
	 * @param phraseVariableString valid string value of the phrase key
	 * @param errorCode string value of the error code
	 * @param phrasevalue string value of the value for the phrase key
	 * @return a valid phrase variable object with phraseVariableString and phrase value; if the phrase variable is not
	 *         valid, the object will return
	 */

	public static PhraseVariable constructPhraseVariableUsing(String phraseVariableString, String errorCode,
			String phrasevalue)
	{
		if (phraseVariableString != null && !phraseVariableString.equals(""))
		{
			// if the errorcode is not present in the phraseVariableString, then the passed phrasevariable does not
			// belong to the passed errorCode hence return null
			if (phraseVariableString.indexOf(errorCode) == -1)
				return null;
			// else continue separating the string and construct the phrase variable object
			String str = phraseVariableString.substring(PHRASE_VARIABLE_PREFIX.length()
					+ PHRASE_VARIABLE_KEYS_SEPARATOR.length());
			String phraseKey = str.substring(errorCode.length() + PHRASE_VARIABLE_KEYS_SEPARATOR.length());
			return new PhraseVariable(phraseKey, phrasevalue);
		} else
			return null;
	}

	/**
	 * This method checks whether the phrasevariable is in valid pattern(begins with "PK@") or not
	 * 
	 * @param phraseVariableString string value of the phrase key
	 * @return true if the phraseVariablestring is valid or flase
	 */
	public static boolean isValidPhraseVariableString(String phraseVariableString)
	{
		if (phraseVariableString == null || phraseVariableString.equals(""))
			return false;
		else
		{
			if (phraseVariableString.startsWith(PHRASE_VARIABLE_PREFIX + PHRASE_VARIABLE_KEYS_SEPARATOR))
				return true;
			else
				return false;
		}
	}

	/**
	 * This method overrides the base toString() method to return string representation as [phraseKey:],[phraseValue:].
	 * Use this method for logging logging.
	 * 
	 * @return returns a readable string representation form of this object
	 */
	public String toString()
	{
		StringBuffer phraseVariable = new StringBuffer();
		phraseVariable.append("{[phraseKey:");
		phraseVariable.append(phraseKey);
		phraseVariable.append("],[phraseValue:");
		phraseVariable.append(phraseValue);
		phraseVariable.append("]}");

		return phraseVariable.toString();
	}

	// The key for the phrase variable
	private String phraseKey;
	// The value for the phrase variable
	private String phraseValue;
	// Constants prefix for phrase variable, this prefix is to be used while sending phrase variables via a http request
	private static final String PHRASE_VARIABLE_PREFIX = "PK";
	private static final String PHRASE_VARIABLE_KEYS_SEPARATOR = "@";
	// the following constants are to be used while defining a phrase key in the resource bundle.
	private static final String RB_PHRASE_VARIABLE_PREFIX = "<<PK@";
	private static final String RB_PHRASE_VARIABLE_SUFFIX = "@>>";

}
