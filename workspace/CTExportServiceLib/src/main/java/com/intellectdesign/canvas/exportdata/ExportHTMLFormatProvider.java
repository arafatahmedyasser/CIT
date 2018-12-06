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

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;

import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.ExportConfigurationDescriptor;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.reports.generator.HTMLGenerator;
import com.intellectdesign.canvas.utility.CTUtility;

/**
 * Responsible for generating the documents in HTML using the HTML Generator
 * 
 * @version 1.0
 */
public class ExportHTMLFormatProvider extends ExportFormatProvider
{
	/**
	 * This method calls the HTMLGenerator to export the document in HTML format and Returns the path of the generated
	 * file
	 * 
	 * @param HashMap hmResultMap Contains the formatted data
	 * @param listMetaData ArrayList MetaData List
	 * @param reportID String ReportID
	 * @param userId String UserID
	 * @return path of the file
	 * @throws ExportDataException
	 */
	public String generateDocument(HashMap hmResultMap, ArrayList listMetaData, String reportID, String userId)
			throws ExportDataException
	{
		String sFilePath = null;
		logger.ctinfo("CTEXP00012", "ExportHTMLFormatProvider.generateDocument", hmResultMap);
		// Call PDF generator to generate the file.
		HTMLGenerator htmlGenerator = new HTMLGenerator();
		try
		{
			ConfigurationManager configMgr = ConfigurationManager.getInstance();
			ExportConfigurationDescriptor exportDescriptor = configMgr.getExportDescriptor();
			sFilePath = exportDescriptor.getHtmlFolderPath() + File.separator + reportID + userId + "_"
					+ CTUtility.getDateTime() + ".html";
			logger.ctdebug("CTEXP00185", "ExportHTMLFormatProvider.generateDocument", hmResultMap, sFilePath);
			htmlGenerator.generateHtmlDocument(hmResultMap, listMetaData, sFilePath, true);

		} catch (Exception exception)
		{
			logger.cterror("CTEXP00024", exception);
			throw new ExportDataException("Exception occured while generating HTML", exception);
		}
		logger.ctinfo("CTEXP00013");
		return sFilePath;
	}

	/**
	 * An instance of Logger
	 */
	private static final Logger logger = Logger.getLogger(ExportHTMLFormatProvider.class);
}
