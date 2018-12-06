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
 * A value object representing a product and a list of subproduct to functions
 * 
 * @version 1.0
 */
public class ProductFunctionVO implements Serializable
{

	private static final long serialVersionUID = -2954123476922803567L;
	private String prodCode;
	private List<SubProductVO> subProdFuncList;

	/**
	 * An empty construction must be provided if there are overloaded constructors in the bean class
	 */
	public ProductFunctionVO()
	{

	}

	/**
	 * Constructor for assigning below parameter to prodCode and subProdFuncList
	 * 
	 * @param prodCode
	 * @param subProdFuncList
	 */
	public ProductFunctionVO(String prodCode, List<SubProductVO> subProdFuncList)
	{
		this.prodCode = prodCode;
		this.subProdFuncList = subProdFuncList;
	}

	/**
	 * method that gets ProductCode
	 * 
	 * @return the prodCode
	 */
	public String getProdCode()
	{
		return prodCode;
	}

	/**
	 * This method is used to set the product code
	 * 
	 * @param prodCode the prodCode to set
	 */
	public void setProdCode(String prodCode)
	{
		this.prodCode = prodCode;
	}

	/**
	 * method that gets SubProdFuncList
	 * 
	 * @return the subProdFuncList
	 */
	public List<SubProductVO> getSubProdFuncList()
	{
		return subProdFuncList;
	}

	/**
	 * This method is used to set the SubProdFuncList
	 * 
	 * @param subProdFuncList the subProdFuncList to set
	 */
	public void setSubProdFuncList(List<SubProductVO> subProdFuncList)
	{
		this.subProdFuncList = subProdFuncList;
	}

	/**
	 * @return A string representation of this object.
	 */
	public String toString()
	{
		StringBuffer strBuffer = new StringBuffer();
		strBuffer.append("{");
		strBuffer.append("prodCode:");
		strBuffer.append(getProdCode());
		strBuffer.append(",subProdFuncList:");
		strBuffer.append(getSubProdFuncList());
		strBuffer.append("}");
		return strBuffer.toString();
	}

	/**
	 * This method is used to check whether prodCode or subProdFuncList is empty or not
	 * 
	 * @return true if all of the members has values, false if atleast one of the member is null or empty
	 */
	public boolean hasValues()
	{
		boolean flag = true;
		if ((this.prodCode != null && !this.prodCode.trim().equals(""))
				&& (this.subProdFuncList != null && !this.subProdFuncList.isEmpty()))
		{
			Iterator<SubProductVO> anIterator = subProdFuncList.iterator();// CT_ENTITLEMENT
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
