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
import com.intellectdesign.canvas.reports.generator.PDFGenerator;
import com.intellectdesign.canvas.utility.CTUtility;

/**
 * Responsible for generating the documents in PDF using the PDF Generator
 * 
 * @version 1.0
 */
public class ExportPDFFormatProvider extends ExportFormatProvider
{
	/**
	 * This method calls the PDFGenerator to export the document in PDF format Returns the path of the generated file
	 * 
	 * @param HashMap Contains the formatted data
	 * @param ArrayList MetaData List
	 * @param String Report ID
	 * @param String User ID
	 * @return path of the file
	 * @throws ExportDataException
	 */
	public String generateDocument(HashMap hmResultMap, ArrayList listMetaData, String reportID, String userId)
			throws ExportDataException
	{
		String sFilePath = null;
		logger.ctinfo("CTEXP00012", "ExportPDFFormatProvider.generateDocument()", hmResultMap);
		// Call PDF generator to generate the file.
		PDFGenerator pdfGenerator = new PDFGenerator();
		try
		{
			sFilePath = reportID + userId + "_" + CTUtility.getDateTime() + ".pdf";
			logger.ctdebug("CTEXP00185", "ExportPDFFormatProvider.generateDocument()", hmResultMap, sFilePath);
			pdfGenerator.generatePDFDocument(hmResultMap, listMetaData, sFilePath, true);
			ConfigurationManager configMgr = ConfigurationManager.getInstance();
			ExportConfigurationDescriptor exportDescriptor = configMgr.getExportDescriptor();
			sFilePath = exportDescriptor.getPdfFolderPath() + File.separator + sFilePath;
		} catch (Exception exception)
		{
			logger.cterror("CTEXP00186", exception);
			throw new ExportDataException("Exception occured while generating PDF", exception);
		}
		logger.ctinfo("CTEXP00013");
		return sFilePath;
	}

	/**
	 * An instance of Logger
	 */
	private static final Logger logger = Logger.getLogger(ExportPDFFormatProvider.class);
}
