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

package com.intellectdesign.canvas.reports.generator;

import java.io.File;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;

import javax.xml.transform.Result;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.sax.SAXResult;
import javax.xml.transform.stream.StreamSource;

import org.apache.fop.apps.FOUserAgent;
import org.apache.fop.apps.Fop;
import org.apache.fop.apps.FopFactory;
import org.apache.fop.apps.MimeConstants;

import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.ExportConfigurationDescriptor;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.preference.GlobalPreferencesUtil;
import com.intellectdesign.canvas.reports.ReportXMLBuilder;

/**
 * This class generates pdf document from the given data. This will call method of ReportXMLBuilderForm to build the
 * xml file and using the xsl file specified, pdf document is generated.
 * 
 * @version 1.0
 */
public class PDFGenerator
{
	private static final Logger logger = Logger.getLogger(PDFGenerator.class);

	/**
	 * Keys in the hashmap. 1. DATA_PROVIDER_OBJECT(HashMap) (Params HashMap to be passed to JavaDataSource). 2.
	 * REPORT_HEADER (String) 3. REPORT_FOOTER(String) 4. PAGE_HEADER(String) 5. PAGE_FOOTER(String) 6.
	 * ROWS_PER_CALL(Integer) 7. REPORT_PARAMS (HashMap) 8. CLASS_NAME(String) - Name of the implementation class
	 */

	/**
	 * This method generates pdf document from the given data. This will call method of ReportXMLBuilderForm to build
	 * the xml file and using the xsl file specified, pdf document is generated using fop api's.
	 * 
	 * @params data The map which contains the data
	 * 
	 * @params metaData List of Column instances, Each instance will have Column Related Details
	 * 
	 * @params pdfPath Path where pdf will be generated
	 * 
	 * @params hasData flag which checks whether data is there or not
	 * 
	 * @throws throws Exception if any while PDF generation
	 * 
	 * @returns boolean
	 */
	public boolean generatePDFDocument(HashMap data, ArrayList metaData, String pdfPath, boolean hasData)
			throws Exception
	{
		String cmName = "PDFGenerator:generatePDFDocument";
		logger.ctinfo("CTEXP00026", cmName);
		OutputStream out = null;
		try
		{

			logger.ctinfo("CTEXP00117", data, metaData, pdfPath);

			Date currDate = new Date();
			
			GlobalPreferencesUtil gpUtil = new GlobalPreferencesUtil();
			String generatedDate = gpUtil.userPrefFormatDateAndTime(data.get("USER_DATE_FORMAT") + " "+data.get("USER_TIME_FORMAT"),
					data.get("USER_TIMEZONEID").toString(), currDate);
			
			ArrayList colMetaData = ReportUtils.getColumnMetaData(metaData);
			data.put("METADATA", colMetaData);
			data.put("GENERATED_DATE", generatedDate);
			if (!hasData)
				data.put("DATA_PROVIDER_INSTANCE", Class.forName((String) data.get("CLASS_NAME")).newInstance());
			ConfigurationManager configMgr = ConfigurationManager.getInstance();
			ExportConfigurationDescriptor exportDescriptor = configMgr.getExportDescriptor();
			String xmlPath = exportDescriptor.getXmlFolderPath() + File.separator
					+ pdfPath.substring(0, pdfPath.lastIndexOf(".")) + ".xml";
			String pdfFullPath = exportDescriptor.getPdfFolderPath() + File.separator + pdfPath;
			logger.ctdebug("CTEXP00114", xmlPath);
			ReportXMLBuilder rxb = new ReportXMLBuilder();
			String type = rxb.renderReportXML(data, xmlPath, hasData);

			FopFactory fopFactory = FopFactory.newInstance();

			File userConfigFile = new File(exportDescriptor.getFopConfigPath());
			fopFactory.setUserConfig(userConfigFile);

			FOUserAgent foUserAgent = fopFactory.newFOUserAgent();
			// configure foUserAgent as desired

			// Setup output
			out = new java.io.BufferedOutputStream(new java.io.FileOutputStream(pdfFullPath));

			// Construct fop with desired output format
			Fop fop = fopFactory.newFop(MimeConstants.MIME_PDF, foUserAgent, out);

			// Setup XSLT
			TransformerFactory factory = TransformerFactory.newInstance();
			Transformer transformer = null;

			String LangDirection = (String) data.get("DIRECTION");
			if (LangDirection != null && LangDirection.trim().equalsIgnoreCase("RTL"))
			{
				if ("D".equals(type))
					transformer = factory.newTransformer(new StreamSource(new File(exportDescriptor
							.getDetailXsltRtlPath())));
				else
					transformer = factory.newTransformer(new StreamSource(new File(exportDescriptor.getXsltRtlPath())));
			} else
			{
				if ("D".equals(type))
					transformer = factory.newTransformer(new StreamSource(
							new File(exportDescriptor.getDetailXsltPath())));
				else
					transformer = factory.newTransformer(new StreamSource(new File(exportDescriptor.getXsltPath())));
			}

			// Set the value of a <param> in the stylesheet
			transformer.setParameter("versionParam", "2.0");

			// Setup input for XSLT transformation
			Source src = new StreamSource(new File(xmlPath));

			// Resulting SAX events (the generated FO) must be piped through to FOP
			Result res = new SAXResult(fop.getDefaultHandler());

			// Start XSLT transformation and FOP processing
			transformer.transform(src, res);

			new File(xmlPath).delete();

			return true;

		} catch (Exception e)
		{
			logger.cterror("CTEXP00038", e);
			throw e;
		} finally
		{
			try
			{
				if (out != null)
					out.close();
			} catch (Exception ee)
			{
				logger.cterror("CTEXP00038", ee);
			}
		}
	}
}