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
 * A value object representing a subproduct and a list of functionVO
 * 
 * @version 1.0
 */
public class SubProductVO implements Serializable
{

	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = 5523873298889507901L;

	private String subProdCode;

	/**
	 * get the sub product code
	 * 
	 * @return the subProdCode
	 */
	public String getSubProdCode()
	{
		return subProdCode;
	}

	/**
	 * Method to set the sub product
	 * 
	 * @param subProdCode the subProdCode to set
	 */
	public void setSubProdCode(String subProdCode)
	{
		this.subProdCode = subProdCode;
	}

	/**
	 * get the list of FunctionVO object
	 * 
	 * @return the funcList
	 */
	public List<FunctionVO> getFuncList()
	{
		return funcList;
	}

	/**
	 * set the list of FunctionVO object
	 * 
	 * @param funcList the funcList to set
	 */
	public void setFuncList(List<FunctionVO> funcList)
	{
		this.funcList = funcList;
	}

	private List<FunctionVO> funcList;

	/**
	 * An empty construction must be provided if there are overloaded constructors in the bean class
	 */
	public SubProductVO()
	{

	}

	public SubProductVO(String subProdCode, List<FunctionVO> funcList)
	{
		this.subProdCode = subProdCode;
		this.funcList = funcList;
	}

	/**
	 * @return A string representation of this object.
	 */
	public String toString()
	{
		StringBuffer strBuffer = new StringBuffer();
		strBuffer.append("{");
		strBuffer.append("subProdCode:");
		strBuffer.append(getSubProdCode());
		strBuffer.append(",funcList:");
		strBuffer.append(getFuncList());
		strBuffer.append("}");
		return strBuffer.toString();
	}

	/**
	 * This method is used to check whether subprodCode or FuncList is empty or not
	 * 
	 * @return true if all of the members has values, false if atleast one of the member is null or empty
	 */
	public boolean hasValues()
	{
		boolean flag = true;
		if ((this.subProdCode != null && !this.subProdCode.trim().equals(""))
				&& (this.funcList != null && !this.funcList.isEmpty()))
		{
			Iterator<FunctionVO> anIterator = funcList.iterator();// CT_ENTITLEMENT
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
