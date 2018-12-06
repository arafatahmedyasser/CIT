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

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.report.dataaggregator.IReportDataAggregator;
import com.intellectdesign.canvas.report.engine.IReportEngineAdaptor;
import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.factory.ReportDataAggregatorFactory;
import com.intellectdesign.canvas.report.factory.ReportEngineAdaptorFactory;
import com.intellectdesign.canvas.report.util.ReportConstants;

/**
 * This class is the request VO object for report context. It is designed for simple VO, because it would be easier to
 * add/update the input parameters future.
 * 
 * @version 1.0
 */
public class ReportContext implements Serializable
{
	private static final long serialVersionUID = -971638963810117210L;
	private Map context = new HashMap();
	/**
	 * It denotes the reporting engine for the report.
	 */
	private String reportEngineAdaptorClassName;
	/**
	 * It denotes the Data Aggregator for the report.
	 */
	private String reportDataAggregatorClassName;
	/**
	 * It denotes the Publisher for the report.
	 */
	private List<ReportPublisher> reportPublishers;
	/**
	 * It denotes the NotificationListener for the report.
	 */
	private List<ReportNotification> notificationListeners;
	/**
	 * List of report policies mapped against the report.
	 */
	private List<ReportPolicy> policies;
	/**
	 * List of data sources which are used to get the data list for the report.
	 */
	private List<ReportDataSourceVO> dataSources;
	/**
	 * Generated Report Instance definition.
	 */
	private ReportInstanceDefinition reportInstanceDefinition;
	/**
	 * Product Code.
	 */
	private String productCode;
	/**
	 * Sub product code.
	 */
	private String subProductCode;
	/**
	 * Function Code.
	 */
	private String funcCode;
	/**
	 * Entitlement Type.
	 */
	private String entlType;
	/**
	 * It represents the system report Id of the report. It represents the report which is the root (pre-defined) report
	 * id.
	 */
	private String systemReportId;
	/**
	 * Login UserName.
	 */
	private String userName;
	/**
	 * Login User's CorporateName.
	 */
	private String corporateName;
	
	private String bundleKey;
	/**
	 * @return the bundleKey
	 */
	public String getBundleKey()
	{
		return bundleKey;
	}
	/**
	 * @param bundleKey the bundleKey to set
	 */
	public void setBundleKey(String bundleKey)
	{
		this.bundleKey = bundleKey;
	}
	/**
	 * This  method is for Str UserName
	 * @return  userName
	 */
	public String getUserName()
	{
		return userName;
	}
	/**
	 * This method is for  Str SetUsername
	 * @param userName the userName to set
	 */
	public void setUserName(String userName)
	{
		this.userName = userName;
	}
	/**
	 * This method is used to insert a object to the context object.
	 * 
	 * @param key
	 * @param value
	 */
	public void setAttribute(String key, Object value)
	{
		context.put(key, value);
	}
	/**
	 * It returns the value object from the context for the given key.
	 * 
	 * @param key
	 * @return value object.
	 */
	public Object getAttribute(String key)
	{
		return context.get(key);
	}
	/**
	 * This method is for IReportEngineAdaptor
	 * 
	 * @return the dataAggregator
	 * @throws ReportingException
	 */
	public IReportEngineAdaptor getReportEngineAdaptor() throws ReportingException
	{
		ReportEngineAdaptorFactory reportEngineAdaptorFactory = ReportEngineAdaptorFactory.getInstance();
		return reportEngineAdaptorFactory.getReportEngineAdaptor(reportEngineAdaptorClassName);
	}
	/**
	 *  This method is for IReportDataAggregator
	 *  
	 * @return the dataAggregator
	 * @throws ReportingException
	 */
	public IReportDataAggregator getReportDataAggregator() throws ReportingException
	{
		ReportDataAggregatorFactory reportDataAggregatorFactory = ReportDataAggregatorFactory.getInstance();
		return reportDataAggregatorFactory.getReportDataAggregator(reportDataAggregatorClassName);
	}
	/**
	 *  This method is for Str  GetReportEngineAdaptor
	 *  
	 * @return the reportEngineAdaptorClassName
	 */
	public String getReportEngineAdaptorClassName()
	{
		return reportEngineAdaptorClassName;
	}
	/**
	 * This method is for  Str  ReportEngineAdaptorClassName
	 * @param reportEngineAdaptorClassName the reportEngineAdaptorClassName to set
	 */
	public void setReportEngineAdaptorClassName(String reportEngineAdaptorClassName)
	{
		this.reportEngineAdaptorClassName = reportEngineAdaptorClassName;
	}
	/**
	 * This method is for Str ReportDataAggregatorName
	 * @return the reportDataAggregatorClassName
	 */
	public String getReportDataAggregatorClassName()
	{
		return reportDataAggregatorClassName;
	}
	/**
	 * This method is for  String ReportDataAggregator 
	 * 
	 * @param reportDataAggregatorClassName the reportDataAggregatorClassName to set
	 */
	public void setReportDataAggregatorClassName(String reportDataAggregatorClassName)
	{
		this.reportDataAggregatorClassName = reportDataAggregatorClassName;
	}
	/**
	 * This method is for List ReportPublishers
	 * 
	 * @return the reportPublishers
	 */
	public List<ReportPublisher> getReportPublishers()
	{
		return reportPublishers;
	}
	/**
	 * This method is for List SetReportPublishers
	 * 
	 * @param reportPublishers the reportPublishers to set
	 */
	public void setReportPublishers(List<ReportPublisher> reportPublishers)
	{
		this.reportPublishers = reportPublishers;
	}
	/**
	 * This method is for  List ReportNotificationListeners
	 * 
	 * @return the notificationListeners
	 */
	public List<ReportNotification> getNotificationListeners()
	{
		return notificationListeners;
	}
	/**
	 * This method is for  Set NotificationsListeners
	 * 
	 * @param notificationListeners the notificationListeners to set
	 */
	public void setNotificationListeners(List<ReportNotification> notificationListeners)
	{
		this.notificationListeners = notificationListeners;
	}
	/**
	 * This method is for ReportInstanceDefinition
	 * 
	 * @return the reportInstanceDefinition
	 */
	public ReportInstanceDefinition getReportInstanceDefinition()
	{
		return reportInstanceDefinition;
	}
	/**
	 * This  method is for  SetReportInstanceDefinition
	 * 
	 * @param reportInstanceDefinition the reportInstanceDefinition to set
	 */
	public void setReportInstanceDefinition(ReportInstanceDefinition reportInstanceDefinition)
	{
		this.reportInstanceDefinition = reportInstanceDefinition;
	}
	/**
	 * This method is for Str getProductCode
	 * 
	 * @return the productCode
	 */
	public String getProductCode()
	{
		return productCode;
	}
	/**
	 * This  method is for  Set Str ProductCode
	 * @param productCode 
	 */
	public void setProductCode(String productCode)
	{
		this.productCode = productCode;
	}
	/**
	 * This method is for Str GetsubProductCode
	 * 
	 * @return the subProductCode
	 */
	public String getSubProductCode()
	{
		return subProductCode;
	}
	/**
	 * This method is for  Set  Str subproductcode
	 * 
	 * @param subProductCode the subProductCode to set
	 */
	public void setSubProductCode(String subProductCode)
	{
		this.subProductCode = subProductCode;
	}
	/**
	 * This methos is for  GetFunCode
	 * 
	 * @return the funcCode
	 */
	public String getFuncCode()
	{
		return funcCode;
	}
	/**
	 * This method is for  SetFunCode
	 * 
	 * @param funcCode the funcCode to set
	 */
	public void setFuncCode(String funcCode)
	{
		this.funcCode = funcCode;
	}
	/**
	 * This method is for List ReportDataSources
	 * 
	 * @return the dataSources
	 */
	public List<ReportDataSourceVO> getDataSources()
	{
		return dataSources;
	}
	/**
	 * This methos is for Set List Report DataSources
	 * 
	 * @param dataSources the dataSources to set
	 */
	public void setDataSources(List<ReportDataSourceVO> dataSources)
	{
		this.dataSources = dataSources;
	}
	/**
	 * This method  is  for  List ReportPolicy
	 * 
	 * @return the policies
	 */
	public List<ReportPolicy> getPolicies()
	{
		return policies;
	}
	/**
	 * This methos is for List  ReportPolices
	 * 
	 * @param policies the policies to set
	 */
	public void setPolicies(List<ReportPolicy> policies)
	{
		this.policies = policies;
	}
	/**
	 * This method is for Str  EntlType
	 * 
	 * @return the entlType
	 */
	public String getEntlType()
	{
		return entlType;
	}
	/**
	 * This method is for  String SetEntlType
	 *  
	 * @param entlType the entlType to set
	 */
	public void setEntlType(String entlType)
	{
		this.entlType = entlType;
	}
	/**
	 * This method used to build List of the NotifiersMap. Each Notiifers map contains the notificationHandlerClassName,
	 * NotificationId.
	 * 
	 * @return list of Notifiers Map.
	 * @exception ReportingException
	 */
	public List<HashMap> getNotifierList() throws ReportingException
	{
		LOGGER.ctinfo("CTREP00517");

		List<HashMap> notifierList = new ArrayList();
		try
		{
			for (ReportNotification notifier : notificationListeners)
			{
				HashMap notifierMap = new HashMap();
				notifierMap.put(ReportConstants.CHANNELHANDLER, notifier.getNotificationHandlerClass());
				notifierMap.put(ReportConstants.NOTIFICATIONID, notifier.getNotificationId());
				notifierList.add(notifierMap);
			}
		} catch (Exception exp)
		{
			LOGGER.cterror("CTREP00518", exp);
			throw new ReportingException(ReportConstants.ERR_CD_RPT_CONTEXT_NOTIFIERS, exp);
		}

		LOGGER.ctinfo("CTREP00519");

		return notifierList;
	}
	/**
	 *  This method is for Str  getSysReportId
	 *  
	 * @return String:systemReportId
	 */
	public String getSystemReportId()
	{
		return systemReportId;
	}
	/**
	 *  This method is for  setSystemReportId
	 *  
	 * @param systemReportId
	 */
	public void setSystemReportId(String systemReportId)
	{
		this.systemReportId = systemReportId;
	}
	/**
	 *  This method is  for  corporateName
	 *  
	 * @return String:corporateName
	 */
	public String getCorporateName()
	{
		return corporateName;
	}
	/**
	 *  This method is for Set  corporateName
	 *  
	 * @param corporateName
	 */
	public void setCorporateName(String corporateName)
	{
		this.corporateName = corporateName;
	}
	// instantiating the logger object.
	private static Logger LOGGER = Logger.getLogger(ReportContext.class);

}
