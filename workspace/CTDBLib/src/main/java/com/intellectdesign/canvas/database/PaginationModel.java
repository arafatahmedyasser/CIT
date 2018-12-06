/*************************************************************************
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved.  
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 *************************************************************************/

package com.intellectdesign.canvas.database;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.constants.listviews.ListViewConstants;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.utils.StringUtils;

/**
 * This class is responsible for pagination in grid views. All the records are retrived from the database for population
 * and then based on listViewPageSize value in orbionedirect.properties, the records are divided as pages.The default
 * value of page size is 46
 * 
 * @version 1.0
 */
public class PaginationModel implements Serializable
{

	/**
	 * An instance of Logger
	 */
	private static Logger logger = Logger.getLogger(PaginationModel.class);
	/**
	 * UID for serialization
	 */
	private static final long serialVersionUID = -5062602580704266886L;

	private static final String START_ROWNUM = "start";
	private static final String LIMIT_NUM_RECORDS = "limit";
	private static final int DEFAULT_PAGE_SIZE = 46;
	private static final int DEFAULT_START_ROWNUM = 0;

	private int pagesize; // this variable will be initialized by reading from a property file. No of rows displayed in
							// the page
	private int startRowOfPage; // this variable is initialized from the request params

	private int currentTotalProperty;
	private static final String TOTAL_COUNT = "TOTAL_COUNT";

	/**
	 * default constructor
	 */
	public PaginationModel()
	{
	}

	/**
	 * Overload constructor that takes the start row num and the page size (Number of records per page)
	 * 
	 * @param startRowNum The start row number (0 based)
	 * @param perPageSize The number of records per page
	 */
	public PaginationModel(int startRowNum, int perPageSize)
	{
		startRowOfPage = startRowNum;
		pagesize = perPageSize;
	}

	/**
	 * This is a helper method that checks whether the map provided has the "start" and "limit" parameters in the Map
	 * provided. These parameters are part of the contract through which the framework expects the paging parameters to
	 * be shared to the Canvas Framework for handling paging of data.
	 * 
	 * @param inputParams The parameters received as part of the request
	 * @return true if paging parameters are available. false otherwise.
	 */
	public static boolean isPagingParamsAvailable(Map inputParams)
	{
		boolean available = false;

		available = !StringUtils.isEmpty((String) inputParams.get(START_ROWNUM))
				&& !StringUtils.isEmpty((String) inputParams.get(LIMIT_NUM_RECORDS));

		return available;
	}

	/**
	 * This constructor initializes the pagination model using keys defined in the map. The key "start" (case *
	 * sensitive) is to present in the map and should contain a value that can be parsed as an integer The page size is
	 * * derived from the orbionedirect.properties "LIST_VIEW_PAGESIZE" key * if an exception occurs in parsing the
	 * string * to integer values the default values are used which is "0" for start * and "25" for pagesize.
	 * 
	 * @param propertyMap containing pagesize,startRowOfPage
	 * 
	 */
	@SuppressWarnings("rawtypes")
	public PaginationModel(Map propertyMap)
	{

		// initialize the page size
		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		String listViewPageSize = null;
		if("1".equals(propertyMap.get(ListViewConstants.INPUT_CHANNEL_ID))){
			listViewPageSize = String.valueOf(configMgr.getCompPrefDescriptor().getDefaultPageSizeForMobile());
		}
		else {
			listViewPageSize = configMgr.getCompPrefDescriptor().getListViewPageSize();
		}
		
		if (propertyMap.containsKey(LIMIT_NUM_RECORDS))
		{
			String recPerPage = (String) propertyMap.get(LIMIT_NUM_RECORDS);
			try
			{
				setPagesize(Integer.parseInt(recPerPage));
			} catch (NumberFormatException nfe)
			{

				if (listViewPageSize != null)
				{
					try
					{
						setPagesize(Integer.parseInt(listViewPageSize));
					} catch (NumberFormatException nfex)
					{
						setPagesize(DEFAULT_PAGE_SIZE);
					}
				}

			}
		} else
		{
			if (listViewPageSize != null)
			{
				try
				{
					setPagesize(Integer.parseInt(listViewPageSize));
				} catch (NumberFormatException nfe)
				{
					setPagesize(DEFAULT_PAGE_SIZE);
				}
			}
		}

		// initialize startRowNum
		if (propertyMap.containsKey(START_ROWNUM))
		{
			String startRowNo = (String) propertyMap.get(START_ROWNUM);
			try
			{
				setStartRowOfPage(Integer.parseInt(startRowNo));
			} catch (NumberFormatException nfe)
			{
				setStartRowOfPage(DEFAULT_START_ROWNUM);
			}
		} else
		{
			setStartRowOfPage(DEFAULT_START_ROWNUM);
		}
	}

	/**
	 * returns the pagesize
	 * 
	 * @return the pagesize
	 */
	public int getPagesize()
	{
		return pagesize;
	}

	/**
	 * sets the page size
	 * 
	 * @param i page size to set.
	 */
	private void setPagesize(int i)
	{
		this.pagesize = i;
	}

	/**
	 * returns the start row page
	 * 
	 * @return the start row page
	 */
	public int getStartRowOfPage()
	{
		return startRowOfPage+1;
	}

	/**
	 * sets the start row of page
	 * 
	 * @param default_start_rownum2
	 */
	private void setStartRowOfPage(int default_start_rownum2)
	{
		this.startRowOfPage = default_start_rownum2;
	}

	/**
	 * always returns the sum of startrowofpage and pagesize
	 * 
	 * @return returns the sum of startrowofpage and pagesize
	 */
	public int getEndRowOfPage()
	{
		return getStartRowOfPage() + getPagesize();
	}

	/**
	 * sets the currentTotalProperty
	 * 
	 * @param i
	 */
	private void setCurrentTotalProperty(int i)
	{
		this.currentTotalProperty = i;
	}

	/**
	 * This method returns the total number of records for grid view. If hash map of the record retrived contains the
	 * TOTAL_COUNT, the method directly returns the value
	 * 
	 * If the TOTAL_COUNT column is not available then, the method calculates the total count value using the formula
	 * startRowOfPage + records.size.
	 * 
	 * When the hash map is null, then total count is the startRowPage
	 * 
	 * @param records
	 * @return totalCount the total Count
	 */
	public int calculateTotalCount(List records)
	{
		return calculateTotalCount(records, -1);
	}

	/**
	 * This retrieves the total count from the given map and sets it to the appropriate local variable.
	 * 
	 * This method returns the total number of records for grid view. If hash map of the record retrived contains the
	 * TOTAL_COUNT, the method directly returns the value
	 * 
	 * If the TOTAL_COUNT column is not available then, the method calculates the total count value using the formula
	 * startRowOfPage + records.size.
	 * 
	 * When the hash map is null, then total count is the startRowPage
	 * 
	 * @param records The data retrieved from server
	 * @param totalCountProvided The total count if explicitly provided
	 * @return The total count that is finally identified.
	 */
	public int calculateTotalCount(List records, int totalCountProvided)
	{
		HashMap temp = null;
		int totalCount = -1;

		if (totalCountProvided != -1)
			totalCount = totalCountProvided;
		else if (records != null)
		{
			if (!records.isEmpty())
			{
				// Expecting TOTAL NO OF Records value in recordlist.
				temp = (HashMap) records.get(0);
				// Group list view TOTAL_COUNT will not be there
				if (temp.containsKey(TOTAL_COUNT))
					totalCount = (Integer) temp.get(TOTAL_COUNT);
				else
				{// this means it goes through old live grid implementation
					logger.cterror("CTDBL00172");
					totalCount = getStartRowOfPage() + records.size();
					setCurrentTotalProperty(totalCount - 1);
					return (totalCount - 1);
				}
			} else
			{
				totalCount = 0;
			}
		} else
		{
			logger.cterror("CTDBL00173");
			totalCount = -1;
		}
		setCurrentTotalProperty(totalCount);
		return totalCount;
	}

	/**
	 * This overridden method returns the value of pagesize and startRowOfPage
	 * 
	 * @return string value of {pagesize:<value>,startRowOfPage:<value>,totalcount:<value>}
	 */
	public String toString()
	{
		StringBuffer sb = new StringBuffer();
		sb.append("{pagesize : ");
		sb.append(this.pagesize);
		sb.append(",startRowOfPage : ");
		sb.append(this.startRowOfPage);
		sb.append(",totalcount : ");
		sb.append(this.currentTotalProperty);
		sb.append("}");
		return sb.toString();
	}
}
