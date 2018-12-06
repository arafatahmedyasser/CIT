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

package com.intellectdesign.canvas.reports;

import com.intellectdesign.canvas.logger.Logger;

/**
 * Contains Summary Data
 * 
 * @version 1.0
 */
public class SummaryData
{
	private String data[] = null;
	private SummaryMetaData metaData[] = null;
	private static final Logger logger = Logger.getLogger(SummaryData.class);

	/**
	 * Default Constructor
	 */

	public SummaryData()
	{
	}

	/**
	 * Constructor with params
	 * 
	 * @param data[]
	 * @param metaData[]
	 */

	public SummaryData(String data[], SummaryMetaData metaData[])
	{
		this.data = data;
		this.metaData = metaData;
	}

	/**
	 * method that gets MetaData
	 * 
	 * @return Returns the MetaData
	 */

	public SummaryMetaData[] getMetaData()
	{
		return this.metaData;
	}

	/**
	 * method that gets data
	 * 
	 * @return Returns the data
	 */

	public String[] getData()
	{
		return this.data;
	}

	/**
	 * This method is used to set the data
	 * 
	 * @param data[] to set
	 */

	public void setData(String data[])
	{
		this.data = data;
	}

	/**
	 * This method is used to set the metaData
	 * 
	 * @param metaData[] to set
	 */

	public void setMetaData(SummaryMetaData metaData[])
	{
		this.metaData = metaData;
	}

	/**
	 * This method is used to get the string representation of metaData and Data
	 * 
	 * @return Returns the string
	 * @throws Exception
	 */

	public String toString()
	{
		StringBuffer str = new StringBuffer();
		try
		{
			for (int i = 0; i < data.length; i++)
			{
				str.append("Metadata:").append(metaData[i]).append(", DATA:").append(data[i]);
			}
		} catch (Exception e)
		{
			logger.cterror("CTEXP00038", e);
		}
		return str.toString();
	}

}