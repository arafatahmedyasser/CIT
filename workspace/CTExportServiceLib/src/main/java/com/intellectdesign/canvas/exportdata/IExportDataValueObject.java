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

/**
 * This interface models and encapsulates the Export data
 * 
 * @version 1.0
 */
public interface IExportDataValueObject
{
	/**
	 * get all column headers
	 * 
	 * @return ArrayList
	 */
	public ArrayList getColumnHeaders();

	/**
	 * get all ExportData
	 * 
	 * @return ArrayList
	 */

	public ArrayList getExportData();

	/**
	 * This method is used to add the ColumnHeader
	 * 
	 * @param sHeaderKey
	 * @param sHeaderDescription
	 * @param sHeaderDataType
	 * 
	 */

	public void addColumnHeader(String sHeaderKey, String sHeaderDescription, String sHeaderDataType);

	/**
	 * This method is used to add the ColumnHeader
	 * 
	 * @param exportDataColumnHeaderValueObject
	 */

	public void addColumnHeader(IExportDataColumnHeaderValueObject exportDataColumnHeaderValueObject);

	/**
	 * This method is used to add the ExportData
	 * 
	 * @param dataMap
	 */

	public void addExportData(HashMap dataMap);

	/**
	 * This method is used to add the ExportData
	 * 
	 * @param listDataMaps
	 */

	public void addExportData(ArrayList listDataMaps);

	/**
	 * This method is used to get the report id
	 * 
	 * @return Returns the report id
	 */

	public String getReportId();

	/**
	 * This method is used to set the report id
	 * 
	 * @param report id to set
	 */

	public void setReportId(String sReportId);

	/**
	 * This method is used to get the export mode
	 * 
	 * @return Returns the export mode
	 */
	public String getexportMode();

	/**
	 * This method is used to set the export mode
	 * 
	 * @param exportMode to set
	 */

	public void setexportMode(String exportMode);

	/**
	 * This method is used to get the linkedcurrency data.
	 * 
	 * @return Returns the linkedcurrency data
	 */

	public HashMap<String, String> getLinkedCurrData();

	// to add the linkedcurrency data.

	/**
	 * This method is used to set the linkedcurrency data
	 * 
	 * @param linkedcurrency data to set
	 */
	public void addLinkedCurrData(HashMap<String, String> mapData);

	/**
	 * This method is used to set the GroupHeaderReqd
	 * 
	 * @param GroupHeaderReqd to set
	 */

	public void setGroupHeaderReqd(String sGroupHeaderReqd);

	/**
	 * Used to check whether the grid having grouping header or not.
	 * 
	 * @return boolean
	 */
	public boolean isGroupHeaderReqd();

	/**
	 * Used to get whether the grid requires grouping header or not.
	 * 
	 * @return String
	 */
	public String getGroupHeaderReqd();

	/**
	 * Used to set the grouped column header
	 * 
	 * @param grpColHeaderList
	 */
	public void setGroupColumnHeader(ArrayList grpColHeaderList);

	/**
	 * Used to get the grouped column headers in an array.
	 * 
	 * @return ArrayList
	 */
	public ArrayList getGroupColumnHeader();

	/**
	 * The file exported will be having a default filename <VIEW_NAME>_<TIMESTAMP> This method will return the prefix
	 * <VIEW_NAME>
	 * 
	 * @return String fileNamePrefix
	 */
	public String getFileNamePrefix();

	/**
	 * Set the view name as the prefix for the filename
	 * 
	 * @param fileNamePrefix
	 */
	public void setFileNamePrefix(String fileNamePrefix);

	/**
	 * To check whether localization is required for filename while exporting
	 * 
	 * @return boolean
	 */
	public boolean isLocalizationRequiredForFileName();

	/**
	 * Set boolean value specifying whether localization is required for filename while exporting
	 * 
	 * @param flag
	 */
	public void setLocalizationRequiredForFileName(boolean flag);

	/**
	 * Set the additional data into the VO
	 * 
	 * @param dataMap Additional data found in ViewDefinition Object
	 */
	public void addExportAdditionalData(HashMap dataMap);

	/**
	 * View definition will be having additional data,this method will return the complete additional data
	 * 
	 * @return HashMap
	 */
	public HashMap getExportAdditionalData();

	/**
	 * gets the bundle key
	 * 
	 * @return String
	 */

	public String getBundleKey();

	/**
	 * sets the bundle key
	 * 
	 * @param bundleKey
	 */

	public void setBundleKey(String bundleKey);

	/**
	 * Checks isOnlyContent
	 * 
	 * @return onlyContent to return only the widget content
	 */
	public boolean isOnlyContent();

	/**
	 * sets the onlyContent
	 * 
	 * @param onlyContent the onlyContent to set
	 */
	public void setOnlyContent(boolean onlyContent);

	/**
	 * This method is used to get the reportHeader
	 * 
	 * @return the reportHeader
	 */
	public String getReportHeader();

	/**
	 * This method is used to set the reportHeader
	 * 
	 * @param reportHeader the reportHeader to set
	 */
	public void setReportHeader(String reportHeader);

}
