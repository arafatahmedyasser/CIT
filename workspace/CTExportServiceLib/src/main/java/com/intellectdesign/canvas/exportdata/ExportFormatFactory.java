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

import java.util.HashMap;

import com.intellectdesign.canvas.constants.export.ExportFwsConstants;
import com.intellectdesign.canvas.logger.Logger;

/**
 * Factory class to get the Format Provider
 * 
 * @version 1.0
 */
public class ExportFormatFactory
{
	/**
	 * Default Constructor, does nothing
	 */
	private ExportFormatFactory()
	{

	}

	static HashMap map = null;
	static
	{
		map = new HashMap();
		map.put(ExportFwsConstants.XLS, "com.intellectdesign.canvas.exportdata.ExportXLSFormatProvider");
		// map.put(ExportFormatConstants.XLS, "com.intellectdesign.canvas.constants.export.ExportPDFFormatProvider");
		map.put(ExportFwsConstants.PDF, "com.intellectdesign.canvas.exportdata.ExportPDFFormatProvider");
		map.put(ExportFwsConstants.CSV, "com.intellectdesign.canvas.exportdata.ExportCSVFormatProvider");
		map.put(ExportFwsConstants.RTF, "com.intellectdesign.canvas.exportdata.ExportRTFFormatProvider");
		map.put(ExportFwsConstants.HTML, "com.intellectdesign.canvas.exportdata.ExportHTMLFormatProvider");
	}

	/**
	 * method returns the Class object associated with the class or interface with the given string name.
	 * 
	 * @param sFormat
	 * @return exportFormatProvider
	 * @throws ExportDataException
	 */
	public static IExportFormatProvider getFormatProvider(String sFormat) throws ExportDataException
	{
		if (!map.keySet().contains(sFormat))
		{
			logger.ctdebug("CTEXP00007", sFormat);
			throw new ExportDataException("Export format not supported. Input format: " + sFormat);
		}

		String sFormatClassName = (String) map.get(sFormat);
		logger.ctdebug("CTEXP00018", sFormatClassName);
		IExportFormatProvider exportFormatProvider = null;
		try
		{
			exportFormatProvider = (IExportFormatProvider) Class.forName(sFormatClassName).newInstance();
		} catch (InstantiationException ie)
		{
			logger.cterror("CTEXP00008", ie, sFormatClassName);
			throw new ExportDataException(ie);
		} catch (IllegalAccessException ie)
		{
			logger.cterror("CTEXP00009", ie, sFormatClassName);
			throw new ExportDataException(ie);
		} catch (ClassNotFoundException cnfe)
		{
			logger.cterror("CTEXP00010", cnfe, sFormatClassName);
			throw new ExportDataException(cnfe);
		}
		logger.ctdebug("CTEXP00011", exportFormatProvider);
		return exportFormatProvider;
	}

	/**
	 * An instance of Logger
	 */
	private static final Logger logger = Logger.getLogger(ExportFormatFactory.class);
}
