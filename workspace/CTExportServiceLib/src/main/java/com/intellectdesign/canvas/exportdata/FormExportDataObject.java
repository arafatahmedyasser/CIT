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
 * Data object class for the form export This class is responsible for Getter and setter methods for the private
 * variables
 * 
 * @version 1.0
 */
public class FormExportDataObject implements IExportFormDataValueObject
{
	private HashMap hmFormData = null;
	private ArrayList listGridData = null;
	private HashMap datamap = null;
	private ArrayList listFieldNames = null;
	private ArrayList listFieldValues = null;
	private String fileNamePrefix = null;

	/**
	 * method that gets FormData
	 * 
	 * @return Returns the FormData
	 */
	public HashMap getFormData()
	{
		return hmFormData;
	}

	/**
	 * This method is used to set the FormData
	 * 
	 * @param hmFormData to set
	 */

	public void setFormData(HashMap hmFormData)
	{
		this.hmFormData = hmFormData;
	}

	/**
	 * method that gets GridData
	 * 
	 * @return Returns the GridData
	 */

	public ArrayList getGridData()
	{
		return listGridData;
	}

	/**
	 * This method is used to set the GridData
	 * 
	 * @param listGridData to set
	 */

	public void setGridData(ArrayList listGridData)
	{
		this.listGridData = listGridData;
	}

	/**
	 * method that gets FieldNames
	 * 
	 * @return Returns the FieldNames
	 */

	public ArrayList getFieldNames()
	{

		return listFieldNames;
	}

	/**
	 * This method is used to set the FieldNames
	 * 
	 * @param listFieldNames to set
	 */

	public void setFieldNames(ArrayList listFieldNames)
	{
		this.listFieldNames = listFieldNames;
	}

	/**
	 * method that gets FieldValues
	 * 
	 * @return Returns the FielValues
	 */

	public ArrayList getFieldValues()
	{
		return listFieldValues;
	}

	/**
	 * This method is used to set the FieldValues
	 * 
	 * @param FieldValues to set
	 */

	public void setFieldValues(ArrayList listFieldValues)
	{
		this.listFieldValues = listFieldValues;

	}

	/**
	 * method that gets FileNamePrefix
	 * 
	 * @return Returns the FileNamePrefix
	 */

	public String getFileNamePrefix()
	{
		return fileNamePrefix;
	}

	/**
	 * This method is used to set the FileNamePrefix
	 * 
	 * @param fileNamePrefix to set
	 */

	public void setFileNamePrefix(String fileNamePrefix)
	{
		this.fileNamePrefix = fileNamePrefix;

	}



	/**
	 * Unimplemented method. This may be used for some other exports
	 * 
	 * @return ArrayList
	 * @see com.intellectdesign.canvas.exportdata.IExportFormDataValueObject#getColumnHeaders()
	 */
	public ArrayList getColumnHeaders()
	{
		return null;
	}

	/**
	 * Unimplemented method. This may be used for some other exports
	 * 
	 * @return ArrayList
	 * @see com.intellectdesign.canvas.exportdata.IExportFormDataValueObject#getExportData()
	 */

	public ArrayList getExportData()
	{
		return null;
	}

	/**
	 * Unimplemented method. This may be used for some other exports
	 * 
	 * @param sHeaderKey
	 * @param sHeaderDescription
	 * @param sHeaderDataType
	 * @see com.intellectdesign.canvas.exportdata.IExportFormDataValueObject#addColumnHeader(java.lang.String, java.lang.String,
	 *      java.lang.String)
	 */

	public void addColumnHeader(String sHeaderKey, String sHeaderDescription, String sHeaderDataType)
	{

	}

	/**
	 * Unimplemented method. This may be used for some other exports
	 * 
	 * @param exportDataColumnHeaderValueObject
	 * @see com.intellectdesign.canvas.exportdata.IExportFormDataValueObject#addColumnHeader(com.intellectdesign.canvas.exportdata.IExportDataColumnHeaderValueObject)
	 */

	public void addColumnHeader(IExportDataColumnHeaderValueObject exportDataColumnHeaderValueObject)
	{

	}

	/**
	 * This method is used to set the ExportData
	 * 
	 * @param dataMap to set
	 */

	public void addExportData(HashMap dataMap)
	{
		this.datamap = dataMap;

	}

	/**
	 * This method is used to add the ExportData
	 * 
	 * @param listDataMaps
	 * @see com.intellectdesign.canvas.exportdata.IExportFormDataValueObject#addExportData(java.util.ArrayList)
	 */
	public void addExportData(ArrayList listDataMaps)
	{
	}

	/**
	 * This method is used to get the isLocalizationRequiredForFileName
	 * 
	 * @returns boolean false
	 */

	public boolean isLocalizationRequiredForFileName()
	{
		return false;
	}

	/**
	 * This method is used to set the iLocalizationRequiredForFileName
	 * 
	 * @param flag
	 */
	public void setLocalizationRequiredForFileName(boolean flag)
	{
	}

}
