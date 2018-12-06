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
 * Interface that provides APIs to manipulate the data for the form based export options.
 *  
 * @version 1.0
 */
public interface IExportFormDataValueObject
{

	/**
	 * This method is used to get the ColumnHeaders
	 * 
	 * @return ArrayList
	 */
	public ArrayList getColumnHeaders();

	/**
	 * This method is used to get the ExportData
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
	 * This method is used to return isLocalizationRequiredForFileName
	 * 
	 * @return boolean
	 */

	public boolean isLocalizationRequiredForFileName();

}
