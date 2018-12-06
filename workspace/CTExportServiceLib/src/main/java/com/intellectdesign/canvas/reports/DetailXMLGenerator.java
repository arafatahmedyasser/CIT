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
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.ResourceBundle;

import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.ExportConfigurationDescriptor;
import com.intellectdesign.canvas.constants.reports.ReportingConstants;
import com.intellectdesign.canvas.datasource.JavaDataSource;
import com.intellectdesign.canvas.logger.Logger;
//For Logger
import com.intellectdesign.canvas.message.ReportsMessageManager;

/**
 * Generates xml file for the provided detail data
 * 
 * @version 1.0
 */
public class DetailXMLGenerator
{
	private FileWriter reportWriter = null;
	private static final Logger logger = Logger.getLogger(DetailXMLGenerator.class);

	/**
	 * Method to render on the body
	 * 
	 * @param detailData
	 * @param dataHash
	 * @throws Exception
	 */
	private void renderBody(DetailData detailData, HashMap dataHash) throws Exception
	{

		String cmName = "DetailXMLGenerator:renderBody";
		logger.ctinfo("CTEXP00026", cmName);
		String langID = (String) dataHash.get("LANGUAGE_ID");

		HashMap detailParams = (HashMap) dataHash.get("PARAMS");
		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		ExportConfigurationDescriptor exportDescriptor = configMgr.getExportDescriptor();

		ResourceBundle labelRB = ResourceBundle.getBundle("infra");
		String service = labelRB.getString("PAGE_TITLE");

		if (detailData != null)
		{
			writeContent("<logo-url><![CDATA[");
			writeContent(exportDescriptor.getIntellectLogo()); // Export_Label Configuration
			writeContent("]]></logo-url>");

			writeContent("<service-title><![CDATA[");
			writeContent(service);
			writeContent("]]></service-title>");

			writeContent("<title><![CDATA[");

			writeContent(ReportsMessageManager.replacePredefinedDetail(detailData.getReportTitle(), detailParams,
					langID));

			writeContent("]]></title>");
			writeContent("<corporate><![CDATA[");
			writeContent((String) dataHash.get("CORPORATE_NAME"));
			writeContent("]]></corporate>");
			writeContent("<report-date><![CDATA[ ");

			writeContent(ReportsMessageManager.getDate(langID));

			writeContent("]]></report-date>");
			writeContent("<report-user><![CDATA[ ");
			writeContent((String) dataHash.get("USER_NAME"));
			writeContent("]]></report-user>");
			writeContent("<report-generated><![CDATA[ ");

			writeContent(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, ReportingConstants.EZ_REP_GEN,
					langID));

			writeContent("]]></report-generated>");
			writeContent("<report-by><![CDATA[ ");

			writeContent(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, ReportingConstants.EZ_REP_BY,
					langID));

			writeContent(" ]]></report-by>");
			writeContent("<report-pageno><![CDATA[ ");

			writeContent(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, ReportingConstants.EZ_PAGE_F,
					langID));

			writeContent("]]></report-pageno>");
			writeContent("<details>");
			ArrayList details = detailData.getDetailsList();
			if (details == null)
			{
				logger.ctdebug("CTEXP00036");
			} else
			{
				java.util.ArrayList list = detailData.getDetailsList();
				String row = "";
				int rowCount = 1;
				for (int i = 0; i < list.size(); i++)
				{
					String label1 = "";
					String label2 = "";
					String value1 = "";
					String value2 = "";
					DetailElement elem = (DetailElement) list.get(i);

					label1 = ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, elem.getLabel(), langID);

					value1 = elem.getValue();
					i++;
					if (i < list.size())
					{
						elem = (DetailElement) list.get(i);

						label2 = ReportsMessageManager
								.getMessage(ReportingConstants.EZ_LABELS, elem.getLabel(), langID);

						value2 = elem.getValue();
					}
					if (rowCount % 2 == 0)
					{
						row = "even";
					} else
					{
						row = "odd";
					}
					writeContent("<detail-row row=\"" + row + "\">");

					writeContent("<detail>");
					writeContent("<label>" + label1 + "</label>");
					writeContent("<value>" + value1 + "</value>");
					writeContent("</detail>");

					writeContent("<detail>");
					writeContent("<label>" + label2 + "</label>");
					writeContent("<value>" + value2 + "</value>");
					writeContent("</detail>");
					writeContent("</detail-row>");
					rowCount++;
				}
			}
			writeContent("</details>");
		}
	}

	/**
	 * Method to render report from the xml
	 * 
	 * @param hMap
	 * @param fPath
	 * @return String
	 * @throws Exception
	 */

	public String renderReportXML(HashMap hMap, String fPath) throws Exception
	{
		String cmName = "DetailXMLGenerator:renderBody";
		logger.ctinfo("CTEXP00026", cmName);
		try
		{
			logger.ctdebug("CTEXP00037", hMap);
			JavaDataSource javaSource = (JavaDataSource) hMap.get("DATA_PROVIDER_INSTANCE");
			HashMap dataSourceParam = (HashMap) hMap.get("DATA_PROVIDER_OBJECT");
			dataSourceParam.put("StartRowNumber", new Integer(0));
			HashMap dataHash = javaSource.execute(dataSourceParam);
			DetailData detailData = (DetailData) dataHash.get("DETAILS");
			reportWriter = new FileWriter(fPath);
			writeContent("<report>");
			dataHash.put("CORPORATE_NAME", hMap.get("CORPORATE_NAME"));
			dataHash.put("USER_NAME", hMap.get("USER_NAME"));

			dataHash.put("LANGUAGE_ID", hMap.get("LANGUAGE_ID"));

			renderBody(detailData, dataHash);
			writeContent("</report>");
			reportWriter.close();
			return "D";
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
				logger.cterror("CTEXP00038", ex);
				throw (ex);
			}
			throw (e);
		} finally
		{
			reportWriter = null;
		}
	}

	/**
	 * Method to write value into a file
	 * 
	 * @param sValue value to write
	 * @throws Exception
	 */
	private void writeContent(String sValue) throws Exception
	{
		String cmName = "DetailXMLGenerator:renderBody";
		logger.ctinfo("CTEXP00026", cmName);
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