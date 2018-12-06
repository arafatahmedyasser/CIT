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
package com.intellectdesign.canvas.data.conversion.util;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Stack;

import com.intellectdesign.canvas.exceptions.util.JSONConvertorException;
import com.intellectdesign.canvas.logger.Logger;

/**
 * Utility class to convert a valid JSON string into a Hashmap.
 * 
 * The JSON format is based on defined objects in the form of key-value pairs, A sample JSON string is as follows:
 * 
 * { "firstName": "John", "lastName": "Smith", "address": { "streetAddress": "21 2nd Street", "city": "New York",
 * "state": "NY", "postalCode": 10021 }, "phoneNumbers": [ "212 732-1234", "646 123-4567" ] } A JSON string is enclosed
 * within { and } (squigly braces) Every key is placed with quotes and every value is either a plain string placed
 * within quotes or could be another object or could be a list The key and value are separated by a : Each key-value
 * pair is seprated by a comma If the value is a list, the list itself is enclosed with [] (square brackets) and each
 * element in the list is separated by a comma. Each element of the list could either be a string enclosed in quotes or
 * an object or another list. If a value (in an object or list) is not enclosed in quotes, it will be treated as a
 * number
 * 
 * The converter represents the JSON String as a java.util.Hashmap. Where the key is always a java.lang.String object.
 * The value could be one of the following: java.lang.String or java.util.Hashmap or java.util.Arraylist or
 * java.util.Date or java.math.BigDecimal. All white spaces outside quoted Strings will be ignored. The converter
 * supports both ' and " as quotes
 * 
 * A Map matching the example above will look as follows:
 * 
 * Map: firstName=John, lastName=Smith, address=Map: streetAddress=21 2nd Street, city=New York, state=NY,
 * postalCode=10021, phoneNumbers=Arraylist 212 732-1234, 646 123-4567
 * 
 * JSON does not include type information. All quoted strings are treated as java.lang.String objects unless specified
 * otherwise All non-quoted values are treated as java.math.BigDecimal. But if a non-quoted String does not represent a
 * valid number an exception is thrown Applications should override the abstract methods provided to identify date and
 * number values which are represeted as strings within the JSON String.
 * 
 * @version 1.0
 */
public abstract class JSONToHashMapConverter
{
	/**
	 * Overloaded constructor that takes sDateFormat as param
	 * 
	 * @param sDateFormat
	 */
	public JSONToHashMapConverter(String sDateFormat)
	{
		this.sDateFormat = sDateFormat;
	}

	/**
	 * Constructor
	 */
	public JSONToHashMapConverter()
	{
		sDateFormat = sDefaultDateFormat;
	}

	/**
	 * Overloaded Constructor that takes interpretAsDate and interpretAsNumber as params
	 * 
	 * @param interpretAsDate
	 * @param interpretAsNumber
	 */
	public JSONToHashMapConverter(boolean interpretAsDate, boolean interpretAsNumber)
	{
		sDateFormat = sDefaultDateFormat;
		this.interpretAsDates = interpretAsDate;
		this.interpretAsNumbers = interpretAsNumber;
	}

	/**
	 * The class expects a JSON String in the following format:
	 * 
	 * JSON Object = { Comma seperated Objects } Each Object is either of the values below: a. "key":"value" b. Or
	 * "key":null c. "key":<Empty String> d. Or "key": e. Or "key":<JSON Object> f. Or "key":<JSON List>
	 * 
	 * JSON List = [ Comma seperated list of objects and values ] Each List is either of the values below: a. "value" b.
	 * null c. Empty String d. <JSON List> e. <JSON Object>
	 * 
	 * 
	 * @param in_sJSON: JSON String
	 * @return HashMap: Capturing the structure defined in the JSON String
	 * @throws JSONConvertorException
	 */
	public HashMap convert(String in_sJSON) throws JSONConvertorException
	{
		if (in_sJSON == null)
		{
			logger.cterror("CTBAS00012", sJSON);
			throw new JSONConvertorException("Error processing JSON String. Input JSON object is null: " + sJSON);
		}

		HashMap map = null;
		sJSON = in_sJSON.trim();
		logger.ctdebug("CTBAS00016", in_sJSON);
		stack = new Stack();
		if (sJSON.startsWith(SQUIGLY_BRACE_START))
			map = processSquiglyBrace();
		else
		{
			logger.cterror("CTBAS00013", sJSON);
			throw new JSONConvertorException("Error processing JSON String. JSON string should be found within {...}: "
					+ sJSON);
		}
		logger.ctdebug("CTBAS00054", map);

		return map;
	}

	/**
	 * Sets the date format to be used to interpret the String representing date values.
	 * 
	 * @param dateFormat
	 */
	public void setDateFormat(String dateFormat)
	{
		sDateFormat = dateFormat;
	}

	/**
	 * Implementing class can guage/interpret the Field name and provide a boolean true if the field quoted string
	 * should be interpreted as a java.util.Date
	 * 
	 * @param sFieldName: The Key as in the JSON String
	 * @return boolean: true if the field quoted strins should be interpreted as a java.util.Date
	 */
	public abstract boolean isDateField(String sFieldName);

	/**
	 * Implementing class can guage/interpret the Field name and provide a boolean true if the field quoted string
	 * should be interpreted as a number
	 * 
	 * @param sFieldName: The Key as in the JSON String
	 * @return boolean: true if the field quoted strins should be interpreted as a number
	 */
	public abstract boolean isNumberField(String sFieldName);

	/**
	 * An Object (Map) definition starts within {} in JSON This method encapsulates all that needs to be done when a {
	 * (starting squigly brace) is found in a JSON string.
	 * 
	 * The method parses the JSON String and does the following:
	 * 
	 * 1. Instantiate new Hashmap 2. Push { into Stack 3. Process JSON String as one of the below: Process empty object
	 * of the kind: {} Retains an empty map Pops { from Stack Process quoted key value pairs Process Key Process
	 * corresponding value Process null/empty string value 4. Process all key value pairs seperated by a , in the manner
	 * described above 5. If the JSON String at any point does not follow the String a JSONConvertorException is thrown
	 * 
	 * @return
	 * @throws JSONConvertorException
	 */
	private HashMap processSquiglyBrace() throws JSONConvertorException
	{
		HashMap map = new HashMap();
		stack.push(SQUIGLY_BRACE_START);
		String sName = null;
		Object objValue = null;
		sJSON = sJSON.substring(1).trim();

		for (; true;)
		{
			if (stack.empty())
				break;

			// This means that the object was initialized as {} or we just found end of object definition
			if (sJSON.startsWith(SQUIGLY_BRACE_END))
			{
				if (!stack.peek().equals(SQUIGLY_BRACE_START))
				{
					logger.cterror("CTBAS00017", sJSON);
					throw new JSONConvertorException("Error processing Object. Improper nesting: " + sJSON);
				}
				stack.pop();
				sJSON = sJSON.substring(1).trim();
				break;
			}
			// Else JSON has some objects defined
			else if (sJSON.startsWith(DOUBLE_QUOTE) || sJSON.startsWith(SINGLE_QUOTE))
			{
				// This is just the Key
				sName = doObjectFound();

				// Start looking for value
				if (!sJSON.startsWith(NAME_VALUE_SEPERATOR))
				{
					logger.cterror("CTBAS00018", sJSON);
					throw new JSONConvertorException("Name value not defined properly: " + sJSON);
				}

				// Ok, so value is found
				sJSON = sJSON.substring(1).trim();

				// Get the value
				objValue = doValueFound(sName);
			}
			// Indicates that there is another key-value pair coming up
			else if (sJSON.startsWith(OBJECT_SEPERATOR))
			{
				sJSON = sJSON.substring(1).trim();
				continue;
			}
			// Is this case possible in JSON?: {null}
			else if (sJSON.startsWith(NULL_VALUE))
			{
				objValue = null;
				sJSON = sJSON.substring(NULL_VALUE.length()).trim(); // Updating the JSON string if it is starts with
																		// null.
			} else
			{
				logger.cterror("CTBAS00019", sJSON);
				throw new JSONConvertorException("Object not started properly at: " + sJSON);
			}
			map.put(sName, objValue);
		}

		return map;
	}

	/**
	 * Method expects JSON String to start with "<Key>" or '<Key>'. Retrieves this 1st Key from teh JSON String and
	 * returns.
	 * 
	 * @return The Key in the starting of the JSON String
	 * @throws JSONConvertorException
	 */
	private String doObjectFound() throws JSONConvertorException
	{
		// Get type of quote, since we support both ' and "
		String sQuote = sJSON.substring(0, 1);
		sJSON = sJSON.substring(1).trim();
		int indexOfCloseQuote = sJSON.indexOf(sQuote);

		// Problem if quote not closed
		if (indexOfCloseQuote == -1)
		{
			logger.cterror("CTBAS00020", sJSON);
			throw new JSONConvertorException("Object Name not defined properly: " + sJSON);
		}
		String sObjectName = sJSON.substring(0, indexOfCloseQuote);
		sJSON = sJSON.substring(indexOfCloseQuote + 1).trim();
		return sObjectName;
	}

	/**
	 * Method expects JSON String to start with one of the below: a. "value" b. null c. <Empty String> d. <JSON Object>
	 * e. <JSON List>
	 * 
	 * Retrieves the value as applicable and returns.
	 * 
	 * Does the following: 1. Check if value is an empty String and ends with a } i.e. of type "Key":} Pop { from top of
	 * stack return null 2. Check if value is of type "Key":, or "Key":null, return null 3. Check if value is a JSON
	 * list Do List processing 4. Check if value is a Quoted String Check of String should be interpreted as a Date Do
	 * date processing Check of String should be interpreted as a Number Do number processing Else return value within
	 * quotes as is 5. Check if the value is a non-quoted String Do number processing 6. If Value not found implies
	 * incorrect JSON formatting, throw exception else return value
	 * 
	 * @param sFieldName
	 * @return Object: If one of the following: java.lang.String or java.util.Hashmap or java.util.Arraylist or
	 *         java.util.Date or java.math.BigDecimal
	 * @throws JSONConvertorException
	 */
	private Object doValueFound(String sFieldName) throws JSONConvertorException
	{
		Object objValue = null;
		String sValue = null;

		// If Object was defined like this "Name":}
		if (sJSON.startsWith(SQUIGLY_BRACE_END))
		{
			if (!stack.peek().equals(SQUIGLY_BRACE_START))
				throw new JSONConvertorException("Error processing Object. Improper nesting: " + sJSON);
			stack.pop();
			return null;
		}
		// If Object was defined like this "Name":,
		if (sJSON.startsWith(NULL_VALUE) || sJSON.startsWith(OBJECT_SEPERATOR))
			return null;
		// The value is a list
		if (sJSON.startsWith(SQUARE_BRACE_START))
			objValue = processList(sFieldName);
		// The value is a list
		else if (sJSON.startsWith(SQUIGLY_BRACE_START))
			objValue = processSquiglyBrace();
		// Looking for "Value"
		else if (sJSON.startsWith(DOUBLE_QUOTE) || sJSON.startsWith(SINGLE_QUOTE))
		{
			String sQuote = sJSON.substring(0, 1);
			sJSON = sJSON.substring(1).trim();
			//code changed to identify only first double quote in user given input
			int indexOfCloseQuote;
			if(sJSON.indexOf("\\")==0&&sJSON.indexOf("\"")==1){
				indexOfCloseQuote = sJSON.indexOf(",")-1;
			}
			else{
				indexOfCloseQuote = sJSON.indexOf(sQuote);
			}
						
			// No ending quote found
			if (indexOfCloseQuote == -1)
			{
				logger.cterror("CTBAS00021", sJSON);
				throw new JSONConvertorException("No ending quote found for value: " + sJSON);
			}
			if (interpretAsDates && isDateField(sFieldName))
				objValue = processAsDate(sJSON.substring(0, indexOfCloseQuote));
			else if (interpretAsNumbers && isNumberField(sFieldName))
				objValue = processAsNumber(sJSON.substring(0, indexOfCloseQuote));
			else
				objValue = processString(sJSON.substring(0, indexOfCloseQuote));
			sJSON = sJSON.substring(indexOfCloseQuote + 1).trim();
		}
		// Final check to see if the value is a number
		// If neither throw an exception
		else
		{
			// We are processing a Map
			if (stack.peek().equals(SQUIGLY_BRACE_START))
			{
				// JSON is like: ####, .... } or like ####} ...
				if (sJSON.indexOf(OBJECT_SEPERATOR) != -1)
				{
					if (sJSON.indexOf(OBJECT_SEPERATOR) < sJSON.indexOf(SQUIGLY_BRACE_END))
						sValue = sJSON.substring(0, sJSON.indexOf(OBJECT_SEPERATOR));
					else if (sJSON.indexOf(SQUIGLY_BRACE_END) < sJSON.indexOf(OBJECT_SEPERATOR))
						sValue = sJSON.substring(0, sJSON.indexOf(SQUIGLY_BRACE_END));
				} else
					sValue = sJSON.substring(0, sJSON.indexOf(SQUIGLY_BRACE_END));
			}
			// We are processing an Arraylist
			else if (stack.peek().equals(SQUARE_BRACE_START))
			{
				// JSON is like: ####, .... ] or like ####] ...
				if (sJSON.indexOf(OBJECT_SEPERATOR) != -1)
				{
					if (sJSON.indexOf(OBJECT_SEPERATOR) < sJSON.indexOf(SQUARE_BRACE_END))
						sValue = sJSON.substring(0, sJSON.indexOf(OBJECT_SEPERATOR));
					else if (sJSON.indexOf(SQUARE_BRACE_END) < sJSON.indexOf(OBJECT_SEPERATOR))
						sValue = sJSON.substring(0, sJSON.indexOf(SQUARE_BRACE_END));
				} else
					sValue = sJSON.substring(0, sJSON.indexOf(SQUARE_BRACE_END));
			}
			if (sValue != null)
				objValue = processAsNumber(sValue);
			else
			{
				logger.cterror("CTBAS00022", sJSON);
				throw new JSONConvertorException("Error in value: " + sJSON);
			}

			// Error in value
			if (objValue == null)
			{
				logger.cterror("CTBAS00022", sJSON);
				throw new JSONConvertorException("Error in value: " + sJSON);
			} else
				sJSON = sJSON.substring(sValue.length()).trim();
		}

		return objValue;
	}

	/**
	 * Helper method to process any special characters that come in the request data
	 * 
	 * @param sValue The string received
	 * @return The processed string
	 */
	private String processString(String sValue)
	{
		// Here we need to ensure that if the user has typed in special characters that will be replaced by
		// harmless equivalents during the JSON encoding, they are replaced back to their originals
		// Elements with index no 6 are added in below two arrays to suppport user input with doublequotes for textbox
		String[] findCharArr = new String[]
		{ "\\t", "\\n", "\\f", "\\r", "\\\\", "\\\"" };
		String[] replaceCharArr = new String[]
		{ "\t", "\n", "\f", "\r", "\\", "\"" }; 
		String temp = sValue;
		String output = sValue;
		int i;
		for (int cnt = 0; cnt < findCharArr.length; cnt++)
		{
			// Reset the string to the already replaced output
			temp = output;
			if (temp.indexOf(findCharArr[cnt]) != -1)
			{
				// Collect output string again from scratch
				output = "";
				while ((i = temp.indexOf(findCharArr[cnt])) != -1)
				{
					output = output.concat(temp.substring(0, i)).concat(replaceCharArr[cnt]);
					temp = temp.substring(i + findCharArr[cnt].length());
				}
				output = output.concat(temp); // concatenating the last substring
			} else
			{
				output = temp;
			}
		}
		return output;
	}

	/**
	 * Tries to convert the value into the date format requested. Does not throw an exception returns a null value
	 * instead
	 * 
	 * @param sValue
	 * @return
	 */
	private String processAsDate(String sValue)
	{
		Date date = null;
		String sDate = null;
		// Get the Format in which UI will send us data.
		SimpleDateFormat incoming_sdf = new SimpleDateFormat(sDateFormat);
		SimpleDateFormat cib_std_sdf = new SimpleDateFormat(sDefaultDateFormat);
		try
		{
			date = incoming_sdf.parse(sValue);

			sDate = cib_std_sdf.format(date);
		} catch (ParseException parseEx)
		{
			// Ignore exception
			// Log here, the String is either not in proper date format or is not a date.
			logger.cterror("CTBAS00014", sDateFormat, sValue);
			sDate=sValue;
		}

		return sDate;
	}

	/**
	 * Tries to convert the value into a Number. If String does not represent a number does not throw an exception
	 * returns a null value instead
	 * 
	 * @param sValue
	 * @return BigDecimal: Returns null if the input String does not represent a valid number
	 */
	private String processAsNumber(String sValue)
	{
		BigDecimal bigDecimal = null;
		String returnStr = "";
		try
		{
			bigDecimal = new BigDecimal(sValue);
			returnStr = bigDecimal.toPlainString();
		} catch (NumberFormatException numberFormatException)
		{
			// Ignore exception
			// Log here, the String is either not in proper Number format or is not a Number.
			logger.cterror("CTBAS00015", sValue);
			returnStr = sValue;
		}
		return returnStr;
	}

	/**
	 * A list definition is within [] in JSON This method encapsulates all that needs to be done when a [ (starting
	 * square brace) is found in a JSON string. Each value in the List is either of the types below: a. "value" b. null
	 * c. Empty String d. <JSON List> e. <JSON Object>
	 * 
	 * The method parses the JSON String and does the following: 1. Push [ into stack 2. Instantiate new Array 3. For
	 * all elements within the JSON list seperated by a , do the following: 4. Check if empty list of type: [] Pop [
	 * from stack return an empty Arraylist 5. If quoted String found for type "value" or 'value' Process value 6. If {
	 * found implies nested Object (Map) Process new object (map) 7. If [ found implies nested List Process List 8.
	 * Check if value is null as in [...,null,...] Put null value in list 9. If value found add object to list else
	 * throw exception 10. Return list
	 * 
	 * @param sFieldName
	 * @return
	 * @throws JSONConvertorException
	 */
	private ArrayList processList(String sFieldName) throws JSONConvertorException
	{
		ArrayList list = new ArrayList();
		stack.push(SQUARE_BRACE_START);
		Object objValue = null;

		sJSON = sJSON.substring(1).trim();
		for (; true;)
		{
			if (sJSON.startsWith(SQUARE_BRACE_END))
			{
				if (stack.peek().equals(SQUARE_BRACE_START))
				{
					stack.pop();
					sJSON = sJSON.substring(1).trim();
					break;
				} else
				{
					logger.cterror("CTBAS00023", sJSON);
					throw new JSONConvertorException("Error Processing List: " + sJSON);
				}
			}

			if (sJSON.startsWith(DOUBLE_QUOTE) || sJSON.startsWith(SINGLE_QUOTE))
				objValue = doValueFound(sFieldName);
			else if (sJSON.startsWith(SQUIGLY_BRACE_START))
				objValue = processSquiglyBrace();
			else if (sJSON.startsWith(SQUARE_BRACE_START))
				objValue = processList(sFieldName);
			else if (sJSON.startsWith(NULL_VALUE))
			{
				objValue = null;
				sJSON = sJSON.substring(NULL_VALUE.length()).trim();
			} else if (sJSON.startsWith(OBJECT_SEPERATOR))
			{
				sJSON = sJSON.substring(1).trim();
				continue;
			} else
			{
				logger.cterror("CTBAS00023", sJSON);
				throw new JSONConvertorException("Error Processing List: " + sJSON);
			}

			list.add(objValue);
		}

		return list;
	}

	private Stack stack = null;

	// Language
	private static String DOUBLE_QUOTE = "\"";
	private static String SINGLE_QUOTE = "'";
	private static String SQUIGLY_BRACE_START = "{";
	private static String SQUIGLY_BRACE_END = "}";
	private static String NAME_VALUE_SEPERATOR = ":";
	private static String OBJECT_SEPERATOR = ",";
	private static String NULL_VALUE = "null";
	private static String SQUARE_BRACE_START = "[";
	private static String SQUARE_BRACE_END = "]";

	// Get from property file
	private String sDefaultDateFormat = "dd/mm/yyyy";

	private String sJSON = null;
	private String sDateFormat = null;

	private boolean interpretAsNumbers = true;
	private boolean interpretAsDates = true;

	/**
	 * this is ref to return BooleanInterpretasDates
	 * 
	 * @return
	 */
	public boolean isInterpretAsNumbers()
	{
		return interpretAsNumbers;
	}

	/**
	 * this is ref to InterpretAsnum
	 * 
	 * @param interpretAsNumbers
	 */
	public void setInterpretAsNumbers(boolean interpretAsNumbers)
	{
		this.interpretAsNumbers = interpretAsNumbers;
	}

	/**
	 * this is ref to return IsinterpretAsDates
	 * 
	 * @return
	 */
	public boolean isInterpretAsDates()
	{
		return interpretAsDates;
	}

	/**
	 * this is ref to set interpretAsDates
	 * 
	 * @param interpretAsDates
	 */
	public void setInterpretAsDates(boolean interpretAsDates)
	{
		this.interpretAsDates = interpretAsDates;
	}

	private static final Logger logger = Logger.getLogger(JSONToHashMapConverter.class);

	/**
	 * @param dateFormat the sDateFormat to set
	 */

	/**
	 * this is ref to JSON To HashMap
	 * 
	 * @param args
	 */
	@SuppressWarnings("unused")
	public static void main(String[] args)
	{

		String s = "{\"firstname\":\"John\",\"lastName\":\"Smith\",\"dob\":\"23/06/2008\",\"address\":{\"streetAddress\":\"21 2nd street\",\"city\":\"New York\",\"state\":\"NY\",\"postCode\":10021},\"phoneNumbers\":[\"212 732-1234\",\"646 123-4567\",{\"mobileNumbers\":[\"0987654321\", \"9876543210\"]},{\"FaxNumber\":\"123 456 789\"}]}";

		JSONToHashMapConverter converter = new OnlineJSONToHashmapConverter("dd/mm/yyyy");

		HashMap map = null;

		try
		{
			map = converter.convert(s);
		} catch (JSONConvertorException jce)
		{
		}
	}
}