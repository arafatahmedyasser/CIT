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
 */
package com.intellectdesign.canvas.report.vo;

import com.intellectdesign.canvas.common.IBaseDefinition;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.factory.ReportPolicyFactory;
import com.intellectdesign.canvas.report.policy.IReportPolicyHandler;

/**
 * This is a class ReportPolicy implements IBaseDefinition
 * 
 * @version 1.0
 */
public class ReportPolicy implements IBaseDefinition
{
	private static final long serialVersionUID = 1867729657944253034L;
	private String policyId;
	private String policyName;
	private String policyHandlerClass;
	/**
	 *  This  Method is for Str Values to  JSON STRING
	 *  
	 * @return null
	 * @see com.intellectdesign.canvas.common.IBaseDefinition#toJSONString()
	 */
	public String toJSONString()
	{
		return null;
	}
	/**
	 *  This method is for  GetPolicyId
	 *  
	 * @return String:policyId
	 */
	public String getPolicyId()
	{
		return policyId;
	}
	/**
	 *  This method is  for Set PolicyId
	 *  
	 * @param policyId
	 */
	public void setPolicyId(String policyId)
	{
		this.policyId = policyId;
	}
	/**
	 *  This method is  for Str Get PolicyName
	 *  
	 * @return String:policyName
	 */
	public String getPolicyName()
	{
		return policyName;
	}
	/**
	 *  This method is for  Set PolicyName
	 *  
	 * @param policyName
	 */
	public void setPolicyName(String policyName)
	{
		this.policyName = policyName;
	}
	/**
	 * This  method is for GetPolicyHandler
	 * 
	 * @return String:policyHandlerClass
	 */
	public String getPolicyHandlerClass()
	{
		return policyHandlerClass;
	}
	/**
	 *  This Method is for Set Str PolicyHandler
	 *  
	 * @param policyHandlerClass
	 */
	public void setPolicyHandlerClass(String policyHandlerClass)
	{
		this.policyHandlerClass = policyHandlerClass;
	}
	/**
	 * This method will return the instance of report policy handler.
	 * 
	 * @return IReportPolicyHandler
	 * @throws ReportingException
	 */
	public final IReportPolicyHandler getReportPolicyHandler() throws ReportingException
	{
		LOGGER.ctinfo("CTREP00564");
		IReportPolicyHandler policyHandler = null;
		if (policyHandlerClass != null)
		{
			ReportPolicyFactory reportPolicyFactory = ReportPolicyFactory.getInstance();
			policyHandler = reportPolicyFactory.getReportPolicyHandler(policyHandlerClass);
		}
		LOGGER.ctinfo("CTREP00565");
		return policyHandler;
	}

	// instantiating the logger object.
	private static Logger LOGGER = Logger.getLogger(ReportPolicy.class);
}
