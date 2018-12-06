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
package com.intellectdesign.canvas.validator;

import java.io.Serializable;

import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.utility.CTUtility;

/**
 * This class is for  a single element within the validation xml.
 * 
 * The sample validation looks like the below
 * <fieldType type="AN" mandatory="true" specialCharacter="&lt;&gt;&amp;&quot;^;:*()+=%$#@!~`[]{}'?" size="20">FIELD_NAME</fieldType>
 * 
 * @version 1.0
 */
public class ElementValue implements Serializable
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = -6671241734040658845L;
	private String gfieldName = null;
	private boolean gfieldMandatory = false;
	private String gspecialChar = null;
	private String inclusiveChars = null;
	private String gFieldType = null;
	private String optionalValue = null;
	private int fieldLength = 0;
	private String gdateCheck = null;
	private boolean isArray = false;
	private boolean maxOccurs = false;
	// To hold length value after decimal in floats and amount field. Default
	// value is 2
	private int afterDecimalLength = 2;
	private boolean gMultiLine = false;
	private boolean gMultiLang = false;
	private String gLangIds = null;
	private String gRestrictLangKey = null;
	private static Logger logger = Logger.getLogger(ElementValue.class);

	/**
	 * The <code>ElementValue</code>
	 * 
	 * @param constructor
	 */

	public ElementValue()
	{
	}

	/**
	 * The <code>setFieldName</code>
	 * 
	 * @param String fieldName
	 */
	public void setFieldName(String fieldName)
	{
		this.gfieldName = fieldName;
	}

	/**
	 * The <code>setMandatory</code>
	 * 
	 * @param String fieldName
	 */
	public void setMandatory(String Mandatory)
	{
		this.gfieldMandatory = Boolean.valueOf(Mandatory).booleanValue();
	}

	/**
	 * The <code>setSpecialCharacter</code>
	 * 
	 * @param String fieldName
	 */
	public void setSpecialCharacter(String specialChar)
	{
		this.gspecialChar = specialChar;
	}

	/**
	 * The <code>setFieldType</code>
	 * 
	 * @param String fieldName
	 */
	public void setFieldType(String lFieldType)
	{
		this.gFieldType = lFieldType;
	}

	/**
	 * The <code>setOptional</code>
	 * 
	 * @param String fieldName
	 */
	public void setOptional(String optValue)
	{
		this.optionalValue = optValue;
	}

	/**
	 * This method Sets the filed length. This method parse fieldLength(string) to integer and sets to
	 * this.fieldLength(int type) If exception occurred while parsing then length might be in format of xxx,xxx ,so it
	 * will set length of before decimal and after decimal by help of getCommaSeparatedList
	 * 
	 * @param String fieldName
	 */
	public void setFieldLength(String pfieldLength)
	{
		String cmName = "[ElementValue.setFieldLength]";
		logger.ctinfo("CTVAL00015", cmName);
		try
		{
			this.fieldLength = (pfieldLength != null && !"".equals(pfieldLength) ? Integer.parseInt(pfieldLength) : 0);
		} catch (NumberFormatException ex)
		{
			logger.ctdebug("CTVAL00016", cmName);
			try
			{
				/**
				 * If exception occurred means the length might be in format of xxx,xxx so calling getCommaSeparatedList
				 * to get length of before decimal and after decimal
				 */
				String[] lengthArr = CTUtility.getCommaSeparatedList(pfieldLength);
				if (null != lengthArr)
				{
					logger.ctdebug("CTVAL00017", cmName, lengthArr.length);
					if (lengthArr.length > 0)
					{
						this.fieldLength = (lengthArr[0] != null || !"".equals(lengthArr[0]) ? Integer
								.parseInt(lengthArr[0]) : 0);
						this.afterDecimalLength = (lengthArr[1] != null || !"".equals(lengthArr[1]) ? Integer
								.parseInt(lengthArr[1]) : 2);
					}
				}
				logger.ctdebug("CTVAL00018", cmName);
			} catch (Exception exception)
			{
				logger.cterror("CTVAL00019", cmName);
				logger.cterror("CTVAL00022", exception, cmName);
			}
		}
		logger.ctdebug("CTVAL00020", cmName, this.fieldLength, this.afterDecimalLength);
		logger.ctinfo("CTVAL00021", cmName);
	}

	/**
	 * The <code>setDateCheck</code>
	 * 
	 * @param String fieldName
	 */
	public void setDateCheck(String dateCheck)
	{
		this.gdateCheck = dateCheck;
	}

	/**
	 * The <code>getFieldName</code>
	 * 
	 * @return String
	 */
	public String getFieldName()
	{
		return this.gfieldName;
	}

	/**
	 * The <code>getMandatory</code>
	 * 
	 * @return boolean
	 */
	public boolean getMandatory()
	{
		return this.gfieldMandatory;
	}

	/**
	 * The <code>getSpecialCharacter</code>
	 * 
	 * @return String
	 */
	public String getSpecialCharacter()
	{
		return this.gspecialChar;
	}

	/**
	 * The <code>getFieldType</code>
	 * 
	 * @return String
	 */
	public String getFieldType()
	{
		return this.gFieldType;
	}

	/**
	 * The <code>getOptional</code>
	 * 
	 * @return String
	 */
	public String getOptional()
	{
		return this.optionalValue;
	}

	/**
	 * The <code>getFieldLength</code>
	 * 
	 * @return int
	 */
	public int getFieldLength()
	{
		return this.fieldLength;
	}

	/**
	 * The <code>getDateCheck</code>
	 * 
	 * @param String fieldName
	 */
	public String getDateCheck()
	{
		return this.gdateCheck;
	}

	/**
	 * The <code>toString</code>
	 * 
	 * @return String
	 */
	public String toString()
	{
		return new StringBuffer(gfieldName).append(" ").append(gspecialChar).append(" ").append(gFieldType).append(" ")
				.append(optionalValue).append("").append(fieldLength).append(" ").append(isArray).append(" ")
				.append(maxOccurs).toString();
	}

	/**
	 * To get InclusiveChars
	 * 
	 * @return Returns Inclusive Chars
	 */
	public String getInclusiveChars()
	{
		return this.inclusiveChars;
	}

	/**
	 * To set Inclusive Chars value
	 * 
	 * @param String inclusiveChars
	 */
	public void setInclusiveChars(String inclusiveChars)
	{
		this.inclusiveChars = inclusiveChars;
	}

	/**
	 * To get AfterDecimalLength
	 * 
	 * @return afterDecimalLength value
	 */
	public int getAfterDecimalLength()
	{
		return afterDecimalLength;
	}

	/**
	 * To get MaxOccurs
	 * 
	 * @return MaxOccurs value
	 */

	public boolean isMaxOccurs()
	{
		return maxOccurs;
	}

	/**
	 * To set MaxOccurs
	 * 
	 * @param MaxOccurs to set
	 * 
	 */

	public void setMaxOccurs(String maxOccurs)
	{
		this.maxOccurs = Boolean.valueOf(maxOccurs).booleanValue();
	}

	/**
	 * To get isArray
	 * 
	 * @return isArray
	 */

	public boolean isArray()
	{
		return isArray;
	}

	/**
	 * To set isArray
	 * 
	 * @return isArray
	 */

	public void setArray(String isArray)
	{
		this.isArray = Boolean.valueOf(isArray).booleanValue();
	}

	/**
	 * To set Multline
	 * 
	 * @param multiLine Flag indicating whether multi line validation is needed
	 */
	public void setMultline(String multiLine)
	{
		this.gMultiLine = Boolean.valueOf(multiLine).booleanValue();
	}

	/**
	 * To check multi line validation
	 * 
	 * @return the Flag indicating whether multi line validation is needed
	 */
	public boolean isMultiLine()
	{
		return gMultiLine;
	}

	/**
	 * To set the MultiLang flag
	 * 
	 * @param multilang flag indicating whether multi lang inputs are allowed for this field
	 */
	public void setMultiLang(String multilang)
	{
		this.gMultiLang = Boolean.valueOf(multilang).booleanValue();
	}

	/**
	 * To get the MultiLang flag
	 * 
	 * @return The flag indicating wehther multi lang validation is needed
	 */
	public boolean isMultiLang()
	{
		return gMultiLang;
	}

	/**
	 * To set the LangIds
	 * 
	 * @param gLangIds the gLangIds to set
	 */
	public void setLangIds(String langIds)
	{
		this.gLangIds = langIds;
	}

	/**
	 * To get the LangIds
	 * 
	 * @return the gLangIds
	 */
	public String getLangIds()
	{
		return gLangIds;
	}

	/**
	 * To set the gRestrictLangKey
	 * 
	 * @param restrictLangKey the gRestrictLangKey to set
	 */
	public void setRestrictLangKey(String restrictLangKey)
	{
		this.gRestrictLangKey = restrictLangKey;
	}

	/**
	 * To get the gRestrictLangKey
	 * 
	 * @return the gRestrictLangKey
	 */
	public String getRestrictLangKey()
	{
		return gRestrictLangKey;
	}
}
