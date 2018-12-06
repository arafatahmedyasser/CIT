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

import java.util.Iterator;
import java.util.Map;

import com.intellectdesign.canvas.common.IBaseDefinition;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.report.util.ReportConstants;
import com.intellectdesign.canvas.report.util.ReportUtil;

/**
 * This class is the response VO object for reports. It contains the all necessary output details regarding the report
 * generation. It is designed for simple VO, because it would be easier to add/update the output details future.
 * 
 * 
 * @version 1.0
 */

public class ReportResponse implements IBaseDefinition
{

	private static final long serialVersionUID = -1063856583071106195L;

	/**
	 * Unique id (REPORT_INSTANCE_ID) for the report.
	 */
	private String reportInstanceId;
	/**
	 * Unique id for the report.
	 */
	private String reportId;
	/**
	 * Name of the Report
	 */
	private String reportName;
	/**
	 * It denotes the status (SUCCESS / FAILURE) of the report.
	 */
	private String status;
	/**
	 * It denotes the error code if any error occurred while report generation.
	 */
	private String errorCode;
	/**
	 * It denotes the error message if any error occurred while report generation.
	 */
	private String errorMsg;
	/**
	 * It contains the reponse details of the request.
	 */
	private Map responseObject;

	/**
	 * @return the reportInstanceId
	 */
	public String getReportInstanceId()
	{
		return reportInstanceId;
	}

	/**
	 * @param reportInstanceId the reportInstanceId to set
	 */
	public void setReportInstanceId(String reportInstanceId)
	{
		this.reportInstanceId = reportInstanceId;
	}

	/**
	 * @return the reportId
	 */
	public String getReportId()
	{
		return reportId;
	}

	/**
	 * @param reportId the reportId to set
	 */
	public void setReportId(String reportId)
	{
		this.reportId = reportId;
	}

	/**
	 * @return the reportName
	 */
	public String getReportName()
	{
		return reportName;
	}

	/**
	 * @param reportName the reportName to set
	 */
	public void setReportName(String reportName)
	{
		this.reportName = reportName;
	}

	/**
	 * @return the status
	 */
	public String getStatus()
	{
		return status;
	}

	/**
	 * @param status the status to set
	 */
	public void setStatus(String status)
	{
		this.status = status;
	}

	/**
	 * @return the errorCode
	 */
	public String getErrorCode()
	{
		return errorCode;
	}

	/**
	 * @param errorCode the errorCode to set
	 */
	public void setErrorCode(String errorCode)
	{
		this.errorCode = errorCode;
	}

	/**
	 * @return the errorMsg
	 */
	public String getErrorMsg()
	{
		return errorMsg;
	}

	/**
	 * @param errorMsg the errorMsg to set
	 */
	public void setErrorMsg(String errorMsg)
	{
		this.errorMsg = errorMsg;
	}

	/**
	 * @return the responseObject
	 */
	public Map getResponseObject()
	{
		return responseObject;
	}

	/**
	 * @param responseObject the responseObject to set
	 */
	public void setResponseObject(Map responseObject)
	{
		this.responseObject = responseObject;
	}

	/**
	 * @return reponseString This method give the JSON String value of ReportResponse object.
	 */
	@Override
	public final String toJSONString()
	{
		LOGGER.ctinfo("CTREP00568");
		StringBuffer reportResponse = new StringBuffer();
		reportResponse.append("reportInstanceId:'" + reportInstanceId + "',");
		reportResponse.append("reportId:'" + reportId + "',");
		reportResponse.append("reportName:'" + reportName + "',");
		reportResponse.append("status:'" + status);
		if (ReportUtil.isNotEmpty(status) && status.equalsIgnoreCase(ReportConstants.STATUS_FAILURE))
		{
			reportResponse.append("'," + "errorCode:'" + errorCode + "',");
			reportResponse.append("errorMsg:'" + errorMsg);
		} else
		{
			StringBuffer responseObj = new StringBuffer();
			Iterator it = responseObject.entrySet().iterator();
			while (it.hasNext())
			{
				Map.Entry pairs = (Map.Entry) it.next();
				responseObj.append(pairs.getKey() + " : " + pairs.getValue());
			}
			reportResponse.append(",responseObject:" + "[" + responseObj + "]");
		}
		LOGGER.ctinfo("CTREP00569", reportResponse);
		return "{" + reportResponse.toString() + "}";
	}

	// instantiating the logger object.
	private static Logger LOGGER = Logger.getLogger(ReportResponse.class);
}
