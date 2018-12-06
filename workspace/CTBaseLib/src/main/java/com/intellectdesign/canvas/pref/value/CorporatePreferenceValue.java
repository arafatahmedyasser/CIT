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

package com.intellectdesign.canvas.pref.value;

import java.util.HashMap;

import com.intellectdesign.canvas.value.ListValue;

/**
 * This class is for CorporatePreferenceValue
 * 
 * @version 1.0
 */
public class CorporatePreferenceValue implements java.io.Serializable
{
	/**
	 * Default value of serialVersionUID
	 */
	private static final long serialVersionUID = 1L;

	private String odGcif = null;
	private String userNo = null;
	private ListValue[] attributeValues = null;
	private String companyName;
	private String langFormat;
	private String amountFormat;
	private String dateFormat;
	private String timeZone;

	/**
	 * this is ref to CorporatePerferenceValue constructor
	 */
	public CorporatePreferenceValue()
	{
	}

	/**
	 * Returns the state of this VO for audit purposes
	 * @param masterAttributeData
	 * @return
	 */
	public HashMap getAsAuditMap(HashMap masterAttributeData)
	{
		HashMap auditMap = new HashMap();
		auditMap.put("OD_GCIF", odGcif);
		auditMap.put("CustomerName", companyName);
		//Get each criteria's description from the master attribute data and then load it into the map.
		if (attributeValues != null && attributeValues.length > 0)
		{
			String aDescription;
			String attributeType;
			for (ListValue aValue : attributeValues)
			{
				attributeType = aValue.getCode();
				aDescription = retrieveDescriptionFrom(masterAttributeData, attributeType, aValue.getDesc());
				auditMap.put(attributeType, aDescription);
			}
		}
		return auditMap;
	}
	
	/**
	 * Helper method to iterate through an array and find a match for the given value
	 * @param attrValues
	 * @param compareValue
	 * @return
	 */
	private String retrieveDescriptionFrom(HashMap masterAttributeData, String attributeKey, String compareValue)
	{
		String retVal = compareValue;
		ListValue[] attrValues = (ListValue[])masterAttributeData.get(attributeKey);
		if (attrValues != null && attrValues.length > 0)
		{
			for (int count = 0; count < attrValues.length; count++)
			{
				if (attrValues[count].getCode().equals(compareValue))
				{
					retVal = attrValues[count].getDesc();
					break;
				}
			}
		}
		return retVal;
	}


	/**
	 * this is ref to CorporatePerferenceValue String constructor
	 * 
	 * @param String gcif
	 * @param ListValue[] attributeValues
	 */
	public CorporatePreferenceValue(String OD_GCIF, ListValue[] attributeValues)
	{
		this.odGcif = OD_GCIF;
		this.attributeValues = attributeValues;
	}

	/**
	 * set gcif
	 * 
	 * @param String gcif
	 */
	public void setGcif(java.lang.String OD_GCIF)
	{
		this.odGcif = OD_GCIF;
	}

	/**
	 * get gcif
	 * 
	 * @return gcif
	 */
	public java.lang.String getGcif()
	{
		return odGcif;
	}

	/**
	 * set user no
	 * 
	 * @param String userNo
	 */
	public void setUserNo(java.lang.String userNo)
	{
		this.userNo = userNo;
	}

	/**
	 * get user number
	 * 
	 * @return user no
	 */
	public java.lang.String getUserNo()
	{
		return userNo;
	}

	/**
	 * get attribute values
	 * 
	 * @return ListValue[]
	 */
	public ListValue[] getAttributeValues()
	{
		return attributeValues;
	}

	/**
	 * set attribute values
	 * 
	 * @param ListValue[] attributeValues
	 */
	public void setAttributeValues(ListValue[] attributeValues)
	{
		this.attributeValues = attributeValues;
	}

	/**
	 * for display all the values
	 * 
	 * @return all the values
	 */
	public String toString()
	{
		StringBuffer str = new StringBuffer();
		str.append("OD_GCIF=" + odGcif);
		str.append("langFormat=" + langFormat);
		str.append("companyName=" + companyName);
		str.append("amountFormat=" + amountFormat);
		str.append("dateFormat=" + dateFormat);
		str.append("timeZone=" + timeZone);
		str.append(";attributeValues=" + attributeValues);
		return str.toString();
	}

	/**
	 * method that sets LangFormat
	 * 
	 * @param langFormat The langFormat to set.
	 */

	public void setLangFormat(String langFormat)
	{
		this.langFormat = langFormat;
	}

	/**
	 * method that gets LangFormat
	 * 
	 * @return Returns the langFormat
	 */

	public String getLangFormat()
	{
		return langFormat;
	}

	/**
	 * method that sets CompanyName
	 * 
	 * @param The companyName to set.
	 */

	public void setCompanyName(String companyName)
	{
		this.companyName = companyName;
	}

	/**
	 * method that gets CompanyName
	 * 
	 * @return Returns the companyName
	 */

	public String getCompanyName()
	{
		return companyName;
	}

	/**
	 * method that sets AmountFormat
	 * 
	 * @param The amountFormat to set.
	 */

	public void setAmountFormat(String amountFormat)
	{
		this.amountFormat = amountFormat;
	}

	/**
	 * method that gets AmountFormat
	 * 
	 * @return Returns the amountFormat
	 */

	public String getAmountFormat()
	{
		return amountFormat;
	}

	/**
	 * method that sets DateFormat
	 * 
	 * @param The dateFormat to set.
	 */

	public void setDateFormat(String dateFormat)
	{
		this.dateFormat = dateFormat;
	}

	/**
	 * method that gets DateFormat
	 * 
	 * @return Returns the dateFormat
	 */

	public String getDateFormat()
	{
		return dateFormat;
	}

	/**
	 * method that sets TimeZone
	 * 
	 * @param The timeZone to set.
	 */

	public void setTimeZone(String timeZone)
	{
		this.timeZone = timeZone;
	}

	/**
	 * method that gets TimeZone
	 * 
	 * @return Returns the timezone
	 */

	public String getTimeZone()
	{
		return timeZone;
	}

}
