/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 *
 */
package com.intellectdesign.canvas.validator;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.constants.common.JSPIOConstants;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.properties.MessageCode;
import com.intellectdesign.canvas.properties.MessageManager;
import com.intellectdesign.canvas.properties.PhraseVariable;
import com.intellectdesign.canvas.utility.CTUtility;
import com.intellectdesign.canvas.validator.locale.LocaleLanguageCharacterSetFactory;
import com.intellectdesign.canvas.validator.locale.LocaleSupportConstants;
/**
 * This class is used to validate incoming data against validation rules defined in <<vertical>>.xml The currently
 * supported validations are mandatory check, type check, date check, special characters check, length check and
 * inclusive characters check. the currently supported types are Alphabets, alphanumeric, uppercasealphanumeric,
 * uppercase alpha, string numeric,number, integer,date, double,bigdecimal the date type has an extra attribute to check
 * if the date should be less than greater than the current date.
 * 
 * One can also skip one or more of the supported validations by setting validations to skip member before calling
 * validate by default all the validation would be carried out. For ex: if you want to skip only mandatory, set the
 * validationsToSkip member with the constant SKIP_MANDATORY_VALIDATION if you want to skip mandatory, and special
 * character validation then set the validationsToSkip member with the constant (SKIP_MANDATORY_VALIDATION |
 * SKIP_SPECIALCHRS_VALIDATION) Basically you can combine one or moer validations to skip by using the | operator.
 * 
 * There are two validation styles, BREAK_AT_FIRST_ERROR and FULL_VALIDATION BREAK_AT_FIRST_ERROR, will break as soon as
 * an error comes and return the error FULL_VALIDATION, will perform all the validations and return all the error codes
 * By default the validation style is BREAK_AT_FIRST_ERROR If you want to add new datatype support or a new validation
 * rule
 * 
 * Note: For people who wants to add new validations or types For new types, ensure you define a type with a unique
 * string constant For new validations, ensure you provide a proper error suffix, a resource key
 * 
 * @version 1.0
 */
public class ServerValidation implements ServerValidator
{
	// member to maintain what validations to skip
	private int validationsToSkip = PERFORM_ALL_VALIDATION;
	// member to maintain the validation style
	private int validationStyle = ApplicationValidator.VALIDATION_STYLE_BREAK_AT_FIRST_ERROR;
	// list of types supported by this validator, the constant names are self
	// explanatory
	/**
	 * Internal constant for serialization purposes
	 */
	public static final String TYPE_ALPHAONLY = "XA";
	public static final String TYPE_ALPHAUPPERCASEONLY = "XAU";
	public static final String TYPE_ALPHANUMERICONLY = "XAN";
	public static final String TYPE_ALPHANUMERICUPPERCASEONLY = "XANU";
	public static final String TYPE_STRINGNUMERICONLY = "XN";
	public static final String TYPE_NUMBER = "N";
	public static final String TYPE_INTEGER = "I";
	public static final String TYPE_DATE = "D";
	public static final String TYPE_DOUBLE = "F";
	public static final String TYPE_BIGDECIMAL = "B";
	public static final String TYPE_CURRENT_DATE_ONLY = "C";
	public static final String TYPE_FORWARD_DATES_ONLY = "F";
	public static final String TYPE_SWIFT = "X";

	// constants for the developer to indicate which validation to skip.
	// note: if you are adding new ensure that they in the powers of 2, i.e 2
	// raised to the power of n, where n is
	// integer greater than 1
	/**
	 * Internal constant for serialization purposes
	 */
	public static final int PERFORM_ALL_VALIDATION = 1;
	public static final int SKIP_MANDATORY_VALIDATION = 2;
	public static final int SKIP_INVALIDTYPE_VALIDATION = 4;
	public static final int SKIP_SPECIALCHRS_VALIDATION = 8;
	public static final int SKIP_INVALIDDATE_VALIDATION = 16;
	public static final int SKIP_LENGTH_VALIDATION = 32;
	public static final int SKIP_INCLUSIVECHRS_VALIDATION = 64;
	private static Logger logger = Logger.getLogger(ServerValidation.class);
	// The following constants are defined for providing phrase variable support
	// in application validator error
	// messages, which includes,
	// keys that should be defined in the property file
	private static final String PHRASE_VARIABLE_KEY_FIELD_NAME = "FLDNAME";
	private static final String RESOURCE_KEY_MANDATORY_ERROR = "ERR_MANDATORY_VAL"; // CT_ERR_MAND
	private static final String RESOURCE_KEY_INVALIDTYPE_ERROR = "ERR_INVALIDTYPE";
	private static final String RESOURCE_KEY_SPECIALCHRS_ERROR = "ERR_SPECIALCHRS";
	private static final String RESOURCE_KEY_INVALIDDATE_ERROR = "ERR_INVALIDDATE";
	private static final String RESOURCE_KEY_LENGTH_ERROR = "ERR_INVALIDLENGTH";
	private static final String RESOURCE_KEY_INCLUSIVECHRS_ERROR = "ERR_INCLUSIVECHRS";

	// suffix used in this validator to classify error types
	private static final String MANDATORY_ERROR_SUFFIX = "_M";
	private static final String INVALIDTYPE_ERROR_SUFFIX = "_I";
	private static final String SPECIALCHRS_ERROR_SUFFIX = "_S";
	private static final String INVALIDDATE_ERROR_SUFFIX = "_D";
	private static final String LENGTH_ERROR_SUFFIX = "_L";
	private static final String INCLUSIVECHRS_ERROR_SUFFIX = "_CHARCT";

	private static final String ERROR_CODE_DELIMITTER = ",";
	private static final int ERROR_CODE_PREFIX_LENGTH = MessageManager.ERROR_CODE_PREFIX.length();

	// if new error suffix are being introduced, then this array needs to be
	// updated as well.
	private static final String[] ERROR_SUFFIX_LIST =
	{ MANDATORY_ERROR_SUFFIX, INVALIDTYPE_ERROR_SUFFIX, SPECIALCHRS_ERROR_SUFFIX, INVALIDDATE_ERROR_SUFFIX,
			LENGTH_ERROR_SUFFIX, INCLUSIVECHRS_ERROR_SUFFIX };

	// a mapping variable to maintain between the suffix and resourcekey
	private static final HashMap ERROR_TYPE_TO_RESOURCE_KEY_MAPPING = new HashMap();

	// initialiser block to initialise the errortype to resourcekey mapping
	static
	{
		ERROR_TYPE_TO_RESOURCE_KEY_MAPPING.put(MANDATORY_ERROR_SUFFIX, RESOURCE_KEY_MANDATORY_ERROR);
		ERROR_TYPE_TO_RESOURCE_KEY_MAPPING.put(INVALIDTYPE_ERROR_SUFFIX, RESOURCE_KEY_INVALIDTYPE_ERROR);
		ERROR_TYPE_TO_RESOURCE_KEY_MAPPING.put(SPECIALCHRS_ERROR_SUFFIX, RESOURCE_KEY_SPECIALCHRS_ERROR);
		ERROR_TYPE_TO_RESOURCE_KEY_MAPPING.put(INVALIDDATE_ERROR_SUFFIX, RESOURCE_KEY_INVALIDDATE_ERROR);
		ERROR_TYPE_TO_RESOURCE_KEY_MAPPING.put(LENGTH_ERROR_SUFFIX, RESOURCE_KEY_LENGTH_ERROR);
		ERROR_TYPE_TO_RESOURCE_KEY_MAPPING.put(INCLUSIVECHRS_ERROR_SUFFIX, RESOURCE_KEY_INCLUSIVECHRS_ERROR);
	}

	/**
	 * Default Constructor, does nothing
	 * 
	 */
	public ServerValidation()
	{

	}

	/**
	 * Overloaded constructor to initialise the various server valiadtion attributes Refer this class's documentation
	 * for further details about these attributes.
	 * 
	 * @param validationsToSkip , a combination of the validations to skip
	 * @param validationStyle , validation style
	 * @param errorReportingStyle , the error reporting reporting style
	 */
	public ServerValidation(int mValidationsToSkip, int mValidationStyle)
	{
		this.validationsToSkip = mValidationsToSkip;
		this.validationStyle = mValidationStyle;
	}

	/**
	 * utility method to convert the error code string used in this server validation class into a
	 * messagecode,phrasevariable objects this method is invoked by the application validator
	 * 
	 * @param errors The errors returned by this servervalidation class
	 * @param prptFileName the propertyfilename, this is used to construct the phrase value for the fieldnames in the
	 *            errorcodes this file name should be the one where the label are present for the fieldnames.
	 * @param langId the language id
	 * @return List a list of message code objects
	 */
	public static List convertErrorStringToMessageCodeList(String errors, String prptFileName, String langId)
	{
		// passing null as the last parameter since there is no necessity of a
		// parammap
		return convertErrorStringToMessageCodeList(errors, prptFileName, langId, null);
	}

	/**
	 * This method is invoked by the error code tag when trying to display error messages from a openwin call (typicall
	 * to display client side (javascript) validation errors) in which case, the client side application would send
	 * error codes and phrase variables through request params the paramMap parameter in this api is to capture the
	 * phrase variables for the errors
	 * 
	 * @param errors The errors returned by this servervalidation class
	 * @param prptFileName the propertyfilename, this is used to construct the phrase value for the fieldnames in the
	 *            errorcodes this file name should be the one where the label are present for the fieldnames.
	 * @param langId the language id
	 * @param paramMap map information which has phrasevariable information
	 * @return List a list of message code objects
	 */
	public static List convertErrorStringToMessageCodeList(String errors, String prptFileName, String langId,
			Map paramMap)
	{
		String cmName = "ServerValidation.convertErrorStringToMessageCodeList";

		List messageCodes = new ArrayList();
		// errors is a comma separate list of error codes
		// split them into an array and process them one by one
		String[] errorsArray = CTUtility.getCommaSeparatedList(errors);
		if (errorsArray != null && errorsArray.length > 0)
		{
			String errorType = "";
			String fieldName = "";
			String resourceKey = "";
			String fieldNameDesc = "";
			String prefixedFieldName = "";
			PhraseVariable aVariable;
			MessageCode aMsgCode;
			for (int index = 0; index < errorsArray.length; index++)
			{
				// dont do anything if there errorCode is null or empty
				if (errorsArray[index] == null || errorsArray[index].equals(""))
					continue;

				// get the error type from the error code
				errorType = getErrorTypeFrom(errorsArray[index]);
				// get the fieldname from the error code
				fieldName = getFieldNameFrom(errorsArray[index], errorType);
				// if the errortype is empty, then the entire resource code is
				// used as a message code without any phrase
				// variables and continue
				// (this is a typical case of a collection errorcode as these
				// errocode wont have any error type suffix)
				if (errorType.equals("") || fieldName.equals(""))
				{
					resourceKey = errorsArray[index];
					if (paramMap != null)
					{
						logger.ctdebug("CTVAL00026", cmName, errorsArray[index]);
						aMsgCode = new MessageCode(resourceKey, paramMap);
					} else
					{
						logger.ctdebug("CTVAL00027", cmName, errorsArray[index]);
						aMsgCode = new MessageCode(resourceKey);
					}
					messageCodes.add(aMsgCode);
					continue;
				} else
				// this is a valid error code, hence create phrase variables for
				// this.
				{
					// get the resourcekey for the above error type
					resourceKey = (String) ERROR_TYPE_TO_RESOURCE_KEY_MAPPING.get(errorType);

					// get the fieldnamedesc using message manager for this
					// field in the prptfilename
					// since this is in application validator we can safely
					// assume that all fieldName should be prefixed
					// with the key LBL_ in the prpt file.
					prefixedFieldName = MessageManager.LABEL_CODE_PREFIX + fieldName;
					fieldNameDesc = MessageManager.getMessage(prptFileName, prefixedFieldName, langId);

					// create a phrase variable using key as
					// PHRASE_VARIABLE_KEY_FIELD_NAME and value as the
					// fieldnamedesc
					aVariable = new PhraseVariable(PHRASE_VARIABLE_KEY_FIELD_NAME, fieldNameDesc);

					// using the above resource and phrase variable, create a
					// message code
					aMsgCode = new MessageCode(resourceKey);
					aMsgCode.addPhraseVariable(aVariable);

					// add the message code to the list
					messageCodes.add(aMsgCode);
				}
			}
		}
		return messageCodes;
	}

	/**
	 * Utility method to get the error type from the error code
	 * 
	 * @param errorCode the errorCode generated by this class
	 * @return String the error Type contained in the errorCode, if no errorType is present, emptyString is returned
	 */
	private static String getErrorTypeFrom(String errorCode)
	{
		String errorType = "";
		for (int index = 0; index < ERROR_SUFFIX_LIST.length; index++)
		{
			if (errorCode.endsWith(ERROR_SUFFIX_LIST[index]))
				return ERROR_SUFFIX_LIST[index];
		}
		return errorType;
	}

	/**
	 * utility method to retrieve the field name from the error code and the error type
	 * 
	 * @param errorCode the errorCode generated by this class
	 * @param errorType the errorType present in this errorCode
	 * @return the fieldName sandwiched between the errorprefix and error type in the errorcode, or emptystring
	 */
	private static String getFieldNameFrom(String errorCode, String errorType)
	{
		String fieldName = "";
		int errorTypeIndex = errorCode.lastIndexOf(errorType);

		// errorcode typically is made of ERR_ + fieldname + errorType
		if (errorTypeIndex != -1 && errorCode.startsWith(MessageManager.ERROR_CODE_PREFIX))
			fieldName = errorCode.substring(ERROR_CODE_PREFIX_LENGTH, errorTypeIndex);

		return fieldName;
	}

	/**
	 * a utility method to generate an errorCode, it prefixes ERR_ to fieldname and then appends the errorType and then
	 * the delimitter return the generated errorCode in the format "ERR_fieldName_errorType,"
	 */
	private StringBuffer generateErrorCode(String fieldName, String errorType)
	{
		return new StringBuffer(MessageManager.ERROR_CODE_PREFIX).append(fieldName).append(errorType)
				.append(ERROR_CODE_DELIMITTER);
	}

	/**
	 * The <code>checkMandatory</code> Check xml defined is mandatory and the data which passed from APS system doesn
	 * contain value for the field defined then return error
	 * 
	 * @param String xml_field
	 * @param boolean xml_mandatory
	 * @param String inputdata
	 * @return String
	 */

	private StringBuffer checkMandatory(String xml_field, boolean xml_mandatory, String inputdata)
	{

		StringBuffer mData = new StringBuffer();

		if ((validationsToSkip & SKIP_MANDATORY_VALIDATION) == SKIP_MANDATORY_VALIDATION)
		{
			// return an empty string to indicate as though mandatory the validation has passed.
			return mData;
		}

		if (xml_mandatory)
		{
			if ("".equals(inputdata) || inputdata == null)
			{
				mData = generateErrorCode(xml_field.trim(), MANDATORY_ERROR_SUFFIX);
			}
		}
		return mData;
	}

	/**
	 * The <code>checkType</code> Check xml defined is alphanumeric or numeric and the data which passed from the user
	 * doesn contain same datatype else return error
	 * 
	 * @param restrictLangId
	 * @param allLangs
	 * @param multiLang
	 * 
	 * @param String xml_field
	 * @param String xml_type
	 * @param String inputdata
	 * @param String xml_specialCharacter
	 * @param String xml_inclChars
	 * @param String langId - which gives locale value in session
	 * @return String - Returns error codes if any else ""
	 */
	private String checkType(String xml_field, String xml_type, String inputdata, String dtType,
			String xml_specialCharacter, String xml_inclChars, String langId, boolean multiLine, boolean multiLang,
			String allLangs, String restrictLangId)
	{
		StringBuffer typeData = new StringBuffer();

		String fieldType = "";
		String fieldName = xml_field.trim();

		if ((validationsToSkip & SKIP_INVALIDTYPE_VALIDATION) == SKIP_INVALIDTYPE_VALIDATION)
		{

			return "";// return an empty string to indicate as though mandatroy
						// validation has passed.
		}
		if (xml_type != null && !"".equals(xml_type))
		{
			fieldType = xml_type.toUpperCase();
			if (TYPE_NUMBER.equals(fieldType) || (TYPE_DOUBLE.equals(fieldType)))
			{
				typeData = checkTypeDouble(fieldName, fieldType, inputdata, dtType, xml_specialCharacter,
						xml_inclChars, langId, multiLine);
			} else if (TYPE_BIGDECIMAL.equals(fieldType))
			{
				typeData = checkTypeBigDecimal(fieldName, fieldType, inputdata, dtType, xml_specialCharacter,
						xml_inclChars, langId, multiLine);
			} else if (TYPE_INTEGER.equals(fieldType))
			{
				// Type I is defined to allow only integers (with out decimals)
				// Error code legend is _I, however this is already used for
				// Type N
				// error code, Type I also reuseing the same legend
				// Note: The following block of code is for checking type, not
				// length
				typeData = checkTypeInteger(fieldName, fieldType, inputdata, dtType, xml_specialCharacter,
						xml_inclChars, langId, multiLine);
			} else if (TYPE_DATE.equals(fieldType))
			{
				typeData = checkTypeDate(fieldName, fieldType, inputdata, dtType, xml_specialCharacter, xml_inclChars,
						langId, multiLine);
			} else if (TYPE_SWIFT.equals(fieldType))
			{
				// Handle swift field validation here.
				typeData = checkTypeSwift(fieldName, fieldType, inputdata, dtType, xml_specialCharacter, xml_inclChars,
						langId, multiLine);
			}
			// if field type is anyone of XAN or XA or XAU or XANU or XN then
			// Check againest of exclusive special chars if any. If validation
			// fails then return error
			// else get the character set for data type, adding the inclusive
			// chars to data type char set if any,
			// then validate.
			else if (isValidFieldType(xml_type))
			{

				/**
				 * This method call will handle the character set check for all locales and valid field types ie,XAN or
				 * XA or XAU or XANU or XN. It will also check for special characters and inclusive characterset so as
				 * to avoid special characters and include inclusive characters while validating
				 */
				boolean isValid = new LocaleLanguageCharacterSetFactory().execute(langId, inputdata, xml_inclChars,
						xml_specialCharacter, xml_type, multiLine);
				if (!isValid)
				{
					typeData = typeData.append(generateErrorCode(xml_field, INCLUSIVECHRS_ERROR_SUFFIX));
				}

			} else
			{

				typeData = generateErrorCode(xml_field.trim(), INVALIDTYPE_ERROR_SUFFIX);
			}
		}

		return typeData.toString();
	}

	/**
	 * The <code>checkLength</code> Checks the length of the inputdata with the length of field defined in xml. If
	 * inputdata length is greater than length of field defined in xml then returns error else returns empty string
	 * 
	 * @param String xml_field
	 * @param int xml_charLength
	 * @param String inputdata
	 * @param xml_numCharsPerLine
	 * @param multiLine
	 * @return String - Returns error codes if any else ""
	 * 
	 */
	public StringBuffer checkLength(String xml_field, int xml_charLength, int xml_numCharsPerLine, String inputdata,
			boolean multiLine)
	{

		StringBuffer lenData = new StringBuffer();
		int charsPerLine = xml_charLength;
		int numRows = xml_charLength;

		if ((validationsToSkip & SKIP_LENGTH_VALIDATION) == SKIP_LENGTH_VALIDATION)
		{

			return lenData;// return an empty string to indicate as though checklength validation has passed.
		}

		// If data is supposed to contain multi line, then user would have
		// provided input as 100,63
		// which stands for 100 lines of 63 chars per line. If there were no
		// multiline, then the single number provided
		// should be treated as the max length.
	
		if (!multiLine)
		{
			charsPerLine = xml_charLength;
			if (inputdata.length() > charsPerLine)
				lenData = generateErrorCode(xml_field.trim(), LENGTH_ERROR_SUFFIX);
		} else
		{
			numRows = xml_charLength;
			charsPerLine = xml_numCharsPerLine;
			// Handle multi line. For this, do basic check. Number of characters
			// should not exceed numRows * numChars
			if (inputdata.length() > (numRows * charsPerLine))
				lenData = generateErrorCode(xml_field.trim(), LENGTH_ERROR_SUFFIX);
			else
			{
				// Split the input data into lines and then check for numRows
				// and numCharsPerLine.
				List<String> allLines = convertToLines(inputdata, charsPerLine);
				if (allLines.size() > numRows)
					lenData = generateErrorCode(xml_field.trim(), LENGTH_ERROR_SUFFIX);
			}
		}

		return lenData;
	}

	/**
	 * The <code>checkLength</code> checks the length of dataArr[0] with lenArr[0] and dataArr[1] with lenArr[1], if
	 * dataArr[0] or dataArr[1] length is greater than lenArr[0] or lenArr[1] then returns error else do nothing
	 * 
	 * @param String xml_field - XML field name
	 * @param int[] lenArr - This array contains two values, first one indicates before decimal length and second one is
	 *        after length
	 * @param String [] dataArr - This array contains two values, first one indicates before decimal value and second
	 *            one is after value
	 * @return String - Returns error codes if any else ""
	 */
	public StringBuffer checkLength(String xml_field, int[] lenArr, String[] dataArr)
	{
		String cmName = "[ServerValidation.checkLength]";
		StringBuffer errorData = new StringBuffer();

		if ((validationsToSkip & SKIP_LENGTH_VALIDATION) == SKIP_LENGTH_VALIDATION)
		{

			return errorData;// return an empty string to indicate as though checklength validation has passed.
		}
		try
		{
			if (dataArr != null && dataArr.length > 0)
			{
				int beforeDecimalLen = lenArr[0];
				int afterDecimalLen = lenArr[1];
				String beforeDecimalData = dataArr[0];
				String afterDecimalData = dataArr[1];

				if (beforeDecimalData.length() > beforeDecimalLen || afterDecimalData.length() > afterDecimalLen)
				{
					errorData = generateErrorCode(xml_field.trim(), LENGTH_ERROR_SUFFIX);
				}
			} 
			
		} catch (Exception exception)
		{

			errorData = generateErrorCode(xml_field.trim(), LENGTH_ERROR_SUFFIX);
			logger.cterror("CTVAL00048", exception, cmName);
		}
		logger.ctdebug("CTVAL00028", errorData, cmName);
		return errorData;
	}

	/**
	 * The <code>validate</code> process the special character,integer,mandatory check based on the value parsed from
	 * xml has well the data passed from aps system as hashmap for validation
	 * 
	 * @param HashMap hashMap
	 * @param ArrayList optList
	 * @exception throws ValidationException
	 * @return String - Returns error codes separated by comma(,) if any else
	 */

	public String validate(HashMap hashMap, ArrayList optList) throws ValidationException
	{
		String cmName = "[ServerValidation.validate]";
		String returnData = "";

		int elementLen = 0;
		int optListSize = optList.size();

		try
		{

			for (int count = 0; count < optListSize; count++)
			{
				Object elementArr[] = (Object[]) optList.get(count);

				elementLen = elementArr.length;

				inner: for (int arrayIndex = 0; arrayIndex < elementLen; arrayIndex++)
				{
					String errorcode = "";
					Object elementOb = elementArr[arrayIndex];
					if (elementOb instanceof ElementValue)
					{

						ElementValue elemValue = (ElementValue) elementOb;
						if (elemValue.isArray())
						{
							String xml_field = elemValue.getFieldName();
							String temp_xml_field = null;
							String[] inputDatas = null;
							String inputdata = null;
							if (elemValue.isMaxOccurs())
							{
								int hdNoOfRows = Integer.parseInt(hashMap.get("hdNoOfRows").toString());
								for (int i = 0; i < hdNoOfRows; i++)
								{
									temp_xml_field = xml_field + i;
									if (hashMap.containsKey(temp_xml_field))
									{
										Object objData = hashMap.get(temp_xml_field);
										inputDatas = (String[]) objData;
										for (int j = 0; j < inputDatas.length; j++)
										{
											inputdata = inputDatas[j].toString();

											errorcode = validateElementArray(elemValue, hashMap, inputdata);
										}
									}
								}
							} else
							{
								if (hashMap.containsKey(xml_field))
								{
									Object objData = hashMap.get(xml_field);
									inputDatas = (String[]) objData;
									for (int j = 0; j < inputDatas.length; j++)
									{
										inputdata = inputDatas[j].toString();
										errorcode = validateElementArray(elemValue, hashMap, inputdata);
									}
								}
							}
						} else
						{
							errorcode = validateElementValue(elemValue, hashMap);
						}
						logger.ctdebug("CTVAL00029", cmName, arrayIndex, errorcode);
					} else if (elementOb instanceof CollectionElementsValue)
					{

						CollectionElementsValue cev = (CollectionElementsValue) elementOb;
						errorcode = validateCollectionElemValue(cev, hashMap);

					}
					returnData += errorcode;
					if (validationStyle == ApplicationValidator.VALIDATION_STYLE_BREAK_AT_FIRST_ERROR)
					{

						if (!"".equals(errorcode))
						{
							break inner;
						}
					} else if (validationStyle == ApplicationValidator.VALIDATION_STYLE_FULL_VALIDATION)
					{

						continue inner;
					} else
					// default , this case would never occur.
					{
						if (!"".equals(errorcode))
						{
							break inner;
						}
					}

				}// inner for close
			}// outer for close
		} catch (Exception ex)
		{
			logger.cterror("CTVAL00050", ex);
			throw new ValidationException(ex);
		}

		if (!"".equals(returnData))
			returnData = returnData.substring(0, returnData.length() - 1);

		return returnData;
	}

	/**
	 * Find the field name from CollectionElementsValue and gets the List from HashMap using the keyname as key. List if
	 * nothing but List of HashMap which has to validate. So this gets HashMap from list one by one and Send to
	 * validateElementValue for validation
	 * 
	 * @param CollectionElementsValue - CollectionElementsValue instance which has been set validation rules for
	 *            incoming collection
	 * @param inputMap - incoming data from client
	 * @return String - Returns error codes if any, else empty string
	 * @exception - ValidationException
	 */
	private String validateCollectionElemValue(CollectionElementsValue cev, HashMap inputMap)
			throws ValidationException
	{

		String errorCode = "";
		List elemValueList = cev.getElementValueList();
		String collectErrorCode = "";
		String collName = cev.getCollectionName();
		StringBuffer errBuffer = new StringBuffer();
		Object ob = inputMap.get(collName);

		List inputList = new ArrayList();
		if (ob != null)
		{
			if (ob instanceof List)
			{
				inputList = (ArrayList) ob;

			} else
			{

				throw new ValidationException(" Object associated in incoming HashMap is not instance of LIST ");
			}
		} 
		
		
		// Collection value mandatory check
		if ((cev.isMandatory() && ob == null) || inputList.isEmpty())
		{

			if ((validationsToSkip & SKIP_MANDATORY_VALIDATION) == SKIP_MANDATORY_VALIDATION)
			{

				errorCode = "";// no errorcode is return since mandatory
								// validation can be skipped.
			} else
			{
				errorCode = generateErrorCode(cev.getCollectionName(), MANDATORY_ERROR_SUFFIX).toString();

			}
			return errorCode;
		}

		int inputListSize = inputList.size();
		// If inputListSize is length is greater than 0 then iterate list and
		// validate all ElementValue in that
		for (int inputListIndex = 0; inputListIndex < inputListSize; inputListIndex++)
		{
			HashMap map = (HashMap) inputList.get(inputListIndex);
			map.put(JSPIOConstants.INPUT_LANGUAGE_ID, inputMap.get(JSPIOConstants.INPUT_LANGUAGE_ID));

			int elemValueListSize = elemValueList.size();

			for (int eleIndex = 0; eleIndex < elemValueListSize; eleIndex++)
			{
				ElementValue elemValue = (ElementValue) elemValueList.get(eleIndex);
				if (elemValue != null)
				{
					errBuffer.append(validateElementValue(elemValue, map));

				}
			}
		}
		errorCode = errBuffer.toString();
		// prefixing collection error code to validation error codes to explain
		// user like validation errors occurred in collection
		if (!errorCode.equals(""))
		{
			// there is no error type associated with collection
			collectErrorCode = generateErrorCode(collName, "") + errorCode;
		}

		return collectErrorCode;
	}

	/**
	 * Find the field name from ElementValue and gets the Object from HashMap using the keyname as key and validates the
	 * objects value against validation rules.
	 * 
	 * @param ElementValue - ElementValue instance which has been set validation rules
	 * @param HashMap - incoming data from client
	 * @return String - error codes if any, else empty string
	 * @exception - ValidationException
	 */
	private String validateElementValue(ElementValue tp, HashMap hashMap)
	{
		
		String xml_field = tp.getFieldName();
		String xml_type = tp.getFieldType();
		boolean xml_mandatory = tp.getMandatory();
		String xml_specialCharacter = tp.getSpecialCharacter();
		// to hold inclusive chars
		String xml_inclChars = tp.getInclusiveChars();
		int xml_charLength = tp.getFieldLength();
		int xml_afterDecimalLength = tp.getAfterDecimalLength();
		String dtCheck = tp.getDateCheck();
		boolean multiLine = tp.isMultiLine();
		boolean multiLang = tp.isMultiLang();
		String allLangs = tp.getLangIds();
		String restrictLangKey = tp.getRestrictLangKey();
		String restrictLangId = null;
		if (restrictLangKey != null && restrictLangKey.length() > 0)
		{
			// Retrieve the Lang Id from the data map and pass it along
			restrictLangId = (String) hashMap.get(restrictLangKey);
		}

		String inputdata = "";
		StringBuffer validateData = new StringBuffer();
		String langId = (String) hashMap.get(JSPIOConstants.INPUT_LANGUAGE_ID);

		if (hashMap.containsKey(xml_field))
		{
				Object objData = hashMap.get(xml_field);
				if (objData != null)
				{
					inputdata = objData.toString();
				}

				if (xml_mandatory)
				{
					validateData = checkMandatory(xml_field, xml_mandatory, inputdata);
				}

				if (xml_field != null)
				{

					validateData = validateData.append(checkType(xml_field, xml_type, inputdata, dtCheck, xml_specialCharacter, xml_inclChars,
									langId, multiLine, multiLang, allLangs, restrictLangId));

					if (!isValidFieldType(xml_type) && xml_specialCharacter != null
							&& xml_specialCharacter.length() > 0)
					{
						validateData = validateData.append(checkSpecial(xml_field, xml_specialCharacter, inputdata));
					}
					// For inclusive chars check, if xml_type is an invalid type
					// then only we will perform
					// this check bcoz if the xml_type is valid then the
					// checkType will perform the
					// checkInclusiveChars()
					if (!isValidFieldType(xml_type) && xml_inclChars != null && xml_inclChars.length() > 0)
					{

						validateData = validateData.append(checkInclusiveChars(xml_field, xml_inclChars, inputdata));
					}

					// If field type is double or Bigdecimal, check for the
					// length before & after decimal separator
					if (xml_type.equalsIgnoreCase(TYPE_DOUBLE) || xml_type.equalsIgnoreCase(TYPE_BIGDECIMAL))
					{

						if (!inputdata.equals(""))
						{
							int[] lengthArr = new int[2];
							lengthArr[0] = xml_charLength;
							lengthArr[1] = xml_afterDecimalLength;
							if (inputdata.indexOf('.') == 0)
							{
								// if input data start with dot(.), for instance
								// .2/.3455 like that, then prefix 0
								inputdata = "0" + inputdata;

							}
							// if input data ends with dot(.), for instance
							// 2./3455. like that, then suffixing 0
							if (inputdata.endsWith("."))
							{
								inputdata = inputdata + "0";

							}
							// input data does not contain dot(.), for insatnce
							// 2, 345 like that, then suffixing .0
							// typically allowing integers for type F
							if (inputdata.indexOf('.') == -1)
							{
								inputdata = inputdata + ".0";

							}
							String[] dataArr = CTUtility.getDelimitedList(inputdata, ".");

							validateData = validateData.append(checkLength(xml_field, lengthArr, dataArr));
						}
					} else
					{
						// If field type is N or I then
						validateData = validateData.append(checkLength(xml_field, xml_charLength, xml_afterDecimalLength, inputdata, multiLine));
					}
				}// xml_field!=null check close

		}

		return validateData.toString();
	}

	/**
	 * Find the field name from ElementValue and gets the Object from HashMap using the keyname as key and validates the
	 * objects value against validation rules.
	 * 
	 * @param ElementValue - ElementValue instance which has been set validation rules
	 * @param HashMap - incoming data from client
	 * @param inputData - Element of an Array
	 * @return String - error codes if any, else empty string
	 */
	private String validateElementArray(ElementValue tp, HashMap hashMap, String inputdata)
	{
		String xml_field = tp.getFieldName();
		String xml_type = tp.getFieldType();
		boolean xml_mandatory = tp.getMandatory();
		String xml_specialCharacter = tp.getSpecialCharacter();
		// to hold inclusive chars
		String xml_inclChars = tp.getInclusiveChars();
		int xml_charLength = tp.getFieldLength();
		int xml_afterDecimalLength = tp.getAfterDecimalLength();
		String dtCheck = tp.getDateCheck();
		boolean multiLine = tp.isMultiLine();

		StringBuffer validateData = new StringBuffer();
		String langId = (String) hashMap.get(JSPIOConstants.INPUT_LANGUAGE_ID);

		boolean multiLang = tp.isMultiLang();
		String allLangs = tp.getLangIds();
		String restrictLangKey = tp.getRestrictLangKey();
		String restrictLangId = null;
		if (restrictLangKey != null && restrictLangKey.length() > 0)
		{
			// Retrieve the Lang Id from the data map and pass it along
			restrictLangId = (String) hashMap.get(restrictLangKey);
		}

			if (xml_mandatory)
			{
				validateData = checkMandatory(xml_field, xml_mandatory, inputdata);
			}

			if (xml_field != null)
			{

				validateData = validateData.append(checkType(xml_field, xml_type, inputdata, dtCheck, xml_specialCharacter, xml_inclChars,
								langId, multiLine, multiLang, allLangs, restrictLangId));

				if (!isValidFieldType(xml_type) && xml_specialCharacter != null && xml_specialCharacter.length() > 0)
				{
					validateData = validateData.append(checkSpecial(xml_field, xml_specialCharacter, inputdata));
				}
				// For inclusive chars check, if xml_type is an invalid type
				// then only we will perform
				// this check bcoz if the xml_type is valid then the checkType
				// will perform the
				// checkInclusiveChars()
				if (!isValidFieldType(xml_type) && xml_inclChars != null && xml_inclChars.length() > 0)
				{

					validateData = validateData.append(checkInclusiveChars(xml_field, xml_inclChars, inputdata));
				}

				// If field type is double or Bigdecimal, check for the length
				// before & after decimal separator
				if (xml_type.equalsIgnoreCase(TYPE_DOUBLE) || xml_type.equalsIgnoreCase(TYPE_BIGDECIMAL))
				{

					if (!inputdata.equals(""))
					{
						int[] lengthArr = new int[2];
						lengthArr[0] = xml_charLength;
						lengthArr[1] = xml_afterDecimalLength;
						String suffix = "";
						String prefix = "";
						if (inputdata.indexOf('.') == 0)
						{
							// if input data start with dot(.), for instance
							// .2/.3455 like that, then prefix 0
							prefix = "0";

						}
						// if input data ends with dot(.), for instance 2./3455.
						// like that, then suffixing 0
						if (inputdata.endsWith("."))
						{
							suffix = "0";

						}
						// input data does not contain dot(.), for insatnce 2,
						// 345 like that, then suffixing .0
						// typically allowing integers for type F
						if (inputdata.indexOf('.') == -1)
						{
							suffix = ".0";

						}
						String[] dataArr = CTUtility.getDelimitedList(prefix + inputdata + suffix, ".");

						validateData = validateData.append(checkLength(xml_field, lengthArr, dataArr));
					}
				} else
				{
					// If field type is N or I then
					validateData = validateData.append(checkLength(xml_field, xml_charLength, xml_afterDecimalLength, inputdata, multiLine));
				}
			}// xml_field!=null check close		

		return validateData.toString();
	}

	/**
	 * The <code>checkSpecial</code>
	 * 
	 * @param String xml_field
	 * @param String xml_specialCharacter
	 * @param String inputdata
	 * @return String desc Check wether xml defined has special character and the data which passed from APS system does
	 *         contain same special character then return error else do nothing
	 */
	private StringBuffer checkSpecial(String xml_field, String xml_specialCharacter, String inputdata)
	{
		StringBuffer spData = new StringBuffer();

		if ((validationsToSkip & SKIP_SPECIALCHRS_VALIDATION) == SKIP_SPECIALCHRS_VALIDATION)
		{

			return spData;// return an empty string to indicate as though special
						// character validation has passed.
		}

		if (xml_specialCharacter != null && !"".equals(xml_specialCharacter))
		{

			char chr[] = xml_specialCharacter.toCharArray();
			for (int count = 0; count < chr.length; count++)
			{
				if (inputdata.indexOf(chr[count]) != -1)
				{
					spData = generateErrorCode(xml_field.trim(), SPECIALCHRS_ERROR_SUFFIX);

					return spData;
				}
			}
		}
		return spData;
	}

	/**
	 * The <code>checkInclusiveChars</code> Check xml defined has character and the data which passed from APS system
	 * does not contain same character then return error else do nothing
	 * 
	 * @param String xml_field - field name
	 * @param String xml_inclChars - char ser defined in xml for xml_field
	 * @param String inputdata - incoming value
	 * @return String - Returns error codes if any else ""
	 */
	private StringBuffer checkInclusiveChars(String xml_field, String xml_inclChars, String inputdata)
	{
		StringBuffer errorData = new StringBuffer();

		if ((validationsToSkip & SKIP_INCLUSIVECHRS_VALIDATION) == SKIP_INCLUSIVECHRS_VALIDATION)
		{

			return errorData;// return an empty string to indicate as though inclusive character validation has passed.
		}

		if (xml_inclChars != null && !"".equals(xml_inclChars))
		{

			char chr[] = inputdata.toCharArray();
			for (int count = 0; count < chr.length; count++)
			{
				if (xml_inclChars.indexOf(chr[count]) == -1)
				{
					errorData = generateErrorCode(xml_field.trim(), INCLUSIVECHRS_ERROR_SUFFIX);

					return errorData;
				}
			}
		} 
		
		return errorData;
	}

	/**
	 * This method is called to check the input data for compatibility to Double. This will check only for Type and not
	 * length
	 * 
	 * @param fieldName The file key
	 * @param xml_type The type of the field as configured in XML
	 * @param inputdata The value for the field
	 * @param dtType back dated type information.
	 * @param xml_specialCharacter Special characters if any to consider
	 * @param xml_inclChars Inclusive characters list
	 * @param langId The language id of the current user
	 * @param multiLine Flag indicating if multiple lines are applicable.
	 * @return The error code applicable for this validation
	 */
	private StringBuffer checkTypeDouble(String fieldName, String xml_type, String inputdata, String dtType,
			String xml_specialCharacter, String xml_inclChars, String langId, boolean multiLine)
	{
		StringBuffer typeData = new StringBuffer();
		try
		{
			if (inputdata != null && !"".equals(inputdata))
			{
				double checkValid = Double.parseDouble(inputdata);

				if (checkValid < 0)
					typeData = generateErrorCode(fieldName, INVALIDTYPE_ERROR_SUFFIX);
			}
		} catch (NumberFormatException nformat)
		{
			// Means that the data is not a valid number. So convert to a valid
			// error message.
			typeData = generateErrorCode(fieldName, INVALIDTYPE_ERROR_SUFFIX);
		}
		return typeData;
	}

	/**
	 * This method is called to check the input data for compatibility to Big Decimal. This will check only for Type and
	 * not length
	 * 
	 * @param fieldName The file key
	 * @param xml_type The type of the field as configured in XML
	 * @param inputdata The value for the field
	 * @param dtType back dated type information.
	 * @param xml_specialCharacter Special characters if any to consider
	 * @param xml_inclChars Inclusive characters list
	 * @param langId The language id of the current user
	 * @param multiLine Flag indicating if multiple lines are applicable.
	 * @return The error code applicable for this validation
	 */
	private StringBuffer checkTypeBigDecimal(String fieldName, String xml_type, String inputdata, String dtType,
			String xml_specialCharacter, String xml_inclChars, String langId, boolean multiLine)
	{
		StringBuffer typeData = new StringBuffer();
		try
		{
			if (inputdata != null && !"".equals(inputdata))
			{
				BigDecimal checkValid = new BigDecimal(inputdata);
				if (checkValid.signum() < 0) // checking for negative numbers
					typeData = generateErrorCode(fieldName, INVALIDTYPE_ERROR_SUFFIX);
			}
		} catch (NumberFormatException nformat)
		{
			// Means that the data is not a valid big decimal. So convert to a
			// valid error message.
			typeData = generateErrorCode(fieldName, INVALIDTYPE_ERROR_SUFFIX);
		}
		return typeData;
	}

	/**
	 * This method is called to check the input data for compatibility to Integer. This will check only for Type and not
	 * length
	 * 
	 * @param fieldName The file key
	 * @param xml_type The type of the field as configured in XML
	 * @param inputdata The value for the field
	 * @param dtType back dated type information.
	 * @param xml_specialCharacter Special characters if any to consider
	 * @param xml_inclChars Inclusive characters list
	 * @param langId The language id of the current user
	 * @param multiLine Flag indicating if multiple lines are applicable.
	 * @return The error code applicable for this validation
	 */
	private StringBuffer checkTypeInteger(String fieldName, String xml_type, String inputdata, String dtType,
			String xml_specialCharacter, String xml_inclChars, String langId, boolean multiLine)
	{
		StringBuffer typeData = new StringBuffer();
		try
		{
			if (inputdata != null && !"".equals(inputdata))
			{
				int checkValid = Integer.parseInt(inputdata);
				if (checkValid < 0)
					typeData = generateErrorCode(fieldName, INVALIDTYPE_ERROR_SUFFIX);
			}
		} catch (NumberFormatException nformat)
		{
			// Means that the data is not a valid Integer. So convert to a valid
			// error message.
			typeData = generateErrorCode(fieldName, INVALIDTYPE_ERROR_SUFFIX);
		}
		return typeData;
	}

	/**
	 * This method is called to check the input data for compatibility to Date. This will check only for Type and not
	 * length. Date will be validated to be in the standard format of - dd/mm/yyyy
	 * 
	 * @param fieldName The file key
	 * @param xml_type The type of the field as configured in XML
	 * @param inputdata The value for the field
	 * @param dtType back dated type information.
	 * @param xml_specialCharacter Special characters if any to consider
	 * @param xml_inclChars Inclusive characters list
	 * @param langId The language id of the current user
	 * @param multiLine Flag indicating if multiple lines are applicable.
	 * @return The error code applicable for this validation
	 */
	private StringBuffer checkTypeDate(String fieldName, String xml_type, String inputdata, String dtType,
			String xml_specialCharacter, String xml_inclChars, String langId, boolean multiLine)
	{
		StringBuffer typeData = new StringBuffer();
		Date inDate;
		Date currDate;
		try
		{
			if (inputdata != null && !"".equals(inputdata))
			{
				if (inputdata.indexOf("dd") == -1)
				{
					SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyyy");
					inDate = format.parse(inputdata);
					Calendar cal = Calendar.getInstance();
					String str = cal.get(Calendar.DATE) + "/" + (cal.get(Calendar.MONTH) + 1) + "/"
							+ cal.get(Calendar.YEAR);
					currDate = format.parse(str);
					if (dtType != null && !"".equals(dtType))
					{
						if (dtType.equals(TYPE_CURRENT_DATE_ONLY))
						{
							if (inDate.compareTo(currDate) < 0)
								typeData = generateErrorCode(fieldName, INVALIDDATE_ERROR_SUFFIX);
							else if (inDate.compareTo(currDate) > 0)
								typeData = generateErrorCode(fieldName, INVALIDDATE_ERROR_SUFFIX);
						} else if (dtType.equals(TYPE_FORWARD_DATES_ONLY))
						{
							if (inDate.compareTo(currDate) < 0)
								typeData = generateErrorCode(fieldName, INVALIDDATE_ERROR_SUFFIX);
						}
					}
				}
			}
		} catch (Exception ep)
		{
			// Any error occurs, flag as invalid date
			typeData = generateErrorCode(fieldName, INVALIDDATE_ERROR_SUFFIX);
		}
		return typeData;
	}

	/**
	 * This method is called to check the input data for compatibility to Swift. This will check only for Type and not
	 * length
	 * 
	 * @param fieldName The file key
	 * @param xml_type The type of the field as configured in XML
	 * @param inputdata The value for the field
	 * @param dtType back dated type information.
	 * @param xml_specialCharacter Special characters if any to consider
	 * @param xml_inclChars Inclusive characters list
	 * @param langId The language id of the current user
	 * @param multiLine Flag indicating if multiple lines are applicable.
	 * @return The error code applicable for this validation
	 */
	private StringBuffer checkTypeSwift(String fieldName, String xml_type, String inputdata, String dtType,
			String xml_specialCharacter, String xml_inclChars, String langId, boolean multiLine)
	{
		StringBuffer typeData = new StringBuffer();
		// Handle swift field validation here.
		boolean isValid = new LocaleLanguageCharacterSetFactory().execute(LocaleSupportConstants.LOCALE_SWIFT,
				inputdata, xml_inclChars, xml_specialCharacter, xml_type, multiLine);
		if (!isValid)
		{
			typeData = typeData.append(generateErrorCode(fieldName, INCLUSIVECHRS_ERROR_SUFFIX));
		}
		return typeData;
	}

	/**
	 * This is a utility method that will convert the input data as per the max chars per line. By default it does a
	 * wrap by character to achieve the line split. The logic followed is this -
	 * <p>
	 * Where ever there is a CR LF, then force move to next line. Else if the max chars per line is reached, then force
	 * a line break and add to next line.
	 * 
	 * @param inputData The string to be split into lines
	 * @param maxCharsPerLine The maximum number of characters per line.
	 * @return The array of lines as a List
	 */
	private List<String> convertToLines(String inputData, int maxCharsPerLine)
	{
		List<String> finalList = new ArrayList<String>();
		String aLine;
		if (inputData != null && inputData.length() > 0)
		{
			// First step. Split the input data by CRLF.
			String[] simpleLines = inputData.split("(\r\n|\r|\n|\n\r)");
			int numIterations = simpleLines.length;
			// Now check for whether any of this line's size is greater than the
			// maxCharsPerLine. If yes, then split it
			// by size.
			for (int count = 0; count < numIterations; count++)
			{
				aLine = simpleLines[count];
				if (aLine.length() > 0)
				{
					while (aLine.length() > maxCharsPerLine)
					{
						finalList.add(aLine.substring(0, maxCharsPerLine));
						aLine = aLine.substring(maxCharsPerLine);
					}
					if (aLine.length() > 0)
						finalList.add(aLine);
				} else
				{
					finalList.add(aLine);
				}
			}
		}
		return finalList;
	}

	/**
	 * The <code>isValidFieldType</code> returns the characterset for the given field type
	 * 
	 * @param: String - field Type
	 * @returns: boolean - return true if the type is valid type else return false
	 */
	private static boolean isValidFieldType(String fieldType)
	{
		if (fieldType != null)
		{
			if ((fieldType.equalsIgnoreCase(TYPE_ALPHAONLY) || fieldType.equalsIgnoreCase(TYPE_ALPHAUPPERCASEONLY)
					|| fieldType.equalsIgnoreCase(TYPE_ALPHANUMERICONLY)
					|| fieldType.equalsIgnoreCase(TYPE_ALPHANUMERICUPPERCASEONLY) || fieldType
						.equalsIgnoreCase(TYPE_STRINGNUMERICONLY)))
				return true;
		}
		return false;
	}
}
