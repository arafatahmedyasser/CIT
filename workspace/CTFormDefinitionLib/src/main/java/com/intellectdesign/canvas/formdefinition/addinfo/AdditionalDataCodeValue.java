/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.*/

package com.intellectdesign.canvas.formdefinition.addinfo;

import com.intellectdesign.canvas.common.IBaseDefinition;

/**
 * This class is for additional data code value implements ibase definition interface.
 * 
 * @version 1.0
 */
public class AdditionalDataCodeValue implements IBaseDefinition
{

	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = 1108904956802931814L;

	private String mCodeValue;
	private String mDisplayValue;

	/**
	 * Default Constructor, does nothing
	 */
	public AdditionalDataCodeValue()
	{

	}

	/**
	 * This method compares the current object with the object passed as parameter
	 * the sort based on display value.
	 * 
	 * @see java.lang.Comparable#compareTo(java.lang.Object)
	 * @param Object - Class object to be compared
	 * @return integerValue - 0 if the argument string is equal to passing string, 
	 * 						a negative value if this string is lexicographically less than the string argument or
	 * 						a positive value greater than 0 if this string is lexicographically greater than the string argument. 
	 */
	public int compareTo(Object o)
	{
		AdditionalDataCodeValue comparevalue = (AdditionalDataCodeValue) o;
		return (this.getDisplayValue().compareTo(comparevalue.getDisplayValue()));
	}

	/**
	 * This method provides the JSONString representation additional display value and code
	 * 
	 * @return toJSONString - JSONString representation of the Additional Data Code Value
	 *   
	 * @see com.intellectdesign.canvas.common.IBaseDefinition#toJSONString()
	 */
	public String toJSONString()
	{
		return "{r7: '" + this.getDisplayValue() + "',r8:\"" + this.getCodeValue() + "\"}";
	}

	/**
	 * Method for setting the codekey and codevalue
	 * 
	 * @param codeKey
	 * @param codeValue
	 */
	public AdditionalDataCodeValue(String codeKey, String codeValue)
	{
		mDisplayValue = codeKey;
		mCodeValue = codeValue;
	}

	/**
	 * This method provides the String representation of the additional data code value
	 * 
	 * @see java.lang.Object#toString()
	 * @return String
	 */
	@Override
	public String toString()
	{
		return "Code='" + mCodeValue + "', Value='" + mDisplayValue + "'";
	}

	/**
	 * This method provides the codeValue of the additional data code.
	 * 
	 * @return mCodeValue - String value of the Code Value
	 */
	public String getCodeValue()
	{
		return mCodeValue;
	}

	/**
	 * This method sets the additional code Value
	 * 
	 * @param codeValue - String value of CodeValue
	 */
	public void setCodeValue(String codeValue)
	{
		mCodeValue = codeValue;
	}

	/**
	 * This method provides the additional data Display Value
	 * 
	 * @return DisplayValue - String value of the additional data Display value
	 */
	public String getDisplayValue()
	{
		return mDisplayValue;
	}

	/**
	 * This method sets the additional data display Value 
	 * 
	 * @param displayValue - String value of the additional data Display Value
	 */
	public void setDisplayValue(String displayValue)
	{
		mDisplayValue = displayValue;
	}
}
