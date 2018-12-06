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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * This class is responsible to construct a error message code with or without Phrase Variables. The class has methods
 * to capture error code, which is made up of an error key with or without phrase variables.
 * 
 * @version 1.0
 */
public class MessageCode implements Serializable
{

	/**
	 * Default value of serialVersionUID
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * This constructor initializes the MessageCode object with messageKey and phrase variables
	 * 
	 * @param errorKey string value of the message key
	 * @param pvCollection collection of phrase variables
	 */
	public MessageCode(String errorKey, List<PhraseVariable> pvCollection)
	{
		setMessageKey(errorKey);
		setPhraseVariableCollection(pvCollection);
	}

	/**
	 * This constructor initializes the message code object for the message key, and phrase variables with values.
	 * 
	 * @param messageKey string value of the valid message key text
	 */
	public MessageCode(String messageKey, Map<String, String> pvMap)
	{
		setMessageKey(messageKey);
		deconstructMessageCodeMap(pvMap);
	}

	/**
	 * This standard constructor initializes the message code object for the errorkey without phrasevariable. The Phrase
	 * Variable will be considered as null
	 * 
	 * @param errorKey string value of the error message key
	 */
	public MessageCode(String errorKey)
	{
		setMessageKey(errorKey);
	}

	/**
	 * This method adds the phrase variables and their values as a collection.
	 * 
	 * @param aphraseVariable PhraseVariable object containing Phrase Variables and their Values
	 */
	public void addPhraseVariable(PhraseVariable aphraseVariable)
	{
		// create the phrase variable if it is null
		if (phraseVariableCollection == null)
			phraseVariableCollection = new ArrayList<PhraseVariable>();

		phraseVariableCollection.add(aphraseVariable);
	}

	/**
	 * This method removes the Phrase Variables from the collection
	 * 
	 * @param aphraseVariable Phrase Variable object containing the phrase keys and their values
	 */
	public void removePhraseVariable(PhraseVariable aphraseVariable)
	{
		if (phraseVariableCollection != null)// remove only if the collection is not null
			phraseVariableCollection.remove(aphraseVariable);
	}

	/**
	 * This method returns the message code that contains the error key
	 * 
	 * @return messageKey string value of the message key.
	 */
	public String getMessageKey()
	{
		return messageKey;
	}

	/**
	 * This method sets the error key in the message code
	 * 
	 * @param errorKey string value of the error key to be set in message code
	 */
	public void setMessageKey(String errorKey)
	{
		this.messageKey = errorKey;
	}

	/**
	 * This method returns the collection of phrase variables with their values as an indexed List
	 * 
	 * @return phraseVariableCollection list of Phrase Variables and their Values
	 */
	public List<PhraseVariable> getPhraseVariableCollection()
	{
		return phraseVariableCollection;
	}

	/**
	 * This method sets the list of phrase variables and their values as a collection
	 * 
	 * @param phraseVariableCollection List of phrase variables and their values
	 */
	public void setPhraseVariableCollection(List<PhraseVariable> phraseVariableCollection)
	{
		this.phraseVariableCollection = phraseVariableCollection;
	}

	/**
	 * This method checks whether the current message code contains any phrase variable or not
	 * 
	 * @return true if the message code has any phrase variables or false
	 */
	public boolean hasPhraseVariables()
	{
		return (phraseVariableCollection != null && !phraseVariableCollection.isEmpty());
	}

	/**
	 * This method constructs mapping of phrase key and their values for the message code
	 * 
	 * @return amap mapping of message key, phrase key and value or an empty map is returned when the messagekey does
	 *         not have any phraseVariables
	 */
	public Map<String, String> constructMessageCodeMap()
	{
		HashMap<String, String> amap = new HashMap<String, String>();
		if (hasPhraseVariables())
		{
			PhraseVariable aVariable;
			Iterator<PhraseVariable> anIterator = phraseVariableCollection.iterator();
			while (anIterator.hasNext())
			{
				aVariable = anIterator.next();

				// creating the mapping of phrase keys and their values for the given message key
				amap.put(aVariable.constructPhraseVariableKeyUsing(messageKey), aVariable.getPhraseValue());
			}
		}
		return amap;
	}

	/**
	 * This method removes the mapping of messagekey, phrase variable and phrase values and returns the phrase keys and
	 * their values as collections for the MessageCode passed as argument. If the errorCodeMap is null or empty, the
	 * method just returns the empty collection
	 * 
	 * @param errorCodeMap containing the phrase variables, values and error key
	 * @return pvCollection a list of phrase keys and thier values or an empty list
	 */
	public List<PhraseVariable> deconstructMessageCodeMap(Map<String, String> errorCodeMap)
	{
		List<PhraseVariable> pvCollection = new ArrayList<PhraseVariable>();
		if (errorCodeMap != null && !errorCodeMap.isEmpty())
		{
			Iterator<String> keyIterator = errorCodeMap.keySet().iterator();
			String pvKey;
			String pvValue;
			PhraseVariable aphraseVariable;
			while (keyIterator.hasNext())
			{
				pvKey = keyIterator.next();
				pvValue = errorCodeMap.get(pvKey);

				// Creating mapping of phrase keys and their values for the given message key, phrase variable and
				// values
				aphraseVariable = PhraseVariable.constructPhraseVariableUsing(pvKey, getMessageKey(), pvValue);
				// if the errorkey and pvkey does not have a pattern match, then null is returned and hence do not add
				// in the pvcollection
				if (aphraseVariable != null)
					pvCollection.add(aphraseVariable);
			}
		}
		// initialize/reset the member phrasevariable collection of this errorcode
		setPhraseVariableCollection(pvCollection);
		return pvCollection;
	}

	/**
	 * This method overrides the base toString() to return string representation for message key, phrase variables and
	 * their values. Use this method for logging. The message code is represented as
	 * {[messageKey:<this.messageKey>],[phraseVariableCollection:<this.phraseVariableCollection.toString>]} if the
	 * phrasevariableCollection is empty then {[messageKey:<this.messageKey>],[phraseVariableCollection:NO PHRASE
	 * VARIABLES LINKED WITH THIS MESSAGE KEY]}
	 * 
	 * @return messageCode.toString readable string representation of the message code
	 */
	public String toString()
	{
		StringBuffer messageCode = new StringBuffer();
		messageCode.append("{[messageKey:");
		messageCode.append(messageKey);
		messageCode.append("],[phraseVariableCollection:");
		if (phraseVariableCollection == null || phraseVariableCollection.isEmpty())
			messageCode.append("NO PHRASE VARIABLES LINKED WITH THIS MESSAGE KEY");
		else
			messageCode.append(phraseVariableCollection.toString());
		messageCode.append("]}");

		return messageCode.toString();
	}

	// member to store the error key
	private String messageKey;
	// member to store the phrase variable collection
	private List<PhraseVariable> phraseVariableCollection;
}
