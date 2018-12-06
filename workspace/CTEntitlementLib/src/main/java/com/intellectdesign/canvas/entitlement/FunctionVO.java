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
import java.util.Iterator;
import java.util.List;

/**
 * A value object representing Function code and List of CanvasCriteriaTypeMap
 * 
 * @version 1.0
 */
public class FunctionVO implements Serializable
{

	private static final long serialVersionUID = -9195515751200850910L;

	private String funcCode;
	private List<CanvasCriteriaTypeMap> criteriaList;

	/**
	 * get the list of CanvasCriteriaTypeMap object
	 * 
	 * @return the criteriaList
	 */
	public List<CanvasCriteriaTypeMap> getCriteriaList()
	{
		return criteriaList;
	}

	/**
	 * set the list of CanvasCriteriaTypeMap object
	 * 
	 * @param criteriaList the criteriaList to set
	 */
	public void setCriteriaList(List<CanvasCriteriaTypeMap> criteriaList)
	{
		this.criteriaList = criteriaList;
	}

	/**
	 * An empty constructor must be provided if there is a overloaded constructor in the bean class
	 */
	public FunctionVO()
	{

	}

	/**
	 * Constructor with parameter assigning to funcCode and criteriaList
	 * 
	 * @param funcCode
	 */
	public FunctionVO(String funcCode, List<CanvasCriteriaTypeMap> criteriaList)
	{
		this.funcCode = funcCode;
		this.criteriaList = criteriaList;
	}

	/**
	 * method that gets funcCode
	 * 
	 * @return the funcCode
	 */
	public String getFuncCode()
	{
		return funcCode;
	}

	/**
	 * This method is used to set the funcCode
	 * 
	 * @param funcCode the funcCode to set
	 */
	public void setFuncCode(String funcCode)
	{
		this.funcCode = funcCode;
	}

	/**
	 * This methos is for String Values
	 * @return A string representation of this object.
	 */
	public String toString()
	{
		StringBuffer strBuffer = new StringBuffer();
		strBuffer.append("{");
		strBuffer.append("funcCode:");
		strBuffer.append(getFuncCode());
		strBuffer.append(",criteriaList:");
		strBuffer.append(getCriteriaList());
		strBuffer.append("}");
		return strBuffer.toString();
	}

	/**
	 * This method is used to check whether functioncode or criteriatype List is empty or not
	 * 
	 * @return true if all of the members has values, false if atleast one of the member is null or empty
	 */
	public boolean hasValues()
	{
		boolean flag = true;
		if ((this.funcCode != null && !this.funcCode.trim().equals(""))
				&& (this.criteriaList != null && !this.criteriaList.isEmpty()))
		{
			Iterator<CanvasCriteriaTypeMap> anIterator = criteriaList.iterator();// CT_ENTITLEMENT
			while (anIterator.hasNext())
			{
				flag &= anIterator.next().hasValues();
			}
			return flag;
		} else
		{
			return false;
		}

	}

}
