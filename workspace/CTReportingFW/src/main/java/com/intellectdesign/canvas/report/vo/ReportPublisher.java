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
import com.intellectdesign.canvas.report.factory.ReportPublisherFactory;
import com.intellectdesign.canvas.report.publisher.IReportPublisher;

/**
 * this is a class ReportPublisher implements IBaseDefinition
 * 
 * @version 1.0
 */
public class ReportPublisher implements IBaseDefinition
{
	private static final long serialVersionUID = -3343650759417677592L;
	private String publisherId;
	private String publisherName;
	private String publisherHandlerClass;

	@Override
	/**
	 * 
	 * @return null
	 * @see com.intellectdesign.canvas.common.IBaseDefinition#toJSONString()
	 */
	public String toJSONString()
	{
		return null;
	}

	/**
	 * @return the publisherId
	 */
	public String getPublisherId()
	{
		return publisherId;
	}

	/**
	 * @param publisherId the publisherId to set
	 */
	public void setPublisherId(String publisherId)
	{
		this.publisherId = publisherId;
	}

	/**
	 * @return the publisherName
	 */
	public String getPublisherName()
	{
		return publisherName;
	}

	/**
	 * @param publisherName the publisherName to set
	 */
	public void setPublisherName(String publisherName)
	{
		this.publisherName = publisherName;
	}

	/**
	 * @return the publisherHandlerClass
	 */
	public String getPublisherHandlerClass()
	{
		return publisherHandlerClass;
	}

	/**
	 * @param publisherHandlerClass the publisherHandlerClass to set
	 */
	public void setPublisherHandlerClass(String publisherHandlerClass)
	{
		this.publisherHandlerClass = publisherHandlerClass;
	}

	/**
	 * This method will return the instance of ReportPublisher.
	 * 
	 * @return IReportPublisher
	 * @throws ReportingException
	 */
	public final IReportPublisher getReportPublisher() throws ReportingException
	{
		LOGGER.ctinfo("CTREP00566");
		IReportPublisher reportPublisher = null;
		if (publisherHandlerClass != null)
		{
			ReportPublisherFactory reportPublisherFactory = ReportPublisherFactory.getInstance();
			reportPublisher = reportPublisherFactory.getReportPublisher(publisherHandlerClass);
		}
		LOGGER.ctinfo("CTREP00567");
		return reportPublisher;

	}

	// instantiating the logger object.
	private Logger LOGGER = Logger.getLogger(ReportPublisher.class);
}
