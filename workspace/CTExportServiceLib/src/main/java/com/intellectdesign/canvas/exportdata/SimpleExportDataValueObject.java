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

package com.intellectdesign.canvas.exportdata;

import java.util.ArrayList;
import java.util.HashMap;

import com.intellectdesign.canvas.constants.export.ExportFwsConstants;

/**
 * This class provides a simple implementation of IExportDataValueObject
 * 
 * @version 1.0
 */
public class SimpleExportDataValueObject implements IExportDataValueObject
{
	private ArrayList listColumnHeaders = null;
	private ArrayList listExportData = null;
	private String sReportId = null;
	private String fileNamePrefix = null;
	private HashMap additionalData = null;
	private boolean bLocalizationRequired = true;

	private String sGroupHeaderReqd = null;
	private ArrayList grpColHeaderList = null;

	private String exportMode = null;
	private String bundleKey = ExportFwsConstants.EZ_LABELS;
	private HashMap<String, String> linkedCurrenciesData = null;

	/**
	 * The parameter to generate the content without the header and the footer
	 */
	private boolean onlyContent = false;
	private String reportHeader = null;

	/**
	 * The default constructor for SimpleExportDataValueObject
	 */
	public SimpleExportDataValueObject()
	{
		listColumnHeaders = new ArrayList();
		listExportData = new ArrayList();
	}

	/**
	 * This method is used to set the BundleKey
	 * 
	 * @param BundleKey to set
	 */

	public void setBundleKey(String bundleKey)
	{
		this.bundleKey = bundleKey;
	}

	/**
	 * method that gets BundleKey
	 * 
	 * @return Returns the BundleKey
	 */

	public String getBundleKey()
	{
		return this.bundleKey;
	}

	/**
	 * method that adds ColumnHeader
	 * 
	 * @param headerKey
	 * @param headerDescription
	 * @param headerDataType
	 * 
	 * 
	 */
	public void addColumnHeader(String headerKey, String headerDescription, String headerDataType)
	{
		SimpleExportDataColumnHeaderValueObject simpleExportDataColumnHeaderVO = new SimpleExportDataColumnHeaderValueObject(
				headerKey, headerDescription, headerDataType);
		listColumnHeaders.add(simpleExportDataColumnHeaderVO);
	}

	/**
	 * method that gets ColumnHeaders
	 * 
	 * @return Returns the ColumnHeaders
	 */

	public ArrayList getColumnHeaders()
	{
		return listColumnHeaders;
	}

	/**
	 * method that gets ExportData
	 * 
	 * @return Returns the ExportData
	 */

	public ArrayList getExportData()
	{
		return listExportData;
	}

	/**
	 * method that sets ExportData
	 * 
	 * @param dataMap to set
	 */

	public void addExportData(HashMap dataMap)
	{
		listExportData.add(dataMap);
	}

	/**
	 * method that sets ExportData
	 * 
	 * @param listDataMaps to set
	 */

	public void addExportData(ArrayList listDataMaps)
	{
		listExportData = listDataMaps;
	}

	/**
	 * method that sets ColumnHeader
	 * 
	 * @param exportDataColumnHeaderValueObject to set
	 */

	public void addColumnHeader(IExportDataColumnHeaderValueObject exportDataColumnHeaderValueObject)
	{
		listColumnHeaders.add(exportDataColumnHeaderValueObject);

	}

	/**
	 * method that gets ReportId
	 * 
	 * @return Returns the ReportId
	 */

	public String getReportId()
	{
		return sReportId;
	}

	/**
	 * method that sets ReportId
	 * 
	 * @param ReportId to set
	 */

	public void setReportId(String reportId)
	{
		this.sReportId = reportId;

	}

	/**
	 * method that gets exportMode
	 * 
	 * @return Returns the exportMode
	 */
	public String getexportMode()
	{
		return exportMode;
	}

	/**
	 * method that sets exportMode
	 * 
	 * @param exportMode to set
	 */

	public void setexportMode(String exportMode)
	{
		this.exportMode = exportMode;

	}

	/**
	 * The file exported will be having a default filename <VIEW_NAME>_<TIMESTAMP> This method will return the prefix
	 * <VIEW_NAME>
	 * 
	 * @return String fileNamePrefix
	 */

	public String getFileNamePrefix()
	{
		return fileNamePrefix;
	}

	/**
	 * Set the view name as the prefix for the filename
	 * 
	 * @param fileNamePrefix to set
	 */
	public void setFileNamePrefix(String fileNamePrefix)
	{
		this.fileNamePrefix = fileNamePrefix;

	}

	/**
	 * Set the additional data into the VO
	 * 
	 * @param dataMap Additional data found in ViewDefinition Object
	 * 
	 */
	public void addExportAdditionalData(HashMap dataMap)
	{
		this.additionalData = dataMap;
	}

	/**
	 * View definition will be having additional data,this method will return the complete additional data
	 * 
	 * @return additional data
	 */
	public HashMap getExportAdditionalData()
	{
		return additionalData;
	}

	/**
	 * To check whether localization is required for filename while exporting
	 * 
	 * @return boolean
	 */
	public boolean isLocalizationRequiredForFileName()
	{
		return bLocalizationRequired;
	}

	/**
	 * Set boolean value specifying whether localization is required for filename while exporting
	 * 
	 * @param flag to check whether localization is required or not
	 */
	public void setLocalizationRequiredForFileName(boolean flag)
	{
		bLocalizationRequired = flag;
	}

	/**
	 * Used to return the whether the grid having grouping header or not.
	 * 
	 * @return String
	 */
	public String getGroupHeaderReqd()
	{
		return sGroupHeaderReqd;
	}

	/**
	 * Used to set the value 'Y' if the grouping header is available in the grid otehr wise 'N'.
	 * 
	 * @param bGroupHeaderReqd to set
	 */
	public void setGroupHeaderReqd(String sGroupHeaderReqd)
	{
		this.sGroupHeaderReqd = sGroupHeaderReqd;
	}

	/**
	 * Used to set the grouping column headers value in an list.
	 * 
	 * @param grpColHeaderList to set
	 */
	public void setGroupColumnHeader(ArrayList grpColHeaderList)
	{
		this.grpColHeaderList = grpColHeaderList;
	}

	/**
	 * Used to get the grouping header value.
	 * 
	 * @return Returns the GroupColumnHeader
	 */
	public ArrayList getGroupColumnHeader()
	{
		return grpColHeaderList;
	}

	/**
	 * Used to check whether the grouping header is required.
	 * 
	 * @return Returns boolean
	 */
	public boolean isGroupHeaderReqd()
	{
		if (this.getGroupHeaderReqd() == null || this.getGroupHeaderReqd().equals('N'))
		{
			return false;
		}
		return true;
	}

	/**
	 * Used to get the LinkedCurrData
	 * 
	 * @return Returns the LinkedCurrData
	 */
	public HashMap<String, String> getLinkedCurrData()
	{
		return linkedCurrenciesData;
	}

	/**
	 * Used to set the LinkedCurrData
	 * 
	 * @param linkedCurrDatamap to set
	 */

	public void addLinkedCurrData(HashMap<String, String> linkedCurrDatamap)
	{
		this.linkedCurrenciesData = linkedCurrDatamap;
	}

	/**
	 * Used to get onlyContent
	 * 
	 * @return the onlyContent
	 */
	public boolean isOnlyContent()
	{
		return onlyContent;
	}

	/**
	 * method that sets onlyContent
	 * 
	 * @param onlyContent the onlyContent to set
	 */
	public void setOnlyContent(boolean onlyContent)
	{
		this.onlyContent = onlyContent;
	}

	/**
	 * method that gets ReportHeader
	 * 
	 * @return the reportHeader
	 */
	public String getReportHeader()
	{
		return reportHeader;
	}

	/**
	 * method that sets ReportHeader
	 * 
	 * @param reportHeader the reportHeader to set
	 */
	public void setReportHeader(String reportHeader)
	{
		this.reportHeader = reportHeader;
	}
}
