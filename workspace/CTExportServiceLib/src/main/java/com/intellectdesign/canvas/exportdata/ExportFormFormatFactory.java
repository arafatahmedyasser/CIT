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
 * Export format factory export happening from form.Contains API to get the format provider based on the format.
 * 
 * @version 1.0
 */
public class ExportFormFormatFactory
{

	private static HashMap map = null;
	static
	{
		map = new HashMap();
		map.put(ExportFwsConstants.OFX_FORM, "com.intellectdesign.canvas.constants.export.ExportOFXFormatProvider");
	}

	/**
	 * API to get the format provider based on the format to be exported as requested by the user.
	 * 
	 * @param: String sFormat: Format of the export like pdf, xsl, ofx etc.
	 * @return: IExportFormFormatProvider: instance of the format provider class
	 * @throws ExportDataException
	 * */
	public static IExportFormFormatProvider getFormExportFormatProvider(String sFormat) throws ExportDataException
	{
		String cmName = "[ExportFormFormatFactory.getFormExportFormatProvider]";
		logger.ctinfo("CTEXP00026", cmName);
		if (!map.keySet().contains(sFormat))
		{
			logger.ctdebug("CTEXP00007", sFormat);
			throw new ExportDataException("Export format not supported. Input format: " + sFormat);
		}

		String sFormatClassName = (String) map.get(sFormat);
		logger.ctdebug("CTEXP00015", sFormatClassName);
		IExportFormFormatProvider exportFormFormatProvider = null;
		try
		{
			exportFormFormatProvider = (IExportFormFormatProvider) Class.forName(sFormatClassName).newInstance();
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
		} catch (Exception cnfe)
		{
			logger.cterror("CTEXP00016", cnfe, sFormatClassName);
			throw new ExportDataException(cnfe);
		}
		logger.ctdebug("CTEXP00011", exportFormFormatProvider);
		logger.ctinfo("CTEXP00017", cmName);
		return exportFormFormatProvider;
	}

	/**
	 * An instance of Logger
	 */
	private static final Logger logger = Logger.getLogger(ExportFormatFactory.class);

	/**
	 * Default Constructor, does nothing
	 */
	private ExportFormFormatFactory()
	{
	}

}
