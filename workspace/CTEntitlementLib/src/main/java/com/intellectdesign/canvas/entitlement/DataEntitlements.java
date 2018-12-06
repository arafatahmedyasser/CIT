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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.intellectdesign.canvas.logger.Logger;

/**
 * A value object representing criteria values
 * 
 * @version 1.0
 */
public class DataEntitlements
{

	/**
	 * method that gets Entitlements
	 * 
	 * @return the entitlements
	 */
	public List<ProductFunctionVO> getEntitlements()
	{
		return entitlements;
	}

	/**
	 * This method is used to set the Entitlements
	 * 
	 * @param entitlements the entitlements to set
	 */
	public void setEntitlements(List<ProductFunctionVO> entitlements)
	{
		this.entitlements = entitlements;
	}

	/**
	 * method that gets isEntitled
	 * 
	 * @return the isEntitled
	 */
	public boolean isEntitled()
	{
		return isEntitled;
	}

	/**
	 * This method is used to set the Entitlements
	 * 
	 * @param isEntitled the isEntitled to set
	 */
	public void setEntitled(boolean isEntitled)
	{
		this.isEntitled = isEntitled;
	}

	/**
	 * Used to get the error code
	 * 
	 * @return Returns the errorcode
	 */
	public String getErrorCode()
	{
		return errorCode;
	}

	/**
	 * Used to set the error code
	 * 
	 * @param errorCode to set
	 */
	public void setErrorCode(String errorCode)
	{
		this.errorCode = errorCode;
	}

	
	/**
	 * 
	 * @param productCode
	 * @param subProductCode
	 * @param functionCode
	 * @return
	 */
	public List<CanvasCriteriaTypeMap> getEntitledCriteiraValues(String productCode, String subProductCode, String functionCode){
		List<CanvasCriteriaTypeMap> entitledCriteriaValues = new ArrayList<CanvasCriteriaTypeMap>();
		if((productCode == null || productCode.isEmpty()) || (subProductCode == null || subProductCode.isEmpty()) || (functionCode == null || functionCode.isEmpty())){
			logger.cterror("CTENT00025");
			return entitledCriteriaValues;
		}
		for(int i=0; i<this.entitlements.size();i++){
			ProductFunctionVO  productSubProductVO  = (ProductFunctionVO) this.entitlements.get(i);
			if(productCode.equals(productSubProductVO.getProdCode())){
				List subProductList = productSubProductVO.getSubProdFuncList();
				for(int subProdIndex = 0 ; subProdIndex < subProductList.size(); subProdIndex++){
					SubProductVO subProductVO = (SubProductVO) subProductList.get(subProdIndex);
					if(subProductCode.equals(subProductVO.getSubProdCode())){
						List functionList = subProductVO.getFuncList();
						for(int functionIndex = 0; functionIndex <functionList.size();  functionIndex++){
							FunctionVO functionVo = (FunctionVO) functionList.get(functionIndex);
							if(functionCode.equals(functionVo.getFuncCode())){
								entitledCriteriaValues = functionVo.getCriteriaList();
							}
						}
					}
				}
			}
		}
		return entitledCriteriaValues;
	}
	
	
	/**
	 * Used to get the String representation
	 * 
	 * @return Returns the String representation of isEntitled and errorCode
	 */

	public String toString()
	{
		return new StringBuffer(" Is Entitled : ").append(isEntitled).append(", Error Code : ").append(errorCode)
				.toString();
	}

	private boolean isEntitled = false;
	private String errorCode = null;
	private List entitlements = null;
	private HashMap entitledCriteriaValuesList = null;
	private List entitledCriteriaTypesList = null;
	
	private static final Logger logger = Logger.getLogger(DataEntitlements.class);
}
