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

/**
 * This class is for <code>ValidCharacterSet</code> handles the validation of input data against any locale specific character set
 * 
 * @version 1.0
 */
public abstract class ValidCharacterSet
{
	/**
	 * To get the charSet
	 * 
	 * @return Returns the charSet.
	 */
	public char[] getCharSet()
	{
		return charSet;
	}

	/**
	 * To set the charSet
	 * 
	 * @param set The charSet to set.
	 */
	public void setCharSet(char[] set)
	{
		charSet = set;
	}

	/**
	 * To get the Exclusions
	 * 
	 * @return Returns the exclusions.
	 */
	public StringBuffer getExclusions()
	{
		return exclusions;
	}

	/**
	 * To set the Exclusions
	 * 
	 * @param exclusions The exclusions to set.
	 */
	public void setExclusions(StringBuffer exclusions)
	{
		this.exclusions = exclusions;
	}

	/**
	 * To get the Inclusions
	 * 
	 * @return Returns the inclusions.
	 */
	public StringBuffer getInclusions()
	{
		return inclusions;
	}

	/**
	 * To set the inclusions
	 * 
	 * @param inclusions The inclusions to set.
	 */
	public void setInclusions(StringBuffer inclusions)
	{
		this.inclusions = inclusions;
	}

	/**
	 * Validates the incoming data against the locale specific character set allowed.
	 * 
	 * @param fieldData - Incoming data that has to be validated
	 * @return Returns true if data is valid or false otherwise
	 */
	public boolean isValid(String fieldData)
	{
		char[] inputData = fieldData.toCharArray();
		boolean isValid = false;
		for (int count = 0; count < inputData.length; count++)
		{
			isValid = find(inputData[count]);
			if (!isValid)
				break;
		}
		return isValid;
	}

	/**
	 * Searches the character set for the specified character.
	 * 
	 * @param c - character which has to be searched for
	 * @return Returns true if the char is present in base set or inclusive characters and not in special characters or
	 *         false other wise
	 */
	public boolean find(char c)
	{
		if (findIn(exclusions, c))
		{
			return false;
		}
		return (findInBaseSet(c) || findIn(inclusions, c));
	}

	/**
	 * Checks for a character in a StringBuffer and returns a boolean value representing whether it is present or not.
	 * Uses Binary Search
	 * 
	 * @param buf - StringBuffer which in which character has to be searched for
	 * @param c - Character which is to be searched
	 * @return Returns true if character is present in the StringBuffer or false otherwise
	 */
	private boolean findIn(StringBuffer buf, char c)
	{
		int lower = 0;
		int upper = buf.length() - 1;
		int index;
		char curChar;

		// If empty, dont bother checking...
		if (upper == -1)
			return false;

		while (upper > (lower + 1))
		{
			index = (upper + lower) / 2;
			curChar = buf.charAt(index);
			if (curChar == c)
				return true;

			if (curChar > c)
				upper = index;
			else
				lower = index;

		}
		if (buf.charAt(lower) == c || buf.charAt(upper) == c)
			return true;
		return false;
	}

	/**
	 * Searches the character set for the specified character. Since the character set is assumed to be in sorted order,
	 * a binary search can be used.
	 * 
	 * @param c - character which has to be searched for
	 * @return Returns true if the char is present in base set or inclusive characters and not in special characters or
	 *         false other wise
	 */
	private boolean findInBaseSet(char c)
	{
		int lower = 0;
		int upper = charSet.length - 1;
		int index;
		char curChar;

		// If empty, dont bother checking...
		if (upper == -1)
			return false;

		while (upper > (lower + 1))
		{
			index = (upper + lower) / 2;
			curChar = charSet[index];
			if (curChar == c)
				return true;

			if (curChar > c)
				upper = index;
			else
				lower = index;

		}
		if (charSet[lower] == c || charSet[upper] == c)
			return true;
		return false;
	}

	/**
	 * <code>abstract</code> declaration for the <code>entireCharSet</code> method Implemented by the subclasses inorder
	 * to get characterSet specific to locale
	 * 
	 * @return Returns an array containing the valid characterSet for each locale
	 */
	protected abstract char[] alphaNumericCharSet();

	/**
	 * <code>abstract</code> declaration for the <code>alphaCharSet</code> method Implemented by the subclasses inorder
	 * to get alpha characterSet specific to locale
	 * 
	 * @return Returns an array containing the valid alpha characterSet for each locale
	 */
	protected abstract char[] alphaCharSet();

	/**
	 * <code>abstract</code> declaration for the <code>numericCharSet</code> method Implemented by the subclasses
	 * inorder to get numeric characterSet specific to locale
	 * 
	 * @return Returns an array containing the valid numeric characterSet for each locale
	 */
	protected abstract char[] numericCharSet();

	// charater array containing the value of locale specific characters
	private char[] charSet;
	// StringBuffer containing the inclusive characters
	private StringBuffer inclusions = new StringBuffer();
	// StringBuffer containing the special characters that needs to be excluded .
	// If they are present in the data an error should be shown to the user
	private StringBuffer exclusions = new StringBuffer();

	public static final char[] BLANK_CHARACTER_SET = new char[]
	{};

}
