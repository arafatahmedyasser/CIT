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

package com.intellectdesign.canvas.reports;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.intellectdesign.canvas.common.UserValue;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.ExportConfigurationDescriptor;
import com.intellectdesign.canvas.constants.reports.ReportingConstants;
import com.intellectdesign.canvas.exportdata.IExportDataValueObject;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.message.ReportsMessageManager;

/**
 * This class is used to generate a xml file from the given data
 * 
 * @version 1.0
 */
public class ReportXMLBuilderForm
{
	private OutputStreamWriter reportWriter = null;
	private static final Logger logger = Logger.getLogger(ReportXMLBuilderForm.class);

	/**
	 * This method generates xml documents by calling various api's
	 * 
	 * @params IExportDataValueObject
	 * @params fPath
	 * @params UserValue
	 * 
	 * @throws Exception
	 */
	public void renderReportXML(IExportDataValueObject dataValueObject, String fPath, UserValue userValue)
			throws Exception
	{
		String cmName = "ReportXmlBuilderForm:renderReportXML";
		logger.ctinfo("CTEXP00026", cmName);
		try
		{
			// Creates a new file at given path
			File f = new File(fPath);
			// Creates FileOutputStream for the file
			FileOutputStream fosObject = new FileOutputStream(f);
			Charset cs = Charset.forName("UTF-8");
			// Creates new OutputStreamWriter to the FileOutputStream
			reportWriter = new OutputStreamWriter(fosObject, cs);

			writeContent("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
			writeContent("<report>");
			// renders header in the xml file
			renderHeader(userValue);
			// renders body in the xml file
			renderBody(dataValueObject);
			writeContent("</report>");
			reportWriter.close();

		} catch (Exception e)
		{
			logger.cterror("CTEXP00038", e);
			try
			{
				// in case of any exception in the generation of the contents for the file
				// then the file is deleted and error propogated to the caller.
				reportWriter.close();
				reportWriter = null;
				File fileObj = new File(fPath);
				fileObj.delete();
			} catch (Exception ex)
			{
				logger.cterror("CTEXP00038", e);
				throw (ex);
			}
			throw (e);
		} finally
		{
			reportWriter = null;
		}

	}

	/**
	 * This method generates header in the xml file
	 * 
	 * @params UserValue
	 * 
	 * @throws Exception
	 */
	private void renderHeader(UserValue userValue) throws Exception
	{
		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		ExportConfigurationDescriptor exportDescriptor = configMgr.getExportDescriptor();

		String langID = userValue.getLangId();
		String cmName = "ReportXmlBuilderForm:renderHeader";
		logger.ctinfo("CTEXP00026", cmName);
		try
		{
			writeContent("<report-header>");

			writeContent("<logo-url><![CDATA[");
			writeContent(exportDescriptor.getIntellectLogo());// gets logo path //Export_Label Configuration
			writeContent("]]></logo-url>");

			writeContent("<report-title><![CDATA[");
			writeContent("Confirmation");// report title
			writeContent("]]></report-title>");
			writeContent("<report-corporate><![CDATA[");
			writeContent(userValue.getPrimaryCorporate());// corporation for which report is generated
			writeContent("]]></report-corporate>");
			writeContent("<report-date><![CDATA[ ");

			writeContent(ReportsMessageManager.getDate(langID).toUpperCase());// report generation date
			writeContent("]]></report-date>");
			writeContent("<report-user><![CDATA[ ");
			writeContent(userValue.getFIRST_NAME());// user name of report generated
			writeContent("]]></report-user>");
			writeContent("<report-generated><![CDATA[ ");
			writeContent(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, ReportingConstants.EZ_REP_GEN));
			writeContent("]]></report-generated>");
			writeContent("<report-by><![CDATA[ ");
			writeContent(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, ReportingConstants.EZ_REP_BY));
			writeContent(" ]]></report-by>");
			writeContent("<report-pageno><![CDATA[ ");
			writeContent(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, ReportingConstants.EZ_PAGE_F));
			writeContent(" ]]></report-pageno>");
			writeContent("<report-pageof><![CDATA[ ");
			writeContent(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, ReportingConstants.EZ_PAGE_OF));
			writeContent(" ]]></report-pageof>");
			writeContent("</report-header>");
		} catch (Exception e)
		{
			logger.cterror("CTEXP00038", e);
			throw (e);
		}
	}

	/**
	 * This method will write the exact string data to the xml file
	 * 
	 * @params data Object
	 * 
	 * @throws Exception
	 */
	private void generateDataXML(Object data) throws Exception
	{
		if (data != null)
		{
			// Checks if data is list or arraylist
			if (data instanceof ArrayList || data instanceof List)
			{
				List dataObj = (List) data;
				writeContent("<items>");
				for (int i = 0, len = dataObj.size(); i < len; i++)
				{
					generateDataXML(dataObj.get(i));// calls the method again for each object of arraylist or list
				}
				writeContent("</items>");

			}
			// Checks if data is map or hashmap
			else if (data instanceof HashMap || data instanceof Map)
			{
				Map dataMap = (Map) data;
				Set keySet = dataMap.keySet();
				Iterator keysItr = keySet.iterator();
				String key = null;
				while (keysItr.hasNext())
				{
					key = (String) keysItr.next();
					// Checks if data is string data then it writes content to xml file else calls this method again
					if (dataMap.get(key) instanceof String)
					{
						writeContent("<item>");
						writeContent("<label><![CDATA[" + key + "]]></label>");
						writeContent("<value><![CDATA[" + dataMap.get(key) + "]]></value>");
						writeContent("</item>");
					} else
					{
						writeContent("<" + key + ">");
						generateDataXML(dataMap.get(key));
						writeContent("</" + key + ">");
					}
				}
			} else
			{
				throw (new Exception("data is in unsupported format"));
			}

		}
	}

	/**
	 * This method will write body contents to the xml file from the data provided
	 * 
	 * @params dataValueObject IExportDataValueObject
	 * 
	 * @throws Exception
	 */
	private void renderBody(IExportDataValueObject dataValueObject) throws Exception
	{
		String cmName = "ReportXmlBuilderForm:renderBody";
		logger.ctinfo("CTEXP00026", cmName);
		// gets the arraylist which has all the data needed
		ArrayList dataList = dataValueObject.getExportData();
		// gets the exact map of data to be writen
		HashMap exportData = (HashMap) dataList.get(0);
		// gets keys in the map
		Set keySet = exportData.keySet();
		Iterator keysItr = keySet.iterator();
		String key = null;
		writeContent("<report-body>");
		// for each key it calls generateDataXML method to get exact data
		while (keysItr.hasNext())
		{
			key = (String) keysItr.next();
			writeContent("<" + key + ">");
			// calls generateDataXML method to write exact data to xml
			generateDataXML(exportData.get(key));
			writeContent("</" + key + ">");
		}
		writeContent("</report-body>");

	}

	/**
	 * This method will write the given string content to the OutputStreamWriter
	 * 
	 * @params sValue String
	 * 
	 * @throws Exception
	 */
	private void writeContent(String sValue) throws Exception
	{
		try
		{
			if (sValue != null)
				reportWriter.write(sValue);
		} catch (Exception e)
		{
			logger.cterror("CTEXP00038", e);
			throw (e);
		}
	}
}
