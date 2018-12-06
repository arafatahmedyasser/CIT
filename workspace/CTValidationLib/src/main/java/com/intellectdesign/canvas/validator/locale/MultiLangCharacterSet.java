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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.intellectdesign.canvas.logger.Logger;
/**
 * This character set will be invoked whenever a field has been flagged as supporting multi lingual input. This is not a
 * character set by itself in a true sense. But it works as a union of all the locales passed to it as a means for
 * arriving at the character set.
 * 
 * @version 1.0
 */
public class MultiLangCharacterSet extends ValidCharacterSet
{
	/**
	 * Internal constant for serialization purposes
	 */
	private String mLangIds;
	private String mRestrictedLangId;
	private char[] alphaChars = new char[0];
	private char[] numChars = new char[0];
	private char[] alphaNumChars = new char[0];

	/**
	 * Default constructpor. If this is used, this should be followed by a call to setLangIds method for this character
	 * set to function properly
	 */
	public MultiLangCharacterSet()
	{

	}

	/**
	 * this is ref to MultiLangCharacterSet
	 * 
	 * @param langIds
	 * @param restrictedLangId
	 */
	public MultiLangCharacterSet(String langIds, String restrictedLangId)
	{
		setLangIds(langIds, restrictedLangId);
	}

	/**
	 * To set the LangIds
	 * 
	 * @param langIds
	 * @param restrictedLangId
	 */

	public void setLangIds(String langIds, String restrictedLangId)
	{
		mLangIds = langIds;
		mRestrictedLangId = restrictedLangId;
		initializeCharSets();
	}

	/**
	 * This method identifies the exact participating char sets and creates the union equivalent applicable for this
	 * combined char set
	 */
	private void initializeCharSets()
	{
		String aLangId;
		ValidCharacterSet aCharSet;
		List<String> allLangIds = new ArrayList<String>();
		List<ValidCharacterSet> allCharSets = new ArrayList<ValidCharacterSet>();
		LocaleLanguageCharacterSetFactory factory = new LocaleLanguageCharacterSetFactory();

		if (mLangIds != null && mLangIds.trim().length() > 0)
		{
			String[] langArr = mLangIds.split(",");
			allLangIds.addAll(Arrays.asList(langArr));
		}
		// Boundary check. If multi lingual is configured and the list of lang ids is empty, then consider that only
		// en_US has been provided.
		if (allLangIds.size() == 0)
			allLangIds.add(LocaleSupportConstants.LOCALE_ENGLISH);
		// If restricted value has been provided, then ensure that the list gets impacted accordingly
		if (mRestrictedLangId != null && mRestrictedLangId.length() > 0)
		{
			// A restriction has been sent from the source. Ensure that only this is added to the List; that too only if
			// the same is also available in this list
			if (allLangIds.contains(mRestrictedLangId))
			{
				allLangIds.clear();
				allLangIds.add(mRestrictedLangId);
			} else
			{
				// This is a problem. The list of lang ids does not include the restricted lang id. This is a
				// configuration error
				LOGGER.cterror("CTVAL00034", allLangIds, mRestrictedLangId);
			}
		}
		// Now identify the character sets that corresponds to the participating lang ids.
		for (int count = 0; count < allLangIds.size(); count++)
		{
			aLangId = allLangIds.get(count);
			aCharSet = factory.getCharSetImpl(aLangId);
			if (aCharSet == null)
			{
				// This means that factory was not able to identify the character set for the lang id.
				// This could only mean that lang id provided is invalid. So log the same as an error.
				LOGGER.cterror("CTVAL00035", aLangId);
			} else
			{
				allCharSets.add(aCharSet);
			}
		}
		// Good. Now that we have the list of character sets identified for merging. Just merge the same into the local
		// variables
		for (int count = 0; count < allCharSets.size(); count++)
		{
			aCharSet = allCharSets.get(count);
			// Let us merge the 3 char sets into appropriate arrays;
			this.alphaChars = mergeArray(this.alphaChars, aCharSet.alphaCharSet());
			this.alphaNumChars = mergeArray(this.alphaNumChars, aCharSet.alphaNumericCharSet());
			this.numChars = mergeArray(this.numChars, aCharSet.numericCharSet());
		}
	}

	/**
	 * Helper method to merge arrays
	 * 
	 * @param source The source into which data is to get accumulated
	 * @param additionalChars The new array that provides the data to be added
	 * @return The additional of source + additionalchars
	 */
	private char[] mergeArray(char[] source, char[] additionalChars)
	{
		// First extend the array
		char[] result = Arrays.copyOf(source, source.length + additionalChars.length);
		// Now copy the additional chars into the new array.
		for (int count = 0, index = source.length; count < additionalChars.length; count++)
		{
			result[index] = additionalChars[count];
			index++;
		}
		return result;
	}

	/**
	 * This method returns the characters that are applicable as alpha and numeric
	 * 
	 * @see com.intellectdesign.canvas.validator.locale.ValidCharacterSet#alphaNumericCharSet()
	 */
	@Override
	protected char[] alphaNumericCharSet()
	{
		return this.alphaNumChars;
	}

	/**
	 * This method returns the characters that are applicable as alpha only
	 * 
	 * @see com.intellectdesign.canvas.validator.locale.ValidCharacterSet#alphaCharSet()
	 */
	@Override
	protected char[] alphaCharSet()
	{
		return this.alphaChars;
	}

	/**
	 * This method returns the characters that are applicable as numeric only.
	 * @return numchars
	 * @see com.intellectdesign.canvas.validator.locale.ValidCharacterSet#numericCharSet()
	 */
	@Override
	protected char[] numericCharSet()
	{
		return this.numChars;
	}

	private static final Logger LOGGER = Logger.getLogger(MultiLangCharacterSet.class);
}
