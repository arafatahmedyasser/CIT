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
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
import java.util.HashMap;

import com.intellectdesign.canvas.constants.reports.ReportingConstants;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.message.ReportsMessageManager;
import com.intellectdesign.canvas.properties.reader.CTProperties;

/**
 * 
 * This class is used to generate OFX document.
 * 
 * @version 1.0
 */
public class OFXGenerator
{
	/**
	 * API to generate the OFX document. Calls another method : renderReportOFX() that will perform all rendering
	 * activity.
	 * 
	 * @param : HashMap data : HashMap that holds all the information which will be the content of the export.
	 * @param : String ofxPath : The path where the export file be stored.
	 * @param: Boolean hasclassName: A boolean indicating whether it has a class or not.
	 * @return: void
	 * @exception Exception
	 * 
	 * */
	public void generateOFXDocument(HashMap data, String ofxPath, Boolean hasclassName)
	{

		String cmName = "[OFXGenerator:generateOFXDocument]";
		logger.ctinfo("CTEXP00026", cmName);
		try
		{
			logger.ctdebug("CTEXP00111", data, "", ofxPath);
			data.put(ReportingConstants.METADATA, "");
			data.put(ReportingConstants.GENERATED_DATE, new java.util.Date().toString());
			if (!hasclassName)
				logger.ctdebug("CTEXP00110", ofxPath);
			renderReportOFX(data, ofxPath);
			logger.ctinfo("CTEXP00017", cmName);

		} catch (Exception e)
		{
			logger.cterror("CTEXP00109", e, cmName);
		}
	}

	/**
	 * API to actually render all the components of the OFX document. In turn calls two methods render the header and
	 * the body of the document.
	 * 
	 * @param: hMap : Hasmap containing the export data and other user related information.
	 * @param: fPath : The instance of the file to be generated, comes with the path and the file name.
	 * @exception IOException
	 * 
	 * */

	private void renderReportOFX(HashMap hMap, String fPath)
	{
		String cmName = "OFXGenerator:renderReportOFX";
		logger.ctinfo("CTEXP00026", cmName);
		try
		{
			fs = new OutputStreamWriter(new FileOutputStream(fPath), "UTF8");
			renderHeader(hMap);
			renderBody(hMap);
			fs.flush();
			fs.close();

		} catch (IOException e)
		{
			logger.cterror("CTEXP00109", e, cmName);
			try
			{
				fs.flush();
				fs.close();
				fs = null;
				File fileObj = new File(fPath);
				fileObj.delete();
			} catch (Exception ex)
			{
				logger.cterror("CTEXP00109", ex, cmName);
			}

		} catch (Exception e)
		{
			logger.cterror("CTEXP00109", e, cmName);
		} finally
		{
			fs = null;
		}
		logger.ctinfo("CTEXP00017", cmName);
	}

	/**
	 * API that does the actual rendering of the export header portion to the export doc.
	 * 
	 * @param : HashMap hMap : Hash map that holds the export data and other user related information.
	 * @throws Exception - throws Exception if any
	 * 
	 * */
	private void renderHeader(HashMap hMap) throws Exception
	{
		String langID = (String) hMap.get("LANGUAGE_ID");

		String cmName = "OFXGenerator:renderHeader";
		logger.ctinfo("CTEXP00026", cmName);

		String exportHeader = null;

		exportHeader = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>"
				+ "\n"
				+ "<?OFX OFXHEADER=\"200\"  VERSION=\"211\" SECURITY=\"NONE\" OLDFILEUID=\"NONE\" NEWFILEUID=\"NONE\"?>"
				+ "\n" + "<OFX>" + "\n" + "<SIGNONMSGSRSV1>" + "\n" + "<SONRS>" + "\n" + "<STATUS>" + "\n" + "<CODE>0"
				+ "</CODE>" + "\n" + "<SEVERITY>INFO" + "</SEVERITY>" + "\n" + "</STATUS>" + "\n" + "<DTSERVER>"
				+ ReportsMessageManager.getDate(langID) + "</DTSERVER>" + "\n" + "<LANGUAGE>"
				+ CTProperties.getProperty(langID) + "</LANGUAGE>" + "\n" + "<FI>" + "\n" + "<ORG>"
				+ (String) hMap.get("CORPORATE_NAME") + "</ORG>" + "\n" + "</FI>" + "\n" + "</SONRS>" + "\n"
				+ "</SIGNONMSGSRSV1>" + "\n" + "<BANKMSGSRSV1>" + "\n";

		try
		{
			writeContent(exportHeader);

		} catch (Exception e)
		{
			logger.cterror("CTEXP00109", e, cmName);
		}
		logger.ctinfo("CTEXP00017", cmName);
	}

	/**
	 * API to render the body portion of the export document. internally calls the renderReportDataColumns() that will
	 * 
	 * @param: HashMap hMap: Hash map that contains all th export data and the user related imformation.
	 * @return: None
	 * @throws Exception
	 * */
	private void renderBody(HashMap hMap) throws Exception
	{
		String cmName = "OFXGenerator:renderBody";
		logger.ctinfo("CTEXP00026", cmName);
		try
		{
			renderReportDataColumns(hMap);
		} catch (Exception e)
		{
			logger.cterror("CTEXP00109", e, cmName);
		}
		logger.ctinfo("CTEXP00017", cmName);
	}

	/**
	 * Api to actually render the export data in the export format.
	 * 
	 * @param:HashMap hMap: Hash Map that hold all the export data and users related information.
	 * @return: None
	 * @exception Exception
	 * */
	private void renderReportDataColumns(HashMap hMap)
	{
		String cmName = "OFXGenerator:renderReportDataColumns";
		logger.ctinfo("CTEXP00026", cmName);
		HashMap hmFormData = null;
		HashMap hmIterator = null;
		String langID = (String) hMap.get("LANGUAGE_ID");
		String dataColumns = null;

		ArrayList listGridData = null;
		try
		{
			hmIterator = new HashMap();
			hmFormData = new HashMap();
			hmFormData = (HashMap) hMap.get("FORM_DATA");
			logger.ctdebug("CTEXP00113", hmFormData);
			listGridData = (ArrayList) hMap.get(ReportingConstants.EXPORT_GRID_DATA);
			int intListCount = listGridData.size();
			logger.ctdebug("CTEXP00112", intListCount);

			if (intListCount > 0)
			{
				dataColumns = "<STMTTRNRS>" + "\n" + "<TRNUID>" + "" + "</TRNUID>" + "\n" + "<STATUS>" + "\n"
						+ "<CODE>" + "0" + "</CODE>" + "\n" + "<SEVERITY>" + "" + "</SEVERITY>" + "\n" + "</STATUS>"
						+ "\n" + "<STMTRS>" + "\n" + "<CURDEF>" + (String) hmFormData.get("OD_CCY_CODE") + "</CURDEF>"
						+ "\n" + "<BANKACCTFROM>" + "\n" + "<BANKID>" + (String) hmFormData.get("BANKNAME")
						+ "</BANKID>" + "\n" + "</ACCTID>" + (String) hmFormData.get("OD_ACC_NO") + "</ACCTID>" + "\n"
						+ "<ACCTTYPE>" + (String) hmFormData.get("OD_ACC_TYPE_2") + "</ACCTTYPE>" + "\n"
						+ "</BANKACCTFROM>" + "\n" + "<BANKTRANLIST>" + "\n";

				for (int iCtr = 0; iCtr < listGridData.size(); iCtr++)
				{

					hmIterator = (HashMap) listGridData.get(iCtr);
					dataColumns = dataColumns +

					"<STMTTRN>" + "\n" + "<TRNTYPE>" + "" + "</TRNTYPE>" + "\n" + "<DTPOSTED>"
							+ (String) hmIterator.get("TXN_DATE") + "</DTPOSTED>" + "\n" + "<DTUSER>" + ""
							+ "</DTUSER>" + "\n" + "<TRNAMT>";

					if (!(hmIterator.get("DEBIT_AMOUNT").toString()).trim().equals(""))
					{
						dataColumns = dataColumns + (String) hmIterator.get("DEBIT_AMOUNT");
					} else
					{
						dataColumns = dataColumns + (String) hmIterator.get("CREDIT_AMOUNT");
					}
					dataColumns = dataColumns + "</TRNAMT>" + "\n" + "<FITID>" + "" + "</FITID>" + "\n" + "</STMTTRN>"
							+ "\n";

				}
				dataColumns = dataColumns + "</BANKTRANLIST>" + "\n" + "</LEDGERBAL>" + "\n" + "<BALAMT>"
						+ (String) hmFormData.get("OD_AVAIL_BAL") + "</BALAMT>" + "\n" + "<DTASOF>"
						+ ReportsMessageManager.getDate(langID) + "</DTASOF>" + "\n" + "</LEDGERBAL>" + "\n" +

						"<AVAILBAL>" + "\n" + "<BALAMT>" + (String) hmFormData.get("OD_AVAIL_BAL") + "</BALAMT>" + "\n"
						+ "<DTASOF>" + ReportsMessageManager.getDate(langID) + "<DTASOF>" + "\n" + "</AVAILBAL>" + "\n"
						+ "</STMTRS>" + "\n" + "</STMTTRNRS>" + "\n";
			}

			writeContent(dataColumns);

			String dataColumnsEnd =

			"</BANKMSGSRSV1>" + "\n" + "</OFX>";

			writeContent(dataColumnsEnd);

		} catch (Exception e)
		{
			logger.cterror("CTEXP00109", e, cmName);
		}
		logger.ctinfo("CTEXP00017", cmName);
	}

	/**
	 * Private API to write the data to out stream.
	 * 
	 * @param: String sValue: String objetc that will be written .
	 * @return: none
	 * @exception Exception
	 * 
	 * */

	private void writeContent(String sValue)
	{

		String cmName = "OFXGenerator:writeContent ";
		logger.ctinfo("CTEXP00026", cmName);

		try
		{
			if (sValue != null)
			{

				byte[] utf8Bytes = sValue.getBytes("UTF8");
				String asString = new String(utf8Bytes, 0, utf8Bytes.length, "UTF8");
				fs.write(asString);
			}
		} catch (IOException e)
		{
			logger.cterror("CTEXP00109", e, cmName);
		} catch (Exception e)
		{
			logger.cterror("CTEXP00109", e, cmName);
		}
		logger.ctinfo("CTEXP00017", cmName);
	}

	private OutputStreamWriter fs = null;
	private static final Logger logger = Logger.getLogger(OFXGenerator.class);
}