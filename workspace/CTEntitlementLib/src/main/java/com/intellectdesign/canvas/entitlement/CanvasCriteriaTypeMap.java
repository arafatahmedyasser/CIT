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

package com.intellectdesign.canvas.entitlement;

import java.io.Serializable;
import java.util.List;

/**
 * A value object representing criteria type and List of criteria values
 * 
 * @version 1.0
 */
public class CanvasCriteriaTypeMap implements Serializable
{
	private static final long serialVersionUID = 1L;
	private String criteriaType;
	private List<CriteriaValue> criteriaValues;

	/**
	 * An empty constructor must be provided if there is a overloaded constructor in the bean class
	 */

	public CanvasCriteriaTypeMap()
	{

	}

	/**
	 * Parametrized constructor for assigning the values of criteriaType and criteriaValues
	 * 
	 * @param criteriaType
	 * @param criteriaValues
	 */
	public CanvasCriteriaTypeMap(String criteriaType, List<CriteriaValue> criteriaValues)
	{
		this.criteriaType = criteriaType;
		this.criteriaValues = criteriaValues;

	}

	/**
	 * Method to get the criteria type
	 * 
	 * @return the criteriaType
	 */
	public String getCriteriaType()
	{
		return criteriaType;
	}

	/**
	 * Method to set the criteria type
	 * 
	 * @param criteriaType the criteriaType to set
	 */
	public void setCriteriaType(String criteriaType)
	{
		this.criteriaType = criteriaType;
	}

	/**
	 * Method to get the criteria values list
	 * 
	 * @return the criteriaValues
	 */
	public List<CriteriaValue> getCriteriaValues()
	{
		return criteriaValues;
	}

	/**
	 * Method to set the criteria values list
	 * 
	 * @param criteriaValues the criteriaValues to set
	 */
	public void setCriteriaValues(List<CriteriaValue> criteriaValues)
	{
		this.criteriaValues = criteriaValues;
	}

	/**
	 * This method is for String Values
	 * @return A string representation of this object.
	 */
	public String toString()
	{
		StringBuffer strBuffer = new StringBuffer();
		strBuffer.append("{");
		strBuffer.append("criteriaType:");
		strBuffer.append(getCriteriaType());
		strBuffer.append(",criteriaValues:");
		strBuffer.append(getCriteriaValues());
		strBuffer.append("}");
		return strBuffer.toString();
	}

	/**
	 * This method is used to check whether criteria type or criteria value List is empty or not
	 * 
	 * @return true if all of the members has values, false if atleast one of the member is null or empty
	 */

	public boolean hasValues()
	{
		
		if ((this.criteriaType != null && !this.criteriaType.trim().equals(""))
				&& (this.criteriaValues != null && !this.criteriaValues.isEmpty()))
		{
			return true;
		} else
		{
			return false;
		}

	}

}
