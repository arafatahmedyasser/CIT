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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

/**
 * A value object that essentially represent the entitlement entries which basically has the relation between Product,
 * Subprod, FunctionCode, UserNo and gcif. This class has the entitlements of a user in a flat structure. The
 * "entitlements" property is a List of Maps where each Map contains the following information -
 * 
 * <table>
 * <tr>
 * <td>Key</td>
 * <td>Purpose</td>
 * </tr>
 * <tr>
 * <td>PRODUCT</td>
 * <td>This key contains the product code (or the top level business functionality). This is a String and has to match
 * the Product configuration that is applied within Canvas configuration</td>
 * </tr>
 * <tr>
 * <td>SUBPROD</td>
 * <td>This key contains the sub product code (or the next level of offerings under the business functionality). This is
 * a String and has to match the Sub Product configuration that is applied within Canvas configuration</td>
 * </tr>
 * <tr>
 * <td>FUNCTION</td>
 * <td>This key contains the function code (or the lowest level of offerings under the business functionality). This is
 * a String and has to match the Function configuration that is applied within Canvas configuration</td>
 * </tr>
 * </table>
 * 
 * @version 1.0
 */
public class CanvasViewEntlVO implements Serializable
{

	/**
	 * this is required for the Serialization process
	 */
	private static final long serialVersionUID = 1L;

	private String userNo = "-1";

	private String gcif = "-1";
	private String userRole = null;

	private List entitlements;

	/**
	 * * method that gets UserNo
	 * 
	 * @return the userNo
	 */
	public String getUserNo()
	{
		return userNo;
	}

	/**
	 * This method is used to set the UserNo
	 * 
	 * @param userNo the userNo to set
	 */
	public void setUserNo(String userNo)
	{
		this.userNo = userNo;
	}

	/**
	 * method that gets Gcif
	 * 
	 * @return the gcif
	 */
	public String getGcif()
	{
		return gcif;
	}

	/**
	 * This method is used to set the Gcif
	 * 
	 * @param gcif the gcif to set
	 */
	public void setGcif(String gcif)
	{
		this.gcif = gcif;
	}

	/**
	 * method that gets Entitlements
	 * 
	 * @return the entitlements
	 */
	public List getEntitlements()
	{
		return entitlements;
	}

	/**
	 * The Method expects the List of Maps with the keys for the entitlements like PRODUCT, SUBPROD , FUNCTION
	 * 
	 * @param entitlements the entitlement to set
	 */
	public void setEntitlements(List entitlements)
	{
		if (entitlements == null || entitlements.size() < 1)
		{
			this.entitlements = new ArrayList();
			HashMap hm = new HashMap();
			hm.put("PRODUCT", "READONLY");
			hm.put("SUBPROD", "READONLY");
			hm.put("FUNCTION", "READONLY");
			this.entitlements.add(hm);

		} else
			this.entitlements = entitlements;
	}

	/**
	 * @return the userRole
	 */
	public String getUserRole()
	{
		return userRole;
	}

	/**
	 * @param userRole the userRole to set
	 */
	public void setUserRole(String userRole)
	{
		this.userRole = userRole;
	}
	
	/**
	 * Utility function that converts the entitlement structure into the hierarchical representation provided by
	 * ProductFunctionVO.
	 * 
	 * @return
	 */
	public List<ProductFunctionVO> getEntitlementsAsProductFunction()
	{
		String currentProduct;
		String currentSubProduct;
		String currentFunction;
		Map<String, String> currentItem;
		ProductFunctionVO target;
		SubProductVO targetSubProd;
		Map<String, ProductFunctionVO> index = new TreeMap<String, ProductFunctionVO>();
		Iterator<Map<String, String>> entlIterator = this.entitlements.iterator();

		while (entlIterator.hasNext())
		{
			currentItem = entlIterator.next();
			currentProduct = currentItem.get("PRODUCT");
			currentSubProduct = currentItem.get("SUBPROD");
			currentFunction = currentItem.get("FUNCTION");
			if (!index.containsKey(currentProduct))
				index.put(currentProduct, new ProductFunctionVO(currentProduct, new ArrayList<SubProductVO>()));

			target = index.get(currentProduct);
			targetSubProd = getSubProductVO(target, currentSubProduct);
			addFunctionTo(targetSubProd, currentFunction);
		}

		List<ProductFunctionVO> resultList = new ArrayList<ProductFunctionVO>();
		Iterator<Map.Entry<String, ProductFunctionVO>> indexIterator = index.entrySet().iterator();
		while (indexIterator.hasNext())
		{
			resultList.add(indexIterator.next().getValue());
		}
		return resultList;
	}

	private SubProductVO getSubProductVO(ProductFunctionVO productVO, String subProdCode)
	{
		SubProductVO result = null;
		List<SubProductVO> subProdList = productVO.getSubProdFuncList();
		Iterator<SubProductVO> subProdIterator = subProdList.iterator();

		while (subProdIterator.hasNext())
		{
			result = subProdIterator.next();
			if (result.getSubProdCode().equals(subProdCode))
				break;
			result = null;
		}
		if (result == null)
		{
			result = new SubProductVO(subProdCode, new ArrayList<FunctionVO>());
			subProdList.add(result);
		}
		return result;
	}

	private void addFunctionTo(SubProductVO subProd, String functionValue)
	{
		FunctionVO result = null;
		List<FunctionVO> funcList = subProd.getFuncList();
		Iterator<FunctionVO> functionsIterator = funcList.iterator();

		while (functionsIterator.hasNext())
		{
			result = functionsIterator.next();
			if (result.getFuncCode().equals(functionValue))
				break;
			result = null;
		}

		if (result == null)
			funcList.add(new FunctionVO(functionValue, new ArrayList<CanvasCriteriaTypeMap>()));
	}

}
