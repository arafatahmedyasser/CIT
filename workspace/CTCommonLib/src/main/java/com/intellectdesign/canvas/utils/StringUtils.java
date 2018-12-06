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

package com.intellectdesign.canvas.utils;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;
import java.util.StringTokenizer;

import com.intellectdesign.canvas.logger.Logger;

/**
 * Helper class that contains various utility methods for use with Strings. No instances of this class is ever expected
 * to be created.
 * 
 * @version 1.0
 */
public final class StringUtils
{

	private static final Logger logger = Logger.getLogger(StringUtils.class);

	/**
	 * Marking the constructor private to avoid instance creation.
	 */
	private StringUtils()
	{

	}

	/**
	 * This contains the mapping of characters for XML escaping
	 */
	private static String[][] XML_ESCAPE_CHAR_MAP;
	/**
	 * This contains the mapping of characters for XML unescaping
	 */
	private static String[][] XML_UNESCAPE_CHAR_MAP;

	static
	{
		// Initialize the escape character list for XML.
		XML_ESCAPE_CHAR_MAP = new String[][]
		{
		{ "&", "&amp;" },
		{ "\"", "&quot;" },
		{ "<", "&lt;" },
		{ ">", "&gt;" },
		{ "'", "&apos;" } };

		// Initialize the unescape character list. This is useful for doing the reverse of parsing the XML.
		XML_UNESCAPE_CHAR_MAP = reverse(flip(XML_ESCAPE_CHAR_MAP));

	}

	/**
	 * This method ensures that the provided string is made to the targetLength by padding it with the padChar provided
	 * either as a prefix or a suffix. If the source string is null, then it is considered as an empty string and the
	 * process is done
	 * 
	 * @param aString The string to be padded to. If null, then empty string is used.
	 * @param targetLength The targetLength to which the string should be made. If the provided string is already at
	 *            this target length or longer, then no action is taken.
	 * @param padChar The character to be used for padding.
	 * @param prefix true, if the padding is to be done by prefixing the padChar. If false, then the padChar is appended
	 *            to the string.
	 * @return The padded string made to the length provided.
	 */
	public static String pad(String aString, int targetLength, char padChar, boolean prefix)
	{
		String valString = ensureExists(aString);
		if (valString.length() >= targetLength)
			return valString;

		// Create the appendage to be padded
		StringBuilder sb = new StringBuilder();
		for (int charsToAppend = targetLength - valString.length(); charsToAppend > 0; charsToAppend--)
			sb.append(padChar);
		// Prefix or suffix it
		if (prefix)
			sb.append(valString);
		else
			sb.insert(0, valString);

		return sb.toString();
	}

	/**
	 * This method checks whether the String provided is empty. This checks for null as well as zero length after
	 * trimming the String
	 * 
	 * @param aString The string to be validated
	 * @return true if the String is empty. false otherwise
	 */
	public static boolean isEmpty(String aString)
	{
		return (aString == null) || ("".equals(aString.trim()));
	}

	/**
	 * This method checks whether the first String contains the second String.
	 * 
	 * @param parentString The string to be validated
	 * @param childString
	 * @return true if the String is empty. false otherwise
	 */
	public static boolean contains(String parentString, String childString)
	{
		return ((childString != null) && !("".equals(childString.trim()))) && parentString.contains(childString);
	}

	/**
	 * This method ensures that if the string passed is null an empty string is returned. This ways, typical null check
	 * based coding done in various places can be easily replaced with a guaranteed availability of a not null String
	 * 
	 * @param aString The string to be checked
	 * @return not null version of the string
	 */
	public static String ensureExists(String aString)
	{
		return ensureExists(aString, "");
	}

	/**
	 * This method ensures that if the string passed is null an empty string is returned. This ways, typical null check
	 * based coding done in various places can be easily replaced with a guaranteed availability of a not null String
	 * 
	 * @param aString The string to be checked
	 * @return not null version of the string
	 */
	public static String ensureExists(String aString, String defaultValue)
	{
		return (aString == null || "".equals(aString)) ? defaultValue : aString.trim();
	}

	/**
	 * This method checks whether the String provided can be parsed into an Integer. If the string is empty or does not
	 * contain valid numerals only, then this will return false.
	 * 
	 * @param aString The string to be checked
	 * @return true, if the string can be converted to an Integer. false otherwise
	 */
	public static boolean isNumber(String aString)
	{
		boolean isNumber = false;
		if (!isEmpty(aString))
		{
			try
			{
				Integer.parseInt(aString.trim());
				isNumber = true;
			} catch (NumberFormatException e)
			{
				isNumber = false;
			}
		}
		return isNumber;
	}

	/**
	 * This methods converts the given String to a boolean representation using the following logic - If the string
	 * value is one of "true", "Y", "1", "yes", "on" in a case insensitive manner, then it is treated as Boolean.TRUE.
	 * Else returns Boolean.FALSE.
	 * 
	 * @param aString The String to be converted
	 * @return The boolean representation of this String
	 */
	public static boolean convertToBoolean(String aString)
	{
		String strVal = ensureExists(aString);
		return ("true".equalsIgnoreCase(strVal)) || ("y".equalsIgnoreCase(strVal)) || ("on".equalsIgnoreCase(strVal))
				|| ("yes".equalsIgnoreCase(strVal)) || ("1".equalsIgnoreCase(strVal));
	}

	/**
	 * This is a helper method to convert the given string to an int value. In case the string provided is empty, or
	 * does not have a valid integer content (as parseable by Integer.valueOf()), then the defaultValue is returned
	 * 
	 * @param aString The string to be converted to int
	 * @param defaultValue The default value to be used if conversion fails or is not possible
	 * @return The int value post conversion
	 */
	public static int convertToInt(String aString, int defaultValue)
	{
		int retVal;
		String strVal = ensureExists(aString, String.valueOf(defaultValue));
		try
		{
			retVal = Integer.valueOf(strVal);
		} catch (NumberFormatException e)
		{
			retVal = defaultValue;
		}
		return retVal;
	}

	/**
	 * This method convers the given string into an array by splitting it using the delimiter string. Since this uses
	 * String.split(String) API, the delimiter should abide by the rules / constraints imposed by the String.split API
	 * 
	 * @param sourceString The string to be converted to an array
	 * @param delimiter The delimiter to be used for the split
	 * @return The array of strings. If the source string is null or empty, then returns null. If there are no instances
	 *         of the delimiter, then the current value is returned as an array.
	 */
	public static String[] convertToArray(String sourceString, String delimiter)
	{
		String[] returnArray = null;
		if (!isEmpty(sourceString))
		{
			returnArray = sourceString.split(delimiter);
			// Trim the values in the array, just to be sure.
			for (int counter = 0; counter < returnArray.length; counter++)
				returnArray[counter] = returnArray[counter].trim();
		}

		return returnArray;
	}

	/**
	 * This method helps merge two char arrays into a single char array. The length of the result array is the sum of
	 * the length of the arrays provided
	 * 
	 * @param source The source into which data is to get accumulated
	 * @param additionalChars The new array that provides the data to be added
	 * @return The additional of source + additionalchars
	 */
	public static char[] mergeArray(char[] source, char[] additionalChars)
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
	 * This method helps to reverse an array on the vertical direction. Post this processing, the last column would be
	 * first and the first column would be the last.
	 * 
	 * @param input The 2 dimensional array to be flipped
	 * @return The array with its key and values interchanged
	 */
	public static String[][] flip(String[][] input)
	{
		String[][] newarray = null;
		if (input != null)
		{
			newarray = new String[input.length][2];
			for (int i = 0; i < input.length; i++)
			{
				newarray[i][0] = input[i][1];
				newarray[i][1] = input[i][0];
			}
		}
		return newarray;
	}


	/**
	 * Returns the array that is reversed (last row -> first row)
	 * 
	 * @param input The 2 dimensional array to be reversed
	 * @return The array with the order of data reversed from the original input
	 */
	public static String[][] reverse(String[][] input)
	{
		String[][] newarray = null;
		if (input != null)
		{
			newarray = new String[input.length][2];
			int j = 0;
			for (int i = input.length - 1; i >= 0; i--)
			{
				newarray[j][0] = input[i][1];
				newarray[j][1] = input[i][0];
				j++;
			}
		}
		return newarray;
	}

	/**
	 * Helper method that replaces the characters present as Key in the CharMap with the corresponding values within the
	 * input.
	 * 
	 * @param input The input string that requires the translation
	 * @param charMap The 2-D array replacement map having the first index as the character to replace and the second
	 *            index as the target character that should be present instead of the source
	 * @return The translated string
	 */
	public static String translate(String input, String[][] charMap)
	{
		String result = input;
		if (!isEmpty(input))
		{
			String compareKey;
			String replaceValue;
			int index;
			StringBuilder sb = new StringBuilder();
			String temp;
			for (int i = 0; i < charMap.length; i++)
			{
				compareKey = charMap[i][0];
				replaceValue = charMap[i][1];
				sb.setLength(0);
				while ((index = result.indexOf(compareKey)) != -1)
				{
					temp = result.substring(0, index);
					sb.append(temp).append(replaceValue);
					result = result.substring(index + compareKey.length());
				}
				// Ensure to taken the remnants into the buffer before converting back to a String
				result = sb.append(result).toString();
			}
		}
		return result;
	}

	/**
	 * This method does an encoding of the data that makes it ready for it to be used within an XML
	 * 
	 * @param sourceData The data to be encoded
	 * @return The encoded data ready for plugging into a XML
	 */
	public static String xmlEncode(String sourceData)
	{
		if (!isEmpty(sourceData))
			return translate(sourceData, XML_ESCAPE_CHAR_MAP);
		return "";
	}

	/**
	 * This method does the reverse of xmlEncode(). Here the data that is already encoded for XML is decoded back to
	 * regular form for easy / direct usage
	 * 
	 * @param xmlData The encoded data from XML
	 * @return The decoded data in regular String format
	 */
	public static String xmlDecode(String xmlData)
	{
		if (!isEmpty(xmlData))
			return translate(xmlData, XML_UNESCAPE_CHAR_MAP);
		return "";
	}

	/**
	 * This method does the entity encoding of all characters that have equivalent available in HTML. This is needed to
	 * ensure that any response sent to the browser uses proper HTML entities instead of data as it is
	 * 
	 * @param source The source string
	 * @param exclusionChars The list of characters (as a String) that can be ignored. Can be null / empty if there is
	 *            no intent to provide any exclusions
	 * @return The string with all Entity codes replaced
	 */
	public static String htmlEncode(String source, String exclusionChars)
	{
		if (isEmpty(source))
			return "";

		StringBuilder sb = new StringBuilder();
		char c;
		String tempExclusionChars = (exclusionChars == null) ? "" : exclusionChars;
		int maxLength = source.length();
		for (int count = 0; count < maxLength; count++)
		{
			c = source.charAt(count);
			if (tempExclusionChars.indexOf(c) != -1)
			{
				// Means do not attempt to replace. So just add it.
				sb.append(c);
			} else
			{
				// Loop through the replacement options
				switch (c)
				{
				case ' ':
					sb.append("&nbsp;");
					break;
				case '­':
					sb.append("&shy;");
					break;
				case '"':
					sb.append("&quot;");
					break;
				case '&':
					sb.append("&amp;");
					break;
				case '\u00A9':
					sb.append("&copy;");
					break;
				case '<':
					sb.append("&lt;");
					break;
				case '>':
					sb.append("&gt;");
					break;
					// added for exclusion of backslash
				case '\\':
					sb.append("&bsol;");
					break;
				
				default:
					sb.append(c);
					break;
				}
			}
		}
		return sb.toString();
	}

	/**
	 * This method does an encoding of the given url so that using URL Encoding scheme. Encoding is always done using
	 * UTF-8
	 * 
	 * @param urlPath The URL string to be encoded
	 * @return The encoded URL string
	 */
	public static String urlEncode(String urlPath)
	{
		String lcmName = new String(" [StringUtils.urlEncode] ");
		String returnValue = urlPath.replaceAll(" ","");
		try
		{
			// urlEncode assumes that the entire data has to be encoded. Which means even the path separator '/' gets
			// encoded. Reverse the same explicitly.
			returnValue = URLEncoder.encode(returnValue, "UTF-8").replaceAll("%2F", "/");
		} catch (UnsupportedEncodingException e)
		{
			// Nothing can be done here. We just eat the exception
			logger.ctdebug("CTCOM00132", e, lcmName, e.getMessage());
		}
		return returnValue;
	}

	/**
	 * This method does an decoding of the given url so that using URL Encoding scheme. Decoding is always done using
	 * UTF-8
	 * 
	 * @param urlPath The URL string to be decoded
	 * @return The decoded URL string
	 */
	public static String urlDecode(String urlPath)
	{
		String lcmName = new String(" [StringUtils.urlDecode] ");
		String returnValue = urlPath;
		try
		{
			returnValue = URLDecoder.decode(urlPath, "UTF-8");
		} catch (UnsupportedEncodingException e)
		{
			// Nothing can be done here. We just eat the exception
			logger.ctdebug("CTCOM00133", e, lcmName, e.getMessage());
		}
		return returnValue;
	}

	/**
	 * Splits the string based on the given delimiter. Use this method instead of String.split() method. Reason:
	 * StringTokenizer is better performance one compare with String.split() method
	 * 
	 * @param aString - Comma separated value
	 * @return String array
	 */
	public static String[] split(String aString, String delimiter)
	{
		StringTokenizer st = new StringTokenizer(aString, delimiter);
		String returnVals[] = new String[st.countTokens()];
		int index = 0;
		while (st.hasMoreElements())
		{
			returnVals[index++] = (String) st.nextElement();
		}
		return returnVals;
	}

	/**
	 * Helps join a list of Strings into a single string using the provided delimiter
	 * 
	 * @param listOfStrings The list of String to be converted to a single String
	 * @param delimiter The delimiter to be used as part of the appending process
	 * @return A simple string representation of the list provided. Will return empty string of the List provided is
	 *         null or empty
	 */
	public static String join(List<String> listOfStrings, String delimiter)
	{
		StringBuilder sb = new StringBuilder();
		if (listOfStrings != null && listOfStrings.size() > 0)
		{
			boolean first = true;
			Iterator<String> valuesIterator = listOfStrings.iterator();
			while (valuesIterator.hasNext())
			{
				// Add the delimiter from the second element onwards
				if (first)
					first = false;
				else
					sb.append(delimiter);
				sb.append(valuesIterator.next());
			}
		}

		return sb.toString();
	}

	/**
	 * Splits the string provided using the delimiter and then returns the same as a List of Strings
	 * 
	 * @param sourceVal The source string to be converted
	 * @param delimiter The delimiter to split the string
	 * @return The list of string values post splitting. In case the source string is empty, null is returned.
	 */
	public static List<String> convertToList(String sourceVal, String delimiter)
	{
		if (!isEmpty(sourceVal))
			return Arrays.asList(split(sourceVal, delimiter));
		return null;
	}

	/**
	 * Checks whether the given string is present in the list of values provided.
	 * 
	 * @param compareVal The string to be checked
	 * @param allValues The array of values
	 * @return true, if the string is present in the possible values; false otherwise
	 */
	public static boolean in(String compareVal, String[] allValues)
	{
		if (allValues == null || allValues.length == 0)
			return false;
		List<String> valuesList = Arrays.asList(allValues);
		return in(compareVal, valuesList);
	}

	/**
	 * Checks whether the given string is present in the list of values provided
	 * 
	 * @param compareVal The string to the checked
	 * @param valuesList The list of possible values
	 * @return true, if the string is present in the possible values; false otherwise
	 */
	public static boolean in(String compareVal, List<String> valuesList)
	{
		if (valuesList == null || valuesList.isEmpty())
			return false;
		return valuesList.contains(compareVal);
	}

	/**
	 * This is a helper method that checks the source string for property tokens. For every property token identified,
	 * it retrieves the replacement value from the variables Properties bag and replaces the same into the source. In
	 * case the Properties bag does not contain the token, then the property name is replaced back into the source.
	 * 
	 * @param source The string to be checked for replacing property tokens
	 * @param variables The Properties object having the replacement values.
	 * @return The String with the property tokens replaced
	 */
	public static String replacePropertyTokens(String source, Properties variables)
	{
		String newString = source;
		String prepend = null;
		String append = null;
		String propName = null;
		String propValue = null;
		if (newString != null && variables != null)
		{
			int start = newString.indexOf(PROPERTY_TOKEN_OPEN);
			int end = newString.indexOf(PROPERTY_TOKEN_CLOSE);

			while (start > -1 && end > start)
			{
				prepend = newString.substring(0, start);
				append = newString.substring(end + PROPERTY_TOKEN_CLOSE.length());
				propName = newString.substring(start + PROPERTY_TOKEN_OPEN.length(), end);
				propValue = variables.getProperty(propName);
				if (propValue == null)
				{
					newString = prepend + propName + append;
				} else
				{
					newString = prepend + propValue + append;
				}
				start = newString.indexOf(PROPERTY_TOKEN_OPEN);
				end = newString.indexOf(PROPERTY_TOKEN_CLOSE);
			}
		}
		return newString;
	}

	/**
	 * This is the constant representing the pattern that denotes that a property name is going to be used
	 */
	public static final String PROPERTY_TOKEN_OPEN = "${";
	
	/**
	 * This is the constant representing the pattern that denotes the closing sequence for the definition of a property
	 * name
	 */
	public static final String PROPERTY_TOKEN_CLOSE = "}";
}
